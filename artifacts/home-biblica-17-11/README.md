# Home interna do Palácio Bíblico — implementação para avaliação

Referência: proposta de 17/11/2026 em Palácio Bíblico — Projeto e Protótipos, consultada junto de Leia Primeiro, Regras de Trabalho, Decisões Aprovadas, Estado de Implementação e Novo Design. Mockup local inspecionado: `assets/imagens/referencias/PALACIO BIBLICO/home escolhida/home que gostei.png`.

HEAD conferido antes/depois: V3.4, `4c872722125fa702787728615c5b290d45524309`. Nenhum commit, staging, push, deploy, alteração de versão, limpeza local ou escrita no Notion. Alterações locais anteriores preservadas. O usuário autorizou expressamente manter nesta etapa a marca atual (coroa e título em código), pois não havia logomarca separada do mockup.

## Arquivos do aplicativo alterados nesta etapa

- `assets/palacio-biblico/home-biblica.js`: nova composição com carrossel, Continuar Estudando, acessos rápidos, jornada e menu; consultas de dados reais e interação manual.
- `assets/palacio-biblico/home-biblica.css`: estilos exclusivos do módulo, menu fixo na área inferior da Home e conteúdo rolável independente.
- `assets/palacio-biblico/biblioteca.js`: exposição do método `abrirLivro` já existente no controlador, sem duplicar a navegação.
- `script.js`: uma propriedade de integração entrega à Home esse mesmo método.

Os arquivos de Biblioteca e o HTML já continham alterações de etapas anteriores. Elas foram mantidas. As cópias `before-home.js` e `before-home.css` registram a Home anterior; os demais arquivos desta pasta são material de implementação e evidências, sem referência no aplicativo.

## Resultado e limites funcionais

- Carrossel manual com cinco WebP verificados: Marcos, Lucas, João, Mateus e Filipenses. João começa centralizado, com Lucas e Mateus parcialmente visíveis. Os arquivos originais não foram alterados, movidos ou excluídos.
- A Home geral não dispara o carregamento das imagens do carrossel. Na entrada do módulo, somente o slide central e dois vizinhos recebem `src`; demais imagens carregam sob demanda por IntersectionObserver. Sem autoplay, temporizador de rotação ou configuração de slides.
- Gesto de toque, arraste com mouse, setas e teclado; movimento reduzido respeitado. Toque no vizinho apenas o centraliza; toque no central abre o destino existente. João e Filipenses abrem as páginas atuais. Mateus mantém a página provisória já existente. Marcos e Lucas sinalizam conteúdo indisponível, sem criar páginas.
- Não existe mecanismo verificável de retomada de treino bíblico. Continuar Estudando apresenta estado vazio e ação funcional Escolher livro → Biblioteca. Não há percentual, versículo fictício ou nova chave de progresso.
- Biblioteca abre o sheet existente. Treinar, Desafios e Progresso permanecem indisponíveis, pois não há telas bíblicas correspondentes.
- Sua Jornada Bíblica consulta livros, versículos e revisões do proprietário local. Mostra contagens de versículos no acervo, revisões válidas ligadas a esses versículos e livros favoritos. São contagens de acervo/atividade, sem alegação de memorização ou conquista. Sem registros, mostra estado vazio; erro de leitura oferece tentar novamente sem apagar dados.
- Menu: Home / Treinos / Explorar / Livros / Jogar / Favoritos / Ajustes. Sete itens dentro do menu; Livros circular elevado ao centro; somente Home selecionado. Livros e Favoritos têm destinos reais. Demais itens inexistentes desabilitados e identificados como indisponíveis.

## Verificações realizadas

- Chrome headless em perfil isolado, com emulação móvel e toque: 360×800, 412×924 e 430×932. Capturas `*-home.png`, `*-biblioteca.png`, `*-jornada.png` e `*-numerica.png`.
- João inicialmente centralizado, dois vizinhos visíveis, cinco imagens existentes e áreas de toque do menu de 48×62 px em 360 px (maiores nas outras larguras).
- Navegação por setas, toque, gesto real de arraste e teclado nas três larguras; arraste com mouse adicional em 360 px. Nenhuma abertura acidental durante os gestos. Sem rotação automática.
- Abertura de João e Filipenses, entrada no cenário original de João, retorno pelo histórico, entrada/saída do módulo e reentrada pela Home geral.
- Biblioteca com 66 cartões, busca `joao` com quatro resultados, foco/blur do placeholder, limpeza, filtros Todos/Favoritos, favoritos salvos e persistentes após recarga. Nenhuma mudança nos refinamentos anteriores da Biblioteca.
- Menu fixo enquanto o conteúdo rola; jornada final visível acima dele; somente Home ativo após fechar o sheet. Sem overflow horizontal.
- Jornada vazia e contagens testadas com registros reais criados exclusivamente no perfil de teste: favorito, versículo e revisão. Nenhum seed no aplicativo de produção. Retomada continua vazia por ausência de mecanismo existente.
- Movimento reduzido: transições do slide desativadas e navegação manual funcionando nas três larguras.
- Quatro suítes existentes: dados, cenário, editor e objetos — todas com zero falhas. Arquivos de teste usam bancos descartáveis próprios.
- Nenhuma exceção JavaScript ou console.error nas execuções finais. Resultados completos em `results.json` e `final-qa-results.json`.
- Sintaxe de Home, Biblioteca e script central válida. Cinco arquivos com assinatura RIFF/WEBP verdadeira. Build existente aprovado e preparado somente em pasta temporária. `git diff --check` sem erros.
- SHA-256 antes/depois confirma arquivos protegidos idênticos: CSS da Biblioteca, índice de livros, repositório, modelo de dados, cenário, home.js, home.css, index.html e Service Worker.

Impacto estimado baixo a médio devido às fotografias; sem medição de CPU, memória, bateria ou fluidez prolongada. Sem backdrop-filter ou animação decorativa contínua. Imagens iniciais somam cerca de 389 KiB, carregadas apenas ao abrir a Home bíblica. Os cinco slides totalizam cerca de 603 KiB. O teste de navegador não comprova comportamento em aparelho físico ou funcionamento offline.

## Continuidade — somente após avaliação

Registro futuro sugerido, sem gravação agora: atualizar o Estado de Implementação com o escopo, evidências e limites desta Home, e Palácio Bíblico — Projeto e Protótipos com as decisões de carrossel manual, sete itens, contagens reais e retomada indisponível. Motivo: distinguir a proposta de 17/11 do código efetivamente validado e preservar os destinos ainda pendentes. Aguardar avaliação visual e autorização específica antes de registrar ou publicar.
