(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
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
    PB.iniciarHomeBiblica = ({elemento, navegar, abrirBiblioteca, abrirLivro}) => {
        if (!elemento) return null;
        // Somente arquivos WebP já verificados no repositório; originais preservados.
        const slides = ['MRK', 'LUK', 'JHN', 'MAT', 'PHP'].map(codigo => {
            const indice = PB.indiceBiblico.find(livro => livro.codigo === codigo);
            return {...indice, disponivel: PB.catalogo.some(livro => livro.codigo === codigo)};
        });
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
            <section class="pd-carrossel" role="region" aria-roledescription="carrossel" aria-label="Livros bíblicos">
              <div class="pd-slides" tabindex="0" aria-label="Deslize para escolher um livro. Use também as setas do teclado.">
                ${slides.map((livro, i) => `<button class="pd-slide" type="button" data-slide="${i}" ${livro.disponivel ? '' : 'aria-disabled="true"'} aria-label="${livro.nome}${livro.disponivel ? ' — abrir livro' : ' — conteúdo indisponível'}" aria-roledescription="slide">
                  <img data-src="${livro.imagem}" ${livro.codigo === 'JHN' ? 'fetchpriority="high"' : 'loading="lazy"'} width="1024" height="576" alt="" draggable="false" decoding="async">
                  <span class="pd-slide-legenda"><small>${livro.testamento === 'novo' && ['JHN', 'MAT', 'MRK', 'LUK'].includes(livro.codigo) ? 'Evangelho de' : 'Carta aos'}</small><strong>${livro.nome}</strong><span>${livro.disponivel ? 'Abrir livro' : 'Em breve'} ${icone('livro')}</span></span>
                </button>`).join('')}
              </div>
              <button class="pd-anterior" type="button" data-passo="-1" aria-label="Livro anterior"><span aria-hidden="true">‹</span></button>
              <button class="pd-proximo" type="button" data-passo="1" aria-label="Próximo livro"><span aria-hidden="true">›</span></button>
              <div class="pd-indicadores" aria-hidden="true">${slides.map((_, i) => `<span data-indicador="${i}"></span>`).join('')}</div>
              <p class="pd-sr" role="status" aria-live="polite" data-slide-status></p>
            </section>
            <section class="pd-continuar pd-painel" aria-labelledby="pdContinuarTitulo">
              <span class="pd-continuar-icone" aria-hidden="true">${icone('livro')}</span>
              <div><h2 id="pdContinuarTitulo">Continuar Estudando</h2><p>Escolha um livro para começar. Ainda não há uma atividade disponível para retomar.</p>
              <button type="button" class="pd-escolher" data-acao="livros">Escolher livro <span aria-hidden="true">›</span></button></div>
            </section>
            <nav class="pd-atalhos" aria-label="Acessos rápidos">
              <button type="button" data-acao="livros">${icone('livro')}<span>Biblioteca</span></button>
              <button type="button" disabled title="Treino bíblico indisponível">${icone('alvo')}<span>Treinar</span><small>Indisponível</small></button>
              <button type="button" disabled title="Desafios bíblicos indisponíveis">${icone('estrela')}<span>Desafios</span><small>Indisponível</small></button>
              <button type="button" disabled title="Tela de progresso indisponível">${icone('barras')}<span>Progresso</span><small>Indisponível</small></button>
            </nav>
            <section class="pd-jornada pd-painel" aria-labelledby="pdJornadaTitulo" aria-busy="true">
              <span class="pd-jornada-icone" aria-hidden="true">${icone('barras')}</span>
              <div><h2 id="pdJornadaTitulo">Sua Jornada Bíblica</h2><p data-jornada-status role="status">Consultando seu acervo…</p>
                <dl class="pd-estatisticas" hidden><div><dt>Versículos no acervo</dt><dd data-total="versiculos"></dd></div><div><dt>Revisões registradas</dt><dd data-total="revisoes"></dd></div><div><dt>Livros favoritos</dt><dd data-total="favoritos"></dd></div></dl>
                <button type="button" class="pd-repetir" data-acao="recarregar" hidden>Tentar novamente</button>
              </div>
            </section>
          </div>
          <nav class="pd-menu" aria-label="Menu do Palácio Bíblico">
            <button type="button" data-acao="inicio" aria-current="page">${icone('casa')}<span>Home</span></button>
            <button type="button" disabled title="Treinos bíblicos indisponíveis">${icone('alvo')}<span>Treinos</span><small>Indisponível</small></button>
            <button type="button" disabled title="Explorar indisponível">${icone('explorar')}<span>Explorar</span><small>Indisponível</small></button>
            <button type="button" data-acao="livros" class="pd-menu-livros"><span class="pd-livros-circulo">${icone('livro')}</span><span>Livros</span></button>
            <button type="button" disabled title="Jogar indisponível">${icone('estrela')}<span>Jogar</span><small>Indisponível</small></button>
            <button type="button" data-acao="favoritos">${icone('estrela')}<span>Favoritos</span></button>
            <button type="button" disabled title="Ajustes do Palácio Bíblico indisponíveis">${icone('ajustes')}<span>Ajustes</span><small>Indisponível</small></button>
          </nav>`;

        const faixa = elemento.querySelector('.pd-slides');
        const botoesSlides = [...faixa.querySelectorAll('[data-slide]')];
        const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
        const jornada = elemento.querySelector('.pd-jornada');
        const estado = elemento.querySelector('[data-jornada-status]');
        const estatisticas = elemento.querySelector('.pd-estatisticas');
        const repetir = elemento.querySelector('.pd-repetir');
        let indice = 2, inicializado = false, sessao = 0, frame = 0, ponteiro = null, arrastou = false;

        function carregarImagem(i) {
            const img = botoesSlides[i]?.querySelector('img');
            if (img?.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
        }
        const observador = new IntersectionObserver(entradas => {
            for (const entrada of entradas) if (entrada.isIntersecting) {
                carregarImagem(Number(entrada.target.dataset.slide)); observador.unobserve(entrada.target);
            }
        }, {root: faixa, rootMargin: '0px 30px'});
        function atualizarSlide() {
            const centro = faixa.scrollLeft + faixa.clientWidth / 2;
            indice = botoesSlides.reduce((melhor, botao, i) => Math.abs(botao.offsetLeft + botao.offsetWidth / 2 - centro) < Math.abs(botoesSlides[melhor].offsetLeft + botoesSlides[melhor].offsetWidth / 2 - centro) ? i : melhor, 0);
            botoesSlides.forEach((botao, i) => botao.toggleAttribute('data-ativo', i === indice));
            elemento.querySelectorAll('[data-indicador]').forEach((ponto, i) => ponto.toggleAttribute('data-ativo', i === indice));
            elemento.querySelector('[data-passo="-1"]').disabled = indice === 0;
            elemento.querySelector('[data-passo="1"]').disabled = indice === slides.length - 1;
            elemento.querySelector('[data-slide-status]').textContent = `${slides[indice].nome}, ${indice + 1} de ${slides.length}${slides[indice].disponivel ? '' : ', conteúdo indisponível'}`;
        }
        function centrar(i, suave = true) {
            const botao = botoesSlides[i];
            if (!botao) return;
            carregarImagem(i);
            faixa.scrollTo({left: botao.offsetLeft + botao.offsetWidth / 2 - faixa.clientWidth / 2, behavior: suave && !reduzido.matches ? 'smooth' : 'instant'});
            if (!suave || reduzido.matches) atualizarSlide();
        }
        faixa.addEventListener('scroll', () => {
            if (!frame) frame = requestAnimationFrame(() => { frame = 0; atualizarSlide(); });
        }, {passive: true});
        faixa.addEventListener('keydown', e => {
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                e.preventDefault();
                centrar(e.key === 'Home' ? 0 : e.key === 'End' ? slides.length - 1 : Math.max(0, Math.min(slides.length - 1, indice + (e.key === 'ArrowRight' ? 1 : -1))));
            }
        });
        faixa.addEventListener('pointerdown', e => {
            if (!e.isPrimary || e.button !== 0) return;
            ponteiro = {id: e.pointerId, x: e.clientX, scroll: faixa.scrollLeft, mouse: e.pointerType === 'mouse'}; arrastou = false;
        });
        faixa.addEventListener('pointermove', e => {
            if (!ponteiro || e.pointerId !== ponteiro.id) return;
            if (Math.abs(e.clientX - ponteiro.x) > 10) arrastou = true;
            if (ponteiro.mouse && arrastou) { faixa.classList.add('pd-arrastando'); faixa.setPointerCapture(e.pointerId); faixa.scrollLeft = ponteiro.scroll - (e.clientX - ponteiro.x); }
        });
        function terminarGesto() {
            const mouse = ponteiro?.mouse; ponteiro = null;
            faixa.classList.remove('pd-arrastando');
            if (mouse && arrastou) { atualizarSlide(); centrar(indice); }
        }
        faixa.addEventListener('pointerup', terminarGesto);
        faixa.addEventListener('pointercancel', terminarGesto);
        faixa.addEventListener('click', e => { if (arrastou && e.detail !== 0) { e.preventDefault(); e.stopPropagation(); arrastou = false; } }, true);
        botoesSlides.forEach((botao, i) => botao.addEventListener('click', () => {
            if (i !== indice) { centrar(i); return; }
            if (slides[i].disponivel) abrirLivro(slides[i].codigo);
        }));
        elemento.querySelectorAll('[data-passo]').forEach(botao => botao.addEventListener('click', () => centrar(indice + Number(botao.dataset.passo))));
        new ResizeObserver(() => { if (inicializado && !elemento.hidden) centrar(indice, false); }).observe(faixa);

        async function carregarJornada() {
            const atual = ++sessao; let repo;
            jornada.setAttribute('aria-busy', 'true'); repetir.hidden = true;
            try {
                repo = await PB.criarRepositorio();
                const [livros, versiculos, revisoes] = await Promise.all(['livros', 'versiculos', 'revisoes'].map(tipo => repo.listar(tipo)));
                if (atual !== sessao) return;
                const livrosIds = new Set(livros.map(l => l.id));
                const validos = versiculos.filter(v => livrosIds.has(v.livroId));
                const versiculosIds = new Set(validos.map(v => v.id));
                const totais = {versiculos: validos.length, revisoes: revisoes.filter(r => versiculosIds.has(r.versiculoId) && ['acerto', 'erro', 'nao-lembrou'].includes(r.resultado) && Number.isFinite(Date.parse(r.ocorridoEm))).length, favoritos: livros.filter(l => l.favorito === true).length};
                estatisticas.hidden = !Object.values(totais).some(Boolean);
                for (const [tipo, total] of Object.entries(totais)) elemento.querySelector(`[data-total="${tipo}"]`).textContent = total;
                estado.textContent = estatisticas.hidden ? 'Sua jornada começa com um livro. Explore a Biblioteca e construa suas associações.' : 'Seu acervo e suas atividades salvas neste dispositivo.';
                elemento.dataset.jornadaEstado = estatisticas.hidden ? 'vazio' : 'disponivel';
            } catch (erro) {
                if (atual !== sessao) return;
                estatisticas.hidden = true; repetir.hidden = false; elemento.dataset.jornadaEstado = 'erro';
                estado.textContent = 'Não foi possível consultar seu acervo. Seus dados não foram apagados.';
                console.error('Home Bíblica: consulta local indisponível', erro);
            } finally { repo?.fechar(); if (atual === sessao) jornada.setAttribute('aria-busy', 'false'); }
        }
        elemento.querySelectorAll('[data-acao]').forEach(botao => botao.addEventListener('click', () => {
            switch (botao.dataset.acao) {
                case 'livros': abrirBiblioteca('todos'); break;
                case 'favoritos': abrirBiblioteca('favoritos'); break;
                case 'palacioMental': navegar('home'); break;
                case 'inicio': elemento.querySelector('.pd-scroll').scrollTo({top: 0, behavior: 'instant'}); break;
                case 'recarregar': carregarJornada(); break;
            }
        }));
        document.addEventListener('visibilitychange', () => { if (!document.hidden && !elemento.hidden) carregarJornada(); });
        globalThis.addEventListener('palacio-biblico-capas', () => {
            slides.forEach((livro, i) => {
                const nova = PB.capasBiblicas[livro.codigo] || null;
                if (nova === livro.imagem) return;
                livro.imagem = nova;
                const img = botoesSlides[i].querySelector('img');
                if (!nova) { img.removeAttribute('src'); delete img.dataset.src; }
                else if (img.hasAttribute('src')) img.src = nova;
                else img.dataset.src = nova;
            });
        });
        return {abrir() {
            PB.atualizarCapas();
            requestAnimationFrame(() => {
                if (elemento.hidden) return;
                centrar(indice, false);
                if (!inicializado) { inicializado = true; botoesSlides.forEach(botao => observador.observe(botao)); }
            });
            return carregarJornada();
        }, suspender() { ++sessao; ponteiro = null; faixa.classList.remove('pd-arrastando'); if (frame) cancelAnimationFrame(frame); frame = 0; }};
    };
})();
