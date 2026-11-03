/* Camada isolada: carregar modelo.js, db.js e repositorio.js nessa ordem. */
(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico = {};
    const campos = {
        livros: ['nome', 'codigo'],
        cenarios: ['livroId', 'nome', 'imagem'],
        regioes: ['cenarioId', 'nome', 'posicao'],
        objetos: ['cenarioId', 'regiaoId', 'nome', 'posicao', 'imagem'],
        versiculos: ['livroId', 'capitulo', 'inicio', 'fim', 'traducao', 'texto', 'fonte'],
        associacoes: ['versiculoId', 'descricao'],
        vinculos: ['objetoId', 'versiculoId', 'associacaoId'],
        flashcards: ['vinculoId', 'tipo'],
        revisoes: ['versiculoId', 'flashcardId', 'resultado', 'ocorridoEm']
    };
    function exigir(condicao, mensagem) {
        if (!condicao) throw new Error(mensagem);
    }
    function texto(valor) { return typeof valor === 'string' && valor.trim().length > 0; }
    function posicao(p) {
        exigir(p && Object.keys(p).every(k => ['x', 'y', 'largura', 'altura'].includes(k)), 'Posição inválida');
        for (const k of ['x', 'y', 'largura', 'altura']) {
            exigir(Number.isFinite(p[k]) && p[k] >= 0 && p[k] <= 1, 'Coordenadas devem estar entre 0 e 1');
        }
        exigir(p.largura > 0 && p.altura > 0 && p.x + p.largura <= 1 && p.y + p.altura <= 1, 'Área fora do cenário');
    }
    function validar(tipo, r) {
        exigir(Object.hasOwn(campos, tipo), 'Tipo desconhecido');
        exigir(texto(r.id) && texto(r.proprietarioLocalId), 'Identidade obrigatória');
        for (const k of campos[tipo]) {
            if (['imagem', 'regiaoId', 'fim', 'texto', 'fonte', 'flashcardId'].includes(k)) continue;
            if (k === 'posicao') posicao(r[k]);
            else if (['capitulo', 'inicio'].includes(k)) exigir(Number.isInteger(r[k]) && r[k] > 0, 'Referência inválida');
            else exigir(texto(r[k]), `Campo obrigatório: ${k}`);
        }
        for (const k of ['imagem', 'regiaoId', 'texto', 'fonte', 'flashcardId']) {
            if (r[k] !== undefined && r[k] !== null) exigir(texto(r[k]), `Campo inválido: ${k}`);
        }
        if (tipo === 'versiculos') {
            exigir(r.fim === undefined || (Number.isInteger(r.fim) && r.fim >= r.inicio), 'Intervalo inválido');
            exigir(!r.texto || texto(r.fonte), 'Texto exige fonte informada e autorizada pelo usuário');
        }
        if (tipo === 'flashcards') exigir(['objeto-referencia', 'referencia-objeto', 'referencia-texto', 'lacuna'].includes(r.tipo), 'Tipo de flashcard inválido');
        if (tipo === 'revisoes') {
            exigir(['acerto', 'erro', 'nao-lembrou'].includes(r.resultado), 'Resultado inválido');
            exigir(Number.isFinite(Date.parse(r.ocorridoEm)), 'Data inválida');
        }
    }
    function dadosPermitidos(tipo, dados) {
        exigir(Object.hasOwn(campos, tipo), 'Tipo desconhecido');
        exigir(dados && Object.getPrototypeOf(dados) === Object.prototype, 'Dados inválidos');
        exigir(Object.keys(dados).every(k => campos[tipo].includes(k)), 'Campo desconhecido ou identidade protegida');
        return structuredClone(dados);
    }
    Object.assign(PB, {campos, exigir, validar, dadosPermitidos,
        novoId: () => crypto.randomUUID(), tipos: Object.freeze(Object.keys(campos))});
})();
