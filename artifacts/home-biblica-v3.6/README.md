# Home do Palácio Bíblico — proposta visual V3.6

Base: HEAD d47bbc235c10c9429e7f27ee05ea3d1f4ccb3a8b, V3.5 publicada. Sem alteração oficial de versão, commit, push, deploy ou escrita no Notion.

## Escopo

- Editados somente assets/palacio-biblico/home-biblica.js e home-biblica.css na aplicação: 103 inserções e 69 remoções.
- Topo com os dois arquivos originais de home-topo, subtítulo HTML, menu funcional e notificações/perfil claramente indisponíveis.
- Cinco slides mantidos, João central inicialmente, navegação manual, tipografia serifada e vizinhos parcialmente visíveis.
- Cartões com ícones preenchidos bronze; Jornada compacta mantendo a leitura dos dados reais; menu inferior com cinco itens e Livros dentro da barra.
- Biblioteca, catálogo, imagens originais, persistência e outras telas sem alterações; hashes comparados com o estado inicial. Todas as alterações e exclusões locais anteriores preservadas. Nada preparado no índice Git.

## Verificação executada

Chrome com emulação mobile em 360×800, 412×924 e 430×932: carregamento dos ativos, centralização de João, cinco itens do menu, ausência de rolagem horizontal, entrada/saída, abertura de João, pesquisa, favoritos e contagem real na Jornada, rolagem e movimento reduzido. Setas nas três larguras; gesto de toque e teclado em 360 px. Nenhum erro de console observado.

Sintaxe JavaScript, hashes dos arquivos protegidos e git diff --check aprovados. Capturas e resultados detalhados nesta pasta. Build não executado nesta etapa visual; não houve mudança no processo de build ou catálogo.

## Limitações

- Testes em emulação, sem medição em aparelho físico ou teste offline nesta etapa. Service Worker preservado.
- PNG original da marca tem cerca de 1,2 MB; impacto de carregamento estimado como médio, sem benchmark. Imagens do topo carregadas ao entrar no módulo.
- Sem retomada persistida verificável, Continuar Estudando mantém estado vazio e acesso à Biblioteca. Destinos inexistentes continuam indisponíveis.
- Notion ainda documenta V3.4; a base local V3.5 foi confirmada pelo Git. Eventual atualização de Estado de Implementação e Projeto e Protótipos deve ocorrer apenas após aprovação visual e autorização de registro.

Aguardando avaliação visual. As cópias before.js e before.css guardam o estado anterior destes dois arquivos para comparação; não substituir arquivos integralmente caso existam edições posteriores.
