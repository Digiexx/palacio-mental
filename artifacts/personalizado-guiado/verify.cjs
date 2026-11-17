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
  try { let data=fs.readFileSync(file);if(url.pathname==='/script.js'){let source=data.toString();const at=source.lastIndexOf('});');data=Buffer.from(source.slice(0,at)+"window.__personalizadoTeste={state:()=>({modo:modoConfiguradoPersonalizado,ordem:ordemConfiguradaPersonalizado,etapa:etapaConfiguradaPersonalizado,selecionados:[...memoriasSelecionadasPersonalizado],aprender:memoriasAprenderPersonalizado.map(m=>Number(m.numero)),fixar:memoriasFixarPersonalizado,desafiar:memoriasDesafiarPersonalizado,velocidade:memoriasVelocidadePersonalizado,fila:velocidadeFila,indices:[indiceMemoriaAtual,indiceFixarPersonalizado,indiceDesafiarPersonalizado,velocidadeIndiceAtual],atuais:[Number(learningNumero.textContent),fixarNumeroAtual,desafiarNumeroAtual,Number(velocidadeNumber.textContent)],pais:Object.fromEntries(Object.keys(modosOrigemPersonalizado).map(k=>[k,telasApp[k].pai]))}),avancarAprender:avancarMemoria,avancarVelocidade:proximaRodadaVelocidade};"+source.slice(at));} if(url.pathname==='/baseline') data=Buffer.from(data.toString().replace('href="style.css"','href="baseline.css"'));
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
function assert(v,m){if(!v)throw Error(m)}
async function click(sel){await evaluate(`document.querySelector(${JSON.stringify(sel)}).click()`);await sleep(60)}
async function st(){return evaluate('__personalizadoTeste.state()')}
async function back(){await evaluate('history.back()');await sleep(250)}
async function main(){await new Promise(r=>server.listen(8771,'127.0.0.1',r));
chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--disable-extensions','--remote-debugging-port=9233','--user-data-dir='+path.join(dir,'chrome-profile'),'--no-first-run','about:blank'],{stdio:'ignore',windowsHide:true});
let tabs;for(let i=0;i<40;i++){try{tabs=await fetch('http://127.0.0.1:9233/json').then(r=>r.json());break}catch{await sleep(250)}}
ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){let p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params)};
await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Network.enable');await cdp('Network.setBypassServiceWorker',{bypass:true});const results=[];
for(const width of [360,430]){
await cdp('Emulation.setDeviceMetricsOverride',{width,height:width===360?800:932,deviceScaleFactor:1,mobile:true});await cdp('Page.navigate',{url:'http://127.0.0.1:8771/'});await sleep(1500);
await click('#btnFecharInstallBanner');await click('#btnMemoriaNumerica');await click('#btnTreinoPersonalizadoMemoria');
assert(await evaluate('btnPersonalizadoAvancar.disabled && personalizadoEtapaNumeros.hidden && [...document.querySelectorAll(".treino-personalizado-modo")].every(b=>b.getAttribute("aria-pressed")==="false")'),'initial');
const storage=await evaluate('JSON.stringify(localStorage)');await sleep(300);await shot(width+'-etapa1');
await click('#btnPersonalizadoAprender');await click('#btnPersonalizadoFixar');await click('#btnPersonalizadoAvancar');
assert(await evaluate('treinoPersonalizadoGrid.children.length===101 && btnPersonalizadoIniciar.disabled'),'grid');
await click('.treino-personalizado-numero[data-numero="4"]');await click('.treino-personalizado-numero[data-numero="4"]');assert(!(await st()).selecionados.length,'toggle');
await click('#btnSelecionarTodasPersonalizado');assert((await st()).selecionados.length===101,'all');await click('#btnLimparPersonalizado');assert(!(await st()).selecionados.length,'clear');
for(const n of [5,1,4])await click(`.treino-personalizado-numero[data-numero="${n}"]`);
await click('#btnPersonalizadoEtapaVoltar');assert((await st()).selecionados.length===3,'preserve');await click('#btnPersonalizadoAvancar');await back();assert((await st()).etapa===1,'native back');await click('#btnPersonalizadoAvancar');
assert(await evaluate('JSON.stringify(localStorage)')===storage,'storage');await evaluate('window.scrollTo({top:0,behavior:"instant"})');await sleep(300);await shot(width+'-etapa2');assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'overflow');
const runs=[];for(const order of ['ordem','aleatorio'])for(const [mode,id] of Object.entries({aprender:'Aprender',fixar:'Fixar',desafiar:'Desafiar',velocidade:'Velocidade'})){
await click('#btnPersonalizadoEtapaVoltar');await click('#btnPersonalizado'+id);await click('#btnPersonalizadoAvancar');await click(`[data-personalizado-ordem="${order}"]`);await click('#btnPersonalizadoIniciar');
let state=await st(),queue=state[mode];assert([...queue].sort((a,b)=>a-b).join()==='1,4,5','permutation '+mode);if(order==='ordem')assert(queue.join()==='1,4,5','ascending');assert(state.pais[mode]==='personalizado','parent');
if(mode==='velocidade'){assert(await evaluate('!velocidadeConfig.hidden'),'time config');await click('#btnIniciarVelocidade');assert((await st()).fila.join()===queue.join(),'stable speed')}
let observed=[];for(let i=0;i<3;i++){
state=await st();observed.push(state.atuais[['aprender','fixar','desafiar','velocidade'].indexOf(mode)]);
if(mode==='aprender')await evaluate('__personalizadoTeste.avancarAprender()');
if(mode==='fixar'){await click('#btnRevelarFixar');await click('#btnLembreiFixar')}
if(mode==='desafiar'){await evaluate(`desafiarResposta.value=${JSON.stringify(String(queue[i]).padStart(2,'0'))};desafiarResposta.dispatchEvent(new Event('input',{bubbles:true}))`);await click('#btnVerificarDesafio');await click('#btnProximoDesafio')}
if(mode==='velocidade')await evaluate('__personalizadoTeste.avancarVelocidade()');}
assert(observed.join()===queue.join(),'round '+mode+' '+observed+' vs '+queue);await back();assert(await evaluate('!telaTreinoPersonalizado.hidden'),'return '+mode);state=await st();assert(state.modo===mode&&state.selecionados.length===3&&state.etapa===2,'return choices');runs.push({mode,order,queue,observed});}
await back();await back();for(const [mode,button] of Object.entries({aprender:'btnAprenderDestaque',fixar:'btnFixar',desafiar:'btnDesafiarMemoria',velocidade:'btnVelocidadeMemoria'})){await click('#'+button);assert((await st()).pais[mode]!=='personalizado','normal '+mode);await back()}
await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await click('#btnTreinoPersonalizadoMemoria');assert(await evaluate('getComputedStyle(personalizadoEtapaNumeros).animationName==="none"'),'reduced');await cdp('Emulation.setEmulatedMedia',{features:[]});results.push({width,runs});}
assert(!errors.length,'JS exceptions '+JSON.stringify(errors));fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({widths:results.map(x=>x.width),runs:results.flatMap(x=>x.runs).length,errors}));}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{try{await cdp('Browser.close')}catch{}ws?.close();chrome?.kill();server.close()});
