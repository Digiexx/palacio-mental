(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    // Índice de navegação; não cadastra livros ou progresso no banco pessoal.
    const livros = PB.livrosBiblicos;
    PB.recriarIndiceBiblico = () => PB.indiceBiblico = Object.freeze(livros.map(([codigo, nome], indice) => {
        const existente = PB.catalogo.find(livro => livro.codigo === codigo);
        const slug = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
        return Object.freeze({
            codigo, nome, ordem: indice + 1, testamento: indice < 39 ? 'antigo' : 'novo',
            disponivel: Boolean(existente), imagem: PB.capasBiblicas[codigo] || null,
            emPreparacao: Boolean(existente?.emPreparacao),
            // Convenção futura de nomes, nunca usada como src sem arquivo confirmado.
            arquivoImagemFuturo: `${String(indice + 1).padStart(2, '0')}-${slug}.webp`,
            nomesBusca: codigo === 'SNG' ? 'Cantares Cântico dos Cânticos Cânticos' : nome
        });
    }));
    PB.recriarIndiceBiblico();
})();
