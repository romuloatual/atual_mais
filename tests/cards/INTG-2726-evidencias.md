# INTG-2726 — Validação manual

**Card:** `[MELHORIA] (Frontend) {Contas a Receber} Permitir múltiplas formas de pagamento na quitação e exibi-las no recibo`
https://integramais.atlassian.net/browse/INTG-2726

**Status: AGUARDANDO.** Depende de um card de Backend (aceitar múltiplas formas numa única quitação) e, segundo o
próprio card, "nada do comportamento multi-forma está implementado" na versão oficial. **Não testar antes de
confirmar que a tela em HMG já mudou.**

## O que o card pede

No modal "Quitar contas a receber": permitir várias linhas de forma de pagamento (forma + conta corrente + valor),
com "valor restante" em tempo real, bloqueando a confirmação só quando a soma **exceder** o total (parcial é
permitido). Enviar tudo numa única requisição. O recibo deve listar as formas realmente usadas (hoje mostra a forma
nominal da conta, ex. "A Prazo", porque lê a lista de contas em vez da lista de pagamentos).

## Checklist — antes de testar

- [ ] Abrir Financeiro > Contas a Receber > Quitar uma conta qualquer em HMG.
- [ ] O modal mostra um botão de **adicionar forma de pagamento** (mais de uma linha)? Se não, a feature não está em
  HMG ainda — parar aqui, registrar "aguardando deploy" e avisar.
- [ ] Se mostrar, conferir a pré-condição do card: ainda é possível quitar com uma forma só (não-regressão)?

## Cenários (BDD) — do card + complementares

Total a pagar de exemplo do card: R$19,00. Fluxo base: Financeiro > Contas a Receber > localizar um título >
Quitar > modal "Quitar contas a receber".

| # | Tipo | Dado | Quando | Então (esperado) | Obtido |
| --- | --- | --- | --- | --- | --- |
| 1 | Feliz | total R$19,00 | adicionar Dinheiro 10,00 + PicPay 9,00 | valor restante 0,00; confirma em 1 requisição; recibo lista as duas formas | Pendente |
| 2 | Negativo | total R$19,00 | soma das formas R$25,00 | bloqueia a confirmação, aviso de valores divergentes | Pendente |
| 3 | Borda | total R$19,00 | soma das formas R$15,00 | valor restante 4,00; confirmação permitida (parcial) | Pendente |
| 4 | Feliz | 2 linhas adicionadas | remover uma | valor restante recalcula; última linha não pode ser removida (botão desabilitado) | Pendente |
| 5 | Regressão | 1 forma só | quitar normalmente | funciona como a versão oficial; recibo mostra essa forma | Pendente |
| B1 | Borda | total R$19,00 | soma exatamente igual ao total, com centavos (ex.: 6,33 + 6,33 + 6,34) | valor restante 0,00, sem erro de arredondamento | Pendente |
| B2 | Borda | — | soma 0,01 a mais que o total | bloqueia (limite exato do aviso) | Pendente |
| B3 | Borda | — | soma 0,01 a menos que o total | permite (parcial, limite exato) | Pendente |
| N1 | Negativo | — | linha com valor 0,00 | aceita, barra, ou ignora? (não especificado pelo card — perguntar) | Pendente |
| N2 | Negativo | — | linha sem forma de pagamento selecionada, só valor | deve bloquear (campo obrigatório) | Pendente |
| N3 | Negativo | — | duas linhas com a mesma forma (ex.: Dinheiro + Dinheiro, contas diferentes) | permitido ou bloqueado? (não especificado — perguntar) | Pendente |
| 6 | Regressão | — | campo "Data de pagamento" | continua só com a data; hora é anexada no envio (conferir payload) | Pendente |
| 7 | Técnico | pedido com 2+ formas | conferir payload da confirmação (DevTools) | uma única requisição com `payments[]`, não uma por forma | Pendente |
| 8 | Técnico | recibo do pedido com 2+ formas | conferir se lista as formas reais, não a forma da conta (ex. não deve aparecer "A Prazo" fixo) | Pendente |

## Pendências

- [ ] Confirmar com o time se o Backend (card relacionado) e este Frontend já estão em HMG.
- [ ] Perguntar ao dev: N1 (valor 0,00) e N3 (forma duplicada) — comportamento esperado?
- [ ] Ponto já sinalizado pelo próprio card: exibição de desconto/acréscimo no recibo com várias formas depende da
  definição do Backend — só testar depois que isso for definido.
- [ ] Antes do PR: mesclar a `main` na branch do card.
