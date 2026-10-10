import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8766/');await page.evaluate(()=>window.Windbell.ready);
await page.locator('#sound').click();await page.waitForFunction(()=>document.getElementById('sound').getAttribute('aria-pressed')==='true',{},{timeout:15000});assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#music').evaluate(el=>el.paused),false);
await page.locator('#sound').click();assert.equal(await page.locator('#music').evaluate(el=>el.paused),true);
await page.locator('#pause').click();const t=await page.evaluate(()=>window.Windbell.time);await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>window.Windbell.time),t);await page.locator('#pause').click();
await page.locator('[data-place=workshop]').click();assert.equal(await page.locator('#dialog').isVisible(),true);assert.ok((await page.locator('#dialog').innerText()).includes('바람 공방'));
await page.locator('#home').click();await page.locator('#scene').focus();let pos=await page.evaluate(()=>[window.Windbell.player.x,window.Windbell.player.y]);await page.keyboard.down('ArrowLeft');await page.waitForTimeout(450);await page.keyboard.up('ArrowLeft');let after=await page.evaluate(()=>[window.Windbell.player.x,window.Windbell.player.y]);assert.ok(Math.hypot(after[0]-pos[0],after[1]-pos[1])>3);
await page.locator('#tour').click();assert.equal(await page.locator('#tour').getAttribute('aria-pressed'),'true');await page.waitForTimeout(300);await page.locator('#home').click();
await page.locator('video').evaluate(video=>new Promise(resolve=>{if(video.readyState>=1)return resolve();video.addEventListener('loadedmetadata',resolve,{once:true})}));const meta=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight}));assert.equal(meta.width,1920);assert.equal(meta.height,1080);assert.ok(Math.abs(meta.duration-36)<.1);
await page.locator('video').evaluate(v=>v.play());await page.waitForTimeout(650);assert.ok(await page.locator('video').evaluate(v=>v.currentTime>0&&!v.paused));await page.locator('video').evaluate(v=>v.pause());
fs.mkdirSync('qa',{recursive:true});await page.locator('#home').click();await page.screenshot({path:'qa/desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});await page.reload();await page.evaluate(()=>window.Windbell.ready);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('.mobile-walk').isVisible(),true);await page.screenshot({path:'qa/mobile.png',fullPage:true});
assert.deepEqual(errors,[]);console.log('PASS: audio toggle, pause, destination dialogue, keyboard movement, guided tour, FullHD video metadata/playback, 390px mobile layout; no JS errors.');console.log(JSON.stringify(meta));await browser.close();

