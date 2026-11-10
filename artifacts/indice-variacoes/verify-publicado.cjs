const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/validacao-publicada-2.3');
fs.mkdirSync(out, {recursive:true});
const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.json':'application/json'};
const server = http.createServer((req,res)=>{
 let name = decodeURIComponent(req.url.split('?')[0]);
 const before = name.startsWith('/before/'); if(before) name = name.slice(7);
 if(name === '/') name = '/index.html';
 try {
   let data;
   if(before && ['/index.html','/script.js','/style.css','/service-worker.js','/assets/banco-memoria.js/banco-memoria.js'].includes(name)) data = cp.execFileSync('git',['show','HEAD:'+name.slice(1)],{cwd:root, maxBuffer:8e6});
   else data = fs.readFileSync(path.join(root,name));
   res.writeHead(200,{'Content-Type':mime[path.extname(name)]||'application/octet-stream'});res.end(data);
 }catch{res.writeHead(404);res.end();}
});
const sleep = ms=>new Promise(r=>setTimeout(r,ms));
let edge;
async function main(){
 await new Promise(r=>server.listen(8765,'127.0.0.1',r));
 edge = cp.spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9223','--user-data-dir='+path.join(require('os').tmpdir(),'palacio-tabela-browser-test'),'about:blank'],{windowsHide:true,stdio:'ignore'});
 let targets;
 for(let i=0;i<40;i++){try{targets=await (await fetch('http://127.0.0.1:9223/json')).json();break;}catch{await sleep(250);}}
 if(!targets) throw Error('Browser unavailable');
 const ws = new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(r=>ws.onopen=r); let id=0;const pending=new Map(),errors=[];
 ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){let p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);};
 const call=(method,params={})=>new Promise((resolve,reject)=>{let n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 const ev=async expression=>{let r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await call('Runtime.enable'); await call('Page.enable');
 const results=[];
 for(const width of [360,430]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:932,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'https://digiexx.github.io/palacio-mental/'});await sleep(1200);
  await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnTabelaMental').click()`);
  let r={width,cases:[]}; const store=await ev(`JSON.stringify(localStorage)`);
  for(const n of [0,1,2,3]){
   await ev(`document.getElementById('btnEntendiMentalDetail').click();document.querySelectorAll('#mentalTableGrid button')[${n}].click()`);await sleep(450);
   let t=await ev(`({number:document.getElementById('mentalDetailNumber').textContent,paths:[...document.querySelectorAll('#mentalDetailGallery img')].map(i=>i.getAttribute('src')),loaded:[...document.querySelectorAll('#mentalDetailGallery img')].map(i=>i.complete&&i.naturalWidth>0),dotsHidden:document.querySelector('#mentalDetail .association-gallery__dots').hidden,arrows:[...document.querySelectorAll('#mentalDetailGallery button')].map(b=>!b.hidden)})`);
   let count=t.paths.length;t.unique=new Set(t.paths).size===count;t.sequence=[];
   for(let i=0;i<count;i++){
    await ev(`document.querySelector('#mentalDetailGallery .association-gallery__arrow--next').click()`);
    t.sequence.push(await ev(`({status:document.querySelector('#mentalDetailGallery .association-gallery__indicator').textContent,active:[...document.querySelectorAll('#mentalDetail .association-gallery__dots span')].findIndex(d=>d.classList.contains('is-active'))})`));
   }
   await ev(`document.getElementById('btnEntendiMentalDetail').click();document.querySelectorAll('#mentalTableGrid button')[${n}].click()`);
   t.reopen=await ev(`document.querySelector('#mentalDetailGallery .association-gallery__indicator').textContent`);
   if(n===3){await sleep(200);const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-03-tabela.png`),Buffer.from(shot.data,'base64'));}
   r.cases.push(t);
  }
  r.storageUnchanged=store===await ev(`JSON.stringify(localStorage)`);
  r.overflow=await ev(`document.documentElement.scrollWidth>innerWidth`);
  await ev(`document.getElementById('btnEntendiMentalDetail').click();history.back()`);await sleep(100);
  r.return=await ev(`document.getElementById('telaTabelaMental').hidden`);
  await ev(`document.getElementById('btnIniciarAprendizado').click();document.getElementById('btnComecarAprendizado').click()`);await sleep(200);
  r.aprender=[];
  for(const n of [1,2,3]){
   await ev(`document.getElementById('btnProximaMemoria').click()`);await sleep(350);
   r.aprender.push(await ev(`({number:document.getElementById('learningNumero').textContent,status:document.querySelector('#learningGallery .association-gallery__indicator').textContent,images:[...document.querySelectorAll('#learningGallery img')].map(i=>i.complete&&i.naturalWidth>0)})`));
  }
  await sleep(200);let shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-03-aprender.png`),Buffer.from(shot.data,'base64'));
  await ev(`document.querySelector('#learningGallery .association-gallery__arrow--next').click()`);
  r.aprenderNext=await ev(`document.querySelector('#learningGallery .association-gallery__indicator').textContent`);
  r.manifest=await ev(`performance.getEntriesByType('resource').filter(e=>e.name.includes('variacoes-memoria')).map(e=>({duration:e.duration,bytes:e.decodedBodySize}))`);
  r.renderTiming=await ev(`(()=>{let times=[];for(let i=0;i<3;i++){let start=performance.now();document.getElementById('btnTabelaMental').click();document.querySelectorAll('#mentalTableGrid button')[3].click();times.push(performance.now()-start);}return times;})()`);
  await ev(`(async()=>{await navigator.serviceWorker.ready;})()`);await sleep(400);
  r.cachedIndex=await ev(`(async()=>!!(await caches.match('./assets/variacoes-memoria.js')))()`);
  await call('Network.enable');await call('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await call('Page.reload');await sleep(1100);
  await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnTabelaMental').click();document.querySelectorAll('#mentalTableGrid button')[3].click()`);await sleep(200);
  r.offline=await ev(`({status:document.querySelector('#mentalDetailGallery .association-gallery__indicator').textContent,images:[...document.querySelectorAll('#mentalDetailGallery img')].map(i=>i.complete&&i.naturalWidth>0)})`);
  await call('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  results.push(r);
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});