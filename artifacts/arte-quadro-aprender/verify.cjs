const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/arte-quadro-aprender');
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
  await call('Page.navigate',{url:'http://127.0.0.1:8777/'});await sleep(1200);
  await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnIniciarAprendizado').click();document.getElementById('btnComecarAprendizado').click()`);await sleep(200);
  const samples=[];
  for(let i=0;i<101;i++){
   const number=await ev(`document.getElementById('learningNumero').textContent.trim()`);
   if(['02','76','79','87','100'].includes(number)){
    await sleep(160);
    const state=await ev(`(()=>{const q=s=>document.querySelector(s),r=s=>q(s).getBoundingClientRect(),g=q('#learningGallery');return {number:q('#learningNumero').textContent.trim(),word:q('#learningPalavra').textContent.trim(),overflow:document.documentElement.scrollWidth>innerWidth,numberTop:r('#learningNumero').top,imageTop:r('#learningGallery').top,buttonTop:r('#btnProximaMemoria').top,imageBottom:r('#learningGallery').bottom,primary:g.querySelector('.is-current img').getAttribute('src'),loaded:g.querySelector('.is-current img').naturalWidth>0,dots:g.querySelectorAll('.association-gallery__dots span').length,activeColor:g.querySelector('.is-active')?getComputedStyle(g.querySelector('.is-active')).backgroundColor:null,arrowBorder:getComputedStyle(g.querySelector('.association-gallery__arrow')).borderColor}})()`);
    if(number==='02'){
     await ev(`document.querySelector('#learningGallery .association-gallery__arrow--next').click()`);
     state.afterNext=await ev(`document.querySelector('#learningGallery .association-gallery__indicator').textContent`);
     await ev(`document.querySelector('#learningGallery .association-gallery__arrow--previous').click()`);
     state.afterPrevious=await ev(`document.querySelector('#learningGallery .association-gallery__indicator').textContent`);
    }
    const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-${number}.png`),Buffer.from(shot.data,'base64'));
    samples.push(state);
   }
   if(number==='100')break;
   await ev(`document.getElementById('btnProximaMemoria').click()`);
  }
  await ev(`document.getElementById('btnAbrirFaixasAprender').click()`);
  const rangeOpen=await ev(`!document.getElementById('learningRangePanel').hidden`);
  await ev(`document.querySelector('.learning-range-option[data-inicio="10"]').click()`);
  const rangeNumber=await ev(`document.getElementById('learningNumero').textContent.trim()`);
  results.push({width,samples,rangeOpen,rangeNumber});
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});