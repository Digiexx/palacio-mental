(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    PB.iniciarBiblioteca = ({navegar}) => {
        const tela = document.getElementById('telaBibliotecaBiblica');
        const busca = document.getElementById('buscaBibliotecaBiblica');
        const lista = document.getElementById('livrosBibliotecaBiblica');
        const status = document.getElementById('statusBibliotecaBiblica');
        const erro = document.getElementById('erroBibliotecaBiblica');
        const tentar = document.getElementById('tentarBibliotecaBiblica');
        const filtros = [...tela.querySelectorAll('[data-filtro]')];
        let filtro = 'todos', livros = [], pronto = false, carregando = null, repo = null;
        const ocupados = new Set();
        const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        function anunciarErro(mensagem) { erro.textContent = mensagem; erro.hidden = false; }
        function abrirLivro(codigo) {
            const livro = PB.catalogo.find(l => l.codigo === codigo);
            if (!livro) return;
            const imagem = document.getElementById('imagemLivroBiblico');
            imagem.src = livro.imagem;
            document.getElementById('tituloLivroBiblico').textContent = livro.nome;
            document.getElementById('categoriaLivroBiblico').textContent = livro.categoria;
            document.getElementById('descricaoLivroBiblico').textContent = livro.descricao;
            document.getElementById('telaLivroBiblico').dataset.livro = codigo;
            navegar('livroBiblico');
        }
        function renderizar() {
            const consulta = normalizar(busca.value);
            const visiveis = PB.catalogo.filter(l => normalizar(l.nome).includes(consulta) &&
                (filtro === 'todos' || livros.some(p => p.codigo.trim().toUpperCase() === l.codigo && p.favorito)));
            const fragmento = document.createDocumentFragment();
            for (const livro of visiveis) {
                const favorito = livros.some(p => p.codigo.trim().toUpperCase() === livro.codigo && p.favorito);
                const card = document.createElement('li'); card.className = 'pb-card';
                const abrir = document.createElement('button'); abrir.type = 'button'; abrir.className = 'pb-abrir-livro';
                abrir.dataset.livro = livro.codigo; abrir.setAttribute('aria-label', `Abrir ${livro.nome}`);
                const img = document.createElement('img'); img.src = livro.imagem; img.alt = ''; img.width = 104; img.height = 88;
                const texto = document.createElement('span'); texto.className = 'pb-card-texto';
                const nome = document.createElement('strong'); nome.textContent = livro.nome;
                const categoria = document.createElement('span'); categoria.textContent = livro.categoria;
                const seta = document.createElement('span'); seta.className = 'pb-card-seta'; seta.textContent = '›'; seta.setAttribute('aria-hidden', 'true');
                texto.append(nome, categoria); abrir.append(img, texto, seta);
                abrir.addEventListener('click', () => abrirLivro(livro.codigo));
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
                        status.textContent = favorito ? `${livro.nome} removido dos favoritos.` : `${livro.nome} adicionado aos favoritos.`;
                    } catch (e) {
                        console.error('Biblioteca Bíblica: favorito não salvo', e);
                        anunciarErro('Não foi possível salvar o favorito. Tente novamente.');
                    } finally {
                        ocupados.delete(livro.codigo); renderizar();
                        // Evita perder o foco ao substituir a lista, inclusive no filtro Favoritos.
                        (lista.querySelector(`[data-favorito="${livro.codigo}"]`) || busca).focus({preventScroll: true});
                    }
                });
                card.append(abrir, estrela); fragmento.append(card);
            }
            lista.replaceChildren(fragmento);
            document.getElementById('vazioBibliotecaBiblica').hidden = !pronto || visiveis.length > 0;
        }
        async function abrir() {
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
        busca.addEventListener('input', () => { if (pronto) renderizar(); });
        filtros.forEach(botao => botao.addEventListener('click', () => {
            filtro = botao.dataset.filtro;
            filtros.forEach(b => b.setAttribute('aria-pressed', String(b === botao)));
            if (pronto) renderizar();
        }));
        tentar.addEventListener('click', abrir);
        return {abrir};
    };
})();
