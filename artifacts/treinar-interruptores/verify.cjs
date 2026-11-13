const fs = require('fs');
const http = require('http');
const path = require('path');
const {spawn} = require('child_process');
const root = process.cwd(), dir = __dirname;
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const server = http.createServer((req,res)=>{
  const url = new URL(req.url,'http://localhost');
  let file = path.join(root,decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
  if(url.pathname === '/baseline') file=path.join(dir,'before.html');
  if(url.pathname === '/baseline.css') file=path.join(dir,'before.css');
  if(!file.startsWith(root)) {res.writeHead(403).end();return;}
  try { let data=fs.readFileSync(file); if(url.pathname==='/baseline') data=Buffer.from(data.toString().replace('href="style.css"','href="baseline.css"'));
    res.setHeader('Content-Type', ({'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream');res.end(data);
  } catch {res.writeHead(404).end();}
});
let chrome, ws, seq=0; const pending=new Map(); const errors=[];
async function cdp(method,params={}) {const id=++seq;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error(method+" timeout"))}},15000);ws.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression) {let r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function tap(selector) {const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(250);}
async function shot(name) {const s=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(dir,name+'.png'),Buffer.from(s.data,'base64'));}
async function state() {return evaluate(`(()=>{const s=document.querySelector('.treinar-exercise-selector'),r=s.getBoundingClientRect();return {question:treinarPergunta.textContent,inputMode:desafiarResposta.inputMode,numberHidden:desafiarNumber.hidden,imageHidden:treinarImagem.hidden,imageLoaded:!!treinarImagem.querySelector('img')?.naturalWidth,pressed:[...s.querySelectorAll('button')].map(b=>b.getAttribute('aria-pressed')),selector:{x:r.x,y:r.y,width:r.width,height:r.height},cardY:document.querySelector('#telaDesafiarMemoria .desafiar-card').getBoundingClientRect().y,overflow:document.documentElement.scrollWidth>innerWidth,storage:JSON.stringify(localStorage)}})()`);}
async function open(baseline=false) {await cdp('Page.navigate',{url:'http://127.0.0.1:8771/'+(baseline?'baseline':'')});await sleep(1600);await evaluate(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnMemoriaNumerica').click();document.getElementById('btnDesafiarMemoria').click()`);await sleep(600);}
async function main(){await new Promise(r=>server.listen(8771,'127.0.0.1',r));
 chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--disable-extensions','--remote-debugging-port=9229','--user-data-dir='+path.join(dir,'chrome-final-captures'),'--no-first-run','about:blank'],{stdio:'ignore',windowsHide:true});
 let tabs;for(let i=0;i<40;i++){try{tabs=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());break;}catch{await sleep(250);}}
 ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl); await new Promise(r=>ws.onopen=r);ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){let p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params);};
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Network.enable');await cdp('Network.setBypassServiceWorker',{bypass:true});await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
 const results=[];
 for(const width of [360,430]){await cdp('Emulation.setDeviceMetricsOverride',{width,height:width===360?800:932,deviceScaleFactor:1,mobile:true});
  const run={width};await open(true);run.before=await state();await shot(width+'-before');await open();run.word=await state();await shot(width+'-palavra');
  await tap('[data-treinar-tipo="numero"]');await sleep(1000);run.image=await state();await evaluate('window.scrollTo(0,0)');await shot(width+'-numero');
  await tap('[data-treinar-tipo="palavra"]');run.returnWord=await state();
  run.frames=await evaluate(`new Promise(resolve=>{const gaps=[];let last=performance.now();function frame(t){gaps.push(t-last);last=t;if(gaps.length<90){window.scrollTo(0,Math.round((Math.sin(gaps.length/15)+1)*100));requestAnimationFrame(frame);}else {window.scrollTo(0,0);resolve({samples:gaps.length,maxMs:Math.max(...gaps),over50ms:gaps.filter(x=>x>50).length});}}requestAnimationFrame(frame)})`);
  await evaluate(`document.querySelector('[data-treinar-tipo="numero"]').focus()`);run.focus=await evaluate(`document.activeElement.matches('[data-treinar-tipo="numero"]')`);
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});run.motion=await evaluate(`getComputedStyle(document.querySelector('[data-treinar-tipo="numero"]')).animationName`);await cdp('Emulation.setEmulatedMedia',{features:[]});
  run.checks = {
    word: run.word.question === 'QUAL É A PALAVRA?' && run.word.inputMode === 'text' && !run.word.numberHidden && run.word.imageHidden,
    image: run.image.question === 'QUAL É O NÚMERO?' && run.image.inputMode === 'numeric' && run.image.numberHidden && run.image.imageLoaded && run.image.pressed.join() === 'false,true',
    roundTrip: run.returnWord.pressed.join() === 'true,false',
    layout: run.before.cardY === run.word.cardY && run.before.cardY === run.image.cardY && !run.image.overflow && !run.word.overflow,
    storage: run.before.storage === run.word.storage && run.word.storage === run.image.storage && run.image.storage === run.returnWord.storage
  };
  await evaluate(`desafiarResposta.value='resposta de teste';desafiarResposta.dispatchEvent(new Event('input',{bubbles:true}));`);
  await tap('#btnVerificarDesafio');
  run.wordCorrection=await evaluate(`({locked:desafiarResposta.readOnly,disabled:[...document.querySelectorAll('[data-treinar-tipo]')].every(b=>b.disabled),next:!btnProximoDesafio.hidden})`);
  await tap('#btnProximoDesafio');
  const expected=await evaluate('desafiarNumber.textContent');
  await tap('[data-treinar-tipo="numero"]');await sleep(600);
  await evaluate(`desafiarResposta.value=${JSON.stringify(expected)};desafiarResposta.dispatchEvent(new Event('input',{bubbles:true}));`);
  await tap('#btnVerificarDesafio');
  run.imageCorrection=await evaluate(`({locked:desafiarResposta.readOnly,disabled:[...document.querySelectorAll('[data-treinar-tipo]')].every(b=>b.disabled),next:!btnProximoDesafio.hidden,feedback:document.querySelector('#telaDesafiarMemoria .desafiar-feedback')?.textContent})`);
  if(Object.values(run.checks).some(v=>!v) || !run.wordCorrection.locked || !run.imageCorrection.locked || !run.wordCorrection.disabled || !run.imageCorrection.next) throw Error('Failed verification '+JSON.stringify(run));
  results.push(run);
 }
 fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{try{await cdp('Browser.close')}catch{}ws?.close();chrome?.kill();server.close();});
