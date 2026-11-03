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
            if (tipo === 'livros') {
                const livros = await req(t.objectStore('livros').index('proprietario').getAll(dono));
                exigir(!livros.some(l => l.id !== r.id && l.codigo.trim().toUpperCase() === r.codigo.trim().toUpperCase()), 'Código de livro já cadastrado');
            }
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
                livros: ['codigo'],
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
        async function persistir(t, tipo, r, acao) {
            await req(t.objectStore(tipo).put(r));
            await req(t.objectStore('operacoes').add({id: PB.novoId(), proprietarioLocalId: dono,
                entidade: tipo, registroId: r.id, revisao: r.revisao, acao,
                criadoEm: r.atualizadoEm, estado: 'somente-local', dados: structuredClone(r)}));
            return r;
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
                return persistir(t, tipo, r, anterior ? 'editar' : 'criar');
            });
        }
        // API de persistência; não é chamada pelo cenário nem inicializa contexto na leitura.
        const textoValido = v => typeof v === 'string' && v.trim().length > 0;
        const canonico = v => v.trim().normalize('NFC').toUpperCase();
        const nomeComparavel = v => v.trim().normalize('NFC').toLocaleLowerCase('pt-BR');
        const chave = (tipo, valor) => JSON.stringify(['palacio-biblico', tipo, dono, valor]);
        const posicaoIgual = (a, b) => a && b && ['x', 'y', 'largura', 'altura'].every(k => a[k] === b[k]);
        function normalizarPosicao(p) {
            PB.validar('objetos', {id: 'validacao', proprietarioLocalId: dono, cenarioId: 'validacao', nome: 'Validação', posicao: p});
            return {x: p.x, y: p.y, largura: p.largura, altura: p.altura};
        }
        function prepararCadastro(dados) {
            exigir(dados && Object.getPrototypeOf(dados) === Object.prototype, 'Cadastro inválido');
            const permitidos = ['livro', 'cenarioOficial', 'regiaoOficialId', 'nome', 'posicao', 'operacaoId'];
            exigir(Object.keys(dados).every(k => permitidos.includes(k)), 'Campo de cadastro desconhecido');
            const d = structuredClone(dados), c = d.cenarioOficial;
            exigir(textoValido(d.operacaoId) && textoValido(d.nome), 'Operação e nome obrigatórios');
            exigir(d.livro && textoValido(d.livro.codigo) && textoValido(d.livro.nome), 'Livro inválido');
            exigir(c && textoValido(c.id) && textoValido(c.imagem) && Number.isInteger(c.largura) && c.largura > 0 && Number.isInteger(c.altura) && c.altura > 0, 'Cenário oficial inválido');
            exigir(Array.isArray(c.regioes) && c.regioes.length > 0 && Array.isArray(c.objetos), 'Manifesto incompleto');
            const regioes = c.regioes.map(r => {
                exigir(textoValido(r.id) && textoValido(r.nome), 'Região oficial inválida');
                return {id: r.id, nome: r.nome, posicao: normalizarPosicao(r.toque)};
            });
            exigir(new Set(regioes.map(r => r.id)).size === regioes.length, 'Regiões oficiais duplicadas');
            const objetos = c.objetos.map(o => {
                exigir(textoValido(o.id) && regioes.some(r => r.id === o.regiaoId), 'Objeto oficial inválido');
                return {id: o.id, regiaoId: o.regiaoId, posicao: normalizarPosicao(o.toque)};
            });
            exigir(new Set([c.id, ...regioes.map(r => r.id), ...objetos.map(o => o.id)]).size === 1 + regioes.length + objetos.length, 'IDs oficiais duplicados');
            const regiao = regioes.find(r => r.id === d.regiaoOficialId);
            exigir(regiao, 'Região inexistente no cenário oficial');
            const geometria = JSON.stringify({id: c.id, imagem: c.imagem, largura: c.largura, altura: c.altura,
                regioes: [...regioes].sort((a, b) => a.id.localeCompare(b.id)).map(r => ({id: r.id, posicao: r.posicao})),
                objetos: [...objetos].sort((a, b) => a.id.localeCompare(b.id))});
            const pedido = {cenarioOficialId: c.id, geometria, codigoLivro: canonico(d.livro.codigo),
                regiaoOficialId: regiao.id, nome: d.nome.trim().normalize('NFC'), posicao: normalizarPosicao(d.posicao)};
            return {pedido, assinatura: JSON.stringify(pedido), operacaoId: d.operacaoId, regiao,
                nomeLivro: d.livro.nome.trim(), imagem: c.imagem};
        }
        async function validarContexto(t, mapa) {
            exigir(mapa.proprietarioLocalId === dono && mapa.tipo === 'contexto-cenario' && Array.isArray(mapa.regioes), 'Mapeamento de cenário inválido ou de outro proprietário');
            const livro = await ler(t, 'livros', mapa.livroId);
            const cenario = await ler(t, 'cenarios', mapa.cenarioId);
            exigir(canonico(livro.codigo) === mapa.codigoLivro && cenario.livroId === livro.id && cenario.imagem === mapa.imagem, 'Contexto pessoal inconsistente');
            const ids = new Set(), pessoais = new Set();
            for (const item of mapa.regioes) {
                exigir(!ids.has(item.oficialId) && !pessoais.has(item.pessoalId), 'Mapeamento de região duplicado');
                ids.add(item.oficialId); pessoais.add(item.pessoalId);
                const r = await ler(t, 'regioes', item.pessoalId);
                exigir(r.cenarioId === cenario.id && posicaoIgual(r.posicao, item.posicao), 'Região pessoal inconsistente');
            }
        }
        async function cadastrarObjetoPessoal(dados) {
            const d = prepararCadastro(dados), p = d.pedido;
            return tx(db, [...PB.tipos, 'metadados', 'operacoes'], 'readwrite', async t => {
                const meta = t.objectStore('metadados');
                const contextoId = chave('contexto-cenario', p.cenarioOficialId);
                const reciboId = chave('cadastro-objeto', d.operacaoId);
                const recibo = await req(meta.get(reciboId));
                let mapa = await req(meta.get(contextoId));
                if (recibo) {
                    exigir(recibo.proprietarioLocalId === dono && recibo.tipo === 'cadastro-objeto' && recibo.assinatura === d.assinatura && recibo.contextoId === contextoId, 'Identificador de operação reutilizado com dados diferentes');
                    exigir(mapa, 'Operação aponta para contexto inexistente');
                    await validarContexto(t, mapa);
                    exigir(mapa.cenarioOficialId === p.cenarioOficialId && mapa.codigoLivro === p.codigoLivro && mapa.geometria === p.geometria, 'Contexto diverge da operação original');
                    const salvo = await ler(t, 'objetos', recibo.objetoId);
                    exigir(salvo.cenarioId === mapa.cenarioId, 'Operação aponta para objeto de outro cenário');
                    return salvo;
                }
                const agora = new Date().toISOString();
                const criar = async (tipo, entrada) => {
                    const r = {...entrada, id: PB.novoId(), proprietarioLocalId: dono, criadoEm: agora, atualizadoEm: agora, revisao: 1};
                    PB.validar(tipo, r);
                    await verificarReferencias(t, tipo, r, null);
                    return persistir(t, tipo, r, 'criar');
                };
                if (mapa) {
                    await validarContexto(t, mapa);
                    exigir(mapa.cenarioOficialId === p.cenarioOficialId && mapa.codigoLivro === p.codigoLivro && mapa.geometria === p.geometria, 'Geometria ou livro do contexto diverge; migração explícita necessária');
                } else {
                    const livros = await req(t.objectStore('livros').index('proprietario').getAll(dono));
                    const candidatosLivro = livros.filter(l => canonico(l.codigo) === p.codigoLivro);
                    exigir(candidatosLivro.length <= 1, 'Livros duplicados: contexto não pode ser escolhido automaticamente');
                    const livro = candidatosLivro[0] || await criar('livros', {nome: d.nomeLivro, codigo: p.codigoLivro});
                    const cenarios = await req(t.objectStore('cenarios').index('proprietario').getAll(dono));
                    const candidatos = cenarios.filter(c => c.livroId === livro.id && c.imagem === d.imagem);
                    exigir(candidatos.length <= 1, 'Cenários duplicados: mapeamento ambíguo');
                    if (!candidatos.length) exigir(!cenarios.some(c => c.livroId === livro.id && nomeComparavel(c.nome) === nomeComparavel(`Cenário de ${d.nomeLivro}`)), 'Cenário existente sem imagem correspondente; confirmação de mapeamento necessária');
                    const cenario = candidatos[0] || await criar('cenarios', {livroId: livro.id, nome: `Cenário de ${d.nomeLivro}`, imagem: d.imagem});
                    const mapas = await req(meta.getAll());
                    exigir(!mapas.some(m => m.tipo === 'contexto-cenario' && m.proprietarioLocalId === dono && m.cenarioId === cenario.id && m.cenarioOficialId !== p.cenarioOficialId), 'Cenário pessoal já mapeado para outro cenário oficial');
                    mapa = {id: contextoId, tipo: 'contexto-cenario', proprietarioLocalId: dono,
                        cenarioOficialId: p.cenarioOficialId, geometria: p.geometria, codigoLivro: p.codigoLivro,
                        livroId: livro.id, cenarioId: cenario.id, imagem: d.imagem, regioes: [], criadoEm: agora};
                }
                let vinculoRegiao = mapa.regioes.find(r => r.oficialId === d.regiao.id);
                if (!vinculoRegiao) {
                    const regioes = await req(t.objectStore('regioes').index('proprietario').getAll(dono));
                    const candidatos = regioes.filter(r => r.cenarioId === mapa.cenarioId &&
                        (nomeComparavel(r.nome) === nomeComparavel(d.regiao.nome) || posicaoIgual(r.posicao, d.regiao.posicao)));
                    exigir(candidatos.length <= 1, 'Regiões duplicadas: mapeamento ambíguo');
                    const existente = candidatos[0];
                    if (existente) exigir(nomeComparavel(existente.nome) === nomeComparavel(d.regiao.nome) && posicaoIgual(existente.posicao, d.regiao.posicao), 'Região existente diverge da geometria oficial; confirmação de mapeamento necessária');
                    const regiao = existente || await criar('regioes', {cenarioId: mapa.cenarioId, nome: d.regiao.nome, posicao: d.regiao.posicao});
                    exigir(!mapa.regioes.some(r => r.pessoalId === regiao.id), 'Região pessoal já mapeada');
                    vinculoRegiao = {oficialId: d.regiao.id, pessoalId: regiao.id, posicao: d.regiao.posicao};
                    mapa.regioes.push(vinculoRegiao);
                }
                const objetos = await req(t.objectStore('objetos').index('proprietario').getAll(dono));
                const repetidos = objetos.filter(o => o.cenarioId === mapa.cenarioId && o.regiaoId === vinculoRegiao.pessoalId &&
                    nomeComparavel(o.nome) === nomeComparavel(p.nome) && posicaoIgual(o.posicao, p.posicao));
                exigir(repetidos.length <= 1, 'Objetos duplicados: cadastro ambíguo');
                const objeto = repetidos[0] || await criar('objetos', {cenarioId: mapa.cenarioId, regiaoId: vinculoRegiao.pessoalId, nome: p.nome, posicao: p.posicao});
                await req(meta.put(mapa));
                await req(meta.add({id: reciboId, tipo: 'cadastro-objeto', proprietarioLocalId: dono,
                    contextoId, objetoId: objeto.id, assinatura: d.assinatura, criadoEm: agora}));
                return objeto;
            });
        }
        function consultarObjetosPessoais(cenarioOficialId) {
            exigir(textoValido(cenarioOficialId), 'Identificador de cenário obrigatório');
            return tx(db, ['metadados', 'livros', 'cenarios', 'regioes', 'objetos'], 'readonly', async t => {
                const mapa = await req(t.objectStore('metadados').get(chave('contexto-cenario', cenarioOficialId)));
                if (!mapa) return [];
                exigir(mapa.cenarioOficialId === cenarioOficialId, 'Mapeamento oficial inconsistente');
                await validarContexto(t, mapa);
                const objetos = (await req(t.objectStore('objetos').index('proprietario').getAll(dono))).filter(o => o.cenarioId === mapa.cenarioId);
                for (const o of objetos) {
                    PB.validar('objetos', o);
                    if (o.regiaoId) exigir((await ler(t, 'regioes', o.regiaoId)).cenarioId === mapa.cenarioId, 'Objeto aponta para região de outro cenário');
                }
                return objetos;
            });
        }
        return Object.freeze({
            proprietarioLocalId: dono,
            cadastrarObjetoPessoal,
            consultarObjetosPessoais,
            criar: (tipo, dados) => gravar(tipo, null, dados),
            editar(tipo, id, dados) {
                exigir(typeof id === 'string' && id.trim().length > 0, 'Identificador de edição obrigatório');
                return gravar(tipo, id, dados);
            },
            vincular: dados => gravar('vinculos', null, dados),
            // Consulta pelo código dentro da mesma transação que escreve: segura entre abas.
            definirFavorito(codigo, nome, favorito) {
                exigir(typeof codigo === 'string' && codigo.trim() && typeof nome === 'string' && nome.trim(), 'Livro inválido');
                exigir(typeof favorito === 'boolean', 'Favorito deve ser booleano');
                const canonico = codigo.trim().toUpperCase();
                return tx(db, ['livros', 'operacoes'], 'readwrite', async t => {
                    const livros = await req(t.objectStore('livros').index('proprietario').getAll(dono));
                    const encontrados = livros.filter(l => l.codigo.trim().toUpperCase() === canonico);
                    exigir(encontrados.length <= 1, 'Há livros duplicados neste acervo; nenhuma alteração foi feita');
                    const anterior = encontrados[0];
                    if (anterior && Boolean(anterior.favorito) === favorito) return anterior;
                    // Remover favorito inexistente é uma operação sem efeito, não um cadastro.
                    if (!anterior && !favorito) return null;
                    const agora = new Date().toISOString();
                    const r = {...anterior, id: anterior?.id || PB.novoId(), proprietarioLocalId: dono,
                        nome: anterior?.nome || nome.trim(), codigo: anterior?.codigo || canonico, favorito,
                        criadoEm: anterior?.criadoEm || agora, atualizadoEm: agora, revisao: (anterior?.revisao || 0) + 1};
                    PB.validar('livros', r);
                    return persistir(t, 'livros', r, anterior ? 'editar' : 'criar');
                });
            },
            obter(tipo, id) { tipoValido(tipo); return tx(db, [tipo], 'readonly', t => ler(t, tipo, id)); },
            listar(tipo) { tipoValido(tipo); return tx(db, [tipo], 'readonly', t => req(t.objectStore(tipo).index('proprietario').getAll(dono))); },
            operacoesPendentes: () => tx(db, ['operacoes'], 'readonly', t => req(t.objectStore('operacoes').index('proprietario').getAll(dono))),
            fechar: () => db.close()
        });
    }
    PB.criarRepositorio = criarRepositorio;
})();
