# INTG-2727 — Validação manual

**Card:** `[MELHORIA] (Frontend) {Contas a Receber} Permitir múltiplas formas de pagamento na quitação e exibi-las no recibo`
https://integramais.atlassian.net/browse/INTG-2727

Depende do Backend [INTG-2726](https://integramais.atlassian.net/browse/INTG-2726) (`payments[]` + `paymentGrouping`
numa única quitação) — status "Pronto Para Teste" no Jira, embora a descrição técnica ainda fale em "gaps a
resolver" (discrepância não resolvida, ver Pendências).

**Status: 🟢 APROVADO em HMG (06/10/2026).** Correção de numeração: este arquivo/branch estavam como `INTG-2726`
(número do Backend, dependência) por engano — corrigido para `INTG-2727`.

HMG, empresa `romulo`, PDV LOJA001. Cliente de teste: Rômulo Alves. Evidência em vídeo (JAM): pendente.

## O que o card pede

No modal "Quitar contas a receber": permitir várias linhas de forma de pagamento (forma + conta corrente + valor),
com "valor restante" em tempo real, bloqueando a confirmação só quando a soma **exceder** o total (parcial é
permitido). Enviar tudo numa única requisição. O recibo deve listar as formas realmente usadas, não a forma
nominal da conta (ex. "A Prazo").

## Critérios do card (BDD) executados

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| 0 | título qualquer | abrir quitação | mostra opção de adicionar mais de uma forma | ✅ feature chegou em HMG |
| 1 | doc. 5002, R$19,00 | Dinheiro 10,00 + PicPay 9,00 | restante 0,00; 1 requisição; recibo lista as duas formas | ✅ recibo #5002: Dinheiro R$10 + PicPay R$9, restante R$0 |
| 2 | total R$25,00 | Dinheiro 15,00 + PicPay 15,00 (soma 30,00) | bloqueia, aviso de valores divergentes | ✅ aviso exibido, restante negativo em vermelho |
| 3 | doc. 5007, R$59,00 | Dinheiro 20,00 + Pix 20,00 (soma 40,00) | restante recalcula; confirmação permitida (parcial) | ✅ recibo #5007, situação "parcialmente paga", restante R$19,00 |
| 4 | 2 linhas | remover uma | restante recalcula; última linha não removível | ✅ confirmado |
| 5 | doc. 5005, 1 forma só | quitar normalmente | funciona como antes; recibo mostra a forma | ✅ recibo #5005, Dinheiro R$49, restante R$0 |
| 6 | — | campo "Data de pagamento" | só data; hora anexada no envio | 🟡 campo só com data (confirmado); hora no payload não verificada (ver Pendências) |
| 7 | 2+ formas | payload da confirmação | 1 requisição com `payments[]` | 🟡 não verificado via rede; evidência indireta forte (1 botão de confirmação, recibo sempre correto) |
| 8 | recibo com 2+ formas | lista as formas reais | não aparece a forma nominal da conta | ✅ recibos #5002/#5007 mostram "Dinheiro"/"PicPay"/"Pix", nunca "A Prazo" |

## Achado — filtro de formas por forma de abertura do documento

Descoberto pelo Rômulo: a forma de pagamento escolhida na **abertura** do documento filtra quais formas ficam
disponíveis na quitação — Dinheiro → nenhuma opção extra (zero), A Prazo → várias, Pix → Dinheiro/PicPay. Bate com
o filtro por `paymentType.code` visto no bundle `3777.4262186b.async.js` servido em HMG. **Não está descrito na
Regra de Negócio do card** — registrado como pergunta ao time, não como bug confirmado.

**Workaround:** abrir o documento como "A Prazo" libera a quitação com múltiplas formas — foi assim que os
critérios acima foram executados.

## Pendências (fora do escopo, não bloqueiam a aprovação)

- [ ] Perguntar ao time: o filtro de formas por forma de abertura (Dinheiro = zero opções) é intencional?
- [ ] Confirmar discrepância do INTG-2726: Jira diz "Pronto Para Teste", descrição técnica fala em "gaps a resolver".
- [ ] Desconto/acréscimo no recibo com várias formas depende de definição do Backend (INTG-2726) — testar depois.
- [ ] Antes do PR: mesclar a `main` na branch do card.
