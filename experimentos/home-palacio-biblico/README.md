# Palácio Bíblico — protótipo isolado da Home medieval

Abra `index.html` desta pasta com **Open with Live Server**. Servindo a raiz do
projeto, use `/experimentos/home-palacio-biblico/`.

Sem build ou dependências externas. Usa o módulo visual compartilhado
`../../assets/palacio-biblico/home-medieval.js` e sua folha CSS, sem carregar os
módulos de dados, favoritos, cenários ou registrar service worker nesta página.
Aqui, os seis botões continuam demonstrativos:
anunciam uma mensagem, sem navegar ou simular recursos prontos. Não há tour,
painel dos 66 livros, contadores de progresso ou acesso à Biblioteca oficial.

## Imagens originais preservadas

- `../../assets/imagens/palacio-biblico/home-palacio-biblico/home-background.webp`:
  941×1671, opaca. `object-fit: cover` preserva proporções e pode recortar bordas.
- `../../assets/imagens/palacio-biblico/home-palacio-biblico/biblia-medalhao.webp`:
  768×768, transparência real confirmada em pixels decodificados, incluindo bordas
  semitransparentes. Medalhão separado, sobreposto ao caminho, sem fundo de botão.

O HTML e o visual têm uma única fonte no componente compartilhado; esta página
continua disponível para comparação isolada. No aplicativo principal, a tela
`homeBiblica` abre pelo cartão Palácio Bíblico. Medalhão e Livros abrem a Biblioteca
existente; Home retorna à Home principal. Os outros três itens são demonstrativos.

O anel é um traço SVG animado em 12 segundos, sem filtros ou loops JavaScript.
Para `prefers-reduced-motion: reduce`, torna-se um contorno estático; a animação
é pausada quando a página fica oculta. A posição e escala são específicas deste
protótipo, sem mudar imagens ou estilos do aplicativo.

## Substituição do experimento anterior

Removidos apenas os seis arquivos exclusivos de `experimentos/mapa-biblico/`:
`index.html`, `mapa.css`, `mapa.js`, `mapa-provisorio.svg`, `README.md` e a cópia
`assets/joao.webp`. Não havia referências externas do aplicativo a esses arquivos.
A referência externa de saída era somente a arte original do mapa; nenhum asset
externo foi excluído. Na conferência desta etapa, o caminho anterior
`assets/imagens/palacio-biblico/mapas/grande-mapa-biblico-v01.webp` já estava ausente.
Nenhuma imagem ausente foi restaurada.

## Verificação local

Chrome headless em 360×800 e 430×932: imagens carregadas, composição inspecionada
visualmente, menu com cinco itens e sem rolagem externa. Seis controles testados
por toque emulado, sem alteração de URL/histórico. Foco visível e movimento
reduzido verificados; sem exceções JavaScript capturadas. O perfil isolado terminou
sem chaves de armazenamento, bancos IndexedDB ou service workers registrados.

Integração local verificada em 360×800, 412×924 e 430×932: Home → Home medieval,
medalhão/Livros → Biblioteca, busca por João, abertura de João/Filipenses,
retornos pelo histórico e botão Home. Favorito testado apenas em perfil temporário.
Sem rolagem externa na Home medieval ou exceções JavaScript capturadas. Os dois
carrosséis numéricos e a abertura de Configurações foram conferidos como regressão.
O cenário de João não foi aberto: sua imagem continua ausente nesta cópia local.

Aguardando avaliação visual do usuário e teste em dispositivo real.
Novas alterações, telas, publicação e escrita no Notion dependem de autorização.
