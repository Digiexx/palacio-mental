const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/fixar-faixas-2.4');
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
 for(const width of [360,430]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:820,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://127.0.0.1:8765/'});await sleep(1200);
  await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnFixar').click();document.getElementById('btnFaixaFixar').click()`);await sleep(300);
  const r={width};r.open=await ev(`!document.getElementById('fixarRangeSelector').hidden`);
  r.layout=await ev(`(()=>{let buttons=[...document.querySelectorAll('.fixar-range-option')];return {rows:buttons.map(b=>Math.round(b.getBoundingClientRect().top)),clipped:buttons.some(b=>b.scrollWidth>b.clientWidth),horizontal:document.documentElement.scrollWidth>innerWidth,color:getComputedStyle(document.getElementById('btnRevelarFixar')).backgroundColor};})()`);
  let shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}-aberto.png`),Buffer.from(shot.data,'base64'));
  await ev(`document.getElementById('btnFecharFaixasFixar').click()`);r.close=await ev(`({hidden:document.getElementById('fixarRangeSelector').hidden,expanded:document.getElementById('btnFaixaFixar').getAttribute('aria-expanded'),focus:document.activeElement.id})`);
  r.ranges=[];
  for(let i=0;i<11;i++){
   await ev(`document.getElementById('btnFaixaFixar').click();document.querySelectorAll('.fixar-range-option')[${i}].click()`);
   r.ranges.push(await ev(`({range:document.getElementById('fixarRangeAtual').textContent,number:document.getElementById('fixarNumber').textContent,closed:document.getElementById('fixarRangeSelector').hidden,active:document.querySelector('.fixar-range-option.is-active').dataset.fixarInicio})`));
  }
  await ev(`document.getElementById('btnFaixaFixar').click();document.getElementById('btnFecharFaixasFixar').focus()`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
  r.escape=await ev(`document.getElementById('fixarRangeSelector').hidden`);
  results.push(r);
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});