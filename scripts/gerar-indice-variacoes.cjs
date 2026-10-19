const fs = require('node:fs');
const path = require('node:path');

// Exportado para validar a descoberta em pastas temporárias, sem tocar nos originais.
function gerarIndice(root) {
    const relative = 'assets/imagens/memoria-numerica/variacoes';
    const directory = path.join(root, relative);
    const index = {};
    const folders = fs.readdirSync(directory, {withFileTypes: true})
        .filter(entry => entry.isDirectory() && /^(?:\d{2}|100)$/.test(entry.name))
        .sort((a, b) => Number(a.name) - Number(b.name));
    for (const folder of folders) {
        const files = fs.readdirSync(path.join(directory, folder.name), {withFileTypes: true})
            .filter(entry => entry.isFile() && /\.webp$/i.test(entry.name))
            .sort((a, b) => a.name.localeCompare(b.name, 'en', {numeric: true}));
        const urls = files.map(file => {
            const filename = path.join(directory, folder.name, file.name);
            const fd = fs.openSync(filename, 'r');
            const header = Buffer.alloc(12);
            try { fs.readSync(fd, header, 0, 12, 0); } finally { fs.closeSync(fd); }
            if (header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WEBP') {
                throw new Error(`Arquivo não é WebP: ${filename}`);
            }
            return `${relative}/${folder.name}/${file.name}`;
        });
        if (urls.length) index[Number(folder.name)] = urls;
    }
    return index;
}

if (require.main === module) {
    const root = path.resolve(__dirname, '..');
    const index = gerarIndice(root);
    const output = '// Gerado por scripts/gerar-indice-variacoes.cjs. Não editar manualmente.\n' +
        'globalThis.PALACIO_VARIACOES = ' + JSON.stringify(index, null, 2) + ';\n';
    fs.writeFileSync(path.join(root, 'assets/variacoes-memoria.js'), output);
    console.log(`Índice: ${Object.keys(index).length} números, ${Object.values(index).flat().length} variações.`);
}
module.exports = {gerarIndice};
