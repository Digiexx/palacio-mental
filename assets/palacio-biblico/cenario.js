(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    // Funções puras para a câmera. Nenhuma coordenada de âncora é modificada.
    const limitarEixo = (valor, conteudo, janela) => conteudo <= janela ? (janela - conteudo) / 2 : Math.max(janela - conteudo, Math.min(0, valor));
    function calcularCamera(largura, altura, manifesto, regiao = null) {
        if (!(largura > 0 && altura > 0)) throw new Error('Área de exibição inválida');
        const ajuste = Math.min(largura / manifesto.largura, altura / manifesto.altura);
        const baseLargura = manifesto.largura * ajuste, baseAltura = manifesto.altura * ajuste;
        const escala = regiao ? Math.max(1, Math.min(manifesto.ampliacaoMaxima, regiao.ampliacao)) : 1;
        const r = regiao?.enquadramento;
        const centro = r ? {x: r.x + r.largura / 2, y: r.y + r.altura / 2} : {x: 0.5, y: 0.5};
        return {baseLargura, baseAltura, escala,
            x: limitarEixo(largura / 2 - centro.x * baseLargura * escala, baseLargura * escala, largura),
            y: limitarEixo(altura / 2 - centro.y * baseAltura * escala, baseAltura * escala, altura)};
    }
    PB.geometriaCenario = Object.freeze({calcularCamera});

    PB.iniciarCenarioJoao = () => {
        const manifesto = PB.cenarioJoao;
        const tela = document.getElementById('telaCenarioJoao');
        const visor = document.getElementById('cjVisor');
        const camada = document.getElementById('cjCamada');
        const imagem = document.getElementById('cjImagem');
        const status = document.getElementById('cjStatus');
        const erro = document.getElementById('cjErro');
        const tentar = document.getElementById('cjTentar');
        const explorar = document.getElementById('cjExplorar');
        const panorama = document.getElementById('cjPanorama');
        const regioesLista = document.getElementById('cjRegioes');
        const objetosLista = document.getElementById('cjObjetos');
        const painel = document.getElementById('cjPainel');
        const fechar = document.getElementById('cjFecharObjeto');
        const movimentoReduzido = matchMedia('(prefers-reduced-motion: reduce)');
        let editor = null;
        let ativo = false, pronto = false, sessao = 0, regiao = null, objeto = null, revelado = false;
        const regioesBotoes = new Map(), objetosBotoes = new Map();

        function area(botao, retangulo) {
            Object.assign(botao.style, {left: `${retangulo.x * 100}%`, top: `${retangulo.y * 100}%`,
                width: `${retangulo.largura * 100}%`, height: `${retangulo.altura * 100}%`});
        }
        function atualizarCamera(animar = true) {
            if (!ativo || !pronto || !visor.clientWidth || !visor.clientHeight) return;
            const c = calcularCamera(visor.clientWidth, visor.clientHeight, manifesto, regiao);
            camada.style.width = `${c.baseLargura}px`;
            camada.style.height = `${c.baseAltura}px`;
            camada.style.transition = animar && !editor?.ativo && !movimentoReduzido.matches ? 'transform 360ms ease' : 'none';
            camada.style.transform = `translate(${c.x}px, ${c.y}px) scale(${c.escala})`;
            tela.dataset.escala = String(c.escala);
            editor?.atualizarEscala(c.escala);
        }
        function atualizarControles() {
            tela.dataset.regiao = regiao?.id || '';
            tela.dataset.objeto = objeto?.id || '';
            tela.dataset.revelado = String(revelado);
            explorar.textContent = regiao ? 'Explorar objetos' : 'Explorar regiões';
            explorar.setAttribute('aria-pressed', String(revelado));
            explorar.disabled = !pronto || Boolean(editor?.ativo);
            explorar.hidden = Boolean(editor?.ativo);
            status.hidden = Boolean(editor?.ativo);
            panorama.disabled = !pronto || !regiao || Boolean(editor?.arrastando);
            document.getElementById('ceEditar').disabled = !pronto || Boolean(editor?.arrastando);
            objetosLista.hidden = !regiao || !pronto;
            document.getElementById('cjObjetosGrupo').hidden = !regiao || !pronto || Boolean(editor?.ativo);
            painel.hidden = !objeto;
            for (const [id, par] of regioesBotoes) {
                par.area.hidden = !pronto || Boolean(regiao);
                par.lista.disabled = !pronto || Boolean(editor?.arrastando);
                par.lista.setAttribute('aria-pressed', String(regiao?.id === id));
            }
            for (const item of manifesto.objetos) {
                const par = objetosBotoes.get(item.id);
                const visivel = pronto && regiao?.id === item.regiaoId;
                par.area.hidden = !visivel || Boolean(editor?.ativo);
                par.lista.hidden = !visivel;
                par.lista.disabled = Boolean(editor?.ativo);
                par.area.setAttribute('aria-pressed', String(objeto?.id === item.id));
                par.lista.setAttribute('aria-pressed', String(objeto?.id === item.id));
            }
        }
        function selecionarRegiao(id) {
            if (!pronto || editor?.arrastando) return;
            regiao = manifesto.regioes.find(r => r.id === id);
            objeto = null; revelado = false;
            atualizarControles(); atualizarCamera();
            status.textContent = `${regiao.nome}. Selecione um objeto na imagem ou nos botões abaixo.`;
        }
        function selecionarObjeto(id) {
            if (!pronto || editor?.ativo) return;
            const escolhido = manifesto.objetos.find(o => o.id === id);
            if (!escolhido || escolhido.regiaoId !== regiao?.id) return;
            objeto = escolhido;
            document.getElementById('cjNomeObjeto').textContent = objeto.nome;
            atualizarControles();
            status.textContent = `${objeto.nome} selecionado.`;
            painel.focus({preventScroll: true});
            painel.scrollIntoView({block: 'nearest', behavior: movimentoReduzido.matches ? 'instant' : 'smooth'});
        }
        function restaurar(focar = false) {
            if (editor?.arrastando) return;
            regiao = null; objeto = null; revelado = false;
            atualizarControles(); atualizarCamera();
            status.textContent = pronto ? 'Panorama completo. Toque em uma região ou use os botões abaixo.' : 'Carregando cenário…';
            if (focar) explorar.focus({preventScroll: true});
        }
        function botaoArea(item, tipo, acao) {
            const b = document.createElement('button'); b.type = 'button'; b.className = `cj-area cj-area-${tipo}`;
            b.dataset.elemento = item.id;
            b.setAttribute('aria-label', `${tipo === 'regiao' ? 'Aproximar' : 'Selecionar'} ${item.nome}`);
            // Alternativas de teclado ficam fora da camada ampliada e nunca são cortadas.
            b.tabIndex = -1;
            const nome = document.createElement('span'); nome.textContent = item.nome; b.append(nome);
            area(b, item.toque); b.addEventListener('click', () => acao(item.id));
            camada.append(b); return b;
        }
        for (const item of manifesto.regioes) {
            const b = document.createElement('button'); b.type = 'button'; b.textContent = item.nome;
            b.dataset.regiao = item.id; b.setAttribute('aria-controls', 'cjVisor');
            b.addEventListener('click', () => selecionarRegiao(item.id)); regioesLista.append(b);
            regioesBotoes.set(item.id, {area: botaoArea(item, 'regiao', selecionarRegiao), lista: b});
        }
        for (const item of manifesto.objetos) {
            const b = document.createElement('button'); b.type = 'button'; b.textContent = item.nome;
            b.dataset.objeto = item.id; b.setAttribute('aria-controls', 'cjPainel');
            b.addEventListener('click', () => selecionarObjeto(item.id)); objetosLista.append(b);
            objetosBotoes.set(item.id, {area: botaoArea(item, 'objeto', selecionarObjeto), lista: b});
        }
        explorar.addEventListener('click', () => { revelado = !revelado; atualizarControles(); });
        panorama.addEventListener('click', () => restaurar(true));
        fechar.addEventListener('click', () => {
            const anterior = objeto; objeto = null; atualizarControles();
            objetosBotoes.get(anterior?.id)?.lista.focus({preventScroll: true});
        });
        async function abrir() {
            ativo = true; pronto = false; const atual = ++sessao;
            erro.hidden = true; tentar.hidden = true; camada.hidden = true; tela.setAttribute('aria-busy', 'true');
            restaurar();
            try {
                if (!imagem.getAttribute('src') || !imagem.naturalWidth) imagem.src = manifesto.imagem;
                await imagem.decode();
                if (!ativo || sessao !== atual) return;
                if (imagem.naturalWidth !== manifesto.largura || imagem.naturalHeight !== manifesto.altura) throw new Error('Imagem incompatível com a geometria do cenário');
                pronto = true; camada.hidden = false; restaurar(); atualizarCamera(false);
            } catch (e) {
                if (!ativo || sessao !== atual) return;
                console.error('Cenário de João: falha ao carregar', e);
                status.textContent = ''; erro.hidden = false; tentar.hidden = false;
            } finally { if (sessao === atual) tela.setAttribute('aria-busy', 'false'); }
        }
        tentar.addEventListener('click', abrir);
        editor = PB.iniciarEditorCenario({tela, camada, manifesto, aoMudar() {
            if (editor?.ativo) { objeto = null; camada.style.transition = 'none'; }
            atualizarControles();
        }});
        new ResizeObserver(() => atualizarCamera(false)).observe(visor);
        movimentoReduzido.addEventListener('change', () => atualizarCamera(false));
        atualizarControles();
        return {abrir, permitirSaida: () => editor.permitirSaida(), suspender() {
            ativo = false; ++sessao; editor.suspender(); tela.setAttribute('aria-busy', 'false');
        }};
    };
})();
