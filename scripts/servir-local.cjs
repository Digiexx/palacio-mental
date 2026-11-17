// Servidor local sem dependências: catálogo em memória + eventos somente em desenvolvimento.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {gerarCatalogo, serializarCatalogo} = require('./gerar-catalogo-capas.cjs');

function criarServidor({root = path.resolve(__dirname, '..'), port = 5501, host = '127.0.0.1', log = console.log} = {}) {
    const pasta = path.join(root, 'assets/imagens/palacio-biblico/livros-menu');
    let catalogo = gerarCatalogo(root), assinatura = '', timer, tentativas = 0;
    const clientes = new Set();
    const assinaturaAtual = () => fs.readdirSync(pasta).filter(n => !n.startsWith('.')).sort().map(n => {
        const stat = fs.statSync(path.join(pasta, n)); return `${n}:${stat.size}:${stat.mtimeMs}`;
    }).join('|');
    assinatura = assinaturaAtual();
    function atualizar() {
        try {
            const proximo = gerarCatalogo(root), nova = assinaturaAtual();
            if (nova !== assinatura) {
                catalogo = proximo; assinatura = nova;
                for (const cliente of clientes) cliente.write('data: capas\n\n');
                log(`Capas atualizadas automaticamente: ${Object.keys(catalogo).length}.`);
            }
            tentativas = 0;
        } catch (e) {
            // Cópia em andamento: mantém catálogo anterior e tenta novamente, sem publicar dados parciais.
            if (++tentativas <= 4) timer = setTimeout(atualizar, 300);
            else log(`Catálogo anterior preservado: ${e.message}`);
        }
    }
    const watcher = fs.watch(pasta, () => { clearTimeout(timer); tentativas = 0; timer = setTimeout(atualizar, 180); });
    const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
    const server = http.createServer((req, res) => {
        if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
        let pathname;
        try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
        catch { res.writeHead(400).end(); return; }
        if (pathname === '/__capas/eventos') {
            res.writeHead(200, {'Content-Type':'text/event-stream','Cache-Control':'no-store','Connection':'keep-alive'});
            res.write(': conectado\n\n'); clientes.add(res); req.on('close', () => clientes.delete(res)); return;
        }
        res.setHeader('Cache-Control', 'no-store');
        if (pathname === '/assets/palacio-biblico/capas-biblicas.json') {
            res.setHeader('Content-Type', mime['.json']);
            res.setHeader('X-Palacio-Capas-Eventos', '/__capas/eventos');
            res.end(JSON.stringify(catalogo)); return;
        }
        if (pathname === '/assets/palacio-biblico/capas-biblicas.js') {
            res.setHeader('Content-Type', mime['.js']); res.end(serializarCatalogo(catalogo)); return;
        }
        const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
        const relative = path.relative(root, file);
        if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p => p.startsWith('.'))) { res.writeHead(403).end(); return; }
        fs.readFile(file, (erro, data) => {
            if (erro) { res.writeHead(404).end(); return; }
            res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
            res.end(req.method === 'HEAD' ? undefined : data);
        });
    });
    function fechar() { clearTimeout(timer); watcher.close(); for (const cliente of clientes) cliente.end(); return new Promise(resolve => server.close(resolve)); }
    return {server, fechar, iniciar: () => new Promise((resolve, reject) => {
        server.once('error', reject); server.listen(port, host, () => { server.removeListener('error', reject); log(`Palácio Mental: http://${host}:${server.address().port}/ — capas automáticas ativas.`); resolve(server.address()); });
    })};
}
if (require.main === module) {
    const i = process.argv.indexOf('--port');
    const app = criarServidor({port: i < 0 ? 5501 : Number(process.argv[i + 1])});
    app.iniciar().catch(e => { console.error(e.message); app.fechar().finally(() => { process.exitCode = 1; }); });
    for (const sinal of ['SIGINT', 'SIGTERM']) process.on(sinal, () => app.fechar().then(() => process.exit()));
}
module.exports = {criarServidor};
