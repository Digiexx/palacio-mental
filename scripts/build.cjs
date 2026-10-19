const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
execFileSync(process.execPath, [path.join(__dirname, 'gerar-indice-variacoes.cjs')], {stdio: 'inherit'});
// Pasta temporária nova a cada build: nunca remove arquivos locais ou referências.
const output = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'palacio-site-'));
for (const name of ['index.html', 'style.css', 'script.js', 'home.css', 'home.js', 'temas.css', 'service-worker.js', 'manifest.json']) {
    fs.copyFileSync(path.join(root, name), path.join(output, name));
}
fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), {
    recursive: true,
    filter: source => path.basename(source).toLowerCase() !== 'referencias'
});
fs.writeFileSync(path.join(output, '.nojekyll'), '');
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `directory=${output}\n`);
console.log(`Site preparado em: ${output}`);
