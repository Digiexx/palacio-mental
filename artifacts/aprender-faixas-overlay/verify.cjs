const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/aprender-faixas-overlay');
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
 await new Promise(r=>server.listen(8777,'127.0.0.1',r));
 edge = cp.spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9237','--user-data-dir='+path.join(require('os').tmpdir(),'palacio-arte-quadro-test'),'about:blank'],{windowsHide:true,stdio:'ignore'});
 let targets;
 for(let i=0;i<40;i++){try{targets=await (await fetch('http://127.0.0.1:9237/json')).json();break;}catch{await sleep(250);}}
 if(!targets) throw Error('Browser unavailable');
 const ws = new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(r=>ws.onopen=r); let id=0;const pending=new Map(),errors=[];
 ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){let p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);};
 const call=(method,params={})=>new Promise((resolve,reject)=>{let n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 const ev=async expression=>{let r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await call('Runtime.enable'); await call('Page.enable');
 const results=[];
 for(const width of [360,430]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:820,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://127.0.0.1:8777/'});await sleep(1000);
  await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnIniciarAprendizado').click();document.getElementById('btnComecarAprendizado').click();document.getElementById('btnProximaMemoria').click();document.getElementById('btnProximaMemoria').click()`);await sleep(250);
  const state=()=>ev(`(()=>{const q=s=>document.querySelector(s),rect=s=>{let r=q(s).getBoundingClientRect();return {top:r.top,left:r.left,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};return {hidden:q('#learningRangePanel').hidden,expanded:q('#btnAbrirFaixasAprender').getAttribute('aria-expanded'),panel:rect('#learningRangePanel'),toggle:rect('#btnAbrirFaixasAprender'),image:rect('#learningGallery'),button:rect('#btnProximaMemoria'),card:rect('.learning-card'),overflow:document.documentElement.scrollWidth>innerWidth,position:getComputedStyle(q('#learningRangePanel')).position,cardOverflow:getComputedStyle(q('.learning-card')).overflow}})()`);
  const closed=await state();
  let shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-fechado.png`),Buffer.from(shot.data,'base64'));
  await ev(`document.getElementById('btnAbrirFaixasAprender').click()`);await sleep(100);
  const open=await state();
  shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-aberto.png`),Buffer.from(shot.data,'base64'));
  await ev(`document.getElementById('btnFecharFaixasAprender').focus()`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  const escape=await ev(`({hidden:document.getElementById('learningRangePanel').hidden,focus:document.activeElement.id})`);
  const ranges=[];
  for(const start of [0,10,20,30,40,50,60,70,80,90,100]){
   await ev(`document.getElementById('btnAbrirFaixasAprender').click()`);
   await ev(`document.querySelector('.learning-range-option[data-inicio="${start}"]').click()`);
   ranges.push(await ev(`({start:${start},number:document.getElementById('learningNumero').textContent.trim(),closed:document.getElementById('learningRangePanel').hidden,overflow:document.documentElement.scrollWidth>innerWidth})`));
  }
  await ev(`document.getElementById('btnAbrirFaixasAprender').click();document.getElementById('btnFecharFaixasAprender').click()`);
  const closeButton=await ev(`document.getElementById('learningRangePanel').hidden`);
  const stable=JSON.stringify(closed.image)===JSON.stringify(open.image)&&JSON.stringify(closed.button)===JSON.stringify(open.button);
  const pass=stable&&closed.panel.height===0&&!open.overflow&&open.panel.left>=0&&open.panel.right<=width&&open.panel.top>=open.toggle.bottom&&open.panel.bottom<=open.card.bottom&&escape.hidden&&escape.focus==='btnAbrirFaixasAprender'&&closeButton&&ranges.every(r=>Number(r.number)===r.start&&r.closed&&!r.overflow);
  results.push({width,pass,stable,closed,open,escape,closeButton,ranges});
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));await call('Browser.close');ws.close();
 if(errors.length||results.some(r=>!r.pass))process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});