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
