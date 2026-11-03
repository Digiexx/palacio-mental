(() => {
    'use strict';
    const congelar = valor => {
        Object.values(valor).forEach(v => { if (v && typeof v === 'object') congelar(v); });
        return Object.freeze(valor);
    };
    // Geometria exclusiva da imagem revisada (SHA-256 em docs/palacio-biblico-dados.md).
    // IDs oficiais não são UUIDs pessoais. Explorar este catálogo não cria registros.
    globalThis.PalacioBiblico.cenarioJoao = congelar({
        id: 'joao-cenario-01',
        imagem: 'assets/imagens/palacio-biblico/joao/cenario-01.webp',
        largura: 1672, altura: 941, ampliacaoMaxima: 3,
        regioes: [
            {
                id: 'joao-cenario-01-regiao-casa', nome: 'Casa', ampliacao: 2,
                enquadramento: {x: 0, y: 0.10, largura: 0.43, altura: 0.80},
                toque: {x: 0, y: 0, largura: 0.30, altura: 1},
                expansaoFutura: 'interior-casa'
            },
            {
                id: 'joao-cenario-01-regiao-jardim', nome: 'Jardim', ampliacao: 2.2,
                enquadramento: {x: 0.29, y: 0.03, largura: 0.42, altura: 0.72},
                toque: {x: 0.30, y: 0, largura: 0.40, altura: 1},
                expansaoFutura: 'jardim-conectado'
            },
            {
                id: 'joao-cenario-01-regiao-porto', nome: 'Porto/Barco', ampliacao: 2.5,
                enquadramento: {x: 0.70, y: 0.06, largura: 0.30, altura: 0.84},
                toque: {x: 0.70, y: 0, largura: 0.30, altura: 1},
                expansaoFutura: 'interior-barco'
            }
        ],
        objetos: [
            {id: 'joao-cenario-01-objeto-porta', nome: 'Porta da casa', regiaoId: 'joao-cenario-01-regiao-casa',
                toque: {x: 0.105, y: 0.285, largura: 0.11, altura: 0.32}, expansaoFutura: 'interior-casa'},
            {id: 'joao-cenario-01-objeto-oliveira', nome: 'Oliveira', regiaoId: 'joao-cenario-01-regiao-jardim',
                toque: {x: 0.468, y: 0.11, largura: 0.20, altura: 0.36}},
            {id: 'joao-cenario-01-objeto-poco', nome: 'Poço', regiaoId: 'joao-cenario-01-regiao-jardim',
                toque: {x: 0.302, y: 0.32, largura: 0.143, altura: 0.365}},
            {id: 'joao-cenario-01-objeto-barco', nome: 'Barco', regiaoId: 'joao-cenario-01-regiao-porto',
                toque: {x: 0.82, y: 0.07, largura: 0.18, altura: 0.47}, expansaoFutura: 'interior-barco'}
        ]
    });
})();
