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
 chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--disable-extensions','--remote-debugging-port=9229','--user-data-dir='+path.join(dir,'chrome-profile'),'--no-first-run','about:blank'],{stdio:'ignore',windowsHide:true});
 let tabs;for(let i=0;i<40;i++){try{tabs=await fetch('http://127.0.0.1:9229/json').then(r=>r.json());break;}catch{await sleep(250);}}
 ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){let p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params);};
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Network.enable');await cdp('Network.setBypassServiceWorker',{bypass:true});
 const results=[];
 for(const width of [360,430]){await cdp('Emulation.setDeviceMetricsOverride',{width,height:width===360?800:932,deviceScaleFactor:1,mobile:true});await open();let before=await state();await tap('[data-treinar-tipo="numero"]');await sleep(800);let image=await state();await tap('[data-treinar-tipo="palavra"]');let word=await state();
 if(image.pressed.join()!=='false,true'||word.pressed.join()!=='true,false'||before.storage!==word.storage||word.overflow)throw Error('Mode regression');
 const layout=await evaluate(`(()=>{const selectors=['#telaFixarMemoria .fixar-number','#telaDesafiarMemoria .desafiar-number','#velocidadeTrainingArea .velocidade-number','.revisao-training-number'];const results=[];for(const sel of selectors){const e=document.querySelector(sel);for(let a=e;a&&a!==document.body;a=a.parentElement){a.hidden=false;a.style.setProperty('display',a===e?'block':'flex','important');a.style.setProperty('flex-direction','column','important');}for(const value of ['00','08','88','99']){e.textContent=value;const s=getComputedStyle(e),r=e.getBoundingClientRect();results.push({sel,value,font:s.fontSize,line:s.lineHeight,padding:s.padding,height:r.height,width:r.width,pass:r.height>=parseFloat(s.fontSize)*1.39});}}return results})()`);
 if(layout.some(r=>!r.pass))throw Error(JSON.stringify(layout));
 await open();await evaluate('desafiarNumber.textContent="00";document.querySelector(".desafiar-card").scrollIntoView({block:"center",behavior:"instant"})');await shot(width+'-treinar');
 const colors=await evaluate(`[...document.querySelectorAll('[data-treinar-tipo]')].map(e=>({active:e.getAttribute('aria-pressed'),background:getComputedStyle(e).backgroundColor,indicator:getComputedStyle(e,'::after').backgroundColor}))`);
 results.push({width,modeSwitch:true,storageUnchanged:true,layout,colors});}
 fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({widths:results.map(x=>x.width),glyphChecks:results.flatMap(x=>x.layout).length,colors:results[0].colors,errors}));}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{try{await cdp('Browser.close')}catch{}ws?.close();chrome?.kill();server.close();});