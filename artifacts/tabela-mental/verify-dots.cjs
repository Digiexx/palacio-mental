const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/tabela-pontos');
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
 const snapshot=()=>ev(`(()=>{const g=document.getElementById('mentalDetailGallery');return {status:g?.querySelector('.association-gallery__indicator').textContent,visible:[...g?.querySelectorAll('figure')||[]].filter(f=>!f.hidden).length,arrows:g?[...g.querySelectorAll('button')].map(b=>!b.hidden):[],images:g?[...g.querySelectorAll('img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})):[],dots:[...document.querySelectorAll('#mentalDetail .association-gallery__dots > span')].map(d=>d.classList.contains('is-active')),dotsHidden:document.querySelector('#mentalDetail .association-gallery__dots').hidden,number:document.getElementById('mentalDetailNumber').textContent};})()`);
 const open=async n=>{await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnTabelaMental').click();document.querySelectorAll('#mentalTableGrid button')[${n}].click()`);await sleep(350);};
 const geometry=()=>ev(`(()=>{let r={};for(const c of ['.mental-detail-card','.mental-detail-image-area','.mental-detail-content','.mental-detail-button','.mental-detail-top']){let e=document.querySelector(c),b=e.getBoundingClientRect(),s=getComputedStyle(e);r[c]={x:b.x,y:b.y,width:b.width,height:b.height,color:s.color,background:s.background,border:s.border,font:s.font,padding:s.padding};}return r;})()`);
 for(const width of [360,430]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:932,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://127.0.0.1:8765/before/'});await sleep(1100);await open(0);const before=await geometry();
  await call('Page.navigate',{url:'http://127.0.0.1:8765/'});await sleep(1100);await open(0);
  const r={width,geometryUnchanged:JSON.stringify(before)===JSON.stringify(await geometry())};
  const store=await ev(`JSON.stringify(localStorage)`);
  r.single=await snapshot();
  for(const n of [1,2]){
   await ev(`document.getElementById('btnEntendiMentalDetail').click(); document.querySelectorAll('#mentalTableGrid button')[${n}].click()`);await sleep(500);
   const item={initial:await snapshot()};
   const total=n===1?6:4;
   item.steps=[];
   for(let i=1;i<=total;i++){await ev(`document.querySelector('#mentalDetailGallery .association-gallery__arrow--next').click()`);item.steps.push(await snapshot());}
   await ev(`document.querySelector('#mentalDetailGallery .association-gallery__arrow--previous').click()`);item.previous=(await snapshot()).status;
   await ev(`document.querySelector('#mentalDetailGallery .association-gallery__viewport').focus()`);
   for(const key of ['Home','End','ArrowLeft','ArrowRight']){await call('Input.dispatchKeyEvent',{type:'keyDown',key,code:key});item[key]=(await snapshot()).status;}
   await sleep(250); const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-${n===1?'teia':'noe'}.png`),Buffer.from(shot.data,'base64'));
   await ev(`document.getElementById('btnEntendiMentalDetail').click(); document.querySelectorAll('#mentalTableGrid button')[${n}].click()`);item.reopen=(await snapshot()).status;
   r[n===1?'teia':'noe']=item;
  }
  await ev(`document.getElementById('btnEntendiMentalDetail').click();document.getElementById('btnAbrirFaixasTabela').click();document.querySelector('.mental-table-range-option[data-inicio="10"]').click();document.querySelector('#mentalTableGrid button').click()`);
  r.rangeSwitch=await snapshot();
  r.storageUnchanged=store===await ev(`JSON.stringify(localStorage)`);
  r.overflow=await ev(`document.documentElement.scrollWidth>innerWidth`);
  await ev(`document.getElementById('btnEntendiMentalDetail').click();document.getElementById('btnIniciarAprendizado').click();document.getElementById('btnComecarAprendizado').click()`);await sleep(300);
  r.aprender=[];
  for(const n of [1,2,3]){
   await ev(`document.getElementById('btnProximaMemoria').click()`);await sleep(300);
   const check=await ev(`({number:document.getElementById('learningNumero').textContent,status:document.querySelector('#learningGallery .association-gallery__indicator').textContent,images:[...document.querySelectorAll('#learningGallery img')].map(i=>i.complete&&i.naturalWidth>0)})`);
   await ev(`document.querySelector('#learningGallery .association-gallery__arrow--next').click()`);
   check.next=await ev(`document.querySelector('#learningGallery .association-gallery__indicator').textContent`);r.aprender.push(check);
  }
  await ev(`document.getElementById('btnTabelaMental').click();document.querySelectorAll('#mentalTableGrid button')[2].click()`);await sleep(600);
  await call('Network.enable');await call('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
  await call('Page.reload');await sleep(1100);await open(2);r.offlineNoe=await snapshot();
  await call('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  results.push(r);
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});