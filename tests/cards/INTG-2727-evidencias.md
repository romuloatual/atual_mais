# INTG-2727 — Validação manual

**Card:** `[MELHORIA] (Frontend) {Contas a Receber} Permitir múltiplas formas de pagamento na quitação e exibi-las no recibo`
https://integramais.atlassian.net/browse/INTG-2727

Depende do Backend [INTG-2726](https://integramais.atlassian.net/browse/INTG-2726) (aceitar múltiplas formas numa
única quitação, `payments[]` + `paymentGrouping`) — marcado como **"Pronto Para Teste"** no Jira, embora a
descrição técnica do próprio card ainda liste "gaps a resolver"/"proposta de alterações" em tempo futuro.
**Discrepância registrada, não resolvida** — ver "Pendências".

> **Nota de correção (06/10/2026):** este arquivo e a branch estavam nomeados `INTG-2726` por engano — esse é o
> número do card de Backend (a dependência acima), não deste card. Corrigido para `INTG-2727`.

**Status do card no Jira: "Pronto Para Teste".** **Resultado do teste: 🔴 BLOQUEADO em HMG.** Modal com a tela
nova, mas o campo "Forma de pagamento" não abre a lista de opções em nenhuma linha — impossível selecionar uma
forma, impossível executar qualquer cenário do card.

HMG, empresa `romulo`, PDV LOJA001, 06/10/2026. Lançamento de teste: Rômulo Alves, doc. 5001, R$150,00. Evidência
em vídeo (JAM): _pendente — gravar ao reexecutar após a correção do dev._

## O que o card pede

No modal "Quitar contas a receber": permitir várias linhas de forma de pagamento (forma + conta corrente + valor),
com "valor restante" em tempo real, bloqueando a confirmação só quando a soma **exceder** o total (parcial é
permitido). Enviar tudo numa única requisição. O recibo deve listar as formas realmente usadas (hoje mostra a forma
nominal da conta, ex. "A Prazo", porque lê a lista de contas em vez da lista de pagamentos).

## Critérios do card (BDD) executados

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| 0 | Modal "Quitar contas a receber" em HMG | abrir a quitação de um título qualquer | mostra opção de adicionar mais de uma linha de forma de pagamento | ✅ mostra — feature de tela chegou em HMG |
| 1 | total R$19,00 | adicionar Dinheiro 10,00 + PicPay 9,00 | valor restante 0,00; confirma em 1 requisição; recibo lista as duas formas | ⛔ bloqueado — ver "Achado técnico" |
| 2 | total R$19,00 | soma das formas R$25,00 | bloqueia a confirmação, aviso de valores divergentes | ⛔ bloqueado |
| 3 | total R$19,00 | soma das formas R$15,00 | valor restante 4,00; confirmação permitida (parcial) | ⛔ bloqueado |
| 4 | 2 linhas adicionadas | remover uma | valor restante recalcula; última linha não pode ser removida (botão desabilitado) | ⛔ bloqueado |
| 5 | 1 forma só (não-regressão) | quitar normalmente | funciona como a versão oficial; recibo mostra essa forma | ⛔ bloqueado — ver nota abaixo |
| 6 | — | campo "Data de pagamento" | continua só com a data; hora é anexada no envio (conferir payload) | ⛔ bloqueado |
| 7 | pedido com 2+ formas | conferir payload da confirmação (DevTools) | uma única requisição com `payments[]`, não uma por forma | ⛔ bloqueado |
| 8 | recibo do pedido com 2+ formas | conferir se lista as formas reais | não deve aparecer a forma nominal da conta (ex. "A Prazo") | ⛔ bloqueado |

**Nota sobre o item 5:** mesmo o fluxo de **uma única forma** não pôde ser validado de ponta a ponta — a 1ª linha só
tem um valor porque veio pré-preenchida pelo padrão configurado em Configurações > Contas a Receber (ver "Achado
técnico"), não porque o campo funciona. Sem esse padrão configurado, nem o caminho antigo (forma única) seria
possível na tela nova.

## Complementares — borda e negativo do card (ainda não especificados)

Pendentes de execução, bloqueados pelo mesmo achado técnico:

| # | Tipo | Quando | Então (esperado) |
| --- | --- | --- | --- |
| B1 | Borda | soma exatamente igual ao total, com centavos (ex.: 6,33 + 6,33 + 6,34 = 19,00) | valor restante 0,00, sem erro de arredondamento |
| B2 | Borda | soma 0,01 a mais que o total | bloqueia (limite exato do aviso) |
| B3 | Borda | soma 0,01 a menos que o total | permite (parcial, limite exato) |
| N1 | Negativo | linha com valor 0,00 | aceita, barra, ou ignora? (não especificado pelo card — perguntar) |
| N2 | Negativo | linha sem forma de pagamento selecionada, só valor | deve bloquear (campo obrigatório) |
| N3 | Negativo | duas linhas com a mesma forma (ex.: Dinheiro + Dinheiro, contas diferentes) | permitido ou bloqueado? (não especificado — perguntar) |

## Achado técnico — bloqueador

**Cenário técnico — negativo: campo "Forma de pagamento" não abre a lista de opções**

- **Dado** o modal "Quitar contas a receber" aberto, com uma linha de forma de pagamento (1ª, pré-preenchida com
  "Dinheiro" pelo padrão configurado) e uma 2ª linha adicionada (vazia)
- **Quando** clico no campo "Forma de pagamento" de qualquer uma das linhas
- **Então** deveria abrir a lista de formas cadastradas (Dinheiro, PicPay, Cartão, etc.)

**Obtido:** ❌ falhou — o campo entra em foco, mas nenhuma lista de opções aparece em nenhuma linha. Reportado
originalmente pelo Rômulo: "teve uma [opção] que apareceu mas depois sumiu".

**Passo a passo (reproduzível):**
1. Financeiro > Contas a Receber > localizar um título em aberto > menu da linha (ícone "⋮" em Situação) > Quitar.
2. No modal, observar a 1ª linha de "Formas de pagamento" — já vem com um valor (ex.: "Dinheiro"), herdado do
   padrão configurado em Configurações > Contas a Receber.
3. Clicar no campo "Forma de pagamento" da 1ª linha: nenhuma lista aparece.
4. Clicar em "+ Adicionar forma de pagamento" (cria uma 2ª linha, vazia).
5. Clicar no campo "Forma de pagamento" da 2ª linha: campo fica em foco (cursor piscando), nenhuma lista aparece.
6. Digitar um texto de busca (ex.: "din"): o valor é registrado no campo, mas a lista de opções continua sem
   aparecer.

**Evidência técnica (DevTools, console + Network + inspeção de DOM):**
```
// Console: sem erro no momento do clique
// Network: nenhuma chamada relacionada a forma de pagamento/gateway disparada ao clicar no campo
//          (sem resultado para filtro "payment" / "gateway" / "method")
// DOM, após clicar e digitar "din" na 2ª linha:
document.getElementById('paymentMethods_1_paymentGateway').value === 'din'  // true — valor digitado registrado
document.querySelectorAll('.ant-select-dropdown').length === 1             // só existe 1 dropdown na página inteira,
                                                                             // e pertence a outro campo (filtro de
                                                                             // Cliente da tela de fundo), oculto
```
Conclusão provada: a lista de opções do campo "Forma de pagamento" não está sendo renderizada nesse modal, em
nenhuma das linhas — não é lentidão, não é erro de digitação/filtro, e não é específico da 2ª linha.

**Causa provável (bate com as próprias notas técnicas do card):** a seção "Notas técnicas" do INTG-2727 lista como
item 1 do escopo a construir: refatorar `AutoCompletePaymentGatewayReceipt.tsx` para aceitar `name`/`label`/
`required`, porque hoje usa `name="paymentId"` **fixo** — "impede uso indexado em `Form.List`" (nas palavras do
próprio card). Isso é exatamente o sintoma reproduzido: um componente de autocomplete com nome de campo fixo,
usado dentro de uma lista indexada (uma instância por linha de forma de pagamento), não consegue vincular a opção
certa a cada linha. **Esse item do plano do dev aparenta não ter sido feito ainda**, apesar do card estar marcado
"Pronto Para Teste" no Jira.

**Impacto:** bloqueia 100% dos cenários do card (não dá pra adicionar uma 2ª forma sem selecionar qual é ela, nem
confirmar o caminho de uma forma só sem depender do padrão pré-configurado).

## Investigação complementar — isolamento da causa (Backend x Frontend)

**Cenário técnico — comparação: o catálogo de forma de pagamento funciona em outro lugar do sistema?**

- **Dado** o card de Backend relacionado (INTG-2726) ainda não implementado, o que poderia sugerir que o campo
  trava "porque o Backend não está pronto"
- **Quando** testo o mesmo tipo de campo "forma de pagamento" em outro fluxo que não depende do INTG-2726: PDV
  (Venda Rápida) > tela de Pagamento > "Adicionar Pagamento"
- **Então** se a lista abrir normalmente ali, a dependência do Backend não é a causa do bloqueio no INTG-2727

**Obtido:** ✅ confirma a hipótese de descarte — no PDV, a lista abre e funciona normalmente (Dinheiro, Cartão de
Crédito, Cartão de Débito, PicPay, Pix, Cartão/Cheque compensado), sem nenhum problema. O catálogo de formas de
pagamento existe e funciona no sistema; o bug é isolado ao componente novo do modal de quitação de Contas a
Receber, **não depende do INTG-2726**. Pode e deve ser reportado como bug agora, no INTG-2727.

## Observação de processo

Numeração do card/branch corrigida em 06/10/2026: o arquivo e a branch estavam como `INTG-2726` (número do card de
Backend, citado como dependência no texto original do card de Frontend) em vez de `INTG-2727` (o próprio card).
Corrigido antes de postar qualquer comentário no Jira.

## Pendências

- [ ] Reportar o bug (campo "Forma de pagamento" sem lista de opções) no INTG-2727 — comentário pronto no padrão JAM,
  apontando a causa provável (item 1 das notas técnicas do próprio card, autocomplete não refatorado).
- [ ] Confirmar com o time a discrepância do INTG-2726 (Backend): status no Jira é "Pronto Para Teste", mas a
  descrição técnica do card ainda fala em "gaps a resolver" — qual das duas está desatualizada?
- [ ] Depois que o dev corrigir: reexecutar os critérios 1–8 e os complementares (B1-B3, N1-N3), com vídeo JAM.
- [ ] Perguntar ao dev: N1 (valor 0,00) e N3 (forma duplicada) — comportamento esperado?
- [ ] Ponto já sinalizado pelo próprio card: exibição de desconto/acréscimo no recibo com várias formas depende da
  definição do Backend (INTG-2726) — só testar depois que isso for definido.
- [ ] Antes do PR: mesclar a `main` na branch do card.
