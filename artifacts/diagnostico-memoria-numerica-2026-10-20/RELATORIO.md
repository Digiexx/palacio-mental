# Diagnóstico — Memória Numérica

Data: 20/10/2026. Escopo exclusivamente diagnóstico. Nenhum arquivo do aplicativo foi alterado nesta etapa. Alterações anteriores em `index.html`, `style.css` e arquivos não rastreados foram preservadas. Não houve commit, push ou escrita no Notion.

## Conclusão e menor intervenção recomendada

**A principal fonte de trabalho contínuo confirmada são os contornos animados de “Seu domínio” e “Suas faixas”.** Ambos animam uma propriedade CSS usada em `conic-gradient`, com máscara e `drop-shadow`, durante todo o tempo em que a central está aberta. Isso provoca recálculo de estilos e pintura a cada quadro, inclusive sem rolar.

Recomendo um primeiro teste de correção limitado a esses dois pseudoelementos: substituir a animação por um contorno estático, preservando painel, cartões, texto, progresso real, imagem e navegação. Não recomendo redesenhar a página nem retirar todos os efeitos com base nestes resultados. A correção permanece pendente de aprovação.

O desperdício de renderização está demonstrado. A intensidade da lentidão relatada no celular e o ganho de fluidez no aparelho ainda precisam de teste físico; o navegador de computador não reproduz a GPU, a temperatura e a taxa de atualização do celular.

## Método e limites

- Edge headless 155.0.4283.62, Windows, via Chrome DevTools Protocol: Performance, Tracing, emulação de viewport e observadores de long tasks/layout shifts.
- Viewports 360 × 820 e 430 × 820, escala de dispositivo 1, CPU com limitação artificial de 4×. Isso não equivale a emular um processador ou GPU específicos de celular.
- Perfil de navegador exclusivo de diagnóstico. Operações de escrita em Storage foram bloqueadas; o armazenamento observado permaneceu `{}`. Não foram executadas respostas de treino nem alterações de progresso.
- Todos os testes B–E foram desativações temporárias em memória no navegador. Nenhuma delas foi salva no CSS/JS do app.
- `requestAnimationFrame` mede cadência dos callbacks, **não FPS efetivamente apresentado pela GPU**. Os eventos Paint do trace medem trabalho de pintura no renderer; sua duração não é tempo total de GPU nem tempo integral de renderização.
- As primeiras tentativas ficaram na Home por causa da seleção do carrossel e foram descartadas. Depois, os gestos sintéticos de toque não causaram deslocamento: esses dados não foram tratados como rolagem. Algumas amostras sem sinal de quadros também foram descartadas.
- A série válida em repouso contém duas passagens A–E por largura, em ordens opostas. O isolamento de animações contém duas passagens A/N/H/C em 360 px. A série final de rolagem contém uma passagem A–E por largura; a precisão é limitada e não se atribuem pequenas diferenças a ganho real.
- Na série final, a rolagem foi programática, em passos ligados ao rAF, com `behavior: instant`. Houve deslocamento real de até **963 px em 360** e **780 px em 430**, cobrindo a página. Isso permite comparar custo visual sob movimento, mas não mede latência do gesto nativo de toque.
- O cenário D esconde a imagem preservando o espaço e usa um fundo simples. Não refaz a navegação sem baixar/decodificar o asset; portanto, isola sua participação visual, não seu custo de rede inicial.
- O cenário E suspende callbacks agendados por timeout/interval/rAF do app após abrir a central. Não remove handlers de navegação, não pausa CSS e não desliga o próprio instrumento de medição. Não equivale a desligar todo o JavaScript.

## Comparação A–E com rolagem real controlada

Cada amostra dura aproximadamente 3,06–3,08 s. Valores arredondados. Paint ms é soma das durações dos eventos Paint, sem incluir rasterização/GPU. Ausência de evento Paint é registrada como zero.

| Cenário | Alteração temporária | Paint eventos / ms — 360 | Paint eventos / ms — 430 | Cadência rAF 360 / 430 |
|---|---|---:|---:|---:|
| A | Página vigente | 531 / 255,3 | 552 / 274,5 | 57,3 / 59,7 Hz |
| B | Sem filter, backdrop-filter, box-shadow e text-shadow no escopo medido | 551 / 338,4 | 552 / 283,5 | 59,4 / 59,5 Hz |
| C | Sem animações/transições na central e no controle Home | 3 / 3,4 | 0 / 0,0 | 59,9 / 59,7 Hz |
| D | Imagem superior invisível, fundo simples e mesmo espaço | 552 / 289,9 | 559 / 268,3 | 60,0 / 60,0 Hz |
| E | Callbacks agendados não essenciais suspensos | 552 / 255,4 | 552 / 395,8 | 59,9 / 59,9 Hz |

Somente C reduz de forma grande e consistente o trabalho de pintura. Em 360, a redução da duração registrada em Paint é de aproximadamente 98,7%; isso **não significa 98,7% mais FPS**. B, D e E não demonstram redução consistente de pintura. Não interpretar diferenças pequenas ou pioras pontuais como benchmark definitivo.

Na rolagem, o cenário A/360 registrou uma long task; as outras nove amostras registraram zero. Esse episódio isolado não comprova uma rotina JavaScript problemática. Todas as amostras registraram **zero layouts**, **CLS zero** e **zero mutações do DOM da central** durante a janela observada. O percentil 95 dos intervalos rAF ficou próximo de 16,8–16,9 ms. Houve atrasos esporádicos; não foi possível medir contagem confiável de quadros descartados pelo compositor.

## Isolamento: contornos da central versus Home fixo

Teste em repouso, 360 px, duas amostras por cenário com aproximadamente 1,27 s cada. Médias:

| Cenário | Eventos Paint | Paint ms |
|---|---:|---:|
| A — original | 231 | 144,1 |
| N — apenas animações da central suspensas; halo Home mantido | 3 | 1,2 |
| H — apenas animações do controle Home suspensas; central mantida | 230,5 | 155,3 |
| C — ambas suspensas | 4 | 2,1 |

O isolamento aponta os contornos da central como causa dominante da pintura contínua. O halo Home continua animando opacidade sobre `blur(10px)`, mas sua suspensão isolada não reduz a pintura medida. Isso não mede energia/GPU específica do halo; apenas indica que ele não é o primeiro candidato para esta correção. Nenhum ajuste global no Home é recomendado nesta etapa.

A série válida adicional A–E em repouso reforça o resultado: em cerca de 3,5–3,6 s, A teve médias de 651/649,5 eventos Paint em 360/430; C teve 2/4. Os recálculos de estilo passaram de aproximadamente 216 por amostra para 0,5, com C. Não houve mutações do DOM ou callbacks recorrentes do app nessa janela. CSS pode recalcular e pintar sem mutações do DOM.

## A. Problemas confirmados e evidências negativas

As linhas abaixo se referem aos arquivos locais existentes na data do diagnóstico.

| Suspeita | Arquivo e linha | Evidência encontrada | Impacto estimado | Resultado medido | Correção recomendada | Risco de regressão |
|---|---|---|---|---|---|---|
| Contornos luminosos contínuos | `style.css:24105–24129` | `.memory-dashboard::after` e `.memory-ranges::after`; `conic-gradient` depende de propriedade animada, máscara, drop-shadow e animação infinita de 5 s | **Alto** em custo contínuo confirmado; fluidez física pendente | N: 231 → 3 eventos Paint em repouso. C quase elimina pintura nas duas larguras com rolagem | Testar contorno estático apenas nesses dois pseudoelementos | Baixo funcional; visual médio porque retira o movimento aprovado anteriormente |
| Reflow repetitivo na central | `script.js:3886`, `script.js:5755` | Atualização de domínio ocorre ao exibir a central. Não há leitura geométrica intercalada nesse cálculo | Baixo no fluxo testado | Zero layouts e zero mutações da central nas janelas de rolagem; nenhum loop de reflow identificado | Não reescrever lógica nem adicionar cache nesta etapa | Médio/alto se mexer sem necessidade nos cálculos de progresso |
| Imagem superior pesada | `index.html:2289–2291`, `style.css:23923–23943` | Um único `<img>` na central; asset pequeno, enquadramento por object-fit e altura explícita | Baixo para rolagem observada | D não apresenta melhora consistente; dimensão e bytes detalhados abaixo | Preservar imagem e composição | Baixo se mantida; médio visual se substituída sem motivo |

## B. Suspeitas ainda não confirmadas

| Suspeita | Arquivo e linha | Evidência encontrada | Impacto estimado | Resultado do teste | Correção recomendada | Risco de regressão |
|---|---|---|---|---|---|---|
| Vidro e sombras dos cartões | `style.css:23945–24005` | Dashboard com backdrop blur 12 px; oito acessos com blur 10 px e múltiplas sombras. Fundos usam vários gradientes estáticos | Médio potencial na GPU do celular | B não reduz pintura de forma consistente e não isola blur de sombra individualmente | Manter agora; testar somente após os contornos estáticos no celular, se ainda necessário | Médio visual, baixo funcional |
| Halo fixo Home repintando tudo | `home.css:149–166`, `home.css:205–295` | Controle fixo, halo 105 × 105 px, blur 10 px, pulso de opacidade 2,6 s | Baixo no problema medido; custo GPU/energia não medido | H mantém praticamente o mesmo Paint; N funciona mesmo com halo ativo | Preservar Home nesta intervenção | Médio: efeito e acesso globais aprovados |
| Timers/observadores causando atualizações frequentes | `script.js:6665`, `script.js:7429`, `home.js:256` | Intervals pertencem ao treino Velocidade; observer de Home monitora status da foto. Não há listener de scroll/touchmove no código inspecionado da central | Baixo no caminho Home → central; outros históricos de navegação não reproduzidos | E não traz ganho; zero callbacks agendados e zero mutações da central nas amostras A–E | Não desligar JS em produção. Se houver lentidão após sair de um treino cronometrado, medir esse caminho separado | Alto se suspensão atingir timers/progresso de treinos |
| Listeners globais de gesto | `home.js:24–46`, `home.js:80–110` | Pointermove/up do carrossel e controle Home, com retornos rápidos sem gesto ativo; sem leitura de layout contínua | Baixo estimado | Nenhuma atualização frequente da central observada; não foi feita atribuição individual de custo a cada listener | Preservar; medir handlers individualmente somente se o problema continuar | Médio para navegação por gesto |
| Leitura/escrita de layout em outras rotas | `home.js:289` | `offsetWidth` força layout na troca manual da fotografia, fora da central; não há getBoundingClientRect/offsetHeight em script.js | Baixo para esta página | Sem evidência desse trecho executando na rolagem da central | Não alterar outra tela | Médio visual se mudar a transição da foto |
| Imagens globais pesando no carregamento inicial | `index.html:74`, `index.html:5983`, `index.html:5992` | Recursos de outras telas já carregados; PNG de instalação e duas artes da Home somam cerca de 7,48 MB | Médio potencial para início do app; sem causalidade confirmada para scroll estável | Inventário de recursos; não houve teste de rede fria/CPU de decodificação isolado | Investigar separadamente carregamento adiado/compactação, com autorização própria | Médio: instalação, Home e aparência fora do escopo |

## Imagens, memória e cálculos

Imagem efetivamente usada pela central:

| Arquivo | Dimensão real | Bytes do arquivo | Observação |
|---|---:|---:|---|
| `assets/imagens/memoria-numerica/central-numerica-topo.webp` | **345 × 259 px** | **9.578** | HTML declara 1440 × 1080. A área usa altura CSS explícita e object-fit: cover; não houve CLS nas janelas medidas. Não substituir a arte para resolver este problema. |

O inventário de rede da sessão inicial registrou 11 recursos de imagem, somando 8.155.627 bytes de corpos de arquivo. Isso inclui outras telas; não são 8 MB exclusivos de Memória Numérica e não são memória de textura/GPU. A central não acrescenta fotografias aos oito cartões de acesso: os ícones são SVG inline.

O heap JavaScript observado na série de 20 amostras variou de aproximadamente 1,97 a 6,13 MiB. Não é RAM total do processo, memória GPU ou evidência de vazamento. O perfil usa banco e progresso vazio; um histórico pessoal grande não foi simulado.

`atualizarMapaDominio` (`script.js:3886`) percorre o banco, consulta registros em memória e atualiza textos/larguras. Para cada faixa, filtra as associações, conta dominados e calcula média dos pontos. `obterDominioNumero` (`script.js:3602`) usa o objeto `dominioMemoria`; não lê localStorage a cada número. O carregamento persistido está em `script.js:3407`. A única chamada encontrada de atualização do mapa está em `script.js:5755`, na abertura da central. Não há cálculo da barra ou das faixas por quadro de animação/scroll.

O manipulador de abertura instrumentado levou aproximadamente 18–103 ms na série válida em repouso, com CPU limitada e overhead do instrumento; não é uma medição de latência de toque até o primeiro quadro e não isola o cálculo de domínio. Não se recomenda trocar esses cálculos com base nessa faixa.

## C. Melhorias opcionais de design

- Manter o acabamento Black Glass e trocar apenas o movimento dos contornos por gradiente estático. Esta é a proposta técnica prioritária, ainda sujeita à aprovação visual.
- Caso ainda haja perda de fluidez no celular depois desse teste, avaliar vidro simulado sem backdrop-filter apenas nos cartões da central, preservando cores, bordas e hierarquia. O teste atual não justifica fazê-lo junto com a primeira correção.
- Redesenho de cartões, mudança de arte, retirada do halo Home e simplificação geral de sombras não são necessários para testar a hipótese mais forte. Não há benefício comprovado que justifique ampliar o escopo agora.

## Próxima etapa proposta

Após aprovação: preparar alteração apenas dos dois contornos da central, comparar antes/depois nas duas larguras e testar no celular real com o mesmo tema/brilho, durante rolagem e ao abrir os oito acessos. Preservar os cálculos de domínio, faixas e progresso. Se persistir lentidão, realizar segunda rodada focada em GPU/backdrop-filter e nos caminhos de retorno dos treinos.

Não atualizar documentação no Notion sem autorização. Sugestão de registro futuro: na página **Memória Numérica**, registrar a origem da pintura contínua, os testes de isolamento e a pendência de validação física; motivo: evitar um redesenho ou alteração de progresso sem evidência. Nenhum registro foi feito.

## Evidências e reprodução

- `comparativo-repouso.json`: 20 amostras válidas A–E; os gestos sintéticos dessa série não deslocaram a página, por isso ela é classificada como repouso.
- `isolamento-animacoes.json`: oito amostras A/N/H/C em repouso.
- `rolagem-programatica.json`: dez amostras A–E com deslocamento real confirmado.
- Traces A/C de rolagem e A/N de isolamento nos ZIPs desta pasta; podem ser extraídos e abertos no DevTools Performance.
- Roteiros `.cjs`: executar a partir da raiz do projeto com Node compatível com WebSocket global e Edge no caminho Windows indicado. Usam servidor local, perfil isolado, bloqueio de escritas Storage e desativações apenas no DOM de teste. Não modificar nem usar o perfil normal do usuário.
- Somente relatórios, roteiros e evidências foram adicionados à pasta de artifacts nesta etapa.
