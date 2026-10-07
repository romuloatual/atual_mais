# INTG-2727 — Validação manual

**Card:** `[MELHORIA] (Frontend) {Contas a Receber} Permitir múltiplas formas de pagamento na quitação e exibi-las no recibo`
https://integramais.atlassian.net/browse/INTG-2727

**Criticidade alta** (envolve valor recebido e baixa do título). **Status: PARCIAL em HMG** (critério de Desconto/Acréscimo
falha por defeito no backend). Entrega do dev (João Victor), branch `feat/bills-to-receive-multiple-payment-methods-INTG-2727`,
revisão de código OK (Winicios). Relacionados: INTG-2726 (Backend, `payments[]` + `paymentGrouping`; "Pronto Para Teste" no
Jira, mas a descrição técnica ainda fala em "gaps a resolver").

HMG, empresa `romulo`, PDV LOJA001, 06 e 07/10/2026. Clientes 102 (Maria das Dores) e 103 (Rômulo Alves).
Evidência em vídeo (JAM): https://jam.dev/c/a2730e10-b92d-4296-985d-01e7aefe6f6f

## O que o card pede

No modal "Quitar contas a receber": várias linhas de forma (forma + conta corrente + valor), "valor restante" em tempo real,
bloqueio só quando a soma **exceder** o total (parcial permitido), envio em uma única requisição, Desconto e Acréscimo globais
**"como hoje"** e recibo com as formas realmente usadas (nunca a forma nominal da conta).

## Critérios do card (BDD) executados

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| 1 | doc. 5002, R$19,00 | Dinheiro 10 + PicPay 9 | restante 0,00; 1 requisição; recibo lista as duas formas | ✅ recibo #5002: Dinheiro R$10 + PicPay R$9 |
| 2 | total R$25,00 | formas somam 30,00 | bloqueia, com aviso de valores divergentes | ✅ aviso exibido; restante negativo em vermelho |
| 3 | doc. 5007, R$59,00 | Dinheiro 20 + Pix 20 | restante recalcula; confirma (parcial) | ✅ recibo #5007, "parcialmente paga", restante R$19,00 |
| 4 | 2 linhas de forma | remover uma | restante recalcula; última linha não removível | ✅ |
| 5 | doc. 5005, 1 forma só | quitar | funciona como antes | ✅ recibo #5005: Dinheiro R$49, restante 0 |
| 6 | qualquer título | data de pagamento | só data na tela; hora atual no envio | ✅ `paymentDate: 2026-10-07T11:41:18` (hora real, não 00:00/12:00) |
| 7 | 2+ formas | confirmar | 1 requisição com `payments[]` | ✅ 1 `POST /receivable/payment` |
| 8 | recibo com 2+ formas | emitir | lista as formas reais, nunca "A Prazo" | ✅ recibos #5002 e #5007 |
| 9 | 2 formas, contas diferentes | quitar | cada forma usa a sua conta corrente | ✅ |
| 10 | doc. 7002, R$100, sem desconto/acréscimo | Dinheiro 60 + PicPay 40 | quita normalmente | ✅ `PAID`, pago 100, restante 0 |
| 11 | doc. 7001, R$100 | **Desconto 20**, Dinheiro 45 + Pix 35 (tela: restante 0,00) | quita normalmente | ❌ quitou só R$60, sobrou R$20 em aberto (`PAID_PARTIALLY`); recibo A4 do doc. 1020 mostra o mesmo (pago R$60, restante R$20, "sessenta reais") |
| 12 | doc. 7003, R$100 | **Desconto 20**, 1 forma (Dinheiro 80) | quita normalmente | ❌ mesmo problema: pago R$60, sobrou R$20 |
| 13 | doc. 7004, R$100 | **Acréscimo 20**, 1 forma (Dinheiro 120) | quita normalmente | ❌ 400 "A soma das formas de pagamento excede o valor total das contas selecionadas" |

## Complementares — negativo e borda (modal de quitação)

Doc. 7004 (R$100,00), testado sem confirmar a quitação, exceto onde indicado.

| # | Tipo | Quando | Então (esperado) | Obtido |
| --- | --- | --- | --- | --- |
| B1 | Borda | soma igual ao total (60 + 40 = 100,00) | permite e quita | ✅ doc. 7002 (critério 10) |
| B2 | Borda | soma R$0,01 acima do total (`100,01`) | bloqueia com aviso | ✅ restante `-0,01`; aviso "A soma dos valores das formas de pagamento não pode ultrapassar o valor total a pagar."; nenhuma requisição |
| B3 | Borda | Desconto maior que o título (`150,00` em R$100,00) | barra ou avisa | ⚠️ Total vira `-50,00` sem aviso (confirmação não executada) |
| N1 | Negativo | valor da forma vazio | barra na tela | ⚠️ campo vira `0,00`, a tela deixa enviar e o backend recusa: 400 "Valor do lançamento financeiro é obrigatório" |
| N2 | Negativo | valor `abc` (letras) | barra ou trata | ⚠️ letras descartadas, vira `0,00`, sem aviso |
| N3 | Negativo | valor `-10` | barra ou trata | ⚠️ perde o sinal, vira `10,00` (restante 90,00) — mesmo padrão do INTG-3545 e INTG-1005 |
| N4 | Negativo | 2ª linha adicionada e deixada vazia | exige o preenchimento | ✅ "Por favor, insira Forma de pagamento / Conta corrente / Valor" (com o nome dos campos); nenhuma requisição |

**Nota sobre as demais observações:**
- **Filtro por forma de abertura:** a forma escolhida ao abrir o documento limita as formas na quitação (Dinheiro → nenhuma
  extra; Pix → Dinheiro/PicPay; A Prazo → várias). Não está na regra do card; pergunta ao time. Alternativa: abrir como "A Prazo".
- **Recibo bobina:** não lista as formas (fora do escopo informado na entrega) e mostra "Restante R$40" no bloco da parcela e
  "R$20" no resumo, no mesmo recibo (doc. 1020).
- **Duplicação ao criar documento:** é outro defeito (2 `POST` idênticos em 42 ms geraram 2 registros do doc. 1022); fica em
  card separado. Com 1 clique em Salvar, os docs. 7001 a 7004 geraram 1 `POST` cada.

## Passo a passo (reproduzível)

**Fluxo base:** Financeiro > Contas a receber > Novo > Cliente `102` > Forma de pagamento `A Prazo` > Parcela `1` > Núm DOC >
Data de emissão `07/10/2026` > Valor `100` > Salvar. Depois: marcar o título na lista > **Opções de fatura** > **Quitação em lote**.

**Cenário 1 — Duas formas (critérios 1 e 10, docs. 5002 e 7002):**
1. Linha 1: Dinheiro, valor `60`. Adicionar forma de pagamento > linha 2: PicPay, valor `40`.
2. Conferir "Valor restante: R$ 0,00" > OK. Resultado: título quitado; recibo lista as duas formas.

**Cenário 2 — Soma maior que o total (critério 2 e B2):**
1. Com título de R$100,00, digitar na forma o valor `100,01`.
2. Conferir restante `-0,01` > OK. Resultado: aviso de que a soma não pode ultrapassar o total; nada é enviado.

**Cenário 3 — Pagamento parcial (critério 3, doc. 5007):**
1. Dinheiro `20` + Pix `20` em título de R$59,00. Conferir restante R$19,00 > OK.
2. Resultado: situação "Pago parcial", restante R$19,00.

**Cenário 4 — Remover linha (critério 4):**
1. Com 2 linhas, clicar no ícone de remover de uma. Conferir que o restante recalcula e que, com 1 linha, o ícone fica desabilitado.

**Cenário 5 — Desconto (critérios 11 e 12, docs. 7001 e 7003):**
1. No campo **Descontos** digitar `20` (Total passa a 80,00).
2. Doc. 7001: Dinheiro `45` + Pix `35`. Doc. 7003: só Dinheiro `80`. Conferir "Valor restante: R$ 0,00" > OK.
3. Resultado: na lista, "Pago parcial", valor 80,00, pago 60,00, a pagar 20,00.

**Cenário 6 — Acréscimo (critério 13, doc. 7004):**
1. No campo **Acréscimos** digitar `20` e na forma Dinheiro `120` > OK. Resultado: erro 400 na tela.

**Cenário 7 — Negativos do modal (N1 a N4):**
1. Valor da forma: apagar, `abc`, `-10` (sair do campo com Tab e conferir o valor). Para o vazio, clicar em OK e ler a mensagem.
2. Adicionar uma 2ª linha, deixar vazia e clicar em OK: conferir as mensagens de campo obrigatório.

**Cenário 8 — Recibo (critérios 8 e 11):** após a quitação, escolher "Emitir Recibo A4" e depois "Emitir Recibo Bobina" e conferir formas, valores e restante.

## Evidência técnica (`POST /api/v1/receivable/payment`, capturado via interceptação de XHR)

```json
// critério 11 (doc. 7001) — enviado
{ "paymentDate": "2026-10-07T11:41:18", "discountAmount": 20, "increaseAmount": 0,
  "items": [{ "id": 56 }],
  "payments": [
    { "paymentGateway": { "id": "1" }, "checkingAccount": { "id": 1 }, "amount": 45 },
    { "paymentGateway": { "id": "6" }, "checkingAccount": { "id": 1 }, "amount": 35 }
  ] }
// resposta (resumo)
{ "amount": 100, "discountAmount": 20, "totalPaid": 60, "total": 20, "status": "PAID_PARTIALLY",
  "payments": [
    { "id": 25, "amount": 45, "discountAmount": 20, "total": 25 },
    { "id": 26, "amount": 35, "discountAmount": 0,  "total": 35 }
  ] }
// critério 13 (doc. 7004) — enviado
{ "increaseAmount": 20, "discountAmount": 0, "items": [{ "id": 60 }],
  "payments": [{ "paymentGateway": { "id": "1" }, "checkingAccount": { "id": 1 }, "amount": 120 }] }
// resposta: 400 IllegalArgumentException — "A soma das formas de pagamento excede o valor total das contas selecionadas"
```

- O front envia os valores corretos em todos os casos (critérios 10 a 13); o erro está no backend (`FinancialPaymentService`).
- **Desconto:** a 1ª forma volta com `discountAmount: 20` e `total: 25` (45 − 20) e o título também guarda o desconto de 20.
  O desconto é abatido duas vezes: pago 60 em vez de 80.
- **Acréscimo:** `validateMultiFormTotal` (linha 145, chamado por `paymentMultiForm`, linha 456) compara a soma das formas (120)
  com o total das contas **sem** o acréscimo (100).
- Sem desconto/acréscimo (critério 10) o backend responde `PAID`, `totalPaid` 100.

## Print/preview

- Recibos do doc. 1020: `evidencia recibo A4.pdf` e `evidencia recibo bobina.pdf` (pasta `Cards\INTG-2727\07-10-2026`).
- Modal com desconto 20, Dinheiro 45 + Pix 35 e "Valor restante: R$ 0,00" (antes de confirmar), e o aviso de soma acima do total (B2).
- Lista de Contas a Receber: 7001 e 7003 (valor 80,00, pago 60,00, a pagar 20,00, "Pago parcial"); 7002 quitado.

## Observação de processo

- Títulos 7001 a 7004 criados no HMG para os testes (7004 no cliente 103 por engano de seleção); o 7004 segue aberto, sem baixa.
- Documentos duplicados na lista (1022, 1021 três vezes, 1001, 5008) foram preservados como evidência do defeito de duplicação.
- O erro 400 do desconto de 06/10 não se repetiu em 07/10 (o desconto passou a ser aceito, mas gravado errado); não se sabe se
  houve deploy no HMG entre os dois dias.

## Pendências

- [ ] Postar o comentário no Jira (formato JAM), com o link do vídeo.
- [ ] Perguntar ao time: o filtro por forma de abertura é intencional? Houve deploy no HMG entre 06 e 07/10?
- [ ] Confirmar a discrepância do INTG-2726 ("Pronto Para Teste" x "gaps a resolver").
- [ ] Testar desconto/acréscimo no recibo com várias formas após a definição do Backend; regressão em Contas a Pagar.
- [ ] Abrir o card do defeito de duplicação ao criar documento.
- [ ] Antes do PR: mesclar a `main` na branch do card.
