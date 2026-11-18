const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const livros = require('../assets/palacio-biblico/livros-biblicos.js');
const fonte = fs.readFileSync(path.join(__dirname, '../assets/palacio-biblico/atualizar-capas.js'), 'utf8');
new vm.Script(fonte);

// Adaptador da listagem para testar o atualizador isoladamente, sem dependências DOM.
class DOMParser {
    parseFromString(html) {
        return {querySelector: () => !html.includes('id="files"') ? null : {
            querySelectorAll: () => [...html.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, body]) => ({
                getAttribute: () => href,
                querySelector: selector => {
                    const match = body.match(new RegExp(`class="${selector.slice(1)}">([^<]*)<`));
                    return match ? {textContent: match[1]} : null;
                }
            }))
        }};
    }
}
const pasta = '/assets/imagens/palacio-biblico/livros-menu/';
const listagem = (data = '18/11/2026 08:35:22', tamanho = '99510', extras = '') =>
    `<ul id="files"><li><a href="${pasta}24-jeremias.webp"><span class="size">${tamanho}</span><span class="date">${data}</span></a></li>${extras}</ul>`;
function ambiente(port = '5500', hostname = '127.0.0.1') {
    let html = listagem(), falhar = false, avisos = 0, chamadas = [], tick;
    const tela = {hidden: false}, listeners = {}, PB = {livrosBiblicos: livros, capasBiblicas: {}, recriarIndiceBiblico() { this.recriacoes = (this.recriacoes || 0) + 1; }};
    const context = {
        PalacioBiblico: PB, URL, AbortController, Event, DOMParser, Date, Promise,
        location: {hostname, port, origin: `http://${hostname}:${port}`},
        document: {hidden: false, currentScript: {src: `http://${hostname}:${port}/assets/palacio-biblico/atualizar-capas.js`}, getElementById: () => tela, addEventListener: (n, f) => { listeners[n] = f; }},
        setTimeout, clearTimeout, setInterval: (f, ms) => { assert.equal(ms, 3000); tick = f; },
        dispatchEvent: () => { avisos++; },
        fetch: async url => {
            chamadas.push(String(url));
            if (falhar) throw Error('offline');
            return {ok: true, text: async () => html, json: async () => ({}), headers: {get: () => null}};
        }
    };
    vm.runInNewContext(fonte, context);
    return {PB, context, tela, chamadas, listeners, get avisos() { return avisos; }, get tick() { return tick; }, html: v => { html = v; }, falhar: v => { falhar = v; }};
}
(async () => {
    const a = ambiente();
    await a.PB.atualizarCapas(true);
    assert.match(a.PB.capasBiblicas.JER, /24-jeremias\.webp\?revisao=/);
    assert.equal(a.avisos, 1);
    const original = a.PB.capasBiblicas.JER;
    await a.PB.atualizarCapas(true);
    assert.equal(a.avisos, 1, 'Listagem idêntica não redesenha');
    a.html(listagem('18/11/2026 08:35:23'));
    await a.PB.atualizarCapas(true);
    assert.notEqual(a.PB.capasBiblicas.JER, original, 'Substituição com mesmo tamanho renova URL');
    const revisao = a.PB.capasBiblicas.JER;
    a.html(listagem('18/11/2026 08:35:23', '99512', `<a href="${pasta}fde.webp"></a><a href="${pasta}24-Jeremias.webp"></a><a href="https://externo.test${pasta}24-jeremias.webp"></a>`));
    await a.PB.atualizarCapas(true);
    assert.notEqual(a.PB.capasBiblicas.JER, revisao);
    assert.deepEqual(Object.keys(a.PB.capasBiblicas), ['JER']);
    const seguro = a.PB.capasBiblicas;
    for (const html of ['<html>erro</html>', listagem('', '')]) {
        a.html(html); await a.PB.atualizarCapas(true); assert.equal(a.PB.capasBiblicas, seguro);
    }
    a.falhar(true); await a.PB.atualizarCapas(true); assert.equal(a.PB.capasBiblicas, seguro);
    a.falhar(false);
    let antes = a.chamadas.length;
    a.tela.hidden = true; a.tick(); await a.PB.atualizarCapas(true);
    assert.equal(a.chamadas.length, antes);
    a.tela.hidden = false; a.context.document.hidden = true; a.tick(); await a.PB.atualizarCapas(true);
    assert.equal(a.chamadas.length, antes);
    a.context.document.hidden = false; a.html(listagem());
    await Promise.all([a.PB.atualizarCapas(true), a.PB.atualizarCapas(true)]);
    assert.equal(a.chamadas.length, antes + 1, 'Sem sobreposição');
    assert(a.chamadas.every(url => url === 'http://127.0.0.1:5500' + pasta));
    for (const [port, host] of [['5501', '127.0.0.1'], ['5500', 'site.example']]) {
        const b = ambiente(port, host); await b.PB.atualizarCapas(true);
        assert.equal(b.tick, undefined);
        assert(b.chamadas[0].endsWith('/capas-biblicas.json'));
    }
    console.log('PASS: Jeremias, substituição por data/tamanho, nomes canônicos, falhas, visibilidade, concorrência, consulta única, produção e 5501.');
    if (process.argv.includes('--live')) {
        const res = await fetch('http://127.0.0.1:5500' + pasta, {cache: 'no-store'});
        assert(res.ok); const html = await res.text();
        const b = ambiente(); b.html(html); await b.PB.atualizarCapas(true);
        assert(b.PB.capasBiblicas.JER); assert(!Object.values(b.PB.capasBiblicas).some(v => v.includes('fde.webp')));
        const imagem = await fetch(new URL(b.PB.capasBiblicas.JER, 'http://127.0.0.1:5500/'));
        const bytes = Buffer.from(await imagem.arrayBuffer());
        assert(imagem.ok); assert.equal(bytes.toString('ascii', 0, 4), 'RIFF'); assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
        console.log(`PASS HTTP 5500: ${Object.keys(b.PB.capasBiblicas).length} capas canônicas; Jeremias servido como WebP com URL de revisão; fde ignorado.`);
    }
})().catch(e => { console.error(e); process.exitCode = 1; });
