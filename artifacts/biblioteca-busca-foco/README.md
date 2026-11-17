# Biblioteca — placeholder ao focar

Ajuste local para avaliação. HEAD conferido antes da edição: 4c87272, V3.4. Regras, decisões e estado consultados no Notion. Nenhuma escrita no Notion, commit, push ou deploy.

Único arquivo do aplicativo alterado nesta etapa: `assets/palacio-biblico/biblioteca.css`, linhas 84–85. Regra do placeholder: cinza #b8b5b0, opacidade .65, peso 300, Arial. Nova regra `input:focus::placeholder` define opacidade 0, sem transição. O texto original permanece no HTML. Layout, dimensões e foco acessível existentes preservados. JavaScript e HTML conferidos por hash antes/depois, sem mudanças.

Chrome headless com perfil isolado, emulação de toque e foco de janela habilitada, em 360×800, 412×924 e 430×932. Resultados em `results.json` e capturas nesta pasta.

- Placeholder visível com campo vazio sem foco; opacidade 0 ao focar antes de digitar; duração de transição 0s.
- Saída do campo vazio restaura opacidade .65.
- Digitação real via protocolo do navegador de `joao` filtra quatro livros. Texto e resultados preservados ao perder foco.
- Limpar pesquisa restaura os 66 cartões e mantém placeholder oculto enquanto o campo está focado.
- Dimensões e posição iguais à referência CSS anterior; barra visível durante rolagem da lista; rótulo acessível mantido.
- Sem overflow horizontal, exceções JavaScript ou console.error na execução final. `git diff --check` aprovado.

Limites: emulação Chrome; aparelho físico e outros navegadores não testados. Alterações locais anteriores preservadas. Não é necessário novo registro no Notion antes da validação: ajuste pontual dentro da direção visual já documentada.
