# INTG-2727 — Validação manual

> Estado final do conhecimento em 08/10/2026. Regras descobertas: `docs/regras-de-negocio/contas-a-receber-quitacao.md`.

**Card:** `[MELHORIA] (Frontend) {Contas a Receber} Permitir múltiplas formas de pagamento na quitação e exibi-las no recibo`
https://integramais.atlassian.net/browse/INTG-2727

**Criticidade alta (financeiro).** **Status: 🟡 PARCIAL em HMG.**
Depende do Backend [INTG-2726](https://integramais.atlassian.net/browse/INTG-2726) (também "Pronto Para Teste" no Jira, apesar da descrição técnica ainda falar em "gaps a resolver"). Branch `card/INTG-2727`.

HMG, empresa `romulo`, PDV LOJA001, 06 a 08/10/2026. Produção (conta de teste) usada **só para comparação**, sem emitir nota.
Evidência em vídeo (JAM): pendente

## O que o card pede

No modal "Quitar contas a receber": várias linhas de forma de pagamento (forma + conta corrente + valor), "valor restante" em tempo real, bloqueio só quando a soma **exceder** o total, uma única requisição, recibo com as formas reais. **Desconto/acréscimo permanecem no nível da quitação, "como hoje".**

## Critérios do card (BDD) executados

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| 1 | doc. 5002, R$19,00, aberto como A Prazo | Dinheiro 10,00 + PicPay 9,00 | restante 0,00; recibo lista as duas formas | ✅ recibo #5002 |
| 2 | total R$25,00 | formas somando R$30,00 | bloqueia com aviso de valores divergentes | ✅ aviso exibido |
| 3 | doc. 5007, R$59,00 | Dinheiro 20 + Pix 20 (parcial) | restante recalcula; confirmação permitida | ✅ "parcialmente paga", restante R$19,00 |
| 4 | 2 linhas | remover uma | restante recalcula; última linha não removível | ✅ |
| 5 | doc. 5005, 1 forma | quitar normalmente | funciona como antes | ✅ recibo #5005 |
| 6 | doc. 0007 | confirmar a quitação | data com hora atual anexada no envio | ✅ `paymentDate: 2026-10-08T10:31:46` (produção envia `12:00:00` fixo) |
| 7 | doc. 0007 | confirmar | 1 requisição com `payments[]` | ✅ 1 só `POST /receivable/payment` |
| 8 | recibos #5002/#5007/0007 | abrir recibo | lista as formas reais, não "A Prazo" | ✅ (A4 lista "Dinheiro") |
| 9 | 2 linhas | contas correntes diferentes por forma | cada forma usa a sua conta | ✅ |
| 10 | título com Desconto ou Acréscimo | formas somando o total que a tela mostra | confirmar e quitar normalmente, "como hoje" | ❌ ver tabela abaixo |

**Em resumo (item 10):** a tela trata o valor da forma como **líquido** (já com desconto/acréscimo). O backend trata como **bruto** e ignora desconto/acréscimo no restante. Resultado: título quitado errado, bloqueio indevido ou 400.

| Doc. | Título | Ajuste | Forma enviada | Tela dizia | Backend respondeu |
| --- | --- | --- | --- | --- | --- |
| 0007 | 500,00 | desconto 50,00 | 450,00 | restante 0,00 | **parcial**, restante 50,00 (desconto "cobrado em dobro") |
| 1017 | 100,00 | acréscimo 10,00 | 110,00 | restante 0,00 | **400** "soma excede o total das contas" |
| 1017 | 100,00 | acréscimo 10,00 | 90,00 | restante 20,00 | parcial, restante 10,00 |
| 0006 | 500,00 | acréscimo 50,00 | 500,00 | restante 50,00 | **PAID**, restante 0,00 |

**Prova (chamadas diretas à API no HMG, 08/10, títulos de R$100,00):** o backend está coerente quando recebe o valor **bruto**.

| Chamada | Enviado | Resultado |
| --- | --- | --- |
| A: formato antigo (forma única) + desconto 10 | `amount 100, total 90` | PAID, pago 90, restante 0 ✅ |
| B: formato novo (`payments[]`) + desconto 10 | forma **100** (bruto) | PAID, pago 90, restante 0 ✅ |
| C: formato novo + acréscimo 10 | forma **100** (bruto) | PAID, pago 110, restante 0 ✅ |

Conclusão: o backend mantém o comportamento da produção; o que destoa é a **modal nova enviar o valor líquido** (450, 110) onde o backend espera o bruto (500, 100).

Regra do backend que explica os 4 casos: soma das formas ≤ título; **total pago = soma − desconto + acréscimo**; **restante = título − soma**. Na produção (forma única) funciona porque `amount` é o bruto do título.

## Complementares — negativo e borda (não decidem o veredito)

| # | Tipo | Quando | Então (esperado) | Obtido |
| --- | --- | --- | --- | --- |
| N1 | Negativo | documento aberto como Dinheiro | lista de formas disponível | ⚠️ lista **vazia**; A Prazo libera várias, Pix libera Dinheiro/PicPay. Regra não escrita no card: pergunta ao time |
| N2 | Negativo | linha com valor 0,00 / forma duplicada | card não define | ❓ não testado, pergunta ao dev |
| B1 | Borda | soma 0,01 a mais/menos que o total | bloqueia / permite | ⏳ não executado |

## Passo a passo (reproduzível)

**Fluxo base:** Financeiro > Contas a Receber > título aberto como A Prazo > menu da linha > Quitar.

**Cenário 10 — desconto:** título de R$500,00; Desconto 50,00; no valor da forma digitar 500 (tela bloqueia: restante −50) e depois 450 (tela libera). Confirmar: o título fica "Pago parcial" com restante R$50,00, e o recibo mostra Pago R$400,00.

**Cenário 10b — acréscimo:** título de R$100,00; Acréscimo 10,00; valor 110 → erro 400. Valor 90 → parcial (tela diz 20 de restante, backend 10).

## Evidência técnica (payload/requisição, quando houver)

```json
// HMG doc. 0007: enviado
{ "paymentDate": "2026-10-08T10:31:46", "increaseAmount": 0, "discountAmount": 50,
  "items": [{ "id": 70 }], "payments": [{ "paymentGateway": {"id":"1"}, "checkingAccount": {"id":1}, "amount": 450 }] }
// resposta (resumo)
{ "status": "PAID_PARTIALLY", "amount": 500, "totalPaid": 400, "discountAmount": 50, "total": 50 }
// Produção doc. 557 (forma única, referência): amount 10, discountAmount 1, total 9 -> PAID, totalPaid 9
```

- Produção usa `amount` bruto + `total` líquido; o HMG manda só `payments[].amount` (líquido na tela) e o backend subtrai o desconto de novo. Com valor bruto o backend fecha certo (chamadas A, B e C acima).

## Print/preview

- Recibos A4 e Bobina da produção (557, 558, 559, 561) e do HMG (0006, 0007, 1017) ficam na pasta local de documentação (contêm CNPJ/CPF: **não subir ao GitHub**).
- Recibo no HMG: A4 lista a forma e os números batem com o dado gravado. Persistem: **acréscimo impresso como "Juros"** (A4 e Bobina) e **"RESTANTE" da parcela na Bobina inconsistente** com o "TOTAL RESTANTE". Os dois já existem na produção: card próprio.

## Observação de processo

- Os testes na produção (conta de teste, valores pequenos, sem nota fiscal) serviram de baseline; o gravador de requisições mascarou tokens e senhas.
- A numeração da branch foi corrigida em 06/10 (era `INTG-2726`, que é o Backend).

## Pendências

- [ ] Abrir bug de Frontend (subtarefa do INTG-2727): a modal envia o valor da forma como líquido; o backend (igual à produção) espera bruto. O time confirma qual lado muda (INTG-2726 e INTG-2727 divergem no texto).
- [ ] Abrir card próprio: recibo imprime acréscimo como "Juros" e "RESTANTE" da parcela da Bobina inconsistente.
- [ ] Perguntar ao time: filtro de formas pela forma de abertura (Dinheiro = nenhuma) é intencional?
- [ ] Confirmar a discrepância de status do INTG-2726.
- [ ] Gravar JAM do item 10 (0007 e 1017).
- [ ] Antes do PR: mesclar a `main` na branch do card.
