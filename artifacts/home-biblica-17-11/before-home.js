(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    const imagens = new URL('../imagens/palacio-biblico/home-palacio-biblico/', document.currentScript.src);
    const desenhos = {
        casa: '<path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10"/>',
        livro: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>',
        alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 8-8m-4 0h4v4"/>',
        barras: '<path d="M3 14h4v7H3zM10 9h4v12h-4zM17 3h4v18h-4z"/>',
        estrela: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
        explorar: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
        ajustes: '<path d="m10 3-.5 2.1-2 .9-1.9-.8L3 9.5 4.6 11v2L3 14.5l2.6 4.3 1.9-.8 2 .9.5 2.1h4l.5-2.1 2-.9 1.9.8 2.6-4.3-1.6-1.5v-2L21 9.5l-2.6-4.3-1.9.8-2-.9L14 3h-4Z"/><circle cx="12" cy="12" r="3"/>',
        calendario: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-12 4h2m3 0h2"/>'
    };
    const icone = nome => `<svg viewBox="0 0 24 24" aria-hidden="true">${desenhos[nome]}</svg>`;
    const diaLocal = () => {
        const agora = new Date();
        return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
    };
    function indiceDoDia(dia, dono, tamanho) {
        let hash = 2166136261;
        for (const letra of `${dia}:${dono}`) hash = Math.imul(hash ^ letra.charCodeAt(0), 16777619);
        return (hash >>> 0) % tamanho;
    }

    PB.iniciarHomeBiblica = ({elemento, navegar, abrirBiblioteca}) => {
        if (!elemento) return null;
        elemento.setAttribute('aria-labelledby', 'pdTitulo');
        elemento.innerHTML = `
          <div class="pd-scroll">
            <header class="pd-header">
              <button class="pd-sair" type="button" data-acao="palacioMental" aria-label="Voltar ao início do Palácio Mental" title="Palácio Mental">${icone('casa')}</button>
              <div class="pd-marca">
                <svg class="pd-coroa" viewBox="0 0 64 44" aria-hidden="true"><path d="m8 14 13 9L32 6l11 17 13-9-6 22H14L8 14ZM15 40h34"/></svg>
                <h1 id="pdTitulo">Palácio Bíblico</h1>
                <p>Memorização de versículos</p>
              </div>
            </header>
            <figure class="pd-hero" aria-label="Composição temporária com Bíblia aberta, paisagem e três cruzes">
              <img class="pd-paisagem" src="${new URL('dfgt.webp', imagens).href}" width="941" height="1671" alt="" draggable="false">
              <svg class="pd-cruzes" viewBox="0 0 160 115" aria-hidden="true"><path d="M80 12v94M56 35h48M31 41v65M14 58h34M130 43v63M113 61h34"/></svg>
              <svg class="pd-biblia" viewBox="185 245 400 215" aria-hidden="true"><image href="${new URL('biblia-medalhao.webp', imagens).href}" width="768" height="768"/></svg>
              <figcaption>Composição visual provisória</figcaption>
            </figure>
            <section class="pd-versiculo" aria-labelledby="pdDiaTitulo" aria-busy="true">
              <div class="pd-card-topo">
                <h2 id="pdDiaTitulo">${icone('calendario')}<span>Versículo do Dia</span></h2>
                <button class="pd-favoritar" type="button" disabled aria-label="Favorito de versículo indisponível" aria-describedby="pdLimite" title="Favoritos de versículos ainda não integrados">${icone('estrela')}</button>
              </div>
              <p class="pd-vazio" data-vazio>Consultando seus versículos…</p>
              <blockquote data-texto hidden></blockquote>
              <p class="pd-referencia" data-referencia hidden></p>
              <p class="pd-fonte" data-fonte hidden></p>
              <button class="pd-repetir" type="button" data-acao="recarregar" hidden>Tentar novamente</button>
              <button class="pd-memorizar" type="button" disabled aria-describedby="pdLimite">${icone('livro')}<span>Memorizar Versículo</span></button>
              <p class="pd-limite" id="pdLimite">Memorização e favorito de versículos ainda não integrados.</p>
            </section>
            <nav class="pd-atalhos" aria-label="Acessos do Palácio Bíblico">
              <button type="button" data-acao="livros">${icone('livro')}<span>Livros</span><small>Biblioteca</small></button>
              <button type="button" disabled title="Treinamento bíblico ainda indisponível">${icone('alvo')}<span>Meus Treinos</span><small>Indisponível</small></button>
              <button type="button" disabled title="Progresso bíblico ainda indisponível">${icone('barras')}<span>Progresso</span><small>Indisponível</small></button>
              <button type="button" data-acao="favoritos">${icone('estrela')}<span>Favoritos</span><small>Livros salvos</small></button>
            </nav>
            <p class="pd-status" role="status" data-status>Continue sua jornada, no seu ritmo.</p>
          </div>
          <nav class="pd-menu" aria-label="Menu do Palácio Bíblico">
            <button type="button" data-acao="inicio" aria-current="page">${icone('casa')}<span>Início</span></button>
            <button type="button" data-acao="livros">${icone('livro')}<span>Livros</span></button>
            <button type="button" disabled>${icone('explorar')}<span>Explorar</span><small>Indisponível</small></button>
            <button type="button" disabled>${icone('barras')}<span>Progresso</span><small>Indisponível</small></button>
            <button type="button" disabled>${icone('ajustes')}<span>Ajustes</span><small>Indisponível</small></button>
          </nav>`;
        const card = elemento.querySelector('.pd-versiculo');
        const vazio = elemento.querySelector('[data-vazio]');
        const texto = elemento.querySelector('[data-texto]');
        const referencia = elemento.querySelector('[data-referencia]');
        const fonte = elemento.querySelector('[data-fonte]');
        const repetir = elemento.querySelector('.pd-repetir');
        const status = elemento.querySelector('[data-status]');
        const cacheSessao = new Map();
        let sessao = 0;

        function mensagem(estado, conteudo) {
            elemento.dataset.versiculoEstado = estado;
            delete elemento.dataset.versiculoId;
            vazio.hidden = false;
            vazio.textContent = conteudo;
            for (const campo of [texto, referencia, fonte]) { campo.hidden = true; campo.textContent = ''; }
            repetir.hidden = estado !== 'erro';
        }
        function lerEscolha(chave) {
            if (cacheSessao.has(chave)) return cacheSessao.get(chave);
            try {
                const salvo = JSON.parse(localStorage.getItem(chave));
                if (salvo && typeof salvo.dia === 'string' && typeof salvo.id === 'string') {
                    cacheSessao.set(chave, salvo);
                    return salvo;
                }
            } catch { /* Armazenamento bloqueado ou preferência inválida: mantém os dados originais. */ }
            return null;
        }
        function guardarEscolha(chave, escolha) {
            cacheSessao.set(chave, escolha);
            try { localStorage.setItem(chave, JSON.stringify(escolha)); }
            catch { status.textContent = 'Escolha do dia mantida nesta sessão; armazenamento de preferências indisponível.'; }
        }
        async function carregar() {
            const atual = ++sessao;
            let repo;
            card.setAttribute('aria-busy', 'true');
            mensagem('carregando', 'Consultando seus versículos…');
            status.textContent = 'Continue sua jornada, no seu ritmo.';
            try {
                repo = await PB.criarRepositorio();
                const [livros, versiculos] = await Promise.all([repo.listar('livros'), repo.listar('versiculos')]);
                if (atual !== sessao) return;
                const porLivro = new Map(livros.map(livro => [livro.id, livro]));
                const disponiveis = versiculos.filter(v => porLivro.has(v.livroId) &&
                    typeof v.texto === 'string' && v.texto.trim() && typeof v.fonte === 'string' && v.fonte.trim())
                    .sort((a, b) => a.id.localeCompare(b.id));
                const dia = diaLocal();
                const chave = `palacioBiblicoVersiculoDoDia:${repo.proprietarioLocalId}`;
                const salva = lerEscolha(chave);
                let versiculo;
                if (salva?.dia === dia) {
                    versiculo = disponiveis.find(v => v.id === salva.id);
                    if (!versiculo) {
                        mensagem('indisponivel', 'O versículo escolhido para hoje não está mais disponível no acervo. Uma nova seleção será feita em outro dia.');
                        return;
                    }
                } else {
                    if (!disponiveis.length) {
                        mensagem('vazio', 'Ainda não há versículos com texto e fonte cadastrados no seu acervo. Seu Versículo do Dia aparecerá aqui quando houver conteúdo disponível.');
                        return;
                    }
                    versiculo = disponiveis[indiceDoDia(dia, repo.proprietarioLocalId, disponiveis.length)];
                    guardarEscolha(chave, {dia, id: versiculo.id});
                }
                elemento.dataset.versiculoEstado = 'disponivel';
                elemento.dataset.versiculoId = versiculo.id;
                vazio.hidden = true;
                repetir.hidden = true;
                texto.textContent = versiculo.texto.trim();
                const intervalo = versiculo.fim && versiculo.fim !== versiculo.inicio
                    ? `${versiculo.inicio}–${versiculo.fim}` : versiculo.inicio;
                referencia.textContent = `${porLivro.get(versiculo.livroId).nome} ${versiculo.capitulo}:${intervalo} · ${versiculo.traducao}`;
                fonte.textContent = `Fonte: ${versiculo.fonte}`;
                for (const campo of [texto, referencia, fonte]) campo.hidden = false;
            } catch (erro) {
                if (atual !== sessao) return;
                console.error('Home Bíblica: consulta local indisponível', erro);
                mensagem('erro', 'Não foi possível consultar os versículos locais. Seus dados não foram apagados.');
            } finally {
                repo?.fechar();
                if (atual === sessao) card.setAttribute('aria-busy', 'false');
            }
        }
        elemento.querySelectorAll('[data-acao]').forEach(botao => botao.addEventListener('click', () => {
            switch (botao.dataset.acao) {
                case 'livros': abrirBiblioteca('todos'); break;
                case 'favoritos': abrirBiblioteca('favoritos'); break;
                case 'palacioMental': navegar('home'); break;
                case 'inicio': elemento.querySelector('.pd-scroll').scrollTo({top: 0, behavior: 'instant'}); break;
                case 'recarregar': carregar(); break;
            }
        }));
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !elemento.hidden) carregar();
        });
        return {abrir: carregar, suspender() { ++sessao; }};
    };
})();
