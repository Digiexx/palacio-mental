(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    const limitar = (v, min, max) => Math.max(min, Math.min(max, v));
    function ajustar(r) {
        if (!r || !['x', 'y', 'largura', 'altura'].every(k => Number.isFinite(r[k]))) throw new Error('Área inválida');
        const largura = limitar(r.largura, 0.02, 1), altura = limitar(r.altura, 0.02, 1);
        return {x: limitar(r.x, 0, 1 - largura), y: limitar(r.y, 0, 1 - altura), largura, altura};
    }
    function ponto(x, y, caixa) {
        if (!(caixa.width > 0 && caixa.height > 0)) return null;
        const p = {x: (x - caixa.left) / caixa.width, y: (y - caixa.top) / caixa.height};
        return p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1 ? p : null;
    }
    const intersecta = (a, b) => a.x < b.x + b.largura && a.x + a.largura > b.x && a.y < b.y + b.altura && a.y + a.altura > b.y;
    PB.geometriaEditor = Object.freeze({ajustar, ponto, intersecta});

    PB.iniciarEditorCenario = ({tela, camada, manifesto, aoMudar}) => {
        const el = id => document.getElementById(id);
        const editar = el('ceEditar'), comandos = el('ceComandos'), formulario = el('ceFormulario');
        const nome = el('ceNome'), mensagem = el('ceMensagem'), conflito = el('ceConflito');
        const adicionar = el('ceAdicionar'), centro = el('ceCentro'), confirmar = el('ceConfirmar');
        const revisar = el('ceRevisar'), descartar = el('ceDescartar');
        const campos = Object.fromEntries(['x', 'y', 'largura', 'altura'].map(k => [k, el(`ce-${k}`)]));
        const superficie = document.createElement('div'); superficie.className = 'ce-superficie'; superficie.hidden = true;
        const moldura = document.createElement('div'); moldura.className = 'ce-moldura'; moldura.hidden = true;
        moldura.setAttribute('aria-hidden', 'true');
        for (const canto of ['no', 'ne', 'so', 'se']) {
            const alca = document.createElement('span'); alca.className = `ce-alca ce-${canto}`; alca.dataset.alca = canto;
            moldura.append(alca);
        }
        superficie.append(moldura); camada.append(superficie);
        let ativo = false, adicionando = false, rascunho = null, gesto = null, selecionado = false;
        function selecionar(valor) {
            selecionado = valor;
            moldura.classList.toggle('ce-selecionada', ativo && selecionado && Boolean(rascunho) && !rascunho.confirmado);
        }
        function renderizar() {
            tela.dataset.editando = String(ativo);
            editar.setAttribute('aria-pressed', String(ativo));
            editar.textContent = ativo ? 'Sair da edição' : 'Editar cenário';
            comandos.hidden = !ativo; superficie.hidden = !ativo;
            formulario.hidden = !ativo || !rascunho; moldura.hidden = !rascunho;
            centro.hidden = !adicionando;
            adicionar.disabled = adicionando;
            el('ceCancelar').hidden = Boolean(rascunho);
            selecionar(selecionado);
            superficie.classList.toggle('ce-aguarda-toque', adicionando);
            if (rascunho) {
                const r = rascunho.posicao;
                Object.assign(moldura.style, {left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.largura * 100}%`, height: `${r.altura * 100}%`});
                moldura.classList.toggle('ce-preparada', rascunho.confirmado);
                nome.disabled = rascunho.confirmado;
                for (const [k, campo] of Object.entries(campos)) {
                    campo.value = String(Math.round(r[k] * 1000) / 10); campo.disabled = rascunho.confirmado;
                }
                confirmar.hidden = rascunho.confirmado; revisar.hidden = !rascunho.confirmado;
                conflito.hidden = !manifesto.objetos.some(o => intersecta(r, o.toque));
            } else conflito.hidden = true;
            aoMudar();
        }
        function podeDescartar() {
            return !rascunho || window.confirm('Este rascunho existe apenas nesta sessão. Descartá-lo e continuar?');
        }
        function encerrarGesto(evento) {
            if (!gesto || (evento && evento.pointerId !== gesto.id)) return;
            const id = gesto.id; gesto = null;
            if (moldura.hasPointerCapture(id)) moldura.releasePointerCapture(id);
            aoMudar();
        }
        function limpar() {
            encerrarGesto(); rascunho = null; adicionando = false; selecionado = false; nome.value = '';
            el('ceAjustePreciso').open = false;
            mensagem.textContent = 'Edição ativa. Adicione uma área para preparar um objeto.';
            renderizar();
        }
        function criar(p) {
            const caixa = camada.getBoundingClientRect();
            const largura = Math.min(1, Math.max(0.12, 96 / caixa.width));
            const altura = Math.min(1, Math.max(0.12, 96 / caixa.height));
            rascunho = {nome: '', posicao: ajustar({x: p.x - largura / 2, y: p.y - altura / 2, largura, altura}), confirmado: false};
            adicionando = false; nome.value = '';
            selecionado = true;
            mensagem.textContent = 'Ajuste a moldura e informe o nome. Nada será gravado nesta etapa.';
            renderizar();
        }
        editar.addEventListener('click', () => {
            if (ativo && !podeDescartar()) return;
            ativo = !ativo; limpar();
            if (ativo) adicionar.focus({preventScroll: true});
        });
        adicionar.addEventListener('click', () => {
            if (!podeDescartar()) return;
            limpar(); adicionando = true;
            mensagem.textContent = 'Toque no centro de um elemento da imagem ou use Criar área ao centro.';
            renderizar(); centro.focus({preventScroll: true});
        });
        centro.addEventListener('click', () => {
            const caixa = camada.getBoundingClientRect(), visor = camada.parentElement.getBoundingClientRect();
            const p = ponto((visor.left + visor.right) / 2, (visor.top + visor.bottom) / 2, caixa);
            criar(p || {x: 0.5, y: 0.5}); nome.focus({preventScroll: true});
        });
        superficie.addEventListener('pointerdown', e => {
            if (!ativo || e.button !== 0 || !e.isPrimary) return;
            e.stopPropagation();
            if (adicionando) {
                const p = ponto(e.clientX, e.clientY, camada.getBoundingClientRect());
                if (p) { e.preventDefault(); criar(p); }
            } else if (e.target === superficie) selecionar(false);
        });
        moldura.addEventListener('pointerdown', e => {
            if (!ativo || !rascunho || rascunho.confirmado || gesto || e.button !== 0 || !e.isPrimary) return;
            e.preventDefault(); e.stopPropagation();
            selecionar(true);
            gesto = {id: e.pointerId, x: e.clientX, y: e.clientY, area: {...rascunho.posicao}, caixa: camada.getBoundingClientRect(), canto: e.target.dataset.alca || ''};
            moldura.setPointerCapture(e.pointerId); aoMudar();
        });
        moldura.addEventListener('pointermove', e => {
            if (!gesto || gesto.id !== e.pointerId) return;
            e.preventDefault();
            const g = gesto, dx = (e.clientX - g.x) / g.caixa.width, dy = (e.clientY - g.y) / g.caixa.height;
            let r = {...g.area};
            if (!g.canto) { r.x += dx; r.y += dy; }
            else {
                let esq = r.x, topo = r.y, dir = r.x + r.largura, fim = r.y + r.altura;
                if (g.canto.includes('o')) esq = limitar(esq + dx, 0, dir - 0.02);
                else dir = limitar(dir + dx, esq + 0.02, 1);
                if (g.canto.includes('n')) topo = limitar(topo + dy, 0, fim - 0.02);
                else fim = limitar(fim + dy, topo + 0.02, 1);
                r = {x: esq, y: topo, largura: dir - esq, altura: fim - topo};
            }
            rascunho.posicao = ajustar(r); renderizar();
        });
        for (const evento of ['pointerup', 'pointercancel', 'lostpointercapture']) moldura.addEventListener(evento, encerrarGesto);
        nome.addEventListener('input', () => { if (rascunho && !rascunho.confirmado) rascunho.nome = nome.value; });
        function selecionarFormulario() { if (rascunho && !rascunho.confirmado) selecionar(true); }
        formulario.addEventListener('focusin', selecionarFormulario);
        formulario.addEventListener('pointerdown', selecionarFormulario);
        for (const [k, campo] of Object.entries(campos)) campo.addEventListener('change', () => {
            if (!rascunho || rascunho.confirmado) return;
            const v = campo.valueAsNumber;
            if (!Number.isFinite(v)) { mensagem.textContent = 'Informe um número válido para ajustar a área.'; renderizar(); return; }
            rascunho.posicao = ajustar({...rascunho.posicao, [k]: v / 100}); renderizar();
        });
        formulario.addEventListener('submit', e => {
            e.preventDefault();
            if (!rascunho || rascunho.confirmado || !nome.reportValidity()) return;
            if (!nome.value.trim()) { nome.setCustomValidity('Informe o nome do objeto.'); nome.reportValidity(); nome.setCustomValidity(''); return; }
            rascunho.nome = nome.value.trim(); rascunho.confirmado = true; encerrarGesto();
            selecionado = false; el('ceAjustePreciso').open = false;
            mensagem.textContent = 'Área preparada. Ainda não foi salva permanentemente e será perdida ao sair ou recarregar.';
            renderizar(); revisar.focus({preventScroll: true});
        });
        revisar.addEventListener('click', () => {
            rascunho.confirmado = false; selecionado = true; mensagem.textContent = 'Revise o nome e a área e confirme novamente.';
            renderizar(); nome.focus({preventScroll: true});
        });
        function cancelar() { if (podeDescartar()) { limpar(); adicionar.focus({preventScroll: true}); } }
        el('ceCancelar').addEventListener('click', cancelar);
        descartar.addEventListener('click', cancelar);
        window.addEventListener('beforeunload', e => { if (rascunho) { e.preventDefault(); e.returnValue = ''; } });
        renderizar();
        return Object.freeze({
            get ativo() { return ativo; }, get arrastando() { return Boolean(gesto); },
            get rascunho() { return rascunho ? structuredClone(rascunho) : null; },
            permitirSaida: podeDescartar,
            suspender() { ativo = false; limpar(); },
            atualizarEscala(escala) { encerrarGesto(); camada.style.setProperty('--ce-escala', escala); }
        });
    };
})();
