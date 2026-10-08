# Contas a Receber > Quitação e recibo

Atualizado em 08/10/2026 (após testes em HMG e produção), durante o INTG-2727. Cards: [INTG-2727](https://integramais.atlassian.net/browse/INTG-2727)
(Frontend) e [INTG-2726](https://integramais.atlassian.net/browse/INTG-2726) (Backend).

## 1. Cálculo da quitação

| # | Regra | Grau | Fonte / onde |
| --- | --- | --- | --- |
| Q1 | **Total a pagar = valor do título − desconto + acréscimo**. Ex.: 10,00 − 1,00 = 9,00 (desconto) ou 3,00 + 1,00 = 4,00 (acréscimo) | ✅ | produção (docs 557 e 558); modal do HMG mostra o mesmo "Total" |
| Q2 | **Restante = total a pagar − total pago.** Quando o restante é 0, a situação vira **Pago** (`PAID`) | ✅ | produção 557/558 |
| Q3 | Pagamento menor que o total é permitido: a situação vira **Pago parcial** e o restante fica em aberto | ✅ | HMG, doc. 5007 e card INTG-2727 |
| Q4 | Desconto e acréscimo são **campos globais da quitação** (um valor só, não por forma de pagamento) | ✅ | card INTG-2727 |
| Q5 | Contrato da forma única: `amount` = valor **bruto** do título; `total` = valor líquido (bruto − desconto + acréscimo) | ✅ | produção: `amount 10, desconto 1, total 9` |
| Q6 | Na produção a data de pagamento vai com hora **fixa `12:00:00`**. No HMG (múltiplas formas) vai a **hora atual** (ex.: `10:31:46`), como o card pede | ✅ | produção (557, 558, 561) e HMG (0007) |
| Q7 | **Desconto e acréscimo não podem ser usados ao mesmo tempo** na quitação | 🟡 | informado pelo Rômulo; falta a fonte (card/manual). Em 06/10 a modal do HMG aceitou os dois preenchidos juntos: ❓ verificar se a produção bloqueia |

## 2. Múltiplas formas de pagamento (INTG-2727)

| # | Regra | Grau | Fonte / onde |
| --- | --- | --- | --- |
| M1 | Cada linha tem **forma, conta corrente e valor**; a conta corrente é **por forma** | ✅ | card; HMG |
| M2 | Mínimo de 1 linha; com 1 linha só, o botão de remover fica **desabilitado** | ✅ | card; HMG |
| M3 | "Valor restante" aparece **em tempo real** = total − soma das formas | ✅ | card; HMG |
| M4 | Soma ≤ total confirma; soma **maior** que o total **bloqueia**, com o aviso "A soma dos valores das formas de pagamento não pode ultrapassar o valor total a pagar" | ✅ | card; HMG |
| M5 | **As formas disponíveis na quitação dependem da forma de pagamento escolhida na abertura do documento**: Dinheiro → nenhuma; A Prazo → várias; Pix → Dinheiro ou PicPay | 🟡 / ❓ | HMG; no código há filtro por `paymentType.code`. **Não está na Regra de Negócio do card:** perguntar se é intencional |
| M6 | Linha com valor 0,00 e duas linhas com a mesma forma: o card não define o comportamento | ❓ | pergunta ao dev |
| M7 | **Contrato bruto x líquido:** a modal nova envia o valor da forma como **líquido** (total ajustado); o backend espera **bruto**, igual à produção. Efeitos: desconto deixa o restante em aberto (0007), acréscimo igual ao total ajustado dá **400** (1017), acréscimo pode fechar como PAID com a tela dizendo parcial (0006) | ❌ | HMG 0006, 0007, 1017. **Provado por API:** com valor bruto o backend fecha certo (desconto 10 e acréscimo 10 em título de 100 → PAID). Defeito da modal; o time confirma qual lado muda |
| M8 | **Regra do backend (múltiplas formas e forma única):** soma das formas ≤ título, senão 400 · total pago = soma − desconto + acréscimo · restante = título − soma · PAID quando restante = 0. O formato antigo (forma única) continua funcionando igual à produção | ✅ | HMG: 4 testes pela tela e 3 chamadas de API (08/10) |

## 3. Recibo

| # | Regra | Grau | Fonte / onde |
| --- | --- | --- | --- |
| R1 | O recibo A4 e o da Bobina vêm de requisições separadas (`receible-receipt-a4` e `receible-receipt-plus`) que recebem a conta quitada | ✅ | produção |
| R2 | O recibo deve listar as **formas reais** usadas (ex.: Dinheiro e PicPay), não a forma nominal da conta ("A Prazo") | ✅ | card; HMG (recibos 5002 e 5007) |
| R3 | **Recibo da produção com desconto/acréscimo:** A4 mostra pago 0,00 e restante = parcela; Bobina mostra "restante" da parcela diferente do "total restante" (igual ao desconto, ou negativo com acréscimo) | ❌ | produção 557, 558, 559, 561 |
| R5 | No HMG o **A4 foi corrigido** (lista a forma e os números batem com o dado gravado) | ✅ | HMG 1017 e 0007 |
| R6 | Persistem no HMG e na produção: **acréscimo impresso como "Juros"** (linha "Acréscimos" zerada) e **"restante" da parcela da Bobina inconsistente** (1017: 0,00 contra 10,00; 0006: −50,00; 0007: 100,00 contra 50,00). **Card próprio** | ❌ | HMG 0006, 0007, 1017; produção 559, 561 |
| R4 | Como o recibo deve exibir desconto/acréscimo quando há várias formas: o card diz que depende da definição do Backend | ❓ | card INTG-2727 |

## Ver também

- Evidência do card: `tests/cards/INTG-2727-evidencias.md` (na branch `card/INTG-2727`).
- Defeito separado: criar documento em Contas a Receber envia 2 requisições `POST /receivable` idênticas.
