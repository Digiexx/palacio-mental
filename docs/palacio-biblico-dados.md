# Palácio Bíblico — camada local de dados

Etapa 01, 03/11/2026. Código isolado, sem integração ao aplicativo, login,
Supabase, publicação ou alteração da versão do app. Decisões de referência:
[Projeto e Protótipos](https://app.notion.com/p/404ff76ffb0381caba07dcedfaec9d4e).

## Carregamento e API

Carregar, nessa ordem, `assets/palacio-biblico/modelo.js`, `db.js` e
`repositorio.js`. Os arquivos expõem `globalThis.PalacioBiblico`, mas não abrem
o banco até uma chamada explícita a `criarRepositorio()`. O app principal não os
carrega. Nenhuma chave de localStorage é lida ou escrita pela camada.

```js
const repo = await PalacioBiblico.criarRepositorio();
const livro = await repo.criar('livros', {nome: 'João', codigo: 'JHN'});
const livros = await repo.listar('livros');
await repo.editar('livros', livro.id, {nome: 'João'});
repo.fechar();
```

Outras operações: `obter(tipo, id)`, `vincular({objetoId, versiculoId,
associacaoId})` e `operacoesPendentes()`. Falhas rejeitam a promessa (validações
de argumentos também podem lançar imediatamente); não anunciar sucesso antes da
resolução. Ausência de registro em `obter` é erro. Não há exclusão, troca de vínculo,
importação/exportação ou resolução de conflitos nesta etapa.

## Banco e identificadores

Banco `palacio-mental-biblico`, schema IndexedDB 1 (não é versão do app).
UUIDs são gerados no dispositivo. Cada registro contém `id`,
`proprietarioLocalId`, `criadoEm`, `atualizadoEm` e `revisao` incremental.
A identidade visitante é criada atomicamente em `metadados`, uma vez por banco;
`contaRemotaId: null` é apenas reserva, sem autenticação. Abas simultâneas usam
a mesma identidade. Todos os dados desta etapa pertencem ao visitante local.
O proprietário local não é uma credencial nem uma barreira de segurança contra
código da mesma origem. O isolamento remoto dependerá de Auth/RLS futuros.

| Store | Campos de domínio |
| --- | --- |
| livros | nome, codigo |
| cenarios | livroId, nome, imagem opcional |
| regioes | cenarioId, nome, posicao |
| objetos | cenarioId, regiaoId opcional, nome, posicao, imagem opcional |
| versiculos | livroId, capitulo, inicio, fim, traducao, texto/fonte opcionais |
| associacoes | versiculoId, descricao |
| vinculos | objetoId, versiculoId, associacaoId |
| flashcards | vinculoId, tipo |
| revisoes | versiculoId, flashcardId opcional, resultado, ocorridoEm |
| metadados | identidade local; reserva de associação remota |
| operacoes | UUID, proprietário, entidade, registroId, revisão, ação, data, estado e snapshot |

Não há seed de associações, progresso ou textos. Referências bíblicas podem ser
armazenadas sem texto. Texto exige uma fonte informada; isso não valida licença
automaticamente. O chamador é responsável por obter conteúdo autorizado. Os testes
não reproduzem NVI nem simulam versos. Dados dos testes nunca são dados do usuário.

## Integridade e coordenadas

- Campos desconhecidos e mudanças de identidade são rejeitados.
- Referências devem existir e pertencer ao mesmo proprietário.
- Região e objeto devem pertencer ao mesmo cenário; cenário e versículo ao mesmo livro.
- Associação deve referir-se ao versículo vinculado. Revisão com flashcard deve
  referir-se ao mesmo versículo do vínculo do cartão.
- Índices únicos impedem mais de um vínculo por objeto, versículo ou associação
  do proprietário, inclusive em gravações concorrentes.
- Referência exata (livro, capítulo, início, fim, tradução) não se repete por
  proprietário. Intervalos sobrepostos diferentes não são fundidos automaticamente.
- `fim` assume `inicio`; capítulo/início/fim são inteiros positivos.
- Posição usa `x`, `y`, `largura`, `altura` normalizados entre 0 e 1, relativos
  à imagem integral, sem depender do viewport. A área deve caber na imagem.
- Objeto vinculado não pode mudar cenário, região, imagem ou posição. Renomear
  preserva seu ID. Não há substituição automática de âncora.
- Livro do cenário, fundo do cenário, posição/localização de região, referência
  bíblica e referências de vínculos/cartões são imutáveis após criação nesta etapa.
  Isso evita invalidar descendentes. Revisões são eventos imutáveis.
- Estado livre/vinculado é derivado de `vinculos`, sem contador independente.
- Flashcards possuem tipos objeto-referencia, referencia-objeto,
  referencia-texto e lacuna; não há renderização, treino ou algoritmo de revisão.

Cada escrita usa uma transação readwrite envolvendo entidades e fila. O registro
e seu snapshot pendente são confirmados juntos; qualquer falha aborta ambos.
Todas as stores de domínio participam da transação para serializar validação e
escrita entre abas. Prioriza integridade; avaliar granularidade com volume real.
Não aguardar rede, temporizadores ou tarefas externas dentro de transações.

## Offline e futura sincronização

A camada não faz chamadas de rede. `estado: somente-local` nunca significa
sincronizado ou backup. A fila não é consumida nem descartada. Cada operação tem
UUID e revisão para futura idempotência; relógio do dispositivo não deve decidir
conflitos sozinho. A fila guarda snapshots completos e ainda não possui compactação.

Catálogos oficiais devem futuramente vir de assets compartilhados com IDs estáveis;
as stores atuais são registros locais, sem editor de catálogo global. Não duplicar
imagens oficiais por proprietário. Imagens pessoais, blobs, upload e backup não
estão implementados; `imagem` guarda somente uma referência textual.

Futuras etapas precisam definir migração visitante→conta sem trocar IDs, particionamento
por conta, Auth/RLS, confirmação remota por operação, conflitos por entidade,
tombstones, exportação/importação e proteção dos arquivos personalizados. Não
colocar credenciais na fila. Um timestamp não autoriza sobrescrever associações.

Migrações futuras devem usar nova versão do schema, condições por `oldVersion`
e mudanças aditivas; não excluir banco/stores em atualizações comuns. Ao receber
`versionchange`, conexões fecham; abertura bloqueada rejeita com mensagem para fechar
outras abas. A abertura atrasada também é fechada após bloqueio. Não há retry destrutivo.

Quota, permissões e limpeza do navegador podem impedir ou apagar armazenamento.
IndexedDB local não recupera dados após reinstalação/limpeza. Erros são propagados;
nenhum fallback silencioso para memória ou localStorage é usado.

## Testes isolados

Abrir `tests/palacio-biblico-dados.html` num navegador compatível (preferencialmente
via servidor local). Não é necessário instalar dependências. Os testes usam bancos
`palacio-biblico-teste-*`; removem somente o banco aleatório da execução. O banco
`palacio-biblico-teste-recarga` permanece como marcador para verificar nova carga.
Nunca executar testes no banco de produção. O HTML não carrega nem registra SW.

Verificações: criação/reabertura, CRUD disponível, fila, rollback real por DataError,
unicidade concorrente, referências, posições, validação, armazenamento indisponível,
conexão fechada e preservação do localStorage. Recarregar confirma o marcador da
página anterior. Bloquear fetch/XHR confirma independência dessas APIs, mas não é
por si só evidência de modo avião, atualização de PWA ou quota esgotada real.

Para verificar offline físico, carregar a página, desconectar a rede e executar
novamente com recursos locais disponíveis. O teste do app instalado fica pendente
até futura integração: sem modificar o SW, não se promete instalação offline destes
arquivos. O build atual copia assets, mas exclui a pasta de testes e documentação.

## Limites de entrega

Não muda navegação, CSS, Home, Memória Numérica, Memória em Ação, bancos pessoais,
Service Worker, manifesto ou build. Regressão estrutural deve comparar esses arquivos
com HEAD; regressão funcional completa do app depende de testes próprios posteriores.
Esta etapa não autoriza commit/publicação nem inclusão automática na versão 2.8.

## Verificação executada em 03/11/2026

Chrome headless com perfil temporário exclusivo, página local `file://`, sem
carregar o aplicativo principal. A suíte final executou 12 grupos de verificações,
com zero falhas. A recarga recuperou o marcador persistido no carregamento anterior.
O protocolo de depuração desativou a rede (`Network.emulateNetworkConditions`);
`navigator.onLine` retornou `false` durante essa execução. Confirmadas operações
locais nesse ambiente offline emulado, não o PWA instalado nem modo avião físico.
Erros de abertura/permissão foram simulados; conexão fechada e rollback por DataError
foram exercitados no IndexedDB real. Quota esgotada, upgrade de um schema anterior,
abertura bloqueada, aparelho real e regressão funcional completa permanecem pendentes.
