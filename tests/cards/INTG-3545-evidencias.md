# INTG-3545 — Validação manual

**Card:** `[DEFEITO] (Frontend) {Venda Rápida V2} Vr. Unitário maior gera desconto em vez de acréscimo`
https://integramais.atlassian.net/browse/INTG-3545

**Criticidade: não informada no card.** **Status: 🟢 APROVADO em HMG.**
Entrega do dev: não registrada aqui. Relacionados: Venda Rápida V1 tem a mesma característica e segue bloqueada (INTG-3435).

HMG, empresa `romulo`, PDV LOJA001, 05/10/2026. Item `051` iPhone 11, R$ 1.631,80 (preço do exemplo do card).
Evidência em vídeo (JAM): https://jam.dev/c/7972ea3c-bbd0-49ed-a1a4-a0f9118fa816

## O que o card pede

No modal "Desconto / Acréscimo por item" da Venda Rápida V2:
1. Vr. Unitário **maior** que o original calcula **Acréscimo** (valor e %).
2. Vr. Unitário **menor** calcula **Desconto** (como já ocorria).
3. Valor com separador de milhar é lido como nos demais campos do modal.

## Critérios do card (BDD) executados

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| 1 | item `051` no carrinho | Vr. Unitário `1.800,00` | Acréscimo R$ 168,20 (10,31%), Total R$ 1.800,00 | ✅ idêntico; carrinho +168,20 e R$ 1.800,00 |
| 2 | item `051` no carrinho | Vr. Unitário `1.200,00` | Desconto R$ 431,80 (26,46%), Total R$ 1.200,00 | ✅ idêntico |
| 3 | item `051` no carrinho | milhar no Vr. Acréscimo e Vr. Desconto (`1.000,00`) | continuam corretos | ✅ 61,28%; totais 2.631,80 e 631,80 |
| 4 | itens de 5 e 6 dígitos (Bicicleta R$ 10.000,00 e Biz 125 R$ 102.000,00) | valores maiores e menores | parsing de vários separadores de milhar | ✅ |
| 5 | Camiseta R$ 44,00 (sem milhar) | `50,00` e `40,00` | Acréscimo +6,00 e Desconto -4,00 | ✅ |
| 6 | itens alterados no carrinho | reabrir o modal e fechar a venda | Vr. Unitário volta ao preço padrão; total = soma | ✅ total final R$ 107.850,00 |

Em resumo: os três pontos do card passam. Os campos mostram `168,2` e `1.800` (o card escreve `168,20`), só formatação.

## Complementares — negativo e borda (não decidem o veredito)

| # | Tipo | Quando | Então (esperado) | Obtido |
| --- | --- | --- | --- | --- |
| B1 | Borda | `999,99`, `1.000,00`, `10.000,00`, `1.000.000,00` | cálculo correto | ✅ 8.368,20 / 512,82% e 998.368,20 / 61.182,02% |
| B2 | Variação | `1800`, `1200`, `1.800,5` e igual ao original | cálculo correto; igual não altera | ✅ |
| N1 | Negativo | valor vazio, `abc` ou `0,00` | barrado ou tratado | ⚠️ Total 0 e Desconto 100%, sem aviso |
| N2 | Negativo | `-5,00` | barrado ou tratado | ⚠️ perde o sinal (vira `5,00`) |

N1 e N2 são observação ao dev, fora do escopo do card.

## Passo a passo (reproduzível)

**Fluxo base:** `/pdv-v2` > item `051` > `Alt+P` (Desconto/Acréscimo) > informar o valor no campo Vr. Unitário > Tab.

**Cenários 1 e 2:** informar `1.800,00` e depois `1.200,00`; conferir Acréscimo/Desconto, % e Total no modal e no carrinho.
**Cenário 3:** informar `1.000,00` no Vr. Acréscimo e no Vr. Desconto.
**Cenário 6:** reabrir o modal (volta ao preço padrão) e fechar a venda com os itens alterados.

## Evidência técnica (payload/requisição, quando houver)

Não se aplica: o defeito é de cálculo na tela do modal, conferido pelos valores exibidos (campos e carrinho). Nenhum payload foi capturado.

## Print/preview

- Vídeo no JAM (link no topo). A venda dos cenários 1 a 3 não foi finalizada; só o carrinho foi conferido.

## Observação de processo

- Fora do escopo: o campo **QTD** mantém a leitura antiga a partir de 1.000 (verificar se há card).
- Executado no Chrome e repetido no navegador do Claude, com o mesmo resultado nos cenários 1 a 3.

## Pendências

- [ ] Registrar a versão/build do HMG testada (o reporte cita o schema `company8`).
- [ ] Opcional: perguntar ao dev se valor vazio/`abc`/`0,00` virar 100% de desconto é o esperado.
- [ ] Antes do PR: mesclar a `main` na branch do card.
