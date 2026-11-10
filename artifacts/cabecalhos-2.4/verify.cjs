const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/cabecalhos-2.4');
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
 const results=[],baseline={};
 const metrics=()=>ev(`(()=>{let o={};for(const q of ['.fixar-training-top','.fixar-card','#btnRevelarFixar','.mental-table-range-toggle','.mental-table-grid']){const e=document.querySelector(q),s=getComputedStyle(e);o[q]={width:e.getBoundingClientRect().width,padding:s.padding,font:s.font,background:s.background,border:s.border};}return o;})()`);
 for(const mode of ['before','after'])for(const width of [360,430]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:932,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://127.0.0.1:8765/'+(mode==='before'?'before/':'')});await sleep(1200);
  await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnFixar').click()`);await sleep(350);
  let r={mode,width,fixarMetrics:await metrics()};
  if(mode==='before')baseline[width]={fixar:r.fixarMetrics};
  if(mode==='after'){
   r.controlsUnchanged=JSON.stringify(r.fixarMetrics)===JSON.stringify(baseline[width].fixar);
   r.header=await ev(`(()=>{let e=document.querySelector('.fixar-header-art img');return {loaded:e.complete&&e.naturalWidth>0,natural:[e.naturalWidth,e.naturalHeight],rendered:[e.width,e.height],title:document.querySelector('.fixar-header h2').textContent.trim(),description:document.querySelector('.fixar-header p').textContent.trim().replace(/\s+/g,' '),overflow:document.documentElement.scrollWidth>innerWidth};})()`);
   let shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-fixar.png`),Buffer.from(shot.data,'base64'));
   await ev(`document.getElementById('btnFaixaFixar').click()`);r.panel=await ev(`!document.getElementById('fixarRangeSelector').hidden`);
   await ev(`document.querySelector('.fixar-range-option[data-fixar-inicio="10"]').click()`);
   r.range=await ev(`document.getElementById('fixarRangeAtual').textContent`);
   await ev(`document.getElementById('btnRevelarFixar').click()`);r.reveal=await ev(`({answer:!document.getElementById('fixarAnswer').hidden,evaluation:!document.getElementById('fixarEvaluation').hidden,question:document.getElementById('fixarQuestion').hidden})`);
   await ev(`document.getElementById('btnLembreiFixar').click()`);r.advance=await ev(`document.getElementById('fixarNumber').textContent`);
  }
  await ev(`document.getElementById('btnTabelaMental').click()`);await sleep(300);
  r.tableMetrics=await metrics();
  if(mode==='before')baseline[width].table=r.tableMetrics;
  if(mode==='after'){
   r.tableUnchanged=JSON.stringify(r.tableMetrics)===JSON.stringify(baseline[width].table);
   r.tableImage=await ev(`({loaded:document.querySelector('.mental-table-hero-image').complete&&document.querySelector('.mental-table-hero-image').naturalWidth>0,mask:getComputedStyle(document.querySelector('.mental-table-hero-image')).maskImage,overflow:document.documentElement.scrollWidth>innerWidth})`);
   let shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-tabela.png`),Buffer.from(shot.data,'base64'));
   await ev(`document.getElementById('btnAbrirFaixasTabela').click();document.querySelector('.mental-table-range-option[data-inicio="20"]').click();document.querySelector('#mentalTableGrid button').click()`);
   r.tableControls=await ev(`({range:document.getElementById('mentalTableRangeAtual').textContent,detail:!document.getElementById('mentalDetail').hidden,number:document.getElementById('mentalDetailNumber').textContent})`);
   await ev(`document.getElementById('btnEntendiMentalDetail').click()`);
   r.closed=await ev(`document.getElementById('mentalDetail').hidden`);
  }
  results.push(r);
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});