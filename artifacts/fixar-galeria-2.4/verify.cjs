const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/fixar-galeria-2.4');
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
 const info=()=>ev(`(()=>{const root=document.getElementById('fixarGallery'),f=document.getElementById('fixarImageArea').getBoundingClientRect(),img=root.querySelector('.is-current img'),b=img?.getBoundingClientRect();return {number:document.getElementById('fixarNumber').textContent,status:root.querySelector('.association-gallery__indicator').textContent,count:root.querySelectorAll('img').length,arrows:[...root.querySelectorAll('button')].map(e=>!e.hidden),dotsHidden:document.querySelector('#fixarAnswer > .association-gallery__dots').hidden,current:[...document.querySelectorAll('#fixarAnswer .association-gallery__dots span')].findIndex(e=>e.classList.contains('is-active')),inside:!!b&&b.x>=f.x-1&&b.right<=f.right+1&&b.y>=f.y-1&&b.bottom<=f.bottom+1,loaded:[...root.querySelectorAll('img')].map(i=>i.complete&&i.naturalWidth>0),mode:root.dataset.navigation};})()`);
 for(const mode of ['arrows','carousel'])for(const width of [360,430]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:820,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://127.0.0.1:8765/'});await sleep(1000);
  await ev(`localStorage.setItem('palacioMentalNavegacaoImagens','${mode}')`);await call('Page.reload');await sleep(1000);
  await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnFixar').click()`);await sleep(100);
  let r={mode,width,cases:[]};
  const advance=async direction=>{
   if(mode==='arrows')await ev(`document.querySelector('#fixarGallery .association-gallery__arrow--${direction>0?'next':'previous'}').click()`);
   else{
    await ev(`document.querySelector('#fixarGallery .association-gallery__viewport').scrollIntoView({block:'center',behavior:'instant'})`);
    let p=await ev(`(()=>{let r=document.querySelector('#fixarGallery .association-gallery__viewport').getBoundingClientRect();return {x:r.x+r.width*.5,y:r.y+r.height*.5}})()`);
    await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});
    await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:p.x-60*direction,y:p.y}]});
    await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   }
  };
  for(let n=0;n<4;n++){
   let t={hiddenBeforeReveal:await ev(`document.getElementById('fixarAnswer').hidden`)};
   await ev(`document.getElementById('btnRevelarFixar').click()`);await sleep(500);t.initial=await info();t.forward=[];
   for(let i=0;i<t.initial.count;i++){await advance(1);t.forward.push((await info()).current);}
   await advance(-1);t.previous=(await info()).current;
   if(n===3){await ev(`document.getElementById('fixarAnswer').scrollIntoView({block:'center',behavior:'instant'})`);await sleep(200);let shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-${mode}-mae.png`),Buffer.from(shot.data,'base64'));}
   await ev(`document.getElementById('${n%2===0?'btnLembreiFixar':'btnNaoLembreiFixar'}').click()`);t.afterEvaluation=await info();r.cases.push(t);
  }
  await ev(`document.getElementById('btnFaixaFixar').click();document.querySelector('.fixar-range-option[data-fixar-inicio="100"]').click()`);r.range=await info();
  await ev(`document.getElementById('btnRevelarFixar').click();document.getElementById('btnLembreiFixar').click();document.getElementById('btnFinalizarFixar').click()`);r.newRound=await info();
  await ev(`document.getElementById('imageNavigationSwitch').click()`);r.livePreference=await ev(`({mode:document.getElementById('fixarGallery').dataset.navigation,stored:localStorage.getItem('palacioMentalNavegacaoImagens')})`);
  r.overflow=await ev(`document.documentElement.scrollWidth>innerWidth`);r.revealColor=await ev(`getComputedStyle(document.getElementById('btnRevelarFixar')).backgroundColor`);
  results.push(r);
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});