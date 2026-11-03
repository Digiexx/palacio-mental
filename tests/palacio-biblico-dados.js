(async () => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    const linhas = [];
    let falhas = 0;
    const assert = (ok, msg) => { if (!ok) throw new Error(msg); };
    async function teste(nome, executar) {
        try { await executar(); linhas.push(`OK: ${nome}`); }
        catch (e) { falhas++; linhas.push(`FALHOU: ${nome}: ${e.message}`); }
    }
    async function rejeita(fn) {
        let falhou = false;
        try { await fn(); } catch { falhou = true; }
        assert(falhou, 'Operação inválida foi aceita');
    }
    // Somente leitura para comparação: não cria nem modifica chaves existentes.
    const snapshot = () => Object.fromEntries(Object.keys(localStorage).sort().map(k => [k, localStorage.getItem(k)]));
    const antes = JSON.stringify(snapshot());
    const nome = `palacio-biblico-teste-${crypto.randomUUID()}`;
    let r, livro, cenario, regiao, objeto, verso, associacao, vinculo;
    await teste('criação e identidade local', async () => {
        r = await PB.criarRepositorio({nome});
        assert(r.proprietarioLocalId, 'Sem identidade');
    });
    await teste('cadastro encadeado sem texto bíblico', async () => {
        livro = await r.criar('livros', {nome: 'João', codigo: 'JHN'});
        cenario = await r.criar('cenarios', {livroId: livro.id, nome: 'Ambiente de teste'});
        regiao = await r.criar('regioes', {cenarioId: cenario.id, nome: 'Região de teste', posicao: {x: 0, y: 0, largura: 1, altura: 1}});
        objeto = await r.criar('objetos', {cenarioId: cenario.id, regiaoId: regiao.id, nome: 'Ponto de teste', posicao: {x: 0.1, y: 0.2, largura: 0.1, altura: 0.1}});
        verso = await r.criar('versiculos', {livroId: livro.id, capitulo: 15, inicio: 5, traducao: 'NVI'});
        associacao = await r.criar('associacoes', {versiculoId: verso.id, descricao: 'Dado técnico de teste; não é associação do usuário'});
        vinculo = await r.vincular({objetoId: objeto.id, versiculoId: verso.id, associacaoId: associacao.id});
        const flash = await r.criar('flashcards', {vinculoId: vinculo.id, tipo: 'referencia-texto'});
        await r.criar('revisoes', {versiculoId: verso.id, flashcardId: flash.id, resultado: 'erro', ocorridoEm: new Date().toISOString()});
        assert((await r.listar('revisoes')).length === 1, 'Revisão ausente');
    });
    await teste('edição preserva identidade, posição e proprietário', async () => {
        const editado = await r.editar('objetos', objeto.id, {nome: 'Ponto renomeado'});
        assert(editado.id === objeto.id && editado.proprietarioLocalId === r.proprietarioLocalId && editado.revisao === 2, 'Identidade/revisão inválida');
        assert(JSON.stringify(editado.posicao) === JSON.stringify(objeto.posicao), 'Posição mudou');
        await rejeita(() => r.editar('objetos', objeto.id, {id: 'outro'}));
        await rejeita(() => r.editar('objetos', objeto.id, {proprietarioLocalId: 'outro'}));
    });
    await teste('duplicatas e referências inválidas não entram na fila', async () => {
        const n = (await r.operacoesPendentes()).length;
        await rejeita(() => r.vincular({objetoId: objeto.id, versiculoId: verso.id, associacaoId: associacao.id}));
        await rejeita(() => r.criar('objetos', {cenarioId: 'ausente', nome: 'Inválido', posicao: objeto.posicao}));
        await rejeita(() => r.criar('versiculos', {livroId: livro.id, capitulo: 15, inicio: 5, traducao: 'NVI'}));
        await rejeita(() => r.editar('objetos', objeto.id, {posicao: {x: 0.3, y: 0.3, largura: 0.1, altura: 0.1}}));
        await rejeita(() => r.editar('cenarios', cenario.id, {imagem: 'novo-fundo.webp'}));
        assert((await r.operacoesPendentes()).length === n, 'Fila alterada em operação rejeitada');
        assert((await r.listar('vinculos')).length === 1, 'Vínculo duplicado');
    });
    await teste('duas conexões concorrentes não ocupam o mesmo objeto', async () => {
        const outra = await PB.criarRepositorio({nome});
        try {
            assert(outra.proprietarioLocalId === r.proprietarioLocalId, 'Identidade divergente');
            const o = await r.criar('objetos', {cenarioId: cenario.id, nome: 'Ponto concorrente', posicao: objeto.posicao});
            const v = await r.criar('versiculos', {livroId: livro.id, capitulo: 3, inicio: 3, traducao: 'NVI'});
            const a = await r.criar('associacoes', {versiculoId: v.id, descricao: 'Teste concorrente'});
            const dados = {objetoId: o.id, versiculoId: v.id, associacaoId: a.id};
            const resultados = await Promise.allSettled([r.vincular(dados), outra.vincular(dados)]);
            assert(resultados.filter(x => x.status === 'fulfilled').length === 1, 'Ocupação concorrente inválida');
        } finally { outra.fechar(); }
    });
    await teste('versículo ocupado, campos inválidos e cruzamento de livros', async () => {
        const outroObjeto = await r.criar('objetos', {cenarioId: cenario.id, nome: 'Outro ponto', posicao: objeto.posicao});
        await rejeita(() => r.vincular({objetoId: outroObjeto.id, versiculoId: verso.id, associacaoId: associacao.id}));
        await rejeita(() => r.editar('livros', null, {nome: 'Inválido'}));
        await rejeita(() => r.criar('objetos', {cenarioId: cenario.id, nome: 'Inválido', posicao: {x: -1, y: 0, largura: 1, altura: 1}}));
        const outroLivro = await r.criar('livros', {nome: 'Filipenses', codigo: 'PHP'});
        const outroVerso = await r.criar('versiculos', {livroId: outroLivro.id, capitulo: 1, inicio: 1, traducao: 'referência técnica sem texto'});
        const outraAssociacao = await r.criar('associacoes', {versiculoId: outroVerso.id, descricao: 'Teste de integridade'});
        await rejeita(() => r.vincular({objetoId: outroObjeto.id, versiculoId: outroVerso.id, associacaoId: outraAssociacao.id}));
    });
    await teste('falha na fila reverte a gravação de dados', async () => {
        const db = await PB.abrirBanco({nome});
        try {
            await rejeita(() => PB.transacao(db, ['livros', 'operacoes'], 'readwrite', async t => {
                await PB.requisicao(t.objectStore('livros').add({...livro, id: 'rollback'}));
                // DataError real: chave obrigatória ausente na operação pendente.
                await PB.requisicao(t.objectStore('operacoes').add({acao: 'teste'}));
            }));
            const resultado = await PB.transacao(db, ['livros'], 'readonly', t => PB.requisicao(t.objectStore('livros').get('rollback')));
            assert(!resultado, 'Transação deixou registro parcial');
        } finally { db.close(); }
    });
    await teste('reabertura preserva dados e fila', async () => {
        const dono = r.proprietarioLocalId;
        const fila = JSON.stringify(await r.operacoesPendentes());
        r.fechar(); r = await PB.criarRepositorio({nome});
        assert(r.proprietarioLocalId === dono, 'Dono alterado');
        assert((await r.obter('objetos', objeto.id)).nome === 'Ponto renomeado', 'Edição perdida');
        assert(JSON.stringify(await r.operacoesPendentes()) === fila, 'Fila perdida');
    });
    await teste('operações sem APIs de rede', async () => {
        const fetchOriginal = globalThis.fetch;
        const xhrOriginal = globalThis.XMLHttpRequest;
        globalThis.fetch = () => { throw new Error('Rede proibida no teste'); };
        globalThis.XMLHttpRequest = function () { throw new Error('Rede proibida no teste'); };
        try {
            await r.editar('livros', livro.id, {nome: 'João'});
            assert((await r.obter('livros', livro.id)).nome === 'João', 'Consulta local falhou');
        } finally { globalThis.fetch = fetchOriginal; globalThis.XMLHttpRequest = xhrOriginal; }
    });
    await teste('indisponibilidade e erro de abertura são propagados', async () => {
        await rejeita(() => PB.abrirBanco({fabrica: null}));
        await rejeita(() => PB.abrirBanco({fabrica: {open() { throw new DOMException('Armazenamento negado', 'SecurityError'); }}}));
        const db = await PB.abrirBanco({nome}); db.close();
        await rejeita(() => PB.transacao(db, ['livros'], 'readwrite', () => {}));
    });
    await teste('persistência entre carregamentos reais da página', async () => {
        const persistente = await PB.criarRepositorio({nome: 'palacio-biblico-teste-recarga'});
        try {
            const livros = await persistente.listar('livros');
            if (livros.length) {
                assert(livros[0].codigo === 'JHN', 'Marcador de recarga inválido');
                linhas.push('EVIDÊNCIA: registro de carregamento anterior recuperado');
            } else {
                await persistente.criar('livros', {nome: 'João', codigo: 'JHN'});
                linhas.push('PENDENTE: recarregue para confirmar persistência entre páginas');
            }
        } finally { persistente.fechar(); }
    });
    await teste('localStorage preservado', async () => assert(JSON.stringify(snapshot()) === antes, 'localStorage alterado'));
    r?.fechar();
    // Remove exclusivamente o banco descartável criado por esta execução.
    await PB.requisicao(indexedDB.deleteDatabase(nome));
    linhas.push(`RESULTADO: ${falhas} falhas. Rede física offline e quota real exigem teste adicional.`);
    document.getElementById('resultado').textContent = linhas.join('\n');
    document.documentElement.dataset.resultado = falhas ? 'falhou' : 'passou';
})();
