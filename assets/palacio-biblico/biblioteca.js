(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    PB.iniciarBiblioteca = ({navegar, fechar = () => navegar('homeBiblica')}) => {
        const tela = document.getElementById('telaBibliotecaBiblica');
        const busca = document.getElementById('buscaBibliotecaBiblica');
        const limparBusca = document.getElementById('limparBuscaBiblica');
        const atualizarLimparBusca = () => { limparBusca.hidden = busca.value.length === 0; };
        const lista = document.getElementById('livrosBibliotecaBiblica');
        const status = document.getElementById('statusBibliotecaBiblica');
        const erro = document.getElementById('erroBibliotecaBiblica');
        const tentar = document.getElementById('tentarBibliotecaBiblica');
        const filtros = [...tela.querySelectorAll('[data-filtro]')];
        const painel = document.getElementById('painelBibliotecaBiblica');
        const fecharBotao = document.getElementById('fecharBibliotecaBiblica');
        const rolagem = document.getElementById('rolagemBibliotecaBiblica');
        const toast = document.createElement('div');
        toast.className = 'pb-toast-favorito';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-atomic', 'true');
        const iconeToast = document.createElement('span');
        iconeToast.textContent = '☆'; iconeToast.setAttribute('aria-hidden', 'true');
        const textoToast = document.createElement('span');
        toast.append(iconeToast, textoToast); painel.append(toast);
        let tempoToast = null;
        function ocultarToast() {
            clearTimeout(tempoToast); tempoToast = null;
            toast.classList.remove('pb-toast-visivel');
            textoToast.textContent = '';
        }
        function anunciarFavorito(nome, favorito) {
            if (!painel.open || tela.hidden || encerramento) return;
            clearTimeout(tempoToast);
            iconeToast.textContent = favorito ? '★' : '☆';
            textoToast.textContent = `${nome} ${favorito ? 'adicionado aos' : 'removido dos'} favoritos`;
            toast.classList.add('pb-toast-visivel');
            tempoToast = setTimeout(() => {
                toast.classList.remove('pb-toast-visivel');
                tempoToast = null;
            }, 1800);
        }
        let filtro = 'todos', livros = [], pronto = false, carregando = null, repo = null;
        let posicaoLista = 0, fechamentosInternos = 0;
        let encerramento = null;
        function encerrar() {
            ocultarToast();
            if (encerramento) return encerramento;
            if (!painel.open) return Promise.resolve();
            encerramento = (async () => {
                painel.classList.add('pb-sheet-saindo');
                await Promise.all(painel.getAnimations().map(animacao => animacao.finished.catch(() => {})));
                ++fechamentosInternos; painel.close();
                painel.classList.remove('pb-sheet-saindo');
            })().finally(() => { encerramento = null; });
            return encerramento;
        }
        const ocupados = new Set();
        const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        function anunciarErro(mensagem) { erro.textContent = mensagem; erro.hidden = false; }
        function abrirLivro(codigo) {
            const livro = PB.catalogo.find(l => l.codigo === codigo);
            if (!livro) return;
            const imagem = document.getElementById('imagemLivroBiblico');
            imagem.src = codigo === 'JHN' ? 'assets/imagens/palacio-biblico/livros-menu/43-joao.webp' : livro.imagem;
            document.getElementById('tituloLivroBiblico').textContent = livro.nome;
            document.getElementById('categoriaLivroBiblico').textContent = codigo === 'JHN' ? 'Evangelho de' : livro.categoria;
            document.getElementById('descricaoLivroBiblico').textContent = codigo === 'JHN' ? 'Estudo · Memorização · Treinamento' : livro.descricao;
            document.getElementById('telaLivroBiblico').dataset.livro = codigo;
            document.getElementById('acessoCenarioJoao').hidden = codigo !== 'JHN';
            document.getElementById('provisorioLivroBiblico').hidden = codigo === 'JHN';
            navegar('livroBiblico');
        }
        function renderizar() {
            const consulta = normalizar(busca.value);
            const visiveis = PB.indiceBiblico.filter(l => normalizar(l.nomesBusca).includes(consulta) &&
                (filtro === 'todos' || livros.some(p => p.codigo.trim().toUpperCase() === l.codigo && p.favorito)));
            const fragmento = document.createDocumentFragment();
            const grupos = new Map();
            for (const [id, nome, total] of [['antigo', 'Antigo Testamento', 39], ['novo', 'Novo Testamento', 27]]) {
                if (!visiveis.some(livro => livro.testamento === id)) continue;
                const secao = document.createElement('section'); secao.className = 'pb-testamento';
                secao.dataset.testamento = id;
                const titulo = document.createElement('h2'); titulo.className = 'pb-grupo';
                const rotulo = document.createElement('span'); rotulo.textContent = nome;
                const contador = document.createElement('small'); contador.textContent = `${total} livros`;
                titulo.append(rotulo, contador);
                const listaGrupo = document.createElement('ul'); listaGrupo.className = 'pb-lista';
                secao.append(titulo, listaGrupo); fragmento.append(secao); grupos.set(id, listaGrupo);
            }
            for (const livro of visiveis) {
                const favorito = livros.some(p => p.codigo.trim().toUpperCase() === livro.codigo && p.favorito);
                const card = document.createElement('li'); card.className = 'pb-card';
                const abrir = document.createElement('button'); abrir.type = 'button'; abrir.className = 'pb-abrir-livro';
                abrir.dataset.livro = livro.codigo;
                if (!livro.disponivel) abrir.setAttribute('aria-disabled', 'true');
                abrir.setAttribute('aria-label', livro.disponivel ? `Abrir ${livro.nome}` : `${livro.nome} — em preparação`);
                const midia = document.createElement('span'); midia.className = 'pb-card-imagem';
                const placeholder = () => {
                    midia.classList.add('pb-card-placeholder');
                    midia.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/></svg>';
                };
                if (livro.imagem) {
                    const img = document.createElement('img'); img.src = livro.imagem; img.alt = '';
                    img.width = 1024; img.height = 576; img.decoding = 'async';
                    img.loading = livro.ordem <= 3 ? 'eager' : 'lazy';
                    img.addEventListener('error', placeholder, {once: true}); midia.append(img);
                } else placeholder();
                const texto = document.createElement('span'); texto.className = 'pb-card-texto';
                const nome = document.createElement('strong'); nome.textContent = livro.nome;
                if (livro.nome.length > 13) nome.className = 'pb-nome-longo';
                texto.append(nome);
                if (!livro.disponivel || livro.emPreparacao) {
                    const preparacao = document.createElement('small'); preparacao.textContent = 'Em preparação';
                    texto.append(preparacao);
                }
                const seta = document.createElement('span'); seta.className = 'pb-card-seta'; seta.setAttribute('aria-hidden', 'true');
                seta.innerHTML = '<svg viewBox="0 0 12 12" focusable="false" aria-hidden="true"><path d="m2.75 .75 6.5 5.25-6.5 5.25"/></svg>';
                const diagonal = document.createElement('span'); diagonal.className = 'pb-card-diagonal';
                diagonal.setAttribute('aria-hidden', 'true');
                diagonal.innerHTML = `<svg viewBox="0 0 1000 200" preserveAspectRatio="none"><defs><linearGradient id="pb-diagonal-${livro.codigo}" x2="0" y2="1"><stop stop-color="#6f4d2e"/><stop offset=".5" stop-color="#d6b486"/><stop offset="1" stop-color="#775436"/></linearGradient></defs><path d="M530 0 450 200" fill="none" stroke="url(#pb-diagonal-${livro.codigo})" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>`;
                abrir.append(midia, diagonal, texto, seta);
                const reflexo = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                reflexo.setAttribute('class', 'pb-reflexo-cartao');
                reflexo.setAttribute('aria-hidden', 'true');
                reflexo.innerHTML = '<rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="14" pathLength="100"/>';
                function confirmarToque() {
                    if (matchMedia('(prefers-reduced-motion: reduce)').matches || card.classList.contains('pb-cartao-interagindo')) return;
                    card.classList.add('pb-cartao-interagindo');
                }
                abrir.addEventListener('pointerdown', evento => { if (evento.isPrimary && evento.button === 0) confirmarToque(); });
                abrir.addEventListener('keydown', evento => { if (!evento.repeat && ['Enter', ' '].includes(evento.key)) confirmarToque(); });
                abrir.addEventListener('click', () => {
                    confirmarToque();
                    if (livro.disponivel) abrirLivro(livro.codigo);
                });
                card.addEventListener('animationend', evento => {
                    if (evento.animationName === 'pb-pressionar-cartao') card.classList.remove('pb-cartao-interagindo');
                });
                const estrela = document.createElement('button'); estrela.type = 'button'; estrela.className = 'pb-favorito';
                estrela.dataset.favorito = livro.codigo;
                estrela.setAttribute('aria-label', `Favorito: ${livro.nome}`); estrela.setAttribute('aria-pressed', String(Boolean(favorito)));
                estrela.textContent = favorito ? '★' : '☆'; estrela.disabled = ocupados.has(livro.codigo);
                estrela.addEventListener('click', async () => {
                    if (ocupados.has(livro.codigo)) return;
                    ocupados.add(livro.codigo); estrela.disabled = true; erro.hidden = true;
                    try {
                        await repo.definirFavorito(livro.codigo, livro.nome, !favorito);
                        livros = await repo.listar('livros');
                        anunciarFavorito(livro.nome, !favorito);
                    } catch (e) {
                        console.error('Biblioteca Bíblica: favorito não salvo', e);
                        anunciarErro('Não foi possível salvar o favorito. Tente novamente.');
                    } finally {
                        ocupados.delete(livro.codigo); renderizar();
                        // Evita perder o foco ao substituir a lista, inclusive no filtro Favoritos.
                        (lista.querySelector(`[data-favorito="${livro.codigo}"]`) || busca).focus({preventScroll: true});
                    }
                });
                card.append(abrir, estrela, reflexo); grupos.get(livro.testamento).append(card);
            }
            lista.replaceChildren(fragmento);
            rolagem.scrollTop = posicaoLista;
            painel.classList.toggle('pb-sem-rolagem', rolagem.scrollHeight <= rolagem.clientHeight);
            document.getElementById('vazioBibliotecaBiblica').hidden = !pronto || visiveis.length > 0;
        }
        async function abrir() {
            PB.atualizarCapas();
            if (!painel.open) {
                painel.classList.toggle('pb-lista-rolada', posicaoLista > 0);
                painel.showModal();
                fecharBotao.focus({preventScroll: true});
            }
            if (carregando) return carregando;
            carregando = (async () => {
                tela.setAttribute('aria-busy', 'true'); pronto = false; lista.replaceChildren();
                status.textContent = 'Carregando biblioteca…'; erro.hidden = true; tentar.hidden = true;
                document.getElementById('vazioBibliotecaBiblica').hidden = true;
                try {
                    repo ||= await PB.criarRepositorio();
                    livros = await repo.listar('livros'); pronto = true;
                    status.textContent = ''; renderizar();
                } catch (e) {
                    repo?.fechar(); repo = null;
                    console.error('Biblioteca Bíblica: falha ao carregar', e);
                    status.textContent = '';
                    anunciarErro('Não foi possível abrir os dados locais da Biblioteca Bíblica. Seus dados não foram apagados.');
                    tentar.hidden = false;
                } finally { tela.setAttribute('aria-busy', 'false'); }
            })();
            try { await carregando; } finally { carregando = null; }
        }
        busca.addEventListener('input', () => { atualizarLimparBusca(); posicaoLista = 0; if (pronto) renderizar(); });
        limparBusca.addEventListener('click', () => {
            busca.value = '';
            busca.dispatchEvent(new Event('input', {bubbles: true}));
            busca.focus({preventScroll: true});
        });
        limparBusca.addEventListener('keydown', evento => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                if (!evento.repeat) limparBusca.click();
            }
        });
        function selecionarFiltro(valor, limparBusca = false) {
            if (!['todos', 'favoritos'].includes(valor)) return;
            filtro = valor;
            posicaoLista = 0;
            if (limparBusca) busca.value = '';
            atualizarLimparBusca();
            filtros.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === valor)));
            if (pronto) renderizar();
        }
        filtros.forEach(botao => botao.addEventListener('click', () => selecionarFiltro(botao.dataset.filtro)));
        tentar.addEventListener('click', abrir);
        const soltarFechar = () => fecharBotao.classList.remove('pb-fechar-pressionado');
        fecharBotao.addEventListener('pointerdown', evento => {
            if (!evento.isPrimary || evento.button !== 0) return;
            fecharBotao.classList.add('pb-fechar-pressionado');
            fecharBotao.setPointerCapture(evento.pointerId);
        });
        for (const evento of ['pointerup', 'pointercancel', 'lostpointercapture', 'keyup', 'blur']) fecharBotao.addEventListener(evento, soltarFechar);
        fecharBotao.addEventListener('keydown', evento => {
            if (['Enter', ' '].includes(evento.key)) fecharBotao.classList.add('pb-fechar-pressionado');
        });
        fecharBotao.addEventListener('click', fechar);
        painel.addEventListener('cancel', evento => { evento.preventDefault(); fechar(); });
        painel.addEventListener('close', () => {
            if (fechamentosInternos) { --fechamentosInternos; return; }
            if (!tela.hidden) fechar();
        });
        rolagem.addEventListener('scroll', () => {
            if (pronto && !tela.hidden && rolagem.scrollTop > 0) painel.classList.add('pb-lista-rolada');
            if (pronto && !tela.hidden) posicaoLista = rolagem.scrollTop;
        }, {passive: true});
        globalThis.addEventListener('palacio-biblico-capas', () => {
            if (!pronto || tela.hidden || !painel.open) return;
            const foco = document.activeElement?.dataset?.favorito;
            renderizar();
            if (foco) lista.querySelector(`[data-favorito="${foco}"]`)?.focus({preventScroll: true});
        });
        return {abrir, abrirLivro, selecionarFiltro, encerrar, suspender() {
            ocultarToast();
            lista.querySelectorAll('.pb-cartao-interagindo').forEach(card => card.classList.remove('pb-cartao-interagindo'));
            if (painel.open) { ++fechamentosInternos; painel.close(); }
        }};
    };
})();
