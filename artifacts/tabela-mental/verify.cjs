const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/tabela-mental');
fs.mkdirSync(out, {recursive:true});
const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.json':'application/json'};
const server = http.createServer((req,res)=>{
 let name = decodeURIComponent(req.url.split('?')[0]);
 const before = name.startsWith('/before/'); if(before) name = name.slice(7);
 if(name === '/') name = '/index.html';
 try {
   let data;
   if(before && ['/index.html','/script.js','/style.css','/service-worker.js'].includes(name)) data = cp.execFileSync('git',['show','HEAD:'+name.slice(1)],{cwd:root, maxBuffer:8e6});
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
 for(const mode of ['before','after'])for(const width of [360,430]){
   await call('Emulation.setDeviceMetricsOverride',{width,height:932,deviceScaleFactor:1,mobile:true});
   await call('Page.navigate',{url:'http://127.0.0.1:8765/'+(mode==='before'?'before/':'')});await sleep(1300);
   // Existing navigation is driven through the application's own controls.
   const open=await ev(`(()=>{const b=document.getElementById('btnTabelaMental'); b.click(); return {hidden:document.getElementById('telaTabelaMental').hidden};})()`);
   await sleep(400);
   await ev(`document.getElementById('btnFecharInstallBanner').click()`);
   const storageBefore=await ev(`JSON.stringify(localStorage)`);
   let r={mode,width,open};
   r.initial=await ev(`({cards:document.querySelectorAll('#mentalTableGrid .mental-table-card').length, overflow:document.documentElement.scrollWidth>innerWidth, title:document.querySelector('.mental-table-hero h2')?.textContent, imageLoaded:document.querySelector('.mental-table-hero-image')?.naturalWidth})`);
   r.timings=await ev(`(()=>{let samples=[];for(let j=0;j<3;j++){let t=performance.now();for(let i=0;i<11;i++)document.querySelectorAll('.mental-table-range-option')[i].click();samples.push(performance.now()-t);}return samples;})()`);
   r.ranges=await ev(`(()=>{let counts=[];for(const b of document.querySelectorAll('.mental-table-range-option')){b.click();counts.push(document.querySelectorAll('#mentalTableGrid .mental-table-card').length);}return counts;})()`);
   if(mode==='after'){
     await ev(`document.getElementById('btnAbrirFaixasTabela').click()`);
     r.keyboardFocus=await ev(`document.activeElement.dataset.inicio`);
     await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
     await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
     r.escape=await ev(`({hidden:document.getElementById('mentalTableRangePanel').hidden,focus:document.activeElement.id,expanded:document.getElementById('btnAbrirFaixasTabela').getAttribute('aria-expanded')})`);
     // Enter opens the native button, Tab advances into the panel, Space selects a range.
     await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
     await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
     r.enter=await ev(`!document.getElementById('mentalTableRangePanel').hidden`);
     await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
     await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
     r.tab=await ev(`({tag:document.activeElement.tagName,id:document.activeElement.id,className:document.activeElement.className})`);
     await ev(`document.querySelector('.mental-table-range-option[data-inicio="10"]').focus()`);
     await call('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
     await call('Input.dispatchKeyEvent',{type:'char',text:' '});
     await call('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
     r.space=await ev(`({range:document.getElementById('mentalTableRangeAtual').textContent,closed:document.getElementById('mentalTableRangePanel').hidden})`);
     await ev(`document.querySelector('#mentalTableGrid button').click()`);
     r.detail=await ev(`({visible:!document.getElementById('mentalDetail').hidden,number:document.getElementById('mentalDetailNumber').textContent})`);
     await ev(`document.getElementById('btnEntendiMentalDetail').click()`);
     r.detailClosed=await ev(`document.getElementById('mentalDetail').hidden`);
     await ev(`history.back()`); await sleep(100);
     r.back=await ev(`document.getElementById('telaTabelaMental').hidden`);
     await ev(`document.getElementById('btnTabelaMental').click()`);
     r.reopen=await ev(`({range:document.getElementById('mentalTableRangeAtual').textContent,active:document.querySelector('.mental-table-range-option.active').dataset.inicio,cards:document.querySelectorAll('#mentalTableGrid button').length})`);
     for(const state of ['closed','open']){
       if(state==='open')await ev(`document.getElementById('btnAbrirFaixasTabela').click()`);
       await sleep(100);
       const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
       fs.writeFileSync(path.join(out,`${width}-${state}.png`),Buffer.from(shot.data,'base64'));
     }
     r.storageUnchanged=storageBefore===await ev(`JSON.stringify(localStorage)`);
     r.cardImages=await ev(`document.querySelectorAll('#mentalTableGrid img').length`);
     r.offlineReady=await ev(`(async()=>{await navigator.serviceWorker.ready; const keys=await caches.keys(); return {keys,header:!!(await caches.match('./assets/imagens/memoria-numerica/tabela-mental-topo.webp')),bank:!!(await caches.match('./assets/banco-memoria.js/banco-memoria.js'))};})()`);
     await call('Network.enable');await call('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
     await call('Page.reload');await sleep(1300);
     await ev(`document.getElementById('btnTabelaMental').click()`);
     r.offline=await ev(`({cards:document.querySelectorAll('#mentalTableGrid button').length,image:document.querySelector('.mental-table-hero-image').naturalWidth})`);
     await call('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
   }
   results.push(r);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));
 }
 console.log(JSON.stringify({results,errors},null,2));await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});
