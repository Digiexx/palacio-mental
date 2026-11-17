const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const {criarServidor} = require('../scripts/servir-local.cjs');

(async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'palacio-capas-observador-'));
    const pasta = path.join(root, 'assets/imagens/palacio-biblico/livros-menu');
    fs.mkdirSync(pasta, {recursive: true}); fs.writeFileSync(path.join(root, 'index.html'), '<title>fixture</title>');
    const bytes = fs.readFileSync(path.join(__dirname, '../assets/imagens/palacio-biblico/livros-menu/44-atos.webp'));
    const logs = [], app = criarServidor({root, port: 0, log: m => logs.push(m)});
    let stream;
    try {
        const address = await app.iniciar(), url = `http://127.0.0.1:${address.port}`;
        const response = await fetch(url + '/assets/palacio-biblico/capas-biblicas.json');
        assert.deepEqual(await response.json(), {});
        assert.equal(response.headers.get('X-Palacio-Capas-Eventos'), '/__capas/eventos');
        let avisar; const evento = new Promise(resolve => { avisar = resolve; });
        await new Promise((resolve, reject) => {
            stream = http.get(url + '/__capas/eventos', res => {
                res.on('data', data => { if (data.toString().includes('data: capas')) avisar(); else resolve(); });
            }); stream.on('error', reject);
        });
        fs.writeFileSync(path.join(pasta, '44-atos.webp'), bytes);
        await Promise.race([evento, new Promise((_, reject) => setTimeout(() => reject(Error('Sem evento automático')), 4000).unref())]);
        assert.equal((await fetch(url + '/assets/palacio-biblico/capas-biblicas.json').then(r => r.json())).ACT, 'assets/imagens/palacio-biblico/livros-menu/44-atos.webp');
        assert(!fs.existsSync(path.join(root, 'assets/palacio-biblico/capas-biblicas.js')));
        assert((await fetch(url + '/assets/palacio-biblico/capas-biblicas.js').then(r => r.text())).includes('44-atos.webp'));
        assert.equal((await fetch(url + '/.git/config')).status, 403);
        assert.equal((await fetch(url + '/%2e%2e%2fsecret')).status, 403);
        assert.equal((await fetch(url + '/', {method: 'POST'})).status, 405);
        fs.writeFileSync(path.join(pasta, '08-rute.webp'), Buffer.from('incompleto'));
        await new Promise(r => setTimeout(r, 1900));
        const seguro = await fetch(url + '/assets/palacio-biblico/capas-biblicas.json').then(r => r.json());
        assert(!!seguro.ACT && !seguro.RUT);
        assert(logs.some(l => l.includes('Catálogo anterior preservado')));
        const callbacks = {}, origem = 'http://127.0.0.1:5501';
        vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../service-worker.js'), 'utf8'), {
            self: {location: {origin: origem}, addEventListener: (nome, callback) => { callbacks[nome] = callback; }},
            URL, Request, Response, fetch: async () => new Response('fixture', {status: 404})
        });
        let resposta;
        callbacks.fetch({request: new Request(origem + '/__capas/eventos'), respondWith: () => { throw Error('Fluxo de eventos não pode entrar no cache'); }});
        callbacks.fetch({request: new Request(origem + '/index.html'), respondWith: promise => { resposta = promise; }});
        assert.equal((await resposta).status, 404); // Caminho normal continua na estratégia existente.
        console.log('PASS servidor: Atos detectado por evento sem build, sem catálogo em disco, validação de cópia parcial e rotas protegidas.');
        console.log('PASS cache: fluxo de eventos ignorado pelo SW; requisições normais continuam gerenciadas.');
    } finally { stream?.destroy(); await app.fechar(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
