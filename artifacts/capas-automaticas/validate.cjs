const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
for(const file of ['scripts/servir-local.cjs','scripts/gerar-catalogo-capas.cjs','assets/palacio-biblico/atualizar-capas.js','assets/palacio-biblico/indice-biblico.js','assets/palacio-biblico/biblioteca.js','assets/palacio-biblico/home-biblica.js','service-worker.js'])new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
for(const file of JSON.parse(fs.readFileSync(path.join(__dirname,'images-before.json'),'utf8').replace(/^\uFEFF/,''))){if(crypto.createHash('sha256').update(fs.readFileSync(file.Path)).digest('hex')!==file.Hash.toLowerCase())throw Error('Imagem alterada: '+file.Path)}
const tasks=JSON.parse(fs.readFileSync('.vscode/tasks.json','utf8'));if(tasks.tasks[0].runOptions.runOn!=='folderOpen')throw Error('Tarefa automática ausente');
console.log('PASS sintaxe, imagens originais por SHA-256 e tarefa automática.');
require('../../tests/catalogo-capas.cjs');
