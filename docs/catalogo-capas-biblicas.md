# Catálogo automático de capas bíblicas

As capas da Biblioteca são descobertas automaticamente no servidor de desenvolvimento e durante a publicação, sem cadastro manual de caminhos e sem testar 66 URLs no navegador. O catálogo não cadastra livros pessoais, não muda disponibilidade de conteúdo e não cria slides na Home. Os cinco slides atuais são mantidos, conforme escolha do responsável.

## Uso local sem build manual

Abrir **http://127.0.0.1:5501/** com o servidor `scripts/servir-local.cjs` ativo. Ele observa `livros-menu`, valida os arquivos e oferece o catálogo atualizado em memória. Ao adicionar uma capa válida, avisa a página por eventos: a Biblioteca aberta se atualiza preservando busca, favorito e rolagem. Não é necessário build nem recarregar a página.

A tarefa `.vscode/tasks.json` inicia o servidor ao abrir esta pasta no VS Code. Na primeira utilização, o VS Code pode exigir que o usuário permita tarefas automáticas. Também é possível iniciar pela tarefa **Palácio Mental: servidor com capas automáticas** ou por `node scripts/servir-local.cjs`. O servidor escuta somente na interface local do computador, sem dependências novas.

Um servidor estático comum ou a abertura por `file://` não observa a pasta. Para atualização local imediata, usar o endereço acima. O observador mantém o último catálogo válido enquanto um arquivo está sendo copiado ou quando encontra um arquivo inválido.

## Adicionar uma capa

1. Salvar um WebP **estático real** em `assets/imagens/palacio-biblico/livros-menu/`.
2. Usar `NN-livro.webp`: ordem canônica de dois dígitos, nome da lista de `assets/palacio-biblico/livros-biblicos.js`, minúsculas, sem acentos, espaços substituídos por hífen. Exemplos: `03-levitico.webp`, `09-1-samuel.webp`, `32-jonas.webp`.
3. No servidor local automático, aguardar a detecção da pasta; a página aberta recebe a atualização sem build.
4. Para produção, a publicação já executa `scripts/build.cjs` pelo GitHub Actions. Não é necessário build manual, mas a imagem precisa estar incluída na publicação autorizada. Arquivos locais/não rastreados não chegam ao GitHub Pages automaticamente.

O gerador valida nome, ordem, correspondência com um dos 66 livros e estrutura do contêiner WebP (assinatura, tamanho, blocos e quadro com dimensões válidas). Arquivos falsos, truncados, animados ou com nomes incorretos interrompem o build com erro, sem renomear, alterar ou excluir os originais. A leitura estrutural não substitui a decodificação visual; conferir as novas imagens no navegador.

## Arquitetura

- `livros-biblicos.js`: única lista canônica dos 66 livros, compartilhada entre Node e navegador.
- `scripts/gerar-catalogo-capas.cjs`: examina a pasta e gera `assets/palacio-biblico/capas-biblicas.js`. Arquivos ocultos são ignorados; demais entradas devem ser capas válidas.
- `capas-biblicas.js`: mapa estático gerado por código do livro. Não editar manualmente.
- `capas-biblicas.json`: catálogo consultado pelo app ao abrir Home/Biblioteca ou voltar à aba. Uma requisição pequena compartilhada, no máximo a cada 15 segundos por interações; sem polling contínuo. Em caso de falha, o app mantém o catálogo conhecido.
- `atualizar-capas.js`: revalida o catálogo e atualiza o índice em memória. Somente no servidor local, abre conexão de eventos indicada pelo próprio servidor; produção não abre essa conexão.
- `indice-biblico.js`: combina lista canônica, catálogo de capas e metadados existentes. Sem capa, `imagem` continua `null`.
- Biblioteca e carrossel leem `PB.indiceBiblico` e recebem avisos de atualização do catálogo, sem sondagens individuais de URL ou mudanças de layout. A lista de cinco slides continua explicitamente selecionada na Home.

Os caminhos permanecem relativos à página do aplicativo, compatíveis com a subpasta `/palacio-mental/` do GitHub Pages. O JSON é resolvido em relação ao arquivo de script. Não dependem de listagem de diretório no servidor. Lista e catálogo são carregados antes de `indice-biblico.js`; a atualização dinâmica é carregada depois dele.

O PWA publicado não pode observar a pasta do computador. Novas imagens e catálogo precisam ser publicados antes de serem reconhecidos naquele endereço. Após uma publicação, o catálogo é revalidado ao entrar no módulo ou retornar à aba; não há promessa de atualização instantânea de uma aba de produção que permaneça aberta sem interação. Não foi adicionado backend nem serviço externo.

## Cache e funcionamento offline

O Service Worker mantém a estratégia **network-first** e o nome de cache vigente. Lista canônica, catálogo JS/JSON e o atualizador entram no precache para permitir resolução offline. O canal contínuo `/__capas/eventos` do servidor local passa diretamente à rede, sem ser armazenado em cache. Foram removidas somente as entradas comprovadamente ausentes `home-palacio-biblico/dfgt.webp` e `home-palacio-biblico/biblia-medalhao.webp`; nenhum arquivo foi apagado.

As sete capas já incluídas no precache permanecem. Novas capas não são acrescentadas automaticamente ao precache: carregam quando solicitadas e são guardadas pelo mecanismo dinâmico existente. Isso evita elevar o download inicial a cada imagem adicionada.

- Capa presente no cache: disponível offline.
- Capa nova nunca carregada/armazenada: ícone genérico offline, com nova tentativa em renderização posterior online.
- Livro sem arquivo de capa: ícone genérico sem requisitar caminho inexistente.

Cobertura offline não significa que todas as imagens do aplicativo estejam disponíveis. Não limpar Cache Storage, IndexedDB ou preferências para aplicar esta mudança.

## Verificação

`node tests/catalogo-capas.cjs` testa descoberta de arquivo novo, nomes, ordem, extensão, capitalização, WebP falso/truncado/animado, determinismo do catálogo e preservação do contrato dos 66 livros. As imagens de teste são cópias em pastas temporárias, sem alterar originais.

`node tests/capas-automaticas.cjs` testa observação da pasta, aviso por evento, descoberta de Atos sem build, catálogo em memória, preservação durante cópia incompleta e proteção de rotas locais.

Na etapa de automação sem build manual, Atos foi testado com a página aberta, sem build e sem recarga. As sete capas já existentes no precache foram mantidas; as demais permanecem sob demanda. O catálogo acompanha os arquivos da pasta, portanto a quantidade varia conforme novas imagens são adicionadas. Custo de desempenho estimado baixo: validação de arquivos no servidor/build, uma consulta pequena compartilhada no navegador e eventos somente em desenvolvimento. Métricas de CPU, bateria e fluidez em aparelho físico não foram medidas.

Evidências do catálogo inicial em `artifacts/catalogo-capas/` e da automação ao vivo em `artifacts/capas-automaticas/`: build, testes, resultados do navegador e capturas. A implementação ainda depende de validação do responsável; sem commit, push, deploy ou alteração de versão.
