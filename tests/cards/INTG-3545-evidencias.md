# INTG-3545 — Validação manual

**Card:** `[DEFEITO] (Frontend) {Venda Rápida V2} Vr. Unitário maior gera desconto em vez de acréscimo`
https://integramais.atlassian.net/browse/INTG-3545

HMG, empresa `romulo`, PDV LOJA001, 05/10/2026. **Status: APROVADO.** Os critérios do card passam.

## O que o card pede

No modal "Desconto / Acréscimo por item" da Venda Rápida V2:
1. Vr. Unitário **maior** que o original calcula **Acréscimo** (valor e %).
2. Vr. Unitário **menor** calcula **Desconto** (como já ocorria).
3. Valor com separador de milhar é lido como nos demais campos do modal.

## Critérios do card (BDD)

Item `051` iPhone 11, R$ 1.631,80 (preço do exemplo do card). `/pdv-v2` > item > `Alt+P` > informar o valor > Tab.
Executado por mim (navegador do Claude) e pelo Rômulo (Chrome), com o mesmo resultado.

| # | Dado / Quando | Então (card) | Obtido |
| --- | --- | --- | --- |
| 1 | Vr. Unitário `1.800,00` | Acréscimo R$ 168,20 (10,31%), Total R$ 1.800,00 | ✅ idêntico; carrinho +168,20 e R$ 1.800,00 |
| 2 | Vr. Unitário `1.200,00` | Desconto R$ 431,80 (26,46%), Total R$ 1.200,00 | ✅ idêntico |
| 3 | Milhar no Vr. Acréscimo e Vr. Desconto (`1.000,00`) | continuam corretos | ✅ 61,28%; totais 2.631,80 e 631,80 |

## Complementares (não fazem parte do card)

| Tipo | Valor | Obtido |
| --- | --- | --- |
| Borda | `999,99`, `1.000,00`, `10.000,00`, `1.000.000,00` | ✅ cálculo correto (8.368,20 / 512,82% e 998.368,20 / 61.182,02%) |
| Variação | `1800`, `1200`, `1.800,5` e igual ao original | ✅ correto; igual não altera nada |
| Negativo | vazio, `abc`, `0,00`, `-5,00` | ⚠️ valor vazio, `abc` e `0,00` dão Total 0 e Desconto 100%; `-5,00` perde o sinal (vira `5,00`). Não barra nem avisa. Observação ao dev, fora do escopo |

Notas: os campos mostram `168,2` e `1.800` (o card escreve `168,20`), só formatação. A venda não foi finalizada (carrinho conferido).

## Pendências

- [ ] Opcional: perguntar ao dev se valor vazio/`abc`/`0,00` virar 100% de desconto é o esperado.
- [ ] Antes do PR: mesclar a `main` na branch do card.
