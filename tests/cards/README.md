# Testes por card

Esta pasta guarda **evidências**, não testes: `INTG-XXXX-evidencias.md` de cada card, os modelos e o conferidor.
Se um cenário do card merecer automação (crítico ou recorrente), o teste vai **direto** em `tests/regression/<módulo>/<área>/`,
com a tag do card ao lado de `@regression` (ex.: `['@regression', '@INTG-2645']`), sem cópia aqui.

Veja a convenção completa em [`../README.md`](../README.md).

## Documentando a validação manual

Antes (ou em vez) de automatizar, registre cada cenário em formato BDD (Dado / Quando / Então),
cobrindo caminho feliz, negativo e borda, e anexe no card do Jira. Texto enxuto, evidência à vontade.
Use o modelo em [`TEMPLATE-caso-de-teste.md`](./TEMPLATE-caso-de-teste.md).

O arquivo de validação de cada card (`INTG-XXXX-evidencias.md`) segue **sempre** o modelo padrão
[`TEMPLATE-evidencias.md`](./TEMPLATE-evidencias.md) (mesmas seções, na mesma ordem). Antes de abrir o PR, rode `npm run check:evidencias` para conferir.

Depois de preencher o arquivo de validação (`INTG-XXXX-evidencias.md`), resuma no comentário do Jira usando o
modelo em [`TEMPLATE-comentario-jira.md`](./TEMPLATE-comentario-jira.md) (status, cenários validados, observações
fora do escopo e conclusão).

Para abrir um **card de defeito** no Jira, use [`TEMPLATE-card-de-defeito.md`](./TEMPLATE-card-de-defeito.md).
