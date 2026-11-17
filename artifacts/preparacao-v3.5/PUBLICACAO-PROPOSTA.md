# Preparação da publicação — V3.5 proposta

Base conferida: **V3.4**, commit `4c872722125fa702787728615c5b290d45524309`, branch main. Notion: Regras de Trabalho e Estado de Implementação consultados; resumo vigente indica V3.5 como próxima versão sugerida. Versão ainda não criada.

**Situação:** build e testes essenciais aprovados em cópia candidata. Sem staging, commit, push, deploy ou escrita no Notion. Arquivos locais preservados, inclusive exclusões e não rastreados. Esta é uma seleção para aprovação final.

## Seleção exata — 29 arquivos

### Código, configuração e geração — 16 arquivos

- `index.html` — modificado.
- `script.js` — modificado.
- `service-worker.js` — modificado.
- `scripts/build.cjs` — modificado.
- `scripts/gerar-catalogo-capas.cjs` — novo.
- `scripts/servir-local.cjs` — novo.
- `.vscode/tasks.json` — novo.
- `assets/palacio-biblico/biblioteca.css` — modificado.
- `assets/palacio-biblico/biblioteca.js` — modificado.
- `assets/palacio-biblico/home-biblica.css` — modificado.
- `assets/palacio-biblico/home-biblica.js` — modificado.
- `assets/palacio-biblico/indice-biblico.js` — modificado.
- `assets/palacio-biblico/livros-biblicos.js` — novo.
- `assets/palacio-biblico/capas-biblicas.js` — novo.
- `assets/palacio-biblico/capas-biblicas.json` — novo.
- `assets/palacio-biblico/atualizar-capas.js` — novo.

`scripts/servir-local.cjs` e `.vscode/tasks.json` preservam a automação local sem build manual. São parte do código-fonte selecionado, mas o build não os envia ao site. Os demais scripts/módulos dão suporte direto à Home, Biblioteca, catálogo e cache em produção.

### Capas novas/alteradas — 13 arquivos

- `assets/imagens/palacio-biblico/livros-menu/01-genesis.webp` — modificado; 164.986 bytes.
- `assets/imagens/palacio-biblico/livros-menu/03-levitico.webp` — novo; 50.034 bytes.
- `assets/imagens/palacio-biblico/livros-menu/04-numeros.webp` — novo; 75.698 bytes.
- `assets/imagens/palacio-biblico/livros-menu/08-rute.webp` — novo; 164.894 bytes.
- `assets/imagens/palacio-biblico/livros-menu/09-1-samuel.webp` — novo; 80.134 bytes.
- `assets/imagens/palacio-biblico/livros-menu/10-2-samuel.webp` — novo; 140.802 bytes.
- `assets/imagens/palacio-biblico/livros-menu/17-ester.webp` — novo; 168.268 bytes.
- `assets/imagens/palacio-biblico/livros-menu/18-jo.webp` — novo; 150.396 bytes.
- `assets/imagens/palacio-biblico/livros-menu/19-salmos.webp` — novo; 136.864 bytes.
- `assets/imagens/palacio-biblico/livros-menu/20-proverbios.webp` — novo; 162.286 bytes.
- `assets/imagens/palacio-biblico/livros-menu/32-jonas.webp` — novo; 112.184 bytes.
- `assets/imagens/palacio-biblico/livros-menu/44-atos.webp` — novo; 101.404 bytes.
- `assets/imagens/palacio-biblico/livros-menu/66-apocalipse.webp` — novo; 135.732 bytes.

As seis outras capas já existentes permanecem no último commit e não precisam ser incluídas novamente. O catálogo completo contém 19 capas. Gênesis é uma substituição local já existente, incluída para publicar o estado atual da Biblioteca, sem alterar o original durante a preparação.

## Fora da seleção

- Todas as exclusões locais, incluindo logo-branca.png, dfgt.webp, biblia-medalhao.webp, rascunho-teste.webp e referências. A cópia candidata mantém os arquivos do último commit; nada foi restaurado ou removido na pasta de trabalho.
- artifacts/, experimentos/, assets/imagens/referencias/ e antigas prévias home-medieval.js/.css.
- Imagens sem dependência no app: fundos/cards avulsos, PNGs joao/01–03 e home-topo (imagem de topo e logomarca ainda não integradas).
- Testes novos e documentação de apoio: executados durante a validação, mas fora desta seleção mínima de funcionamento. Continuam locais.

## Validação executada

- Build do estado local aprovado. Em seguida, cópia isolada do último commit com sobreposição somente dos 29 arquivos selecionados, sem aplicar exclusões ou copiar outros arquivos não rastreados. Build dessa cópia aprovado.
- 19 capas reais verificadas; 50 entradas válidas no precache e todas as dependências de scripts do HTML presentes no pacote.
- Arquivos selecionados conferidos por SHA-256 após o build e ao finalizar; sintaxe JS e JSON válida. Home geral, estilos numéricos, modelo/repositório de dados e cenário de João preservados em relação ao último commit (textos comparados normalizando apenas CRLF/LF; imagem comparada byte a byte).
- Pacote do site sem artifacts, experimentos ou referências. Arquivos novos não selecionados não aparecem na cópia candidata nem no pacote.
- Chrome 360×800: João centralizado e vizinhos visíveis; sete itens de menu e apenas Home ativo; toque, gesto, teclado e navegação funcionando; favoritos persistem após recarga; Biblioteca com 66 cartões; menu fixo e conteúdo acessível; sem overflow horizontal. Mouse também conferido em 360 px.
- Chrome 412×924: João centralizado e vizinhos visíveis; sete itens de menu e apenas Home ativo; toque, gesto, teclado e navegação funcionando; favoritos persistem após recarga; Biblioteca com 66 cartões; menu fixo e conteúdo acessível; sem overflow horizontal. Mouse também conferido em 360 px.
- Chrome 430×932: João centralizado e vizinhos visíveis; sete itens de menu e apenas Home ativo; toque, gesto, teclado e navegação funcionando; favoritos persistem após recarga; Biblioteca com 66 cartões; menu fixo e conteúdo acessível; sem overflow horizontal. Mouse também conferido em 360 px.
- Suíte existente dados: passou; RESULTADO: 0 falhas. Rede física offline e quota real exigem teste adicional.
- Suíte existente cenario: passou; RESULTADO: 0 falhas. Interação, navegação e offline exigem testes no aplicativo.
- Suíte existente editor: passou; RESULTADO: 0 falhas. Arraste real, navegação central e mobile exigem teste no aplicativo.
- Suíte existente objetos: passou; RESULTADO: 0 falhas. Quota real e aparelho físico exigem validação adicional.
- Cinco grupos dos testes do catálogo aprovados contra os módulos candidatos: descoberta, nome/ordem/extensão, WebP real/truncado/animado, serialização e contrato dos 66 livros.
- Testes do observador local aprovados contra o candidato: Atos detectado por evento sem build, catálogo virtual, cópia parcial inválida, proteção de rotas e canal contínuo fora do cache.
- Produção/PWA em /palacio-mental/: catálogo JS antigo atualizado pelo JSON, Service Worker ativo, Atos e favorito mantidos em recarga offline; sem conexão de eventos em produção.
- Sem exceções JavaScript ou console.error nas execuções finais; git diff --check aprovado. Staging vazio.

## Riscos e limites

- Avaliação estética final e teste em Android físico desta candidata ainda pendentes. Os testes em navegador são emulação, sem medição de bateria, CPU ou fluidez prolongada.
- Capas novas ficam offline depois de carregadas e armazenadas; não há cobertura offline integral de todas as imagens. As sete capas já precacheadas permanecem.
- Novas imagens locais só chegam ao PWA remoto após uma publicação autorizada. O servidor local observa a pasta; GitHub Pages usa o catálogo gerado automaticamente no workflow.
- O cache técnico continua palacio-mental-v3.4. Isso não define a versão do próximo commit. O código do SW mudou, portanto sua atualização pode ocorrer sem trocar o identificador do cache, preservando o conteúdo dinâmico já salvo.
- A tarefa automática local pode solicitar permissão do VS Code e usa a porta 5501. Ela não roda no site publicado.
- A seleção representa os hashes registrados. Se arquivos forem alterados ou novas capas adicionadas antes da autorização, reconferir a lista e regenerar/testar o candidato afetado.

## Próxima ação — aguardando autorização

Aprovar ou ajustar os 29 arquivos e a versão V3.5. Nenhuma autorização de commit, push ou deploy foi presumida nesta preparação. Sugestão de mensagem futura: `V3.5 - Home do Palacio Biblico, Biblioteca e catalogo automatico de capas`. Gravação no Notion também não foi realizada.

Cópia candidata testada: `C:\Users\NATHAN~1\AppData\Local\Temp\palacio-v3.5-candidato-2K0lbH\source`. Pacote gerado: `C:\Users\NATHAN~1\AppData\Local\Temp\palacio-site-K2PYkS`. Ambos são temporários; não houve publicação.

Evidências: selection.json (lista e hashes), selected-files.txt, package-check.json, logs de build/validação, browser-home/results.json, browser-pwa/production-results.json e capturas nas pastas correspondentes.
