# Biblioteca de tipografia SVG

Oito estudos vetoriais reutilizáveis com as iniciais **MN**. São marcas e tratamentos de letras desenhados em paths, não arquivos de fonte nem alfabetos completos. Não dependem de fontes instaladas, JavaScript ou bibliotecas.

Todos usam `viewBox="0 0 128 128"`, fundo transparente e traços finos. Os sete estudos usam violeta `#8C65C5`, lavanda `#B18AFF` e lavanda clara `#E0AEFF`. O monograma integrado usa `--pm-purple-primary`, com fallback exato `#8650CB`, extraído do contorno aprovado. Não contêm animações, filtros, imagens raster ou recursos externos.

| Arquivo | Estilo e uso sugerido |
|---|---|
| `circuito-digital.svg` | Trilhas ortogonais e terminais; inspiração em circuitos digitais. |
| `neural.svg` | Conexões curvas e nós; linguagem de redes neurais. |
| `fragmentada.svg` | Letras segmentadas, com interrupções e pontos de continuidade. |
| `orbita.svg` | Letras envolvidas por uma elipse inclinada e pontos orbitais. |
| `geometrica.svg` | Letras angulares dentro de um hexágono fino. |
| `duplo-contorno.svg` | Dois percursos paralelos sugerem profundidade sem sombras. |
| `constelacao.svg` | Nós e ligações finas constroem uma constelação tipográfica. |
| `monograma-mn.svg` | M e N interligados pela haste central, círculo externo e pontos de conexão. Único asset integrado à interface nesta etapa. |

## Integração atual

Somente `monograma-mn.svg` aparece ao lado do título HTML da página Memória Numérica. Os outros sete arquivos são referências disponíveis na biblioteca, sem carregamento ou elementos adicionados à interface. A tipografia e o M decorativo já existentes no título permanecem preservados.

O monograma tem tamanho de exibição controlado em `style.css`, por seletores exclusivos de Memória Numérica. A integração por `use` permite herdar a variável de cor do título, mantendo o desenho em um único arquivo. O título textual continua sendo o nome acessível; o monograma é decorativo:

```html
<svg class="memory-numeric-monogram" viewBox="0 0 128 128"
     aria-hidden="true" focusable="false" width="52" height="52">
  <use href="assets/svg/tipografia/monograma-mn.svg#monograma-mn" />
</svg>
```

Para um uso futuro em que um SVG comunique informação por conta própria, fornecer um `alt` descritivo se usado em `<img>`, ou um nome acessível no SVG inline. Cada arquivo também contém um `<title>` para uso direto/inline. Não duplicar a leitura do título quando a marca apenas o acompanha.

Manter proporção quadrada e testar a legibilidade no tamanho final. A paleta pode ser editada diretamente nos atributos `stroke` e `fill` de cada arquivo, mediante aprovação do contexto visual. Importar um SVG como imagem externa não permite mudar seus traços pelo `color` do elemento pai.

Nenhuma integração em outras páginas, alteração de navegação ou novo fluxo é definida por esta biblioteca.
