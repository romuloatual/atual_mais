# INTG-3545 — Validação manual

**Card:** `[DEFEITO] (Frontend) {Venda Rápida V2} Vr. Unitário maior gera desconto em vez de acréscimo`
https://integramais.atlassian.net/browse/INTG-3545

HMG, empresa `romulo`, PDV LOJA001, 05/10/2026. **Status: APROVADO em HMG.** Os critérios do card passam.
Evidência em vídeo (JAM): https://jam.dev/c/7972ea3c-bbd0-49ed-a1a4-a0f9118fa816

## O que o card pede

No modal "Desconto / Acréscimo por item" da Venda Rápida V2:
1. Vr. Unitário **maior** que o original calcula **Acréscimo** (valor e %).
2. Vr. Unitário **menor** calcula **Desconto** (como já ocorria).
3. Valor com separador de milhar é lido como nos demais campos do modal.

## Critérios do card (BDD)

Item `051` iPhone 11, R$ 1.631,80 (preço do exemplo do card). `/pdv-v2` > item > `Alt+P` > informar o valor > Tab.
Executado pelo Rômulo (Chrome) e conferido por mim (navegador do Claude), com o mesmo resultado.

| # | Dado / Quando | Então (card) | Obtido |
| --- | --- | --- | --- |
| 1 | Vr. Unitário `1.800,00` | Acréscimo R$ 168,20 (10,31%), Total R$ 1.800,00 | ✅ idêntico; carrinho +168,20 e R$ 1.800,00 |
| 2 | Vr. Unitário `1.200,00` | Desconto R$ 431,80 (26,46%), Total R$ 1.200,00 | ✅ idêntico |
| 3 | Milhar no Vr. Acréscimo e Vr. Desconto (`1.000,00`) | continuam corretos | ✅ 61,28%; totais 2.631,80 e 631,80 |
| 4 | Itens de 5 e 6 dígitos (Bicicleta R$ 10.000,00 e Biz 125 R$ 102.000,00), valores maiores e menores | parsing de vários separadores de milhar | ✅ (Rômulo) |
| 5 | Sem milhar: Camiseta R$ 44,00 com `50,00` e `40,00` | Acréscimo +6,00 e Desconto -4,00 | ✅ (Rômulo) |
| 6 | Reabrir o modal; fechar a venda com os itens alterados | Vr. Unitário volta ao preço padrão; total = soma | ✅ total final R$ 107.850,00 (Rômulo) |

## Complementares (não fazem parte do card)

| Tipo | Valor | Obtido |
| --- | --- | --- |
| Borda | `999,99`, `1.000,00`, `10.000,00`, `1.000.000,00` | ✅ cálculo correto (8.368,20 / 512,82% e 998.368,20 / 61.182,02%) |
| Variação | `1800`, `1200`, `1.800,5` e igual ao original | ✅ correto; igual não altera nada |
| Negativo | vazio, `abc`, `0,00`, `-5,00` | ⚠️ valor vazio, `abc` e `0,00` dão Total 0 e Desconto 100%; `-5,00` perde o sinal (vira `5,00`). Não barra nem avisa. Observação ao dev, fora do escopo |

Notas: os campos mostram `168,2` e `1.800` (o card escreve `168,20`), só formatação. A venda não foi finalizada (carrinho conferido).

Fora do escopo: o campo **QTD** mantém a leitura antiga a partir de 1.000 (verificar se há card); a Venda Rápida **V1** tem a mesma característica e segue bloqueada (INTG-3435).

## Pendências

- [ ] Registrar a versão/build do HMG testada (o reporte cita o schema `company8`).
- [ ] Opcional: perguntar ao dev se valor vazio/`abc`/`0,00` virar 100% de desconto é o esperado.
- [ ] Antes do PR: mesclar a `main` na branch do card.
