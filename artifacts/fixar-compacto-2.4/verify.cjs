const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(root, 'artifacts/fixar-compacto-2.4');
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
 for(const [width,height] of [[360,500],[360,640],[360,740],[360,800],[430,740],[430,820],[430,932]]){
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://127.0.0.1:8765/'});await sleep(1100);
  await ev(`document.getElementById('btnFecharInstallBanner').click();document.getElementById('btnFixar').click()`);await sleep(350);
  let r={width,height};
  r.initial=await ev(`(()=>{const b=document.getElementById('btnRevelarFixar'),s=getComputedStyle(b),r=b.getBoundingClientRect();return {scroll:document.documentElement.scrollHeight>innerHeight,docHeight:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,buttonBottom:r.bottom,buttonVisible:r.top>=0&&r.bottom<=innerHeight,background:s.backgroundColor,descriptionRemoved:!document.querySelector('.fixar-header-copy p'),imageLoaded:document.querySelector('.fixar-header-art img').naturalWidth>0};})()`);
  let shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}x${height}-inicial.png`),Buffer.from(shot.data,'base64'));
  await ev(`document.getElementById('btnRevelarFixar').scrollIntoView({block:'center'});document.getElementById('btnRevelarFixar').click()`);await sleep(200);
  r.revealed=await ev(`({answer:!document.getElementById('fixarAnswer').hidden,buttons:[...document.querySelectorAll('#fixarEvaluation button')].map(b=>({id:b.id,visible:getComputedStyle(b).display!=='none'&&b.getBoundingClientRect().height>0}))})`);
  await ev(`document.getElementById('btnLembreiFixar').scrollIntoView({block:'end',behavior:'instant'})`);await sleep(100);
  r.buttonRects=await ev(`['btnLembreiFixar','btnNaoLembreiFixar'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return {top:r.top,bottom:r.bottom}})`); r.accessible=await ev(`['btnLembreiFixar','btnNaoLembreiFixar'].every(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1})`);
  shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,`${width}x${height}-revelado.png`),Buffer.from(shot.data,'base64'));
  await ev(`document.getElementById('btnNaoLembreiFixar').click()`);r.next=await ev(`document.getElementById('fixarNumber').textContent`);
  results.push(r);
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});