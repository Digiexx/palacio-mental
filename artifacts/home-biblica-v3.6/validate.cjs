const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
new vm.Script(fs.readFileSync('assets/palacio-biblico/home-biblica.js','utf8'));
for(const list of ['protected-before.json','assets-before.json'])for(const file of JSON.parse(fs.readFileSync(path.join(__dirname,list),'utf8').replace(/^\uFEFF/,''))){const sha=crypto.createHash('sha256').update(fs.readFileSync(file.Path)).digest('hex');if(sha!==file.Hash.toLowerCase())throw Error('Arquivo fora do escopo alterado: '+file.Path)}
console.log('PASS: sintaxe da Home; Biblioteca, catálogo, dados, outras telas, versão/cache e assets originais preservados por SHA-256.');
