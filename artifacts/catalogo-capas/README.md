# Catálogo de capas — entrega local para avaliação

Regras de Trabalho e Estado de Implementação consultados no Notion. HEAD conferido: `4c872722125fa702787728615c5b290d45524309`, V3.4. Alterações locais anteriores, incluindo imagens não rastreadas, preservadas. Nenhum commit, staging, push, deploy, alteração de versão ou escrita no Notion.

## Arquivos desta etapa

Alterados: `assets/palacio-biblico/indice-biblico.js`, `index.html`, `scripts/build.cjs`, `service-worker.js`.

Novos: `scripts/gerar-catalogo-capas.cjs`, `assets/palacio-biblico/livros-biblicos.js`, `assets/palacio-biblico/capas-biblicas.js`, `tests/catalogo-capas.cjs`, `docs/catalogo-capas-biblicas.md`.

Biblioteca, Home, CSS, script de navegação e dados pessoais não precisaram de alterações: já consomem o índice compartilhado. Hashes confirmam os arquivos protegidos e as imagens originais idênticos ao início da etapa. Salmos e Apocalipse surgiram na pasta durante a conferência e foram reconhecidos ao executar novamente o build; nenhum cadastro manual novo foi feito.

## Resultado

Catálogo final com 12 capas WebP. Apenas arquivos verificados são listados; capa não altera disponibilidade do livro. Os 66 registros e todas as propriedades anteriores, exceto o campo de imagem esperado, foram preservados. Carrossel mantém os cinco slides selecionados e o layout existente.

Nomes incorretos, ordem incompatível, maiúsculas, extensão incorreta, falso WebP, arquivo truncado e animação são recusados no build. A validação estrutural do WebP não é um decodificador completo; novas imagens também devem ser conferidas visualmente.

O Service Worker continua com o mesmo nome de cache e estratégia network-first. Somente as entradas ausentes dfgt.webp e biblia-medalhao.webp foram retiradas. A lista canônica e o catálogo entram no precache. São 48 entradas válidas, mantendo sete capas antigas (854.060 bytes), sem incluir automaticamente as cinco novas capas (510.512 bytes) no download inicial. Essas cinco têm cache sob demanda.

## Testes executados

- Build integrado aprovado, gerando catálogo e site em pasta temporária, sem publicação.
- Cinco grupos do gerador aprovados. Fixtures usam pastas temporárias, sem alterar originais. Contrato dos 66 livros conferido com SHA-256 da estrutura anterior, excluindo somente `imagem`.
- Sintaxe de todos os arquivos JS novos/alterados validada. Hashes dos arquivos protegidos e das imagens iniciais preservados; todas as referências do precache existem.
- Chrome headless em perfil separado, em `/palacio-mental/`, com Service Worker real instalado e controlando a página. Sem bypass de SW no teste.
- Simulação offline bloqueou a rede do navegador e também as respostas do servidor de teste, para impedir que requisições do worker passassem pela rede.
- Catálogo e lista canônica disponíveis offline. Jonas nunca carregado: fallback genérico esperado. Jonas carregado online e confirmado no Cache Storage: imagem disponível após recarga offline. Favorito permaneceu salvo e o filtro funcionou offline.
- Capas carregadas e decodificadas de Jonas, Levítico, Números, João, Gênesis, Salmos e Apocalipse. Rute sem capa mantém ícone genérico, sem tentativa de carregar `08-rute.webp` ou listar o diretório.
- Busca e 66 cartões preservados; Jonas/Levítico/Números continuam indisponíveis para abrir páginas, independentemente da existência da capa.
- Carrossel usa a imagem de João do catálogo e permanece com cinco slides, João centralizado.
- Jonas conferido em 360×800, 412×924 e 430×932; capturas nesta pasta. Nenhuma alteração de layout.
- Sem exceções JavaScript ou chamadas console.error na execução final. Falha de rede de uma capa não armazenada, durante o teste offline frio, é esperada e termina no fallback.
- `git diff --check` aprovado. Resultados: `browser-results.json`, `final-validation-output.txt`, `build-output.txt`.

Limites: sem teste em aparelho físico, quota real, rede física ou publicação. Não há garantia de todas as capas offline antes de carregamento/cache. Desempenho estimado baixo; sem medição de CPU/bateria. Novas capas ainda não rastreadas precisarão ser incluídas quando houver autorização futura para publicar.

Sugestão futura de registro, somente após validação e autorização: Estado de Implementação — catálogo automático e limites do offline; Palácio Bíblico — Projeto e Protótipos — convenção NN-livro.webp, build e cache sob demanda. Motivo: documentar como adicionar novas capas sem retomar o cadastro manual e sem prometer cobertura offline integral. Nada foi escrito no Notion nesta etapa.
