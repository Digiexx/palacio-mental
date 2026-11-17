const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
for(const file of ['assets/palacio-biblico/home-biblica.js','assets/palacio-biblico/biblioteca.js','script.js'])new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
const before=JSON.parse(fs.readFileSync(path.join(__dirname,'hashes-before.json'),'utf8').replace(/^\uFEFF/,''));
for(const file of before){const after=crypto.createHash('sha256').update(fs.readFileSync(file.Path)).digest('hex');if(after!==file.Hash.toLowerCase())throw Error('Arquivo fora de escopo alterado: '+file.Path)}
for(const file of ['40-mateus.webp','41-marcos.webp','42-lucas.webp','43-joao.webp','50-filipenses.webp']){const data=fs.readFileSync(path.join('assets/imagens/palacio-biblico/livros-menu',file));if(data.toString('ascii',0,4)!=='RIFF'||data.toString('ascii',8,12)!=='WEBP')throw Error('Formato inválido '+file)}
console.log('Sintaxe JS válida; arquivos protegidos idênticos por SHA-256; cinco WebP reais verificados.');
require('../../scripts/build.cjs');
