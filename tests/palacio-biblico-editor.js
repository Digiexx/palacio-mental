(async () => {
    'use strict';
    // Em segundo plano o Chrome pode alterar activeElement sem emitir focusin.
    // Aguarda foco real em vez de simular o evento ou aprovar sem exercitá-lo.
    if (!document.hasFocus()) {
        document.documentElement.dataset.resultado = 'aguardando-foco';
        document.getElementById('resultado').textContent = 'Ative esta aba para executar os testes de foco e teclado.';
        await new Promise(resolve => window.addEventListener('focus', resolve, {once: true}));
    }
    const PB = PalacioBiblico, G = PB.geometriaEditor, linhas = [];
    const el = id => document.getElementById(id), assert = (v, m) => { if (!v) throw Error(m); };
    let falhas = 0, consultas = 0, uuid = 0, editor;
    const original = JSON.stringify(PB.cenarioJoao), localAntes = JSON.stringify({...localStorage});
    const abrirOriginal = indexedDB.open, uuidOriginal = crypto.randomUUID, confirmarOriginal = window.confirm;
    function teste(nome, fn) {
        try { fn(); linhas.push(`OK: ${nome}`); } catch (e) { ++falhas; linhas.push(`FALHOU: ${nome}: ${e.message}`); }
    }
    function alterar(id, valor) { el(id).value = String(valor); el(id).dispatchEvent(new Event('change')); }
    try {
        indexedDB.open = () => { ++consultas; throw Error('Editor tentou abrir IndexedDB'); };
        crypto.randomUUID = () => { ++uuid; throw Error('Editor tentou gerar UUID'); };
        window.confirm = () => true;
        editor = PB.iniciarEditorCenario({tela: el('telaCenarioJoao'), camada: el('cjCamada'), manifesto: PB.cenarioJoao, aoMudar() {}});
        teste('ativar e sair sem área não exige descarte', () => {
            el('ceEditar').click(); assert(editor.ativo && !el('ceComandos').hidden, 'Edição não ativou');
            el('ceEditar').click(); assert(!editor.ativo && !editor.rascunho, 'Edição não encerrou');
        });
        teste('criar área pelo controle acessível, sem UUID', () => {
            el('ceEditar').click(); el('ceAdicionar').click(); el('ceCentro').click();
            assert(editor.rascunho && !editor.rascunho.confirmado && !el('ceFormulario').hidden, 'Área não criada');
        });
        teste('coordenadas numéricas são limitadas à imagem', () => {
            alterar('ce-largura', 25); alterar('ce-altura', 30); alterar('ce-x', 99); alterar('ce-y', -10);
            const r = editor.rascunho.posicao;
            assert(r.x === 0.75 && r.y === 0 && r.largura === 0.25 && r.altura === 0.3, 'Limites incorretos');
        });
        teste('alças somente na seleção e ajuste preciso inicialmente recolhido', () => {
            const moldura = document.querySelector('.ce-moldura'), alca = moldura.querySelector('.ce-alca');
            assert(getComputedStyle(moldura).borderTopStyle === 'solid', 'Contorno não contínuo');
            assert(!el('ceAjustePreciso').open && getComputedStyle(alca).display !== 'none', 'Estado inicial incorreto');
            document.querySelector('.ce-superficie').dispatchEvent(new PointerEvent('pointerdown', {button: 0, isPrimary: true, bubbles: true}));
            assert(getComputedStyle(alca).display === 'none', 'Alças visíveis sem seleção');
            el('ceAdicionar').focus(); el('ceNome').focus();
            assert(getComputedStyle(alca).display !== 'none', 'Ajuste por teclado não selecionou');
        });
        teste('nome e confirmação permanecem somente em memória', () => {
            el('ceNome').value = 'Cesto de teste'; el('ceNome').dispatchEvent(new Event('input'));
            el('ceFormulario').requestSubmit();
            assert(editor.rascunho.confirmado && editor.rascunho.nome === 'Cesto de teste', 'Não confirmou');
            assert(getComputedStyle(document.querySelector('.ce-alca')).display === 'none', 'Alças visíveis após confirmar');
            assert(el('ceMensagem').textContent.includes('Ainda não foi salva permanentemente'), 'Confirmação enganosa');
            const copia = editor.rascunho; copia.posicao.x = 0;
            assert(editor.rascunho.posicao.x === 0.75, 'Estado interno mutável pela consulta');
        });
        teste('revisão e aviso de sobreposição preservam objetos oficiais', () => {
            el('ceRevisar').click(); const r = PB.cenarioJoao.objetos[0].toque;
            alterar('ce-largura', r.largura * 100); alterar('ce-altura', r.altura * 100);
            alterar('ce-x', r.x * 100); alterar('ce-y', r.y * 100);
            assert(!editor.rascunho.confirmado && !el('ceConflito').hidden, 'Conflito não indicado');
            assert(JSON.stringify(PB.cenarioJoao) === original, 'Oficiais alterados');
        });
        teste('recusar descarte preserva rascunho e modo', () => {
            window.confirm = () => false;
            assert(!editor.permitirSaida(), 'Saída permitida'); el('ceEditar').click(); el('ceDescartar').click();
            assert(editor.ativo && editor.rascunho, 'Rascunho descartado sem autorização');
        });
        teste('cancelar e sair com confirmação descartam apenas memória', () => {
            window.confirm = () => true; el('ceDescartar').click();
            assert(!editor.rascunho && editor.ativo, 'Cancelar não limpou a área');
            el('ceEditar').click(); assert(!editor.ativo, 'Não saiu');
        });
        teste('conversão de toque em panorama e zoom', () => {
            for (const escala of [1, 2, 2.2, 2.5]) {
                const c = {left: -87, top: 31, width: 360 * escala, height: 203 * escala};
                const p = G.ponto(c.left + c.width * 0.37, c.top + c.height * 0.62, c);
                assert(Math.abs(p.x - 0.37) < 1e-10 && Math.abs(p.y - 0.62) < 1e-10, 'Conversão incorreta');
            }
        });
        teste('faixas vazias e retângulos degenerados', () => {
            const c = {left: 0, top: 100, width: 360, height: 203};
            assert(G.ponto(20, 80, c) === null && G.ponto(361, 120, c) === null, 'Faixa vazia aceita');
            const r = G.ajustar({x: -1, y: 2, largura: 0, altura: 0});
            assert(r.x === 0 && r.y === 0.98 && r.largura === 0.02 && r.altura === 0.02, 'Dimensão nula aceita');
            let rejeitado = false; try { G.ajustar({x: NaN, y: 0, largura: 1, altura: 1}); } catch { rejeitado = true; }
            assert(rejeitado, 'NaN aceito');
        });
        teste('borda adjacente não é sobreposição; interseção real é', () => {
            const a = {x: 0, y: 0, largura: 0.2, altura: 0.2};
            assert(!G.intersecta(a, {...a, x: 0.2}) && G.intersecta(a, {...a, x: 0.1}), 'Interseção incorreta');
        });
        teste('sem banco, UUID, localStorage ou mutação do manifesto', () => {
            assert(consultas === 0 && uuid === 0, 'APIs persistentes chamadas');
            assert(JSON.stringify({...localStorage}) === localAntes && JSON.stringify(PB.cenarioJoao) === original, 'Dados existentes alterados');
        });
    } finally {
        editor?.suspender(); indexedDB.open = abrirOriginal; crypto.randomUUID = uuidOriginal; window.confirm = confirmarOriginal;
    }
    linhas.push(`RESULTADO: ${falhas} falhas. Arraste real, navegação central e mobile exigem teste no aplicativo.`);
    el('resultado').textContent = linhas.join('\n');
    document.documentElement.dataset.resultado = falhas ? 'falhou' : 'passou';
})();
