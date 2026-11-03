# Palácio Bíblico — camada local de dados

Etapa 01, 03/11/2026. Código isolado, sem integração ao aplicativo, login,
Supabase, publicação ou alteração da versão do app. Decisões de referência:
[Projeto e Protótipos](https://app.notion.com/p/404ff76ffb0381caba07dcedfaec9d4e).

Atualização local da Etapa 02: a Biblioteca passou a carregar esta camada no
aplicativo. As descrições de isolamento acima e na seção Limites de entrega
documentam a entrega original da Etapa 01. Login e sincronização continuam ausentes.

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
| livros | nome, codigo, favorito opcional (booleano) |
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

## Integração da Biblioteca — Etapa 02

O catálogo visual oficial em `assets/palacio-biblico/catalogo.js` contém João/JHN
e Filipenses/PHP, com categoria e imagem separadas dos dados pessoais. Abrir a
Biblioteca faz apenas consultas, sem cadastrar livros, versículos ou operações.
Não existem percentuais, metas de domínio ou estados de conclusão inventados.

`definirFavorito(codigo, nome, booleano)` localiza o livro do proprietário pelo
código normalizado dentro de uma transação com a fila. Reutiliza o UUID existente,
inclusive de registros da Etapa 01 sem campo favorito; ausência significa false.
Cria o livro somente no primeiro favorito. Repetir o mesmo estado não gera revisão
nem operação; desfavoritar um livro inexistente também não grava nada. Duplicatas
preexistentes geram erro explícito, sem apagar, fundir ou mover associações.
Cadastro genérico de livro também rejeita código duplicado; código existente
fica protegido em edições. Não houve mudança de versão do schema ou limpeza.

Biblioteca e Livro integram `telasApp`, com pais Home e Biblioteca respectivamente.
O controlador `popstate` existente foi preservado. O livro mostra uma tela
provisória, sem cenário interativo ou cadastro automático. CSS é restrito às novas
telas. Os recursos essenciais entraram no precache, mantendo o nome técnico atual
do cache e o número da versão do aplicativo.

As três imagens são assets isolados gerados com imagegen e convertidos realmente
de PNG para WebP por canvas do Chrome, 1200 × 800 px, qualidade 0,85. Prompts:
cabeçalho com arco antigo, oliveira, lago e montanhas da Galileia ao pôr do sol;
João com barco de pesca no lago da Galileia ao entardecer; Filipenses com rua e
colunas antigas de Filipos e montanhas da Macedônia ao entardecer. Todos pedem
composição cinematográfica histórica, cores naturais discretas, sem pessoas,
textos, interface, moldura de celular ou colagem. Não são cenários interativos
definitivos. Originais gerados foram preservados fora do repositório.

Validação local: suíte de dados ampliada para 13 grupos, zero falhas no Chrome,
incluindo favoritos idempotentes, concorrência, compatibilidade com livros antigos
e recarga. Interface verificada em 360/430 px sem overflow horizontal; pesquisa
ignora caixa/acentos; favoritos persistem após recarga; retorno nativo Livro →
Biblioteca → Home e Início global funcionaram nos fluxos exercitados. Falha de
abertura de armazenamento simulada mostrou erro e Tentar novamente recuperou a lista.
Com rede desativada pelo protocolo do Chrome, recarga via SW manteve Biblioteca,
imagens e favorito. Isso não substitui teste físico no PWA instalado nem atualização
de uma instalação antiga. Abertura dos módulos Numérica, Aprender, Memória na Prática,
Lista Ancorada, Revisão e Aparência foi verificada sem erros JS não tratados nesse
percurso. Não representa regressão completa de todos os treinos.

## Cenário de João — Etapa 03 local

Imagem revisada escolhida pelo usuário: `assets/imagens/palacio-biblico/joao/cenario-01.webp`,
WebP VP8, 1672 × 941 px, 660262 bytes. SHA-256:
`3307BDB139B3B5549285F8D3FD0C2097BCE0624BFD72D0350641D2F975EFDCAC`.
O arquivo `rascunho-teste.webp` (371952 bytes) permanece preservado e não é usado
pelo aplicativo. A imagem revisada não foi convertida, substituída ou alterada.

O manifesto `assets/palacio-biblico/cenarios/joao.js` separa retângulos de
enquadramento da câmera e áreas efetivas de toque. Origem no canto superior
esquerdo da imagem integral; medidas normalizadas em 0–1. As áreas das regiões
formam três faixas adjacentes, sem sobreposição. Os enquadramentos podem conter
elementos vizinhos para preservar contexto. IDs são oficiais e imutáveis, não
UUIDs pessoais. Não há mapeamento automático para registros do IndexedDB.

| Região | Enquadramento x/y/largura/altura | Centro | Zoom | Toque x/y/largura/altura |
| --- | --- | --- | --- | --- |
| Casa | 0 / 0.10 / 0.43 / 0.80 | 0.215 / 0.50 | 2× | 0 / 0 / 0.30 / 1 |
| Jardim | 0.29 / 0.03 / 0.42 / 0.72 | 0.50 / 0.39 | 2.2× | 0.30 / 0 / 0.40 / 1 |
| Porto/Barco | 0.70 / 0.06 / 0.30 / 0.84 | 0.85 / 0.48 | 2.5× | 0.70 / 0 / 0.30 / 1 |

Prefixo de ID de região: `joao-cenario-01-regiao-`, sufixos `casa`, `jardim`, `porto`.
Prefixo de objeto: `joao-cenario-01-objeto-`. Retângulos dos quatro objetos:

| Objeto / sufixo | Região | Toque x/y/largura/altura |
| --- | --- | --- |
| Porta da casa / porta | Casa | 0.105 / 0.285 / 0.11 / 0.32 |
| Oliveira / oliveira | Jardim | 0.468 / 0.11 / 0.20 / 0.36 |
| Poço / poco | Jardim | 0.302 / 0.32 / 0.143 / 0.365 |
| Barco / barco | Porto | 0.82 / 0.07 / 0.18 / 0.47 |

Somente regiões são clicáveis no panorama. Ao aproximar, somente objetos da região
ficam ativos; os alvos de região são ocultados. Marcadores começam invisíveis e
podem ser revelados. Há alternativas por botões nomeados fora da imagem. A mesma
camada CSS contém imagem e alvos; escala e deslocamentos afetam tudo junto. O
panorama usa ajuste proporcional integral, sem `cover`; faixas escuras são
esperadas no visor vertical. A câmera é limitada às bordas, com máximo de 3×,
e recalculada ao redimensionar. Movimento reduzido desativa a transição.

Biblioteca → João → Cenário usa o mapa `telasApp` e o `popstate` existente.
Zoom/seleção não criam entradas no histórico; Voltar do dispositivo retorna ao
livro e Panorama completo restaura a câmera. Filipenses mantém a tela provisória.
Entrar na casa, explorar outro jardim e entrar no barco são apenas reservas de
expansão no manifesto; nenhuma dessas entradas foi implementada.

O controlador do cenário não abre nem escreve IndexedDB/localStorage, não cria
operações pendentes e não apresenta estados Livre/Vinculado. O painel identifica
somente nome e ID do objeto. Cadastro, vínculos, versículos, flashcards e futuros
cenários conectados dependem de nova autorização. O schema permanece intacto.

Testes isolados: `tests/palacio-biblico-cenario.html` verifica 12 grupos de
geometria sem abrir banco. No Chrome local, os 12 grupos passaram. A interação
foi verificada em 360/430 px: aproximações, alinhamento, restauração e quatro
objetos; toques emulados, Enter nativo, retorno de foco e movimento reduzido.
Snapshots de todas as stores antes/depois de explorar foram idênticos. Voltar,
Início, favorito e Filipenses foram conferidos. Com SW ativo e rede desativada
no Chrome, recarga manteve favorito e cenário, inclusive seleção do barco.
Falha simulada de decodificação exibiu erro e nova tentativa recuperou a imagem.
Ainda faltam aparelho físico, leitor de tela, atualização de PWA antigo, medição
de fluidez/bateria e regressão completa dos treinos. Não houve commit/publicação.

## Persistência de objetos pessoais — Etapa 04.1

A Etapa 03 foi preservada no commit local
`02d8b44e69a5ea6f5e8fa79f0d94021c673fdad8`, após nova validação. Os resultados
da seção anterior são o registro histórico da implementação original.

Esta etapa acrescenta somente APIs no repositório e testes isolados. Não conecta
cadastro à interface, não cadastra os quatro objetos oficiais no banco e não
modifica seus identificadores, posições ou manifesto. O schema continua em 1,
sem migração, novas stores ou alteração dos índices de unicidade de vínculos.

### Cadastro e consulta

`repositorio.cadastrarObjetoPessoal(dados)` recebe:

- `livro`: `{codigo, nome}`, por exemplo o livro João do catálogo existente;
- `cenarioOficial`: manifesto completo de João, incluindo imagem, dimensões,
  regiões e objetos oficiais;
- `regiaoOficialId`: identificador estável da região oficial;
- `nome`: nome informado pela pessoa;
- `posicao`: `{x, y, largura, altura}` normalizados sobre a imagem original;
- `operacaoId`: token estável, gerado uma vez por intenção de cadastro e
  reutilizado em todas as tentativas dessa mesma operação.

Retorna o objeto pessoal persistido, com UUID e proprietário local. Não recebe
versículo nem cria vínculo. Coordenadas devem ser finitas, entre 0 e 1, com
dimensões positivas e retângulo integralmente dentro da imagem. A região é
validada no manifesto; a área do objeto não precisa ficar contida na faixa de
toque da região, pois elementos visuais podem ultrapassá-la.

`repositorio.consultarObjetosPessoais(cenarioOficialId)` retorna os objetos do
cenário pessoal mapeado. Sem mapeamento, retorna `[]`. A consulta é somente de
leitura: não cria contexto, objetos ou operações. A abertura do repositório
continua usando a identidade local já prevista na Etapa 01; a interface do
cenário permanece sem chamar essas APIs.

### Mapeamento e reaproveitamento

São utilizados registros auxiliares na store `metadados`, separados da identidade
local. As chaves são arrays serializados em JSON com namespace, tipo,
proprietário e identificador oficial ou token da operação, evitando colisões.

O registro `contexto-cenario` guarda o ID oficial, livro e cenário pessoais,
correspondências entre IDs oficiais e UUIDs de regiões, imagem e assinatura da
geometria oficial. A região pessoal usa a área `toque` do manifesto, não o
enquadramento da câmera. Regiões são materializadas somente quando recebem seu
primeiro objeto. Os quatro objetos oficiais permanecem exclusivamente estáticos.

O livro é reutilizado pelo código canônico. O cenário é reutilizado quando livro
e caminho da imagem coincidem. Uma região existente é reutilizada quando nome
normalizado e retângulo coincidem. Favorito, nome e demais dados existentes não
são sobrescritos. Candidatos múltiplos, nome de cenário conhecido com outra imagem,
região parcialmente correspondente ou geometria oficial alterada interrompem a
operação, sem tentar corrigir ou duplicar silenciosamente os dados. Esses casos
exigem futura decisão explícita de mapeamento/migração.

### Atomicidade e idempotência

Contexto, região, objeto, mapeamento, comprovante da operação e fila são gravados
na mesma transação IndexedDB `readwrite`. A promessa somente conclui quando a
transação confirma. Falha em qualquer gravação aborta todas as alterações.
Transações com as mesmas stores são serializadas também entre conexões/abas.

Cada entidade pessoal nova gera exatamente uma operação pendente com seu
snapshot. Mapeamentos e comprovantes são infraestrutura local e não geram
operações remotas nesta etapa. Uma sincronização/backup futuro deverá definir
explicitamente como transportar ou reconstruir esses metadados; não há Supabase
nem envio de operações implementado.

Repetir o token com a mesma assinatura retorna o mesmo objeto sem novas
gravações; repetir com dados diferentes é rejeitado. Mesmo com tokens diferentes,
cadastros com cenário, região, nome normalizado e retângulo idênticos reutilizam
o objeto e não duplicam a fila. Cada novo token mantém seu comprovante local.
Objetos com dados distintos são intenções distintas; deduplicação aproximada e
controle visual de sobreposição pertencem à interface futura. Comprovantes não
são removidos automaticamente. A API genérica anterior continua disponível;
a futura interface deve usar a nova operação transacional para esse fluxo.

As proteções existentes de um versículo por objeto, unicidade inversa do
versículo e imutabilidade da posição de objetos vinculados permanecem intactas.

### Validação local

`tests/palacio-biblico-objetos.html` executa 19 grupos no IndexedDB real do Chrome:
cadastro sem versículo; consulta sem efeitos; reuso de contexto e favorito;
idempotência; duas conexões concorrentes; rollback na fila e no comprovante;
geometria inválida e borda válida; ambiguidade e mudança do manifesto; proteção
de proprietário e referências; vínculos; reabertura e recarga real; preservação
do manifesto e do localStorage. Usa somente bancos com prefixo de teste.

Os 19 grupos passaram, inclusive após recarga real e com rede desativada pelo
protocolo do Chrome, executando novamente a suíte previamente carregada. Isso
valida a persistência sem rede, não a instalação/atualização offline da PWA.
Os 13 grupos da suíte de dados anterior e os 12 de geometria também passaram.
Verificação de sintaxe pelo motor do Chrome passou para os sete scripts
inspecionados. Nenhuma dependência foi instalada.
O fluxo Biblioteca → João → Cenário, Voltar ao livro e Início foi repetido após
a alteração. Comparação de todas as stores antes/depois de abrir o cenário foi
idêntica, confirmando ausência de cadastro automático nesse percurso.

Pendências: aparelho físico, quota real/disco cheio, encerramento abrupto do
navegador/sistema, concorrência manual em duas abas e regressão completa dos
treinos. Concorrência automatizada foi exercitada em duas conexões distintas
na mesma página. A Etapa 04.2 poderá construir a interface de edição sobre essas
APIs, mediante autorização própria.

## Editor visual temporário — Etapa 04.2 local

`editor-cenario.js` mantém um único rascunho na memória da página, com nome,
retângulo normalizado e estado de confirmação. Não chama o repositório, não
abre IndexedDB, não gera UUID e não usa localStorage. Confirmar área significa
somente preparar a área na sessão atual; não equivale a persistir um objeto.
Salvar/restaurar objetos pessoais continua reservado à Etapa 04.3.

Editar cenário → Adicionar objeto permite tocar na imagem ou usar Criar área ao
centro pelo teclado. A moldura pode ser movida e redimensionada pelos quatro
cantos. Posição e dimensões também têm campos numéricos em porcentagem. Valores
são limitados à imagem, com dimensão mínima normalizada de 0,02; toques fora da
imagem não criam área. As alças mantêm 44 CSS px mesmo com zoom. Em áreas muito
pequenas, os controles numéricos oferecem ajuste sem depender das alças.

Imagem e moldura compartilham a camada transformada original. Durante o gesto,
os controles de câmera ficam bloqueados. Na edição, seleção dos objetos oficiais
e animação de câmera ficam suspensas; Casa, Jardim e Porto/Barco continuam
disponíveis entre gestos. Sobreposição com objetos oficiais gera aviso e não
modifica nenhum deles. Apenas os objetos oficiais são considerados no aviso;
objetos pessoais ainda não são restaurados pela interface nesta etapa.

O usuário pode confirmar, revisar ou descartar. Sair da edição ou navegar com
rascunho solicita confirmação, inclusive para área já preparada, pois continua
temporária. A proteção usa o controlador central de navegação e seu popstate
existente. Ao recusar Voltar, a entrada do cenário é reposta no histórico.
Não há controlador independente de histórico. Recarga/fechamento também usa
beforeunload; a exibição desse aviso depende das regras do navegador e não
garante recuperação após encerramento do sistema. IDs técnicos deixaram de ser
exibidos no painel dos objetos oficiais.

Validação no Chrome local: 11 grupos isolados do editor, 12 de geometria,
19 de persistência e 13 de dados aprovados. As duas suítes de dados também
confirmaram recuperação após novo carregamento. No aplicativo, toques, arraste,
redimensionamento, alinhamento de zoom, alças, nome, confirmação e proteção
nativa de Voltar/Início foram verificados em 360 × 800 e 430 × 932 CSS px.
Tab/ArrowUp nos controles, movimento reduzido e ausência de overflow horizontal
foram conferidos. Instrumentação bloqueando escritas e geração de UUID, mais
comparação integral das stores antes/depois, confirmou ausência de gravações no
fluxo de edição; manifesto e localStorage permaneceram idênticos.

O novo script foi acrescentado ao precache sem mudar versão ou nome do cache.
Com SW ativo e rede desativada no Chrome, recarga carregou imagem e editor.
Capturas e resultados da interação ficam em `artifacts/palacio-biblico-etapa042/`.
O convite de instalação do perfil novo bloqueou inicialmente os toques; após
dispensá-lo pelo botão existente, a execução completa passou. Não foi necessário
alterar o fluxo de instalação.

Pendências: validação visual pelo usuário, celular físico, leitor de tela,
atualização de PWA antigo, encerramento abrupto e medição de fluidez/bateria.
Risco de desempenho estimado baixo: uma moldura, estilos estáticos, sem timer
ou animação contínua; não houve benchmark em aparelho. Esta etapa permanece
local, sem commit ou publicação. A Etapa 04.3 exige nova autorização.

Refinamento de encerramento da Etapa 04.2: contorno fino, roxo e contínuo,
inclusive após preparar a área; alças visíveis somente quando a moldura estiver
selecionada para ajuste. Tocar fora desmarca; tocar na moldura ou focar os campos
seleciona novamente. O nome permanece em destaque. As coordenadas ficam em
`details/summary` nativo, inicialmente recolhido, com título Ajuste preciso.
As ações do rascunho são Confirmar área, Ajustar e Descartar, sem duplicar
Cancelar no formulário. Confirmações de descarte e saída permanecem intactas.
O fechamento autoriza somente commit local; publicação e integração de
persistência continuam pendentes. A suíte do editor passa a ter 12 grupos.

Diagnóstico da falha de foco no fechamento: a mesma suíte falhava em aba de
segundo plano e passava em aba ativa, sem mudança no editor. No Chrome testado,
`focus()` alterava `activeElement` no segundo plano sem emitir `focusin`. A suíte
agora aguarda foco real na janela antes de executar os testes, mostrando
`aguardando-foco` até a ativação. Não simula o evento nem considera o teste
aprovado enquanto a aba estiver inativa. A implementação do editor foi mantida.

Validação do fechamento: os 12 grupos do editor, 12 de cenário, 19 de objetos
e 13 de dados passaram (56 grupos, zero falhas), incluindo recarga das suítes
de persistência. Em 360 × 800 e 430 × 932 CSS px, gestos, zoom, teclado,
abertura de Ajuste preciso por Enter, confirmação e Voltar/Início passaram.
As verificações instrumentadas registraram zero escritas durante a edição e
nenhuma mudança no banco, manifesto ou localStorage. Capturas atualizadas:
`artifacts/palacio-biblico-etapa042-fechamento-validado/`, fora do commit.
