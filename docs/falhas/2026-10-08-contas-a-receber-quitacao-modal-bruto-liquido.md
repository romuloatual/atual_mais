# Modal de quitação envia o valor da forma como líquido; o backend espera bruto

**Tipo: Bug (subtarefa) do INTG-2727** (HMG) · Severidade alta · Tela: [Quitação](../telas/contas-a-receber-quitacao.md) · Evidência: `tests/cards/INTG-2727-evidencias.md` (branch `card/INTG-2727`)

**Resumo:** com Desconto ou Acréscimo, a modal exige que a soma das formas feche com o **total ajustado** e envia o valor **líquido**. O backend, igual à produção, trata o valor da forma como **bruto** e aplica desconto/acréscimo por cima.

| Título | Ajuste | Forma enviada | Tela dizia | Backend respondeu |
| --- | --- | --- | --- | --- |
| 500 | desconto 50 | 450 | restante 0 | parcial, restante 50 |
| 100 | acréscimo 10 | 110 | restante 0 | erro 400 "soma excede o total" |
| 500 | acréscimo 50 | 500 | restante 50 | quitado (PAID), restante 0 |

**Provado por API:** com valor **bruto** o backend fecha certo (formato antigo e novo). O defeito está na modal; o time confirma qual lado muda (INTG-2726 e INTG-2727 divergem no texto). Desconto e acréscimo não se usam juntos (regra informada).

**Reteste:** desconto e acréscimo, um por vez, com 1 e 2 formas; recibos A4 e Bobina.
