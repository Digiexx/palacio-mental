# Índice de variações

Execute `node scripts/gerar-indice-variacoes.cjs` após adicionar imagens localmente.
O script lê apenas arquivos WebP reais nas pastas `00` a `99` e `100` em
`assets/imagens/memoria-numerica/variacoes/`, ordenando pastas e nomes numericamente.
Arquivos inválidos interrompem a geração. O resultado determinístico fica em
`assets/variacoes-memoria.js`; nenhuma imagem ou associação é modificada.

Aprender e Tabela Mental utilizam a mesma lista gerada. A imagem principal continua
vindo do banco pessoal. Cadastros manuais em `imagensVariantes` são combinados com
o índice, preservando sua ordem após os caminhos indexados e removendo duplicatas.
Não há mais limite artificial de cinco variações. Sem índice, os cadastros manuais
continuam disponíveis. Os pontos e as setas permanecem sob responsabilidade da galeria.

## Publicação

`node scripts/build.cjs` sempre regenera o índice antes de preparar um site estático
em diretório temporário. Copia somente os arquivos do app e assets, sem referências,
artefatos de teste, scripts de desenvolvimento ou metadados Git.

O workflow `.github/workflows/pages.yml` executa esse build em pushes para `main`
ou acionamento manual e publica exclusivamente o artefato resultante. As novas imagens
precisam estar incluídas no repositório enviado. Não é necessário editar o manifesto
manualmente nem criar commits automáticos do arquivo gerado no servidor.

Antes da primeira publicação por esse workflow, confirmar em Settings → Pages →
Build and deployment que Source está em **GitHub Actions**. A configuração remota
não foi alterada nesta implementação; a consulta sem autenticação retornou 404.
Publicação direta por branch ignora este build e deve ser substituída por esse fluxo.
Não usar publicação manual da raiz sem executar o build.

## Cache e offline

O service worker mantém a estratégia network-first. Apenas o pequeno índice entra
no precache; fotografias e variações não são adicionadas à instalação. Imagens
carregadas online ficam no cache dinâmico e podem ser reutilizadas offline.
Uma imagem nunca carregada pode faltar offline, mesmo que esteja listada no índice.
A revisão do cache garante a instalação do novo índice junto dos arquivos do app;
nenhuma chave de progresso, preferências ou banco pessoal é limpa.
