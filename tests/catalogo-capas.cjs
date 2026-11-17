const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const {gerarCatalogo, validarWebP, serializarCatalogo} = require('../scripts/gerar-catalogo-capas.cjs');
const livros = require('../assets/palacio-biblico/livros-biblicos.js');
const root = path.resolve(__dirname, '..');
const relative = 'assets/imagens/palacio-biblico/livros-menu';
const real = fs.readFileSync(path.join(root, relative, '32-jonas.webp'));
let grupos = 0;
function testar(nome, executar) { executar(); ++grupos; console.log(`OK ${nome}`); }
function fixture(files) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'palacio-capas-teste-'));
    fs.mkdirSync(path.join(dir, relative), {recursive: true});
    for (const [nome, dados] of Object.entries(files)) fs.writeFileSync(path.join(dir, relative, nome), dados);
    return dir; // Somente pastas de teste; nenhum original é modificado ou excluído.
}
testar('descoberta de arquivo novo sem cadastro manual', () => {
    const dir = fixture({}); assert.deepEqual(gerarCatalogo(dir), {});
    fs.writeFileSync(path.join(dir, relative, '32-jonas.webp'), real);
    assert.deepEqual(gerarCatalogo(dir), {JON: `${relative}/32-jonas.webp`});
    fs.writeFileSync(path.join(dir, relative, '09-1-samuel.webp'), real);
    assert.equal(gerarCatalogo(dir)['1SA'], `${relative}/09-1-samuel.webp`);
    assert.deepEqual(gerarCatalogo(dir), gerarCatalogo(dir));
});
testar('ordem, nome, extensão e caixa rigorosos para GitHub Pages', () => {
    for (const nome of ['31-jonas.webp', '32-joao.webp', '32-Jonas.webp', '32-jonas.WEBP', '32-jonas.png', '32-jonas.webp.png', '67-jonas.webp', '03-levítico.webp']) {
        assert.throws(() => gerarCatalogo(fixture({[nome]: real})), /Nome de capa inválido|não corresponde/);
    }
});
testar('formato real, truncamento, blocos inválidos e animação rejeitados', () => {
    assert.throws(() => validarWebP(Buffer.from('isto não é WebP'), 'falso.webp'), /não é WebP/);
    assert.throws(() => validarWebP(real.subarray(0, real.length - 1), 'truncado.webp'), /tamanho RIFF/);
    const adulterado = Buffer.from(real); adulterado.writeUInt32LE(real.length, 16);
    assert.throws(() => validarWebP(adulterado, 'bloco.webp'), /bloco WebP truncado/);
    const animado = Buffer.from(real); animado.write('ANIM', 12, 'ascii');
    assert.throws(() => validarWebP(animado, 'animado.webp'), /estático/);
    assert(validarWebP(real, 'Jonas').largura > 0);
});
testar('catálogo atual contém somente arquivos reais e é reproduzível', () => {
    const catalogo = gerarCatalogo(root);
    assert.equal(catalogo.JON, `${relative}/32-jonas.webp`);
    assert.equal(catalogo.LEV, `${relative}/03-levitico.webp`);
    assert.equal(catalogo.NUM, `${relative}/04-numeros.webp`);
    const ctx = {PalacioBiblico: {}};
    vm.runInNewContext(serializarCatalogo(catalogo), ctx);
    assert.equal(JSON.stringify(ctx.PalacioBiblico.capasBiblicas), JSON.stringify(catalogo));
});
testar('66 livros preservados; capa não altera disponibilidade ou nomes de busca', () => {
    assert.equal(livros.length, 66); assert.equal(new Set(livros.map(l => l[0])).size, 66);
    const PB = {catalogo: [{codigo: 'JHN'}, {codigo: 'PHP'}, {codigo: 'MAT', emPreparacao: true}]};
    const ctx = {PalacioBiblico: PB};
    vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/palacio-biblico/livros-biblicos.js'), 'utf8'), ctx);
    vm.runInNewContext(serializarCatalogo(gerarCatalogo(root)), ctx);
    vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/palacio-biblico/indice-biblico.js'), 'utf8'), ctx);
    const semImagem = lista => JSON.stringify(lista.map(({imagem, ...resto}) => resto));
    // Contrato anterior à migração, com o mesmo catálogo de disponibilidade acima.
    assert.equal(crypto.createHash('sha256').update(semImagem(PB.indiceBiblico)).digest('hex'), 'a52d77f6bb6796a345336c0a1203cfbbf357405aebd0cec274e5bc725ef65f81');
    assert.equal(PB.indiceBiblico.find(l => l.codigo === 'JON').disponivel, false);
    PB.capasBiblicas = {};
    PB.recriarIndiceBiblico();
    assert(PB.indiceBiblico.every(l => l.imagem === null));
});
console.log(`RESULTADO: ${grupos} grupos aprovados.`);
