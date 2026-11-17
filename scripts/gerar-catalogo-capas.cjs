const fs = require('node:fs');
const path = require('node:path');
const livros = require('../assets/palacio-biblico/livros-biblicos.js');
const pasta = 'assets/imagens/palacio-biblico/livros-menu';
const slug = nome => nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');

function validarWebP(data, nome) {
    const exigir = (ok, motivo) => { if (!ok) throw new Error(`${nome}: ${motivo}`); };
    exigir(data.length >= 20 && data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP', 'conteúdo não é WebP');
    exigir(data.readUInt32LE(4) + 8 === data.length, 'tamanho RIFF inválido ou arquivo truncado');
    let posicao = 12, dimensoes = null;
    while (posicao < data.length) {
        exigir(posicao + 8 <= data.length, 'cabeçalho de bloco truncado');
        const tipo = data.toString('ascii', posicao, posicao + 4), tamanho = data.readUInt32LE(posicao + 4);
        const inicio = posicao + 8, fim = inicio + tamanho;
        exigir(fim + (tamanho % 2) <= data.length, 'bloco WebP truncado');
        exigir(tipo !== 'ANIM' && tipo !== 'ANMF', 'capas devem ser WebP estático');
        if (tipo === 'VP8 ') {
            exigir(tamanho >= 10 && !(data[inicio] & 1) && data.toString('hex', inicio + 3, inicio + 6) === '9d012a', 'quadro VP8 inválido');
            dimensoes = {largura: data.readUInt16LE(inicio + 6) & 0x3fff, altura: data.readUInt16LE(inicio + 8) & 0x3fff};
        } else if (tipo === 'VP8L') {
            exigir(tamanho >= 5 && data[inicio] === 0x2f, 'quadro VP8L inválido');
            const bits = data.readUInt32LE(inicio + 1);
            exigir((bits >>> 29) === 0, 'versão VP8L inválida');
            dimensoes = {largura: (bits & 0x3fff) + 1, altura: ((bits >>> 14) & 0x3fff) + 1};
        } else if (tipo === 'VP8X') {
            exigir(tamanho === 10 && !(data[inicio] & 2), 'cabeçalho VP8X inválido ou animado');
        }
        posicao = fim + (tamanho % 2);
    }
    exigir(dimensoes?.largura > 0 && dimensoes?.altura > 0, 'nenhum quadro WebP válido');
    return dimensoes;
}

function gerarCatalogo(root) {
    const esperados = new Map(livros.map(([codigo, nome], i) => [`${String(i + 1).padStart(2, '0')}-${slug(nome)}.webp`, codigo]));
    const catalogo = {};
    const entradas = fs.readdirSync(path.join(root, pasta), {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name, 'en'));
    for (const entrada of entradas) {
        if (entrada.name.startsWith('.')) continue;
        if (!entrada.isFile()) throw new Error(`Entrada de capa não é arquivo regular: ${entrada.name}`);
        if (!/^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.webp$/.test(entrada.name)) throw new Error(`Nome de capa inválido: ${entrada.name}. Use NN-livro.webp, sem acentos e em minúsculas.`);
        const codigo = esperados.get(entrada.name);
        if (!codigo) throw new Error(`Capa não corresponde à ordem e ao nome de um dos 66 livros: ${entrada.name}`);
        validarWebP(fs.readFileSync(path.join(root, pasta, entrada.name)), entrada.name);
        catalogo[codigo] = `${pasta}/${entrada.name}`;
    }
    return catalogo;
}

function serializarCatalogo(catalogo) {
    return '// Gerado automaticamente. Não editar manualmente.\n' +
        'globalThis.PalacioBiblico.capasBiblicas = Object.freeze(' + JSON.stringify(catalogo, null, 2) + ');\n';
}

if (require.main === module) {
    const root = path.resolve(__dirname, '..');
    const catalogo = gerarCatalogo(root); // Validação completa antes de escrever; nunca modifica imagens.
    const output = serializarCatalogo(catalogo);
    fs.writeFileSync(path.join(root, 'assets/palacio-biblico/capas-biblicas.js'), output);
    fs.writeFileSync(path.join(root, 'assets/palacio-biblico/capas-biblicas.json'), JSON.stringify(catalogo, null, 2) + '\n');
    console.log(`Catálogo: ${Object.keys(catalogo).length} capas WebP verificadas para 66 livros.`);
}
module.exports = {gerarCatalogo, validarWebP, serializarCatalogo};
