(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    const url = new URL('capas-biblicas.json', document.currentScript.src);
    const esperados = new Map(PB.livrosBiblicos.map(([codigo, nome], i) => [codigo,
        `assets/imagens/palacio-biblico/livros-menu/${String(i + 1).padStart(2, '0')}-${nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-')}.webp`]));
    let pendente = null, ultima = 0, eventos = null;
    PB.atualizarCapas = (forcar = false) => {
        if (pendente) return pendente;
        if (!forcar && Date.now() - ultima < 15000) return Promise.resolve();
        ultima = Date.now();
        pendente = (async () => {
            const controller = new AbortController(), limite = setTimeout(() => controller.abort(), 1800);
            try {
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
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && (!document.getElementById('telaHomeBiblica').hidden || !document.getElementById('telaBibliotecaBiblica').hidden)) PB.atualizarCapas();
    });
})();
