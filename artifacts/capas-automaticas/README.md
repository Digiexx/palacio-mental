# Capas automáticas sem build manual — avaliação local

Regras e Estado de Implementação consultados no Notion. HEAD conferido: `4c87272`, V3.4. Sem commit, push, deploy, alteração de versão, limpeza de arquivos ou escrita no Notion. Imagens anteriores preservadas por SHA-256. O responsável confirmou que os cinco slides atuais devem permanecer; Atos não é acrescentado como novo slide.

## Uso imediato

Servidor ativo em **http://127.0.0.1:5501/**. Abrir esse endereço para ter reconhecimento local automático. Ao adicionar uma capa válida em `livros-menu`, a pasta é observada, o catálogo é revalidado e a Biblioteca aberta recebe o novo catálogo por evento. Sem build, recarga ou 66 requisições de teste.

`.vscode/tasks.json` configura a inicialização do servidor ao abrir a pasta no VS Code; a primeira execução pode exigir permissão nativa do VS Code para tarefas automáticas. A tarefa também pode ser iniciada pelo nome **Palácio Mental: servidor com capas automáticas**. Alternativa: `node scripts/servir-local.cjs`. Servidor restrito a 127.0.0.1. Um servidor estático diferente ou `file://` não oferece observação automática da pasta.

## Arquivos desta etapa

- Novos: `scripts/servir-local.cjs`, `.vscode/tasks.json`, `assets/palacio-biblico/atualizar-capas.js`, `assets/palacio-biblico/capas-biblicas.json`, `tests/capas-automaticas.cjs`.
- Ajustados: gerador e catálogo JS, `indice-biblico.js`, `biblioteca.js`, `home-biblica.js`, `index.html`, `service-worker.js`, testes do catálogo e documentação.
- CSS/layout, lista dos 66 livros, destinos, dados pessoais e cinco slides preservados.

O servidor mantém o catálogo atual em memória e serve JS/JSON diretamente. Uma cópia incompleta ou arquivo inválido não substitui o último catálogo válido. A tarefa não roda build e não reescreve arquivos de imagem.

No navegador, uma consulta pequena ao JSON é compartilhada entre Home e Biblioteca. Revalidação ao entrar no módulo/retornar à aba, com intervalo mínimo de 15 segundos entre interações; não há polling contínuo. Eventos locais podem forçar atualização imediata. O canal de eventos existe somente no servidor de desenvolvimento, é autorizado por cabeçalho de mesma origem e não entra no cache do Service Worker. Em produção, não há EventSource nem conexão de eventos.

## Produção/PWA: limite necessário

GitHub Pages não observa a pasta do computador. Arquivos novos precisam integrar uma publicação autorizada; o workflow existente gera o catálogo nessa publicação, dispensando build manual. Depois de publicados, o app revalida um único JSON ao entrar no módulo ou voltar à aba. Sem publicação não é possível alterar o PWA remoto.

O Service Worker mantém cache V3.4 e network-first; catálogo JSON e atualizador são precacheados. Capas continuam sob demanda, além das sete já precacheadas. Offline, o app usa o catálogo conhecido/cacheado e capas previamente armazenadas; imagens não armazenadas mantêm fallback genérico. Sem backend novo ou limpeza de armazenamento.

## Testes executados

- Em uma cópia temporária do site, iniciar sem `44-atos.webp`, abrir Biblioteca, pesquisar `atos` e favoritar. Copiar o arquivo real de Atos para essa pasta de teste, com página aberta: capa apareceu automaticamente **sem build e sem reload**. Busca e favorito permaneceram. O catálogo JS em disco não foi modificado pelo teste, comprovando que a descoberta veio do servidor/evento.
- Capturas em 360×800, 412×924 e 430×932. Cinco slides mantidos, João centralizado e catálogo de Atos compartilhado com a Home.
- Teste permanente do servidor: evento de alteração, catálogo virtual sem arquivo gerado, manutenção do catálogo durante cópia inválida, bloqueio de pastas privadas/traversal e métodos não suportados.
- Teste do Service Worker: fluxo de eventos é ignorado pelo cache; requisições normais continuam gerenciadas.
- Testes do gerador aprovados, atualizados para aceitar que novos livros ganhem capa sem invalidar uma suposição fixa sobre Rute permanecer sem imagem.
- Produção simulada em `/palacio-mental/`, com **catálogo JS antigo sem Atos** e JSON novo: Atos foi reconhecido pelo JSON; após carregar a capa e favoritar, recarga offline com SW real manteve capa/favorito. Nenhuma conexão de eventos em produção.
- Regressão online/offline da Biblioteca: Jonas, demais capas, fallback, busca, favoritos e carrossel aprovados com SW real.
- Sintaxe, hashes de todas as imagens presentes no início, tarefa automática, build final em pasta temporária e `git diff --check` aprovados. Sem exceções JavaScript ou console.error nas execuções finais.

Limites: emulação de Chrome, sem aparelho físico ou medição de bateria/CPU. Custo estimado baixo: validação no servidor/build e uma consulta pequena compartilhada. Não foi testada substituição visual ao vivo de uma imagem com o mesmo nome já carregada; o escopo validado é adição de novas capas e atualização do catálogo.

Evidências: `browser-results.json`, `production-results.json`, `server-tests.txt`, `validation-output.txt`, `build-output.txt` e PNGs desta pasta.

Registro futuro sugerido, somente após validação/autorização: Estado de Implementação e Palácio Bíblico — Projeto e Protótipos, com uso do servidor local, cinco slides preservados e limites da produção/offline. Motivo: substituir a orientação anterior de build manual por um procedimento verificável. Nada foi gravado no Notion.
