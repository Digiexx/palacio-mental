(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    // Índice de navegação; não cadastra livros ou progresso no banco pessoal.
    const livros = [
        ['GEN', 'Gênesis'], ['EXO', 'Êxodo'], ['LEV', 'Levítico'], ['NUM', 'Números'],
        ['DEU', 'Deuteronômio'], ['JOS', 'Josué'], ['JDG', 'Juízes'], ['RUT', 'Rute'],
        ['1SA', '1 Samuel'], ['2SA', '2 Samuel'], ['1KI', '1 Reis'], ['2KI', '2 Reis'],
        ['1CH', '1 Crônicas'], ['2CH', '2 Crônicas'], ['EZR', 'Esdras'], ['NEH', 'Neemias'],
        ['EST', 'Ester'], ['JOB', 'Jó'], ['PSA', 'Salmos'], ['PRO', 'Provérbios'],
        ['ECC', 'Eclesiastes'], ['SNG', 'Cantares'], ['ISA', 'Isaías'], ['JER', 'Jeremias'],
        ['LAM', 'Lamentações'], ['EZK', 'Ezequiel'], ['DAN', 'Daniel'], ['HOS', 'Oseias'],
        ['JOL', 'Joel'], ['AMO', 'Amós'], ['OBA', 'Obadias'], ['JON', 'Jonas'],
        ['MIC', 'Miqueias'], ['NAM', 'Naum'], ['HAB', 'Habacuque'], ['ZEP', 'Sofonias'],
        ['HAG', 'Ageu'], ['ZEC', 'Zacarias'], ['MAL', 'Malaquias'],
        ['MAT', 'Mateus'], ['MRK', 'Marcos'], ['LUK', 'Lucas'], ['JHN', 'João'],
        ['ACT', 'Atos'], ['ROM', 'Romanos'], ['1CO', '1 Coríntios'], ['2CO', '2 Coríntios'],
        ['GAL', 'Gálatas'], ['EPH', 'Efésios'], ['PHP', 'Filipenses'], ['COL', 'Colossenses'],
        ['1TH', '1 Tessalonicenses'], ['2TH', '2 Tessalonicenses'], ['1TI', '1 Timóteo'],
        ['2TI', '2 Timóteo'], ['TIT', 'Tito'], ['PHM', 'Filemom'], ['HEB', 'Hebreus'],
        ['JAS', 'Tiago'], ['1PE', '1 Pedro'], ['2PE', '2 Pedro'], ['1JN', '1 João'],
        ['2JN', '2 João'], ['3JN', '3 João'], ['JUD', 'Judas'], ['REV', 'Apocalipse']
    ];
    const imagensConfirmadas = {
        GEN: 'assets/imagens/palacio-biblico/livros-menu/01-genesis.webp',
        EXO: 'assets/imagens/palacio-biblico/livros-menu/02-exodo.webp',
        MAT: 'assets/imagens/palacio-biblico/livros-menu/40-mateus.webp',
        MRK: 'assets/imagens/palacio-biblico/livros-menu/41-marcos.webp',
        LUK: 'assets/imagens/palacio-biblico/livros-menu/42-lucas.webp',
        JHN: 'assets/imagens/palacio-biblico/livros-menu/43-joao.webp',
        PHP: 'assets/imagens/palacio-biblico/livros-menu/50-filipenses.webp'
    };
    PB.indiceBiblico = Object.freeze(livros.map(([codigo, nome], indice) => {
        const existente = PB.catalogo.find(livro => livro.codigo === codigo);
        const slug = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
        return Object.freeze({
            codigo, nome, ordem: indice + 1, testamento: indice < 39 ? 'antigo' : 'novo',
            disponivel: Boolean(existente), imagem: imagensConfirmadas[codigo] || null,
            emPreparacao: Boolean(existente?.emPreparacao),
            // Convenção futura de nomes, nunca usada como src sem arquivo confirmado.
            arquivoImagemFuturo: `${String(indice + 1).padStart(2, '0')}-${slug}.webp`,
            nomesBusca: codigo === 'SNG' ? 'Cantares Cântico dos Cânticos Cânticos' : nome
        });
    }));
})();
