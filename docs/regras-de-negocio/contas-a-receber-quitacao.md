# Contas a Receber > Quitação e recibo

Atualizado em 08/10/2026, durante o INTG-2727. Cards: [INTG-2727](https://integramais.atlassian.net/browse/INTG-2727)
(Frontend) e [INTG-2726](https://integramais.atlassian.net/browse/INTG-2726) (Backend).

## 1. Cálculo da quitação

| # | Regra | Grau | Fonte / onde |
| --- | --- | --- | --- |
| Q1 | **Total a pagar = valor do título − desconto + acréscimo**. Ex.: 19,00 − 5,00 + 2,00 = 16,00 | ✅ | produção (docs 557 e 558); modal do HMG mostra o mesmo "Total" |
| Q2 | **Restante = total a pagar − total pago.** Quando o restante é 0, a situação vira **Pago** (`PAID`) | ✅ | produção 557/558 |
| Q3 | Pagamento menor que o total é permitido: a situação vira **Pago parcial** e o restante fica em aberto | ✅ | HMG, doc. 5007 e card INTG-2727 |
| Q4 | Desconto e acréscimo são **campos globais da quitação** (um valor só, não por forma de pagamento) | ✅ | card INTG-2727 |
| Q5 | Contrato da forma única: `amount` = valor **bruto** do título; `total` = valor líquido (bruto − desconto + acréscimo) | ✅ | produção: `amount 10, desconto 1, total 9` |
| Q6 | Na produção a data de pagamento vai com hora **fixa `12:00:00`**; o card pede a hora atual no HMG | 🟡 | produção (2 testes); HMG a conferir |

## 2. Múltiplas formas de pagamento (INTG-2727)

| # | Regra | Grau | Fonte / onde |
| --- | --- | --- | --- |
| M1 | Cada linha tem **forma, conta corrente e valor**; a conta corrente é **por forma** | ✅ | card; HMG |
| M2 | Mínimo de 1 linha; com 1 linha só, o botão de remover fica **desabilitado** | ✅ | card; HMG |
| M3 | "Valor restante" aparece **em tempo real** = total − soma das formas | ✅ | card; HMG |
| M4 | Soma ≤ total confirma; soma **maior** que o total **bloqueia**, com o aviso "A soma dos valores das formas de pagamento não pode ultrapassar o valor total a pagar" | ✅ | card; HMG |
| M5 | **As formas disponíveis na quitação dependem da forma de pagamento escolhida na abertura do documento**: Dinheiro → nenhuma; A Prazo → várias; Pix → Dinheiro ou PicPay | 🟡 / ❓ | HMG; no código há filtro por `paymentType.code`. **Não está na Regra de Negócio do card:** perguntar se é intencional |
| M6 | Linha com valor 0,00 e duas linhas com a mesma forma: o card não define o comportamento | ❓ | pergunta ao dev |
| M7 | Quitação com Desconto ou Acréscimo e múltiplas formas: a tela calcula certo (restante 0,00), mas o backend responde **400 "A soma das formas de pagamento excede o valor total"** e o desconto aparece cobrado em dobro | ❌ | HMG; na produção (forma única) o mesmo cenário funciona. Hipótese: o backend novo compara a soma das formas com o valor bruto ou aplica o desconto de novo |

## 3. Recibo

| # | Regra | Grau | Fonte / onde |
| --- | --- | --- | --- |
| R1 | O recibo A4 e o da Bobina vêm de requisições separadas (`receible-receipt-a4` e `receible-receipt-plus`) que recebem a conta quitada | ✅ | produção |
| R2 | O recibo deve listar as **formas reais** usadas (ex.: Dinheiro e PicPay), não a forma nominal da conta ("A Prazo") | ✅ | card; HMG (recibos 5002 e 5007) |
| R3 | Recibo **com desconto** está errado na produção. **A4:** valor da parcela = título − desconto, **valor pago = 0**, restante = parcela. **Bobina:** "restante" da parcela = o desconto, enquanto o "total restante" do resumo está certo | ❌ / 🟡 | produção (docs 557 e 558). As fórmulas são inferidas de 2 exemplos. Comparar com o HMG antes de abrir card próprio |
| R4 | Como o recibo deve exibir desconto/acréscimo quando há várias formas: o card diz que depende da definição do Backend | ❓ | card INTG-2727 |

## Ver também

- Evidência do card: `tests/cards/INTG-2727-evidencias.md` (na branch `card/INTG-2727`).
- Defeito separado: criar documento em Contas a Receber envia 2 requisições `POST /receivable` idênticas.
