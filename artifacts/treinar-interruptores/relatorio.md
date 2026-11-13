# Treinar — seletor de modos

Alteração local em 13/11/2026. Branch `main`, HEAD `b43c424`, igual à referência local `origin/main` (sem consulta ao remoto). Staging vazio. Preservadas 64 exclusões e cinco entradas não rastreadas preexistentes. Sem commit, push, publicação ou mudança de versão.

## Escopo

- `index.html`: removida somente a superfície curva SVG e os rótulos secundários do seletor; mantidos os dois botões, `data-treinar-tipo`, `aria-pressed`, tipos e grupo acessível.
- `style.css`: estilos exclusivos sob `#telaDesafiarMemoria`. Dois botões Black Glass de 44 px, cantos arredondados, indicador circular à direita, borda e seleção lavanda estáticas, foco de teclado visível.
- Referência visual local inspecionada: `assets/imagens/referencias/MEMORIA NUMERICA/tela treinar/49a9d8ca-3c22-4df3-9949-c6b57cd64c3b.png`. Roxo mantido discreto conforme pedido, sem reproduzir halo intenso do mockup.
- Mantida a altura externa de 60 px do seletor para preservar a posição do restante da tela. JavaScript, Fixar, outras páginas, imagens, armazenamento, manifesto e service worker não alterados.

## Testes executados

Chrome headless via CDP, servidor HTTP local e perfil de teste isolado. Service worker ignorado no teste para garantir leitura dos arquivos atuais. Capturas PNG reais de viewport, não mockups.

| Verificação | 360 × 800 | 430 × 932 |
| --- | --- | --- |
| Número → Palavra: pergunta, número visível, campo texto | Passou | Passou |
| Toque em Imagem → Número: imagem carregada, número oculto, campo numérico | Passou | Passou |
| Retorno por toque a Número → Palavra e seleção exclusiva | Passou | Passou |
| Verificação de palavra incorreta, bloqueio dos modos, próxima questão | Passou | Passou |
| Verificação de número correto, bloqueio dos modos e próxima ação disponível | Passou | Passou |
| localStorage inalterado ao alternar modos | Passou | Passou |
| Histórico de respostas do perfil de teste mantido após recarga | Passou | Passou |
| Posição do cartão idêntica ao original; sem overflow horizontal | Passou | Passou |
| Foco programático no botão; emulação de movimento reduzido sem animação no botão | Passou | Passou |

O cartão permaneceu em y=386,390625 px em 360 px e y=425,71875 px em 430 px. Seletor com larguras de 300/370 px e altura externa de 60 px antes/depois. A troca de modo não escreveu no localStorage; responder escreveu somente os resultados reais dos exercícios no perfil isolado. Dados pessoais do navegador habitual não foram usados.

Fluidez: 90 amostras de requestAnimationFrame durante rolagem programática por largura, máximo de 16,8 ms entre quadros, nenhum intervalo acima de 50 ms. Nenhuma exceção de JavaScript observada. Esta é uma amostra do ambiente desktop, sem limitação de CPU; não comprova FPS, consumo de memória ou bateria em celular real. Estimativa de risco baixo: CSS estático, sem blur adicional, animação contínua ou novo JavaScript.

`git diff --check` passou. Diff de código limitado ao seletor no HTML e aos estilos desse componente. Staging permaneceu vazio. Os avisos de conversão LF/CRLF do Git não são falhas de whitespace.

## Capturas

| Largura | Original | Número → Palavra | Imagem → Número |
| --- | --- | --- | --- |
| 360 px | [Antes](360-before.png) | [Palavra](360-palavra.png) | [Número](360-numero.png) |
| 430 px | [Antes](430-before.png) | [Palavra](430-palavra.png) | [Número](430-numero.png) |

Evidências estruturadas: `results.json`; automação: `verify.cjs`; cópias originais: `before.html` e `before.css`. A primeira tentativa capturou o convite de instalação; o teste final o dispensa antes de navegar. Uma tentativa adicional errou o alvo durante rolagem suave; a automação foi corrigida para rolagem instantânea antes do toque, sem mudar o app.

## Limites

Pendente: avaliação pelo usuário em celular físico, leitor de tela, teclado virtual real e PWA publicada. Não foi executada regressão integral de outras páginas; Fixar e demais páginas foram preservados por escopo do diff. Sem medição direta de memória/bateria nem comparação de desempenho antes/depois. Não houve validação de atualização/offline porque o service worker não mudou.

## Sugestão de registro no Notion — aguardando aprovação

Destino: Estado de Implementação (`3faff76ffb038025bc0dcba441812706`). Conteúdo: seletor de Treinar substituído localmente por dois botões Black Glass com indicador circular à direita; lógica preservada; testes 360/430 e fluxos de resposta aprovados em Chrome headless; capturas locais e limites de fluidez; sem commit, publicação ou mudança de versão; celular físico pendente. Motivo: permitir retomada fiel desta entrega sem confundi-la com publicação. Nenhuma escrita realizada no Notion.
