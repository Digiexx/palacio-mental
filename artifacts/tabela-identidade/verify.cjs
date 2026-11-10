const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/tabela-identidade');
fs.mkdirSync(out, {recursive:true});
const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.json':'application/json'};
const server = http.createServer((req,res)=>{
 let name = decodeURIComponent(req.url.split('?')[0]);
 const before = name.startsWith('/before/'); if(before) name = name.slice(7);
 if(name === '/') name = '/index.html';
 try {
   let data;
   if(before && name === '/style.css') data = fs.readFileSync(path.join(out,'style-before.css'));
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
 const results=[],geometry={};
 const inspect=()=>ev(`(()=>{let layout={},paint={};for(const q of ['.mental-detail-card','.mental-detail-image-area','.mental-detail-code','.mental-detail-word','.mental-detail-number','.mental-detail-button','.mental-detail-content']){let e=document.querySelector(q),r=e.getBoundingClientRect(),s=getComputedStyle(e);layout[q]={x:r.x,y:r.y,w:r.width,h:r.height,padding:s.padding,font:s.font,borderWidth:s.borderWidth,borderRadius:s.borderRadius};paint[q]={color:s.color,background:s.background,borderColor:s.borderColor,shadow:s.boxShadow};}return {layout,paint};})()`);
 for(const mode of ['before','after'])for(const width of [360,430]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:932,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://127.0.0.1:8765/'+(mode==='before'?'before/':'')});await sleep(1300);
  await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnTabelaMental').click();document.querySelectorAll('#mentalTableGrid button')[2].click()`);await sleep(500);
  let r={mode,width,...await inspect()};
  if(mode==='before')geometry[width]=r.layout;else r.geometryUnchanged=JSON.stringify(geometry[width])===JSON.stringify(r.layout);
  const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-${mode}.png`),Buffer.from(shot.data,'base64'));
  if(mode==='after'){
   r.tests=[];
   for(const n of [0,1,2]){
    await ev(`document.getElementById('btnEntendiMentalDetail').click();document.querySelectorAll('#mentalTableGrid button')[${n}].click()`);await sleep(250);
    let t=await ev(`({number:document.getElementById('mentalDetailNumber').textContent,images:document.querySelectorAll('#mentalDetailGallery img').length,dotsHidden:document.querySelector('#mentalDetail .association-gallery__dots').hidden,arrows:[...document.querySelectorAll('#mentalDetailGallery button')].map(b=>!b.hidden)})`);
    await ev(`document.querySelector('#mentalDetailGallery .association-gallery__arrow--next').click()`);
    t.status=await ev(`document.querySelector('#mentalDetailGallery .association-gallery__indicator').textContent`);r.tests.push(t);
   }
   r.overflow=await ev(`document.documentElement.scrollWidth>innerWidth`);
  }
  results.push(r);
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results:results.map(r=>({mode:r.mode,width:r.width,geometryUnchanged:r.geometryUnchanged,tests:r.tests,overflow:r.overflow})),errors},null,2));await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});