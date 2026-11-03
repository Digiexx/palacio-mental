(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    const {exigir, requisicao: req, transacao: tx} = PB;
    async function criarRepositorio(opcoes) {
        const db = await PB.abrirBanco(opcoes);
        let dono;
        try {
            dono = await tx(db, ['metadados'], 'readwrite', async t => {
                const s = t.objectStore('metadados');
                let identidade = await req(s.get('identidade-local'));
                if (!identidade) {
                    identidade = {id: 'identidade-local', proprietarioLocalId: PB.novoId(), contaRemotaId: null};
                    await req(s.add(identidade));
                }
                return identidade.proprietarioLocalId;
            });
        } catch (erro) { db.close(); throw erro; }
        function tipoValido(tipo) { exigir(PB.tipos.includes(tipo), 'Tipo desconhecido'); }
        async function ler(t, tipo, id) {
            const r = await req(t.objectStore(tipo).get(id));
            exigir(r && r.proprietarioLocalId === dono, `Referência inexistente ou de outro proprietário: ${tipo}`);
            return r;
        }
        async function verificarReferencias(t, tipo, r, anterior) {
            const ref = (tipoRef, id) => ler(t, tipoRef, id);
            if (['cenarios', 'versiculos'].includes(tipo)) await ref('livros', r.livroId);
            if (tipo === 'regioes') await ref('cenarios', r.cenarioId);
            if (tipo === 'objetos') {
                await ref('cenarios', r.cenarioId);
                if (r.regiaoId) exigir((await ref('regioes', r.regiaoId)).cenarioId === r.cenarioId, 'Região de outro cenário');
            }
            if (tipo === 'associacoes' || tipo === 'revisoes') await ref('versiculos', r.versiculoId);
            if (tipo === 'vinculos') {
                const objeto = await ref('objetos', r.objetoId);
                const versiculo = await ref('versiculos', r.versiculoId);
                const associacao = await ref('associacoes', r.associacaoId);
                exigir(associacao.versiculoId === versiculo.id, 'Associação de outro versículo');
                exigir((await ref('cenarios', objeto.cenarioId)).livroId === versiculo.livroId, 'Cenário de outro livro');
            }
            if (tipo === 'flashcards') await ref('vinculos', r.vinculoId);
            if (tipo === 'revisoes' && r.flashcardId) {
                const f = await ref('flashcards', r.flashcardId);
                exigir((await ref('vinculos', f.vinculoId)).versiculoId === r.versiculoId, 'Flashcard de outro versículo');
            }
            if (!anterior) return;
            // Estrutura referencial imutável: evita invalidar descendentes já salvos.
            const protegidos = {
                cenarios: ['livroId', 'imagem'], regioes: ['cenarioId', 'posicao'],
                versiculos: ['livroId', 'capitulo', 'inicio', 'fim', 'traducao'],
                associacoes: ['versiculoId'], vinculos: ['objetoId', 'versiculoId', 'associacaoId'],
                flashcards: ['vinculoId'], revisoes: PB.campos.revisoes
            };
            for (const k of protegidos[tipo] || []) exigir(JSON.stringify(r[k]) === JSON.stringify(anterior[k]), `Campo estrutural protegido: ${k}`);
            if (tipo === 'objetos') {
                const vinculado = await req(t.objectStore('vinculos').index('objetoId').get([dono, r.id]));
                if (vinculado) for (const k of ['cenarioId', 'regiaoId', 'posicao', 'imagem']) {
                    exigir(JSON.stringify(r[k]) === JSON.stringify(anterior[k]), 'Objeto vinculado: posição e localização protegidas');
                }
            }
        }
        async function gravar(tipo, id, dados) {
            const entrada = PB.dadosPermitidos(tipo, dados);
            return tx(db, [...PB.tipos, 'operacoes'], 'readwrite', async t => {
                const anterior = id ? await ler(t, tipo, id) : null;
                const agora = new Date().toISOString();
                const r = {...anterior, ...entrada, id: anterior?.id || PB.novoId(), proprietarioLocalId: dono,
                    criadoEm: anterior?.criadoEm || agora, atualizadoEm: agora, revisao: (anterior?.revisao || 0) + 1};
                if (tipo === 'versiculos' && r.fim === undefined) r.fim = r.inicio;
                PB.validar(tipo, r);
                await verificarReferencias(t, tipo, r, anterior);
                await req(t.objectStore(tipo).put(r));
                await req(t.objectStore('operacoes').add({id: PB.novoId(), proprietarioLocalId: dono,
                    entidade: tipo, registroId: r.id, revisao: r.revisao, acao: anterior ? 'editar' : 'criar',
                    criadoEm: agora, estado: 'somente-local', dados: structuredClone(r)}));
                return r;
            });
        }
        return Object.freeze({
            proprietarioLocalId: dono,
            criar: (tipo, dados) => gravar(tipo, null, dados),
            editar(tipo, id, dados) {
                exigir(typeof id === 'string' && id.trim().length > 0, 'Identificador de edição obrigatório');
                return gravar(tipo, id, dados);
            },
            vincular: dados => gravar('vinculos', null, dados),
            obter(tipo, id) { tipoValido(tipo); return tx(db, [tipo], 'readonly', t => ler(t, tipo, id)); },
            listar(tipo) { tipoValido(tipo); return tx(db, [tipo], 'readonly', t => req(t.objectStore(tipo).index('proprietario').getAll(dono))); },
            operacoesPendentes: () => tx(db, ['operacoes'], 'readonly', t => req(t.objectStore('operacoes').index('proprietario').getAll(dono))),
            fechar: () => db.close()
        });
    }
    PB.criarRepositorio = criarRepositorio;
})();
