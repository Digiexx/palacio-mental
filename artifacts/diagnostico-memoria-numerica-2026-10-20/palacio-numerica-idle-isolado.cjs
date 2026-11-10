const fs = require('fs'), http = require('http'), cp = require('child_process'), path = require('path');
const root = process.cwd(), out = path.join(require('os').tmpdir(), 'palacio-numerica-idle-isolado');
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
 edge = cp.spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new','--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding','--disable-background-timer-throttling','--no-first-run','--remote-debugging-port=9237','--user-data-dir='+path.join(require('os').tmpdir(),'palacio-diagnostico-isolado'),'about:blank'],{windowsHide:true,stdio:'ignore'});
 let targets;
 for(let i=0;i<40;i++){try{targets=await (await fetch('http://127.0.0.1:9237/json')).json();break;}catch{await sleep(250);}}
 if(!targets) throw Error('Browser unavailable');
 const ws = new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(r=>ws.onopen=r); let id=0;const pending=new Map(),errors=[];
 ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){let p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);};
 const call=(method,params={})=>new Promise((resolve,reject)=>{let n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 const ev=async expression=>{let r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await call('Runtime.enable'); await call('Page.enable');
 const traces=[];let collecting=false;
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(collecting&&m.method==='Tracing.dataCollected')traces.push(...m.params.value);});
 await call('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{
  window.__diag={timerCalls:0,rafCalls:0,writesBlocked:0,domMutations:0,paused:false};window.__nativeRAF=requestAnimationFrame.bind(window);
  for(const name of ['setTimeout','setInterval']){const original=window[name].bind(window);window[name]=(fn,ms,...args)=>original(typeof fn==='function'?function(...a){if(!__diag.paused){__diag.timerCalls++;return fn(...a)}}:fn,ms,...args);}
  const raf=window.__nativeRAF;window.requestAnimationFrame=fn=>raf(t=>{if(!__diag.paused){__diag.rafCalls++;fn(t)}});
  for(const name of ['setItem','removeItem','clear'])Storage.prototype[name]=function(){__diag.writesBlocked++};
  window.__long=[];window.__shifts=[];try{new PerformanceObserver(l=>__long.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});new PerformanceObserver(l=>__shifts.push(...l.getEntries().map(e=>({start:e.startTime,value:e.value,hadRecentInput:e.hadRecentInput})))).observe({type:'layout-shift',buffered:true});}catch{}
 })()`});
 await call('Performance.enable');await call('Emulation.setCPUThrottlingRate',{rate:4});
 const results=[];let inventory;
 const scopes='#telaMemoriaNumerica, #telaMemoriaNumerica *, #telaMemoriaNumerica::before, #telaMemoriaNumerica::after, #telaMemoriaNumerica *::before, #telaMemoriaNumerica *::after, .home-nav, .home-nav *, .home-nav *::before, .home-nav *::after';
 for(const width of [360])for(let rep=0;rep<2;rep++)for(const scenario of ['A','N','H','C']){
  await call('Emulation.setDeviceMetricsOverride',{width,height:820,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:'http://127.0.0.1:8777/'});await sleep(1000);
  const opened=await ev(`(()=>{document.getElementById('btnFecharInstallBanner').click();let t=performance.now();document.getElementById('btnMemoriaNumerica').click();document.getElementById('btnMemoriaNumerica').click();if(document.getElementById('telaMemoriaNumerica').hidden)throw Error('Central not visible');return performance.now()-t})()`);await call('Page.bringToFront');await call('Emulation.setFocusEmulationEnabled',{enabled:true});await sleep(600);
  if(!inventory){inventory=await ev(`(()=>{const root=document.getElementById('telaMemoriaNumerica'),items=[];for(const el of [root,...root.querySelectorAll('*'),...document.querySelectorAll('.home-nav,.home-nav *')]){if(!el.getBoundingClientRect().width)continue;for(const pseudo of [null,'::before','::after']){let s=getComputedStyle(el,pseudo);if(pseudo&&['none','normal'].includes(s.content))continue;if(s.filter!=='none'||s.backdropFilter!=='none'||s.animationName!=='none'||s.boxShadow!=='none'||s.textShadow!=='none')items.push({tag:el.tagName,id:el.id,class:el.className,pseudo,filter:s.filter,backdrop:s.backdropFilter,shadow:s.boxShadow,textShadow:s.textShadow,animation:s.animationName,duration:s.animationDuration,iteration:s.animationIterationCount,position:s.position});}}return {effects:items,animations:document.getAnimations().map(a=>({target:a.effect?.target?.className,name:a.animationName,playState:a.playState})),images:[...root.querySelectorAll('img')].map(i=>({src:i.getAttribute('src'),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,displayWidth:i.width,displayHeight:i.height,loaded:i.complete})),resources:performance.getEntriesByType('resource').filter(r=>/\.(webp|png|jpg)/.test(r.name)).map(r=>({name:r.name,bytes:r.decodedBodySize,duration:r.duration})),height:document.documentElement.scrollHeight}})()`);}
  let css='';if(scenario==='B')css=scopes+'{filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;text-shadow:none!important}';
  if(scenario==='C')css=scopes+'{animation:none!important;transition:none!important}';
  if(scenario==='N')css='#telaMemoriaNumerica::after,#telaMemoriaNumerica::before,#telaMemoriaNumerica *,#telaMemoriaNumerica *::after,#telaMemoriaNumerica *::before{animation:none!important;transition:none!important}';
  if(scenario==='H')css='.home-nav,.home-nav *,.home-nav *::before,.home-nav *::after{animation:none!important;transition:none!important}';
  if(scenario==='D')css='#telaMemoriaNumerica .memory-numeric-hero img{visibility:hidden!important}#telaMemoriaNumerica .memory-numeric-hero{background:#08080b!important}';
  if(css)await ev(`(()=>{let s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.append(s)})()`);
  if(scenario==='E')await ev('__diag.paused=true');
  await ev(`(()=>{__diag.domMutations=0;new MutationObserver(l=>__diag.domMutations+=l.length).observe(document.getElementById('telaMemoriaNumerica'),{subtree:true,attributes:true,childList:true,characterData:true});__diag.timerCalls=0;__diag.rafCalls=0;__long=[];__shifts=[];window.__frames=[];__diag.probing=true;window.__frameStart=performance.now();function tick(t){__frames.push(t);if(__diag.probing)__nativeRAF(tick)}__nativeRAF(tick)})()`);
  traces.length=0;collecting=true;
  await call('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline.frame,benchmark',transferMode:'ReportEvents'});
  const m0=await call('Performance.getMetrics');const start=await ev('performance.now()');
  await sleep(1000);


  await sleep(250);
  const end=await ev('performance.now()');const m1=await call('Performance.getMetrics');
  const traceDone=new Promise(resolve=>{const fn=e=>{if(JSON.parse(e.data).method==='Tracing.tracingComplete'){ws.removeEventListener('message',fn);resolve()}};ws.addEventListener('message',fn)});await call('Tracing.end');await traceDone;collecting=false;
  const probe=await ev(`(()=>{const f=__frames.filter(t=>t>=${start}&&t<=${end}),d=f.slice(1).map((t,i)=>t-f[i]).sort((a,b)=>a-b);__diag.probing=false;return {visibility:document.visibilityState,rafFrames:f.length,rafRate:f.length/((${end}-${start})/1000),intervalP95:d[Math.floor(d.length*.95)]||0,intervalsOver25:d.filter(t=>t>25).length,intervalsOver50:d.filter(t=>t>50).length,longTasks:__long.filter(x=>x.start>=${start}),cls:__shifts.filter(x=>x.start>=${start}&&!x.hadRecentInput).reduce((a,x)=>a+x.value,0),diag:__diag,scrollY,overflow:document.documentElement.scrollWidth>innerWidth,storage:JSON.stringify(localStorage)}})()`);
  const perf={};for(const name of ['LayoutCount','RecalcStyleCount','LayoutDuration','RecalcStyleDuration','TaskDuration','ScriptDuration'])perf[name]=m1.metrics.find(m=>m.name===name).value-m0.metrics.find(m=>m.name===name).value;perf.heapMB=m1.metrics.find(m=>m.name==='JSHeapUsedSize').value/1048576;
  const events={};for(const e of traces){if(['Paint','PrePaint','Layout','UpdateLayoutTree','RasterTask','DrawFrame','FireAnimationFrame','FunctionCall'].includes(e.name)){const v=events[e.name]||(events[e.name]={count:0,ms:0});v.count++;v.ms+=(e.dur||0)/1000;}}
  const row={width,rep,scenario,openHandlerMs:opened,elapsedMs:end-start,probe,perf,events};results.push(row);console.log(JSON.stringify({width,rep,scenario,rafRate:probe.rafRate,p95:probe.intervalP95,paint:events.Paint,layout:perf.LayoutCount}));
  if(rep===0&&width===360)fs.writeFileSync(path.join(out,`trace-${scenario}.json`),JSON.stringify({traceEvents:traces}));
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({environment:{browser:await call('Browser.getVersion'),cpuThrottle:4,viewportHeight:820,deviceScaleFactor:1,note:'Desktop headless; no real mobile GPU; rAF cadence is not presentation FPS'},inventory,results,errors},null,2));
 console.log('DONE '+out);await call('Browser.close');ws.close();
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{server.close();if(edge)edge.kill();});