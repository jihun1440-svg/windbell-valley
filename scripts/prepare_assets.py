"""Slice the generated atlas without repainting; compose original village score."""
from pathlib import Path
from PIL import Image
import numpy as np
import wave,json

ROOT=Path(__file__).resolve().parents[1]
assets=ROOT/'assets'
atlas=Image.open(assets/'characters-original.png').convert('RGBA')
w,h=atlas.size
manifest={'source':'characters-original.png','columns':4,'rows':4,'characters':{}}
for row,name in enumerate(['traveler','baker','gardener','cat']):
    frames=[atlas.crop((round(col*w/4),round(row*h/4),round((col+1)*w/4),round((row+1)*h/4))) for col in range(4)]
    boxes=[f.getchannel('A').point(lambda p:255 if p>90 else 0).getbbox() for f in frames]
    box=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes))
    fw,fh=box[2]-box[0],box[3]-box[1]
    strip=Image.new('RGBA',(fw*4,fh))
    for i,f in enumerate(frames):strip.paste(f.crop(box),(i*fw,0))
    strip.save(assets/f'{name}-walk.png')
    manifest['characters'][name]={'file':f'{name}-walk.png','width':fw,'height':fh,'frames':4,'fps':6,'pivot':'bottom-center'}
(assets/'sprites.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
# 36 seconds, original pentatonic melody; celesta, soft flute, plucked strings and creek.
sr=44100;duration=36;n=sr*duration;mix=np.zeros((n,2),dtype=np.float64)
rng=np.random.default_rng(1440)
def note(start,length,midi,amp,kind='flute',pan=0):
    t=np.arange(int(length*sr))/sr;f=440*2**((midi-69)/12)
    if kind=='bell':s=(np.sin(2*np.pi*f*t)*np.exp(-2.8*t)+.24*np.sin(2*np.pi*f*2.76*t)*np.exp(-4*t)+.12*np.sin(2*np.pi*f*4.1*t)*np.exp(-6*t))
    elif kind=='pluck':s=(np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*f*2*t)+.09*np.sin(2*np.pi*f*3*t))*np.exp(-3*t)
    else:s=(np.sin(2*np.pi*f*t+.012*np.sin(2*np.pi*4.7*t))+.11*np.sin(2*np.pi*f*2*t))*np.minimum(1,t/.13)*np.minimum(1,(length-t)/.23)*np.exp(-.18*t)
    i=int(start*sr);end=min(i+len(s),n);s=s[:end-i]*amp
    mix[i:end,0]+=s*np.sqrt((1-pan)/2);mix[i:end,1]+=s*np.sqrt((1+pan)/2)
beat=.75
melody=[(76,2),(79,1),(81,1),(79,2),(76,2),(74,2),(72,2),(74,2),(76,2),(79,2),(81,2),(84,2),(81,2),(79,2),(76,2),(74,2),(72,4),(74,2),(76,2),(79,2),(76,2),(74,2),(72,4)]
pos=0
for midi,beats in melody:
    if pos>=33:break
    note(pos,beats*beat*.9,midi,.11,'flute',-.13);pos+=beats*beat
chords=[[48,55,60,64],[45,52,57,60],[41,48,53,57],[43,50,55,59]]
for bar in range(12):
    chord=chords[bar%4]
    for j in range(8):note(bar*3+j*.375,1.7,chord[[0,1,2,3,2,1,2,3][j]],.045,'pluck',.3 if j%2 else -.3)
for start,midi in [(1,88),(6.2,91),(12.4,86),(19,88),(25.5,93),(31.5,88)]:note(start,3.8,midi,.027,'bell',.5)
# Gentle broad-band filtered stream ambience, no borrowed recordings.
noise=rng.normal(0,1,(n,2));smooth=np.stack([np.convolve(noise[:,i],np.ones(32)/32,'same') for i in range(2)],axis=1)
mix+=smooth*.008
fade=np.minimum(1,np.arange(n)/(sr*2))*np.minimum(1,(n-np.arange(n))/(sr*3))
mix*=fade[:,None];peak=float(np.abs(mix).max());mix*=.78/max(peak,.001)
with wave.open(str(assets/'windbell-theme.wav'),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((mix*32767).astype('<i2').tobytes())
print('4 transparent 4-frame walking strips; 36-second stereo original score. Peak:',round(peak,4))
