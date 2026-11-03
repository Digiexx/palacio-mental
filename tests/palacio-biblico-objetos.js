(async () => {
    'use strict';
    const PB = globalThis.PalacioBiblico, oficial = PB.cenarioJoao;
    const linhas = [], original = JSON.stringify(oficial);
    let falhas = 0;
    const assert = (v, mensagem) => { if (!v) throw new Error(mensagem); };
    const pedido = (extras = {}) => ({livro: {codigo: 'JHN', nome: 'João'}, cenarioOficial: oficial,
        regiaoOficialId: oficial.regioes[1].id, nome: 'Cesto pessoal de teste',
        posicao: {x: 0.46, y: 0.6, largura: 0.08, altura: 0.09}, operacaoId: crypto.randomUUID(), ...extras});
    async function rejeita(fn) {
        let falhou = false;
        try { await fn(); } catch { falhou = true; }
        assert(falhou, 'Operação inválida foi aceita');
    }
    async function teste(nome, fn) {
        try { await fn(); linhas.push(`OK: ${nome}`); }
        catch (e) { ++falhas; linhas.push(`FALHOU: ${nome}: ${e.message}`); }
    }
    async function snapshot(nome) {
        const db = await PB.abrirBanco({nome});
        try {
            return await PB.transacao(db, [...db.objectStoreNames], 'readonly', async t => {
                const out = {};
                for (const tipo of db.objectStoreNames) out[tipo] = await PB.requisicao(t.objectStore(tipo).getAll());
                return out;
            });
        } finally { db.close(); }
    }
    async function isolado(fn) {
        const nome = `palacio-biblico-teste-objetos-${crypto.randomUUID()}`;
        const r = await PB.criarRepositorio({nome});
        try { await fn(r, nome); }
        finally {
            r.fechar();
            // Remove exclusivamente o banco aleatório criado por este teste.
            await PB.requisicao(indexedDB.deleteDatabase(nome));
        }
    }
    const localAntes = JSON.stringify({...localStorage});
    await teste('consulta vazia não cria contexto, objeto ou fila; schema 1 preservado', () => isolado(async (r, nome) => {
        const antes = JSON.stringify(await snapshot(nome));
        assert((await r.consultarObjetosPessoais(oficial.id)).length === 0, 'Consulta deveria estar vazia');
        assert(JSON.stringify(await snapshot(nome)) === antes, 'Consulta gravou registros');
        const db = await PB.abrirBanco({nome});
        assert(db.version === 1, 'Schema alterado'); db.close();
    }));
    await teste('cadastro sem versículo cria contexto e fila atomicamente', () => isolado(async (r, nome) => {
        const salvo = await r.cadastrarObjetoPessoal(pedido());
        const s = await snapshot(nome);
        assert(s.livros.length === 1 && s.cenarios.length === 1 && s.regioes.length === 1 && s.objetos.length === 1, 'Contexto incompleto');
        assert(s.versiculos.length === 0 && s.vinculos.length === 0 && s.associacoes.length === 0, 'Criou dados bíblicos automaticamente');
        assert(s.operacoes.length === 4 && s.operacoes.every(op => op.proprietarioLocalId === r.proprietarioLocalId), 'Fila inconsistente');
        assert(s.metadados.filter(m => m.tipo === 'contexto-cenario').length === 1 && s.metadados.filter(m => m.tipo === 'cadastro-objeto').length === 1, 'Mapeamento/recibo ausente');
        assert(salvo.proprietarioLocalId === r.proprietarioLocalId && salvo.revisao === 1, 'Identidade inválida');
        for (const op of s.operacoes) {
            const registro = s[op.entidade].find(x => x.id === op.registroId);
            assert(registro && JSON.stringify(op.dados) === JSON.stringify(registro), 'Snapshot da fila difere do registro');
        }
    }));
    await teste('mesma operação repetida não grava nada novamente', () => isolado(async (r, nome) => {
        const d = pedido(), a = await r.cadastrarObjetoPessoal(d);
        const antes = JSON.stringify(await snapshot(nome));
        const b = await r.cadastrarObjetoPessoal(structuredClone(d));
        assert(a.id === b.id && JSON.stringify(await snapshot(nome)) === antes, 'Repetição duplicou dados');
        await rejeita(() => r.cadastrarObjetoPessoal({...d, nome: 'Outro conteúdo'}));
        assert(JSON.stringify(await snapshot(nome)) === antes, 'Operação conflitante alterou registros');
    }));
    await teste('duplo envio concorrente com o mesmo token', () => isolado(async (r, nome) => {
        const outra = await PB.criarRepositorio({nome});
        try {
            const d = pedido();
            const salvos = await Promise.all([r.cadastrarObjetoPessoal(d), outra.cadastrarObjetoPessoal(d)]);
            const s = await snapshot(nome);
            assert(salvos[0].id === salvos[1].id && s.objetos.length === 1 && s.operacoes.length === 4, 'Toque duplo duplicou registro/fila');
        } finally { outra.fechar(); }
    }));
    await teste('tokens diferentes não duplicam objeto idêntico em duas conexões', () => isolado(async (r, nome) => {
        const outra = await PB.criarRepositorio({nome});
        try {
            const salvos = await Promise.all([r.cadastrarObjetoPessoal(pedido()), outra.cadastrarObjetoPessoal(pedido())]);
            const s = await snapshot(nome);
            assert(salvos[0].id === salvos[1].id && s.objetos.length === 1 && s.operacoes.length === 4, 'Cadastro idêntico duplicado');
        } finally { outra.fechar(); }
    }));
    await teste('objetos diferentes concorrentes compartilham contexto e região', () => isolado(async (r, nome) => {
        const outra = await PB.criarRepositorio({nome});
        try {
            const salvos = await Promise.all([r.cadastrarObjetoPessoal(pedido()), outra.cadastrarObjetoPessoal(pedido({nome: 'Segundo objeto técnico', posicao: {x: 0.6, y: 0.7, largura: 0.1, altura: 0.1}}))]);
            const s = await snapshot(nome);
            assert(salvos[0].id !== salvos[1].id && s.livros.length === 1 && s.cenarios.length === 1 && s.regioes.length === 1 && s.objetos.length === 2 && s.operacoes.length === 5, 'Contexto concorrente duplicado');
        } finally { outra.fechar(); }
    }));
    await teste('reutiliza livro favorito, cenário e região preexistentes sem modificá-los', () => isolado(async (r, nome) => {
        const livro = await r.definirFavorito('JHN', 'João', true);
        const cenario = await r.criar('cenarios', {livroId: livro.id, nome: 'Meu panorama anterior', imagem: oficial.imagem});
        const regiao = await r.criar('regioes', {cenarioId: cenario.id, nome: 'Jardim', posicao: oficial.regioes[1].toque});
        const anterior = await snapshot(nome);
        const salvo = await r.cadastrarObjetoPessoal(pedido());
        const depois = await snapshot(nome);
        assert(salvo.cenarioId === cenario.id && salvo.regiaoId === regiao.id, 'Não reutilizou registros');
        for (const tipo of ['livros', 'cenarios', 'regioes']) assert(JSON.stringify(anterior[tipo]) === JSON.stringify(depois[tipo]), `Alterou ${tipo}`);
        assert(depois.operacoes.length === anterior.operacoes.length + 1, 'Criou operações extras de contexto');
    }));
    await teste('segunda região do mesmo cenário não duplica livro/cenário', () => isolado(async (r, nome) => {
        const a = await r.cadastrarObjetoPessoal(pedido());
        const b = await r.cadastrarObjetoPessoal(pedido({regiaoOficialId: oficial.regioes[0].id, nome: 'Objeto pessoal da casa'}));
        const s = await snapshot(nome);
        assert(a.cenarioId === b.cenarioId && a.regiaoId !== b.regiaoId && s.cenarios.length === 1 && s.regioes.length === 2, 'Mapeamento de região inválido');
    }));
    await teste('rollback real de contexto, objeto, mapeamento e fila', () => isolado(async (r, nome) => {
        const antes = JSON.stringify(await snapshot(nome));
        const originalAdd = IDBObjectStore.prototype.add;
        IDBObjectStore.prototype.add = function (valor) {
            return originalAdd.call(this, this.name === 'operacoes' ? {} : valor);
        };
        try { await rejeita(() => r.cadastrarObjetoPessoal(pedido())); }
        finally { IDBObjectStore.prototype.add = originalAdd; }
        assert(JSON.stringify(await snapshot(nome)) === antes, 'Falha deixou registros parciais');
    }));
    await teste('rollback quando falha a gravação final do comprovante', () => isolado(async (r, nome) => {
        const antes = JSON.stringify(await snapshot(nome));
        const originalAdd = IDBObjectStore.prototype.add;
        IDBObjectStore.prototype.add = function (valor) {
            return originalAdd.call(this, this.name === 'metadados' && valor.tipo === 'cadastro-objeto' ? {} : valor);
        };
        try { await rejeita(() => r.cadastrarObjetoPessoal(pedido())); }
        finally { IDBObjectStore.prototype.add = originalAdd; }
        assert(JSON.stringify(await snapshot(nome)) === antes, 'Recibo falhou sem rollback total');
    }));
    await teste('limites geométricos e referências rejeitados antes de gravar', () => isolado(async (r, nome) => {
        const antes = JSON.stringify(await snapshot(nome));
        for (const posicao of [
            {x: -0.1, y: 0, largura: 0.1, altura: 0.1},
            {x: 0.95, y: 0, largura: 0.1, altura: 0.1},
            {x: 0, y: 0, largura: 0, altura: 0.1},
            {x: 0, y: NaN, largura: 0.1, altura: 0.1}
        ]) await rejeita(() => r.cadastrarObjetoPessoal(pedido({posicao})));
        await rejeita(() => r.cadastrarObjetoPessoal(pedido({regiaoOficialId: 'inexistente'})));
        await rejeita(() => r.cadastrarObjetoPessoal(pedido({nome: ' '})));
        await rejeita(() => r.cadastrarObjetoPessoal(pedido({operacaoId: ''})));
        await rejeita(() => r.cadastrarObjetoPessoal({...pedido(), proprietarioLocalId: 'outro'}));
        assert(JSON.stringify(await snapshot(nome)) === antes, 'Entrada inválida gravou dados');
    }));
    await teste('área na borda da imagem é válida', () => isolado(async r => {
        const salvo = await r.cadastrarObjetoPessoal(pedido({posicao: {x: 0.9, y: 0.9, largura: 0.1, altura: 0.1}}));
        assert(salvo.posicao.x === 0.9 && salvo.posicao.altura === 0.1, 'Área de borda alterada');
    }));
    await teste('mudança de geometria oficial é rejeitada sem migração silenciosa', () => isolado(async (r, nome) => {
        await r.cadastrarObjetoPessoal(pedido());
        const antes = JSON.stringify(await snapshot(nome));
        const alterado = structuredClone(oficial); alterado.regioes[1].toque.largura = 0.39;
        await rejeita(() => r.cadastrarObjetoPessoal(pedido({cenarioOficial: alterado})));
        assert(JSON.stringify(await snapshot(nome)) === antes, 'Geometria alterada silenciosamente');
    }));
    await teste('contexto ambíguo é rejeitado sem duplicar nem alterar dados antigos', () => isolado(async (r, nome) => {
        const livro = await r.criar('livros', {codigo: 'JHN', nome: 'João'});
        await r.criar('cenarios', {livroId: livro.id, nome: 'Cenário A', imagem: oficial.imagem});
        await r.criar('cenarios', {livroId: livro.id, nome: 'Cenário B', imagem: oficial.imagem});
        const antes = JSON.stringify(await snapshot(nome));
        await rejeita(() => r.cadastrarObjetoPessoal(pedido()));
        assert(JSON.stringify(await snapshot(nome)) === antes, 'Escolheu contexto ambíguo');
    }));
    await teste('reabertura preserva UUIDs, coordenadas, mapeamento e fila', () => isolado(async (r, nome) => {
        const a = await r.cadastrarObjetoPessoal(pedido());
        const antes = JSON.stringify(await snapshot(nome));
        r.fechar(); const outra = await PB.criarRepositorio({nome});
        try {
            const salvos = await outra.consultarObjetosPessoais(oficial.id);
            assert(salvos.length === 1 && JSON.stringify(salvos[0]) === JSON.stringify(a), 'Objeto perdido na reabertura');
            assert(JSON.stringify(await snapshot(nome)) === antes, 'Reabertura gravou dados');
        } finally { outra.fechar(); }
    }));
    await teste('máximo um vínculo por objeto e índice inverso preservados', () => isolado(async r => {
        const a = await r.cadastrarObjetoPessoal(pedido());
        const b = await r.cadastrarObjetoPessoal(pedido({nome: 'Outro objeto técnico'}));
        const livroId = (await r.obter('cenarios', a.cenarioId)).livroId;
        const v = await r.criar('versiculos', {livroId, capitulo: 15, inicio: 5, traducao: 'Referência técnica sem texto'});
        const assoc = await r.criar('associacoes', {versiculoId: v.id, descricao: 'Fixture isolada de integridade; não é associação pessoal'});
        await r.vincular({objetoId: a.id, versiculoId: v.id, associacaoId: assoc.id});
        await rejeita(() => r.vincular({objetoId: a.id, versiculoId: v.id, associacaoId: assoc.id}));
        const outraAssoc = await r.criar('associacoes', {versiculoId: v.id, descricao: 'Segunda fixture técnica'});
        await rejeita(() => r.vincular({objetoId: b.id, versiculoId: v.id, associacaoId: outraAssoc.id}));
        await rejeita(() => r.editar('objetos', a.id, {posicao: {x: 0, y: 0, largura: 0.1, altura: 0.1}}));
        assert((await r.listar('vinculos')).length === 1, 'Unicidade de vínculos violada');
    }));
    await teste('consulta não mistura proprietários e contextos corrompidos são rejeitados', () => isolado(async (r, nome) => {
        await r.cadastrarObjetoPessoal(pedido());
        const db = await PB.abrirBanco({nome});
        try {
            await PB.transacao(db, ['metadados'], 'readwrite', async t => {
                const todos = await PB.requisicao(t.objectStore('metadados').getAll());
                const mapa = todos.find(m => m.tipo === 'contexto-cenario');
                mapa.proprietarioLocalId = 'outro-proprietario';
                await PB.requisicao(t.objectStore('metadados').put(mapa));
            });
        } finally { db.close(); }
        await rejeita(() => r.consultarObjetosPessoais(oficial.id));
        await rejeita(() => r.cadastrarObjetoPessoal(pedido()));
    }));
    await teste('persistência entre carregamentos reais', async () => {
        const nome = 'palacio-biblico-teste-objetos-recarga';
        const r = await PB.criarRepositorio({nome});
        try {
            const anteriores = await r.consultarObjetosPessoais(oficial.id);
            if (anteriores.length) {
                const antes = JSON.stringify(await snapshot(nome));
                const salvo = await r.cadastrarObjetoPessoal(pedido({operacaoId: 'marcador-recarga'}));
                assert(salvo.id === anteriores[0].id && JSON.stringify(await snapshot(nome)) === antes, 'Recarga duplicou registros');
                linhas.push('EVIDÊNCIA: objeto do carregamento anterior recuperado, sem duplicação');
            } else {
                await r.cadastrarObjetoPessoal(pedido({operacaoId: 'marcador-recarga'}));
                linhas.push('PENDENTE: recarregar a página para confirmar persistência entre carregamentos');
            }
        } finally { r.fechar(); }
    });
    await teste('objetos oficiais e localStorage preservados', async () => {
        assert(JSON.stringify(oficial) === original && Object.isFrozen(oficial), 'Manifesto oficial alterado');
        assert(JSON.stringify({...localStorage}) === localAntes, 'localStorage alterado');
    });
    linhas.push(`RESULTADO: ${falhas} falhas. Quota real e aparelho físico exigem validação adicional.`);
    document.getElementById('resultado').textContent = linhas.join('\n');
    document.documentElement.dataset.resultado = falhas ? 'falhou' : 'passou';
})();
