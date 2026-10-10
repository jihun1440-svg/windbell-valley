// Own isolated headless renderer for the authored HTML animation, not the user's browser.
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ffmpeg=process.argv[2];if(!ffmpeg)throw Error('Pass FFmpeg executable path');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8766/?render=1');await page.evaluate(()=>window.Windbell.ready);
const out=path.join(root,'assets','windbell-valley-ko.mp4');
const encoder=spawn(ffmpeg,['-y','-f','image2pipe','-vcodec','mjpeg','-framerate','24','-i','pipe:0','-i',path.join(root,'assets','windbell-theme.wav'),'-c:v','libx264','-preset','fast','-crf','26','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-t','36','-movflags','+faststart',out],{stdio:['pipe','ignore','pipe']});
let logs='';encoder.stderr.on('data',b=>logs+=b.toString());
for(let i=0;i<864;i++){
 const jpg=await page.evaluate(s=>{window.Windbell.renderAt(s,{cinematic:true});return document.querySelector('#render-canvas').toDataURL('image/jpeg',.94).split(',')[1]},i/24);
 const bytes=Buffer.from(jpg,'base64');if(!encoder.stdin.write(bytes))await once(encoder.stdin,'drain');
 if(i===48)fs.writeFileSync(path.join(root,'assets','poster.jpg'),bytes);
 if(i%144===0)console.log(`Film frames ${i}/864`);
}
encoder.stdin.end();const [code]=await once(encoder,'close');await browser.close();
if(code!==0)throw Error(logs.slice(-2500));if(errors.length)throw Error(errors.join('\n'));
console.log('Rendered 36-second 1920x1080 / 24fps Korean film with stereo audio:',out);


