(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    const url = new URL('capas-biblicas.json', document.currentScript.src);
    const liveServer = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && location.port === '5500';
    const pasta = new URL('../imagens/palacio-biblico/livros-menu/', url);
    const esperados = new Map(PB.livrosBiblicos.map(([codigo, nome], i) => [codigo,
        `assets/imagens/palacio-biblico/livros-menu/${String(i + 1).padStart(2, '0')}-${nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-')}.webp`]));
    let pendente = null, ultima = 0, eventos = null;
    const bibliotecaVisivel = () => !document.hidden && document.getElementById('telaBibliotecaBiblica')?.hidden === false;
    async function lerListagem(signal) {
        const resposta = await fetch(pasta, {cache: 'no-store', signal});
        if (!resposta.ok) throw new Error('Listagem indisponível');
        // Documento separado: scripts da listagem nunca são executados.
        const documento = new DOMParser().parseFromString(await resposta.text(), 'text/html');
        const lista = documento.querySelector('#files');
        if (!lista) throw new Error('Resposta não é uma listagem do Live Server');
        const arquivos = new Map([...esperados].map(([codigo, caminho]) => [new URL(caminho.split('/').pop(), pasta).href, [codigo, caminho]]));
        const mapa = {};
        for (const link of lista.querySelectorAll('a[href]')) {
            const destino = new URL(link.getAttribute('href'), pasta);
            const esperado = arquivos.get(destino.href);
            if (!esperado) continue;
            const tamanho = link.querySelector('.size')?.textContent.trim();
            const data = link.querySelector('.date')?.textContent.trim();
            if (!/^\d+$/.test(tamanho || '') || !data) throw new Error('Metadados incompletos');
            const [codigo, caminho] = esperado;
            mapa[codigo] = `${caminho}?revisao=${encodeURIComponent(`${tamanho}-${data}`)}`;
        }
        return mapa;
    }
    PB.atualizarCapas = (forcar = false) => {
        if (liveServer && !bibliotecaVisivel()) return Promise.resolve();
        if (pendente) return pendente;
        if (!forcar && Date.now() - ultima < 15000) return Promise.resolve();
        ultima = Date.now();
        pendente = (async () => {
            const controller = new AbortController(), limite = setTimeout(() => controller.abort(), 1800);
            try {
                if (liveServer) {
                    const mapa = await lerListagem(controller.signal);
                    if (!bibliotecaVisivel()) return;
                    if (JSON.stringify(mapa) !== JSON.stringify(PB.capasBiblicas)) {
                        PB.capasBiblicas = Object.freeze(mapa);
                        PB.recriarIndiceBiblico();
                        globalThis.dispatchEvent(new Event('palacio-biblico-capas'));
                    }
                    return;
                }
                const resposta = await fetch(url, {cache:'no-store', signal:controller.signal});
                if (!resposta.ok) return;
                const mapa = await resposta.json();
                if (!mapa || typeof mapa !== 'object' || Array.isArray(mapa) || Object.entries(mapa).some(([codigo, caminho]) => esperados.get(codigo) !== caminho)) return;
                if (JSON.stringify(mapa) !== JSON.stringify(PB.capasBiblicas)) {
                    PB.capasBiblicas = Object.freeze({...mapa});
                    PB.recriarIndiceBiblico();
                    globalThis.dispatchEvent(new Event('palacio-biblico-capas'));
                }
                // O cabeçalho só existe no servidor local; produção não abre conexão persistente.
                const endpoint = resposta.headers.get('X-Palacio-Capas-Eventos');
                if (!eventos && endpoint && ['localhost','127.0.0.1','[::1]'].includes(location.hostname)) {
                    const destino = new URL(endpoint, url);
                    if (destino.origin === location.origin && destino.pathname === '/__capas/eventos') {
                        eventos = new EventSource(destino);
                        eventos.onmessage = () => PB.atualizarCapas(true);
                        eventos.onopen = () => PB.atualizarCapas(true);
                    }
                }
            } catch { /* Rede indisponível ou catálogo inválido: mantém último catálogo confiável. */ }
            finally { clearTimeout(limite); }
        })().finally(() => { pendente = null; });
        return pendente;
    };
    // Uma listagem por ciclo, apenas na Biblioteca local visível; nunca sonda imagens.
    if (liveServer) setInterval(() => { if (bibliotecaVisivel()) PB.atualizarCapas(true); }, 3000);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && (!document.getElementById('telaHomeBiblica').hidden || !document.getElementById('telaBibliotecaBiblica').hidden)) PB.atualizarCapas();
    });
})();
