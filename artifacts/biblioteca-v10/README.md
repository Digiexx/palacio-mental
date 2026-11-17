# Biblioteca Bíblica — refinamento V10 para avaliação

Base Git: V3.4, 4c87272. Notion consultado antes das alterações: Regras de Trabalho, Decisões Aprovadas, Estado de Implementação e Palácio Bíblico — Projeto e Protótipos. V10 identifica este refinamento local; não é uma nova versão publicada.

## Escopo aplicado

- `biblioteca.css`: textos brancos nos quatro filtros, inclusive selecionados e desabilitados; preenchimentos e bordas anteriores mantidos. Placeholder cinza #8c8985, Arial regular; texto e demais estilos da busca preservados.
- A camada recortada do V9 foi generalizada para `.pb-card .pb-abrir-livro::before`, sem duplicar os gradientes nem aplicar efeitos sobre as imagens. Removida a atribuição condicional da classe experimental no JavaScript.
- Subtítulos com `visibility: hidden`: o espaço permanece no layout para não deslocar os nomes. Condições reais de disponibilidade, atributos acessíveis e ações existentes permanecem intactos.
- Chevron de fonte substituído por SVG de geometria centrada, aproximadamente 8×12 px de desenho, no círculo existente de 28×28 px. Nenhuma alteração na área clicável do botão do livro.
- Imagens, favoritos, dados, animações, estrutura da lista, bottom sheet e Black Toast preservados.

## Evidências executadas

Chrome headless em perfil isolado, com emulação de toque em 360×800, 412×924 e 430×932. `results.json` contém o resultado funcional; `visual-final.json` e capturas `*-v10.png` contêm a conferência visual final. Arquivos `before.css` e `before.js` preservam o estado local V9 anterior a esta etapa, para comparação.

- 66 cartões com a camada de gradientes.
- Comparação dos estilos computados antes/depois: backgrounds, bordas e dimensões dos filtros, posição vertical dos nomes, dimensões dos cartões, estilos das imagens, bottom sheet e toast preservados. Propriedades derivadas da cor do texto foram excluídas da comparação dos estilos.
- Textos dos quatro filtros brancos, inclusive no filtro Favoritos selecionado; Em treino e Concluídos continuam desabilitados.
- Busca por `joao` encontra os quatro livros correspondentes; botão de limpeza funciona.
- Favorito de Gênesis alterna, aparece no filtro, mostra o toast e persiste após recarga; favorito de teste removido ao final. Somente dados do perfil de teste foram usados.
- Gênesis continua sem abrir página; João e Filipenses abrem e voltam à Biblioteca. Nenhuma condição de disponibilidade foi alterada.
- Rolagem até o fim e fechamento do sheet funcionam; sem rolagem horizontal.
- SVG centrado horizontal e verticalmente no círculo, com diferença de centros de 0 px na emulação.
- Sem exceções JavaScript ou chamadas console.error na execução final. `git diff --check` sem erros.

Não foram testados aparelho físico, offline ou desempenho medido. A aprovação visual permanece pendente do usuário. Sem commit, push, deploy ou escrita no Notion.

Após avaliação e autorização futura, o conteúdo útil para continuidade seria registrar os cinco ajustes e seus testes no Estado de Implementação, com detalhes visuais no documento do módulo; motivo: distinguir o V9 experimental do V10 aprovado. Nenhum registro proposto aqui foi gravado.
