# Teste Black Gradient V9 — avaliação visual pendente

Base conferida: V3.4, commit 4c872722125fa702787728615c5b290d45524309. Regras, estado, decisões e documentação do módulo consultados no Notion antes da edição. Nenhuma escrita no Notion, commit, push ou publicação.

## Alteração e reversão

- `assets/palacio-biblico/biblioteca.js`, linhas 93–94: comentário do teste e atribuição da classe `pb-card-black-v9` exclusivamente para GEN, EXO e LEV.
- `assets/palacio-biblico/biblioteca.css`, linhas 97–106: bloco entre `INICIO TESTE BLACK GRADIENT V9` e `FIM TESTE BLACK GRADIENT V9`. Camada estática em ` .pb-card-black-v9 .pb-abrir-livro::before`, com recorte diagonal limitado à área de conteúdo. A regra geral do cartão e seu fundo atrás da fotografia permanecem intactos.

Para desativar imediatamente, remover apenas a linha 94 do JavaScript e recarregar. Para retirar todo o teste, remover também o comentário da linha 93 e o bloco CSS completo entre os marcadores. Não usar restauração global do Git: há modificações locais anteriores preservadas.

Os arquivos desta pasta são evidências locais e não são necessários ao aplicativo. Podem ser arquivados separadamente. Nenhum dado pessoal foi migrado ou limpo.

## Verificações executadas

Chrome headless com emulação móvel em 360×800, 412×924 e 430×932, perfil de teste separado e Service Worker ignorado no teste. Resultado em `results.json`; capturas antes/depois nos respectivos PNGs.

- 66 cartões renderizados; classe experimental somente nos três livros solicitados.
- Estilos computados dos outros 63 cartões e dos quatro filtros idênticos ao remover a classe em tempo de execução; dimensões dos 66 cartões preservadas.
- Comparação de pixels de um recorte da fotografia de Gênesis antes/depois sem diferenças. Imagens de Gênesis e Êxodo carregadas; placeholder preexistente de Levítico preservado. Inspeção visual das capturas de 360 e 430 px.
- Toques nos três cartões preservam seu estado atual de preparação; favoritos dos três livros alternam, aparecem no filtro Favoritos e persistem após recarga. Dados criados exclusivamente no perfil de teste.
- Sem overflow horizontal, exceções JavaScript ou chamadas console.error durante a execução final.
- `git diff --check` aprovado.

Não comprova teste em aparelho físico, offline ou desempenho medido. Aprovação estética depende do usuário. Nenhuma conclusão registrada no Notion; considerar documentação apenas após avaliação visual e autorização correspondente.
