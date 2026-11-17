const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=process.cwd(),dir=__dirname;
const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
const base=git(['rev-parse','HEAD']);
const files=[
 'index.html','script.js','service-worker.js',
 'scripts/build.cjs','scripts/gerar-catalogo-capas.cjs','scripts/servir-local.cjs','.vscode/tasks.json',
 'assets/palacio-biblico/biblioteca.css','assets/palacio-biblico/biblioteca.js',
 'assets/palacio-biblico/home-biblica.css','assets/palacio-biblico/home-biblica.js',
 'assets/palacio-biblico/indice-biblico.js','assets/palacio-biblico/livros-biblicos.js',
 'assets/palacio-biblico/capas-biblicas.js','assets/palacio-biblico/capas-biblicas.json',
 'assets/palacio-biblico/atualizar-capas.js'
];
const covers=[...new Set([
 ...git(['diff','--name-only','--diff-filter=AM','--','assets/imagens/palacio-biblico/livros-menu/']).split('\n'),
 ...git(['ls-files','--others','--exclude-standard','--','assets/imagens/palacio-biblico/livros-menu/']).split('\n')
])].filter(p=>/^assets\/imagens\/palacio-biblico\/livros-menu\/\d{2}-[a-z0-9-]+\.webp$/.test(p)).sort();
files.push(...covers);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'palacio-v3.5-candidato-')),candidate=path.join(temp,'source'),archive=path.join(temp,'head.tar');
fs.mkdirSync(candidate);execFileSync('git',['archive','--format=tar','--output='+archive,base],{cwd:root});execFileSync('tar',['-xf',archive,'-C',candidate]);
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const selected=files.map(file=>{
 if(!fs.statSync(path.join(root,file)).isFile())throw Error('Arquivo ausente: '+file);
 if(/^(artifacts|experimentos|assets\/imagens\/referencias)\//.test(file))throw Error('Fora de escopo: '+file);
 const dest=path.join(candidate,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,file),dest);
 return {file,bytes:fs.statSync(dest).size,sha256:sha(dest),tipo:git(['ls-files','--',file])?'modificado':'novo'};
});
const manifest={base,proximaVersao:'V3.5 (proposta; não criada)',candidate,selected,excluded:'Todas as exclusões locais; artifacts, experimentos, referências, testes/docs novos e imagens sem dependência no app.'};
fs.writeFileSync(path.join(dir,'selection.json'),JSON.stringify(manifest,null,2));fs.writeFileSync(path.join(dir,'selected-files.txt'),files.join('\n')+'\n');
console.log('Candidato:',candidate);console.log('Selecionados:',files.length,'arquivos;',covers.length,'capas novas/alteradas.');
execFileSync(process.execPath,[path.join(candidate,'scripts/build.cjs')],{cwd:candidate,stdio:'inherit'});
for(const file of selected)if(sha(path.join(candidate,file.file))!==file.sha256)throw Error('Build alterou arquivo selecionado: '+file.file);
for(const file of git(['diff','--name-only','--diff-filter=D']).split('\n').filter(Boolean))if(!fs.existsSync(path.join(candidate,file)))throw Error('Exclusão local entrou no candidato: '+file);
const catalog=JSON.parse(fs.readFileSync(path.join(candidate,'assets/palacio-biblico/capas-biblicas.json'),'utf8'));
for(const file of Object.values(catalog))if(sha(path.join(candidate,file))!==sha(path.join(root,file)))throw Error('Capa divergente: '+file);
console.log('PASS candidato: sem exclusões locais; capas atuais preservadas; catálogo consistente após build.');
