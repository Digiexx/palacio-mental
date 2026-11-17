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
async function open(baseline=false) {await cdp('Page.navigate',{url:'http://127.0.0.1:8789/'+(baseline?'baseline':'')});await sleep(1600);await evaluate(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnMemoriaNumerica').click();document.getElementById('btnDesafiarMemoria').click()`);await sleep(600);}
function assert(v,m){if(!v)throw Error(m)}
async function click(sel){await evaluate(`document.querySelector(${JSON.stringify(sel)}).click()`);await sleep(60)}
async function st(){return evaluate('__personalizadoTeste.state()')}
async function openLibrary(){await cdp('Page.navigate',{url:'http://127.0.0.1:8789/'});await sleep(1800);await evaluate(`document.getElementById('btnFecharInstallBanner')?.click();document.getElementById('btnPalacioBiblico').click()`);await sleep(500);await evaluate(`document.querySelector('[data-acao="livros"]').click()`);await sleep(800);assert(await evaluate('document.querySelectorAll(".pb-card").length===66'),'66 cards');}
const snapshot=`(()=>{const css=e=>e && JSON.stringify([...getComputedStyle(e)].map(k=>[k,getComputedStyle(e).getPropertyValue(k)]));return {other:[...document.querySelectorAll('.pb-card:not(.pb-card-black-v9)')].map(css),filters:[...document.querySelectorAll('.pb-filtros button')].map(css),images:[...document.querySelectorAll('.pb-card-black-v9 .pb-card-imagem')].map(e=>({css:css(e),img:css(e.querySelector('img')),src:e.querySelector('img')?.src,loaded:!e.querySelector('img') || e.querySelector('img').naturalWidth>0})),size:[...document.querySelectorAll('.pb-card')].map(e=>[e.offsetWidth,e.offsetHeight])}})()`;
async function imageShot(){const r=await evaluate(`(()=>{const r=document.querySelector('.pb-card-imagem').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width*.8,height:r.height,scale:1}})()`);return (await cdp('Page.captureScreenshot',{format:'png',clip:r})).data;}
async function main(){await new Promise(r=>server.listen(8789,'127.0.0.1',r));
chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--disable-extensions','--remote-debugging-port=9249','--user-data-dir='+path.join(dir,'chrome-profile-approved'),'--no-first-run','about:blank'],{stdio:'ignore',windowsHide:true});
let tabs;for(let i=0;i<40;i++){try{tabs=await fetch('http://127.0.0.1:9249/json').then(r=>r.json());break}catch{await sleep(250)}}
ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){let p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params);else if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params)};
await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Network.enable');await cdp('Network.setBypassServiceWorker',{bypass:true});
const results=[];
for(const [width,height] of [[360,800],[412,924],[430,932]]){
await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});await openLibrary();
assert(await evaluate(`JSON.stringify([...document.querySelectorAll('.pb-card-black-v9 [data-livro]')].map(e=>e.dataset.livro))==='["GEN","EXO","LEV"]'`),'only target cards');
const after=await evaluate(snapshot), imageAfter=await imageShot();await shot(width+'x'+height+'-v9');
await evaluate(`document.querySelectorAll('.pb-card-black-v9').forEach(e=>e.classList.remove('pb-card-black-v9'))`);
const before=await evaluate(snapshot.replaceAll('.pb-card:not(.pb-card-black-v9)', '.pb-card:nth-child(n+4)').replaceAll('.pb-card-black-v9 .pb-card-imagem','.pb-card:nth-child(-n+3) .pb-card-imagem'));
// Compare all non-target cards directly across toggle, including both testaments.
const unaffected=await evaluate(`(()=>{const css=e=>e && JSON.stringify([...getComputedStyle(e)].map(k=>[k,getComputedStyle(e).getPropertyValue(k)]));return [...document.querySelectorAll('.pb-card')].slice(3).map(css)})()`);
assert(JSON.stringify(after.other)===JSON.stringify(unaffected),'63 unchanged cards');assert(JSON.stringify(after.filters)===JSON.stringify(before.filters),'filters unchanged');assert(JSON.stringify(after.size)===JSON.stringify(before.size),'dimensions unchanged');assert(imageAfter===await imageShot(),'image pixels unchanged');await shot(width+'x'+height+'-before');
await evaluate(`document.querySelectorAll('.pb-card').forEach(e=>{if(['GEN','EXO','LEV'].includes(e.querySelector('[data-livro]').dataset.livro))e.classList.add('pb-card-black-v9')})`);
for(const code of ['GEN','EXO','LEV']){await tap('[data-favorito="'+code+'"]');assert(await evaluate(`document.querySelector('[data-favorito="${code}"]').getAttribute('aria-pressed')==='true'`),'favorite '+code);await tap('[data-livro="'+code+'"]');assert(await evaluate('document.querySelectorAll(".pb-card-black-v9").length===3'),'selection preserved');}
await tap('[data-filtro="favoritos"]');assert(await evaluate('document.querySelectorAll(".pb-card").length===3'),'favorites filter');await openLibrary();for(const code of ['GEN','EXO','LEV'])assert(await evaluate(`document.querySelector('[data-favorito="${code}"]').getAttribute('aria-pressed')==='true'`),'persistence '+code);
for(const code of ['GEN','EXO','LEV'])await tap('[data-favorito="'+code+'"]');
await tap('[data-filtro="todos"]');assert(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'no overflow');assert(after.images.every(x=>x.loaded),'target images loaded');
results.push({width,height,cards:66,targets:3,unchangedCards:63,filtersUnchanged:true,imagePixelsUnchanged:true,favoritesAndPersistence:true,selection:true,overflow:false});
}
assert(errors.length===0,'console errors: '+JSON.stringify(errors));fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors}));}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{try{await cdp('Browser.close')}catch{}ws?.close();chrome?.kill();server.close()});
