# INTG-2727 — Validação manual

**Card:** `[MELHORIA] (Frontend) {Contas a Receber} Permitir múltiplas formas de pagamento na quitação e exibi-las no recibo`
https://integramais.atlassian.net/browse/INTG-2727

Depende do Backend [INTG-2726](https://integramais.atlassian.net/browse/INTG-2726) (aceitar múltiplas formas numa
única quitação, `payments[]` + `paymentGrouping`) — marcado como **"Pronto Para Teste"** no Jira, embora a
descrição técnica do próprio card ainda liste "gaps a resolver"/"proposta de alterações" em tempo futuro.
**Discrepância registrada, não resolvida** — ver "Pendências".

> **Nota de correção (06/10/2026):** este arquivo e a branch estavam nomeados `INTG-2726` por engano — esse é o
> número do card de Backend (a dependência acima), não deste card. Corrigido para `INTG-2727`.

**Status do card no Jira: "Pronto Para Teste".** **Resultado do teste: 🟡 BLOQUEADO/CONDICIONADO em HMG.** Modal
com a tela nova; o campo "Forma de pagamento" **filtra as opções de acordo com a forma de pagamento escolhida na
abertura do documento a receber** (achado pelo Rômulo, testando na prática — ver "Achado técnico" para a matriz
e a causa no código). Para "Dinheiro", o filtro zera todas as opções, impossibilitando testar o card nesse caso.

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
| 1 | total R$19,00 (doc. 5002, aberto como "A Prazo") | adicionar Dinheiro 10,00 + PicPay 9,00 | valor restante 0,00; confirma em 1 requisição; recibo lista as duas formas | ✅ passou — recibo #5002 lista Dinheiro R$10,00 e PicPay R$9,00, Total Pago R$19,00, Restante R$0,00. Requisição única não conferida (pendente). |
| 2 | total R$25,00 | Dinheiro R$15,00 + PicPay R$15,00 (soma R$30,00) | bloqueia a confirmação, aviso de valores divergentes | ✅ passou — aviso "A soma dos valores das formas de pagamento não pode ultrapassar o valor total a pagar", valor restante exibido em vermelho (-R$5,00) |
| 3 | total R$59,00 | Dinheiro R$20,00 + Pix R$20,00 (soma R$40,00) | valor restante recalcula; confirmação permitida (parcial) | ✅ passou — recibo #5007 gerado normalmente, situação "parcialmente paga", Total Pago R$40,00, Total Restante R$19,00 (bate com 59-40) |
| 4 | 2 linhas adicionadas | remover uma | valor restante recalcula; última linha não pode ser removida (botão desabilitado) | ⛔ bloqueado |
| 5 | 1 forma só (não-regressão) | quitar normalmente | funciona como a versão oficial; recibo mostra essa forma | ⛔ bloqueado — ver nota abaixo |
| 6 | — | campo "Data de pagamento" | continua só com a data; hora é anexada no envio (conferir payload) | ⛔ bloqueado |
| 7 | pedido com 2+ formas | conferir payload da confirmação (DevTools) | uma única requisição com `payments[]`, não uma por forma | ⛔ bloqueado |
| 8 | recibo do pedido com 2+ formas | conferir se lista as formas reais | não deve aparecer a forma nominal da conta (ex. "A Prazo") | ✅ passou — recibo #5002 mostra "Dinheiro" e "PicPay" na coluna Forma Pagamento, não "A Prazo" (forma de abertura do documento) |

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
7. Clicar em outro campo (ex.: Conta corrente): o texto digitado **some**. Confirmado no código: o campo limpa a
   busca no `onBlur` de propósito (`L("")`), porque o texto digitado nunca é um valor "de verdade" — só vira valor
   real se o usuário clicar numa opção da lista. Como a lista nunca aparece, nunca há o que clicar, e o campo volta
   sempre vazio ao perder o foco. Não é um bug à parte; é consequência direta do mesmo problema.

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
Conclusão (parcial, corrigida abaixo): no título de teste usado (criado com forma "Dinheiro"), a lista de opções
nunca populou em nenhuma linha. **O Rômulo descobriu, testando com títulos criados com formas diferentes, que
isso não é geral — depende da forma de pagamento escolhida na abertura do documento a receber.**

## Achado principal — filtro de formas de pagamento depende da forma de pagamento de abertura do documento

**Descoberta (Rômulo, 06/10/2026):** ao criar o documento a receber, a forma de pagamento escolhida na abertura
influencia quais formas ficam disponíveis no campo "Forma de pagamento" do modal de quitação:

| Forma de pagamento na abertura do documento | Formas disponíveis na quitação |
| --- | --- |
| Dinheiro | nenhuma outra forma selecionável (lista vazia — o bug que reproduzi antes) |
| A Prazo | várias formas disponíveis |
| Pix | Dinheiro ou PicPay |

**Causa provável (bate com o código visto no bundle `3777.4262186b.async.js`):** o campo recebe um `document`/`type`
(derivado da forma de pagamento de abertura) e usa isso para **filtrar** a lista de opções antes de buscá-la:
```js
S && v.test(S) && Y.filter(e => "05"!==e.paymentType.code && "14"!==e.paymentType.code && "15"!==e.paymentType.code)
S && !v.test(S) && Y.map(...)   // sem filtro
!S && Y.map(...)                // sem filtro
```
Ou seja, dependendo do tipo do documento (`S`), certos códigos de forma de pagamento (`paymentType.code` 05/14/15)
são excluídos da lista. **Hipótese, não confirmada por completo:** para documentos abertos como "Dinheiro", o
filtro parece excluir tudo (zero opções); para "A Prazo", quase nada é excluído; para "Pix", só um subconjunto
passa. Não verifiquei o código exato que decide `S`/`v` nem a tabela completa de `paymentType.code`, então não
afirmo a regra exata — só que ela existe e está ligada à forma de abertura, com evidência direta da tela.

**Isso muda o veredito:** não é "o campo nunca funciona" — é "o campo funciona, mas filtrado por uma regra não
documentada no card". Essa regra **não aparece na seção "Regra de Negócio" do INTG-2727** — é um comportamento que
já existia no sistema (ou foi introduzido junto) e merece confirmação com o time: é intencional, ou é o bug?

## Achado técnico — bloqueador (caso "Dinheiro")

**Cenário técnico — negativo: campo "Forma de pagamento" não abre a lista de opções (documento aberto como "Dinheiro")**

- **Dado** o modal "Quitar contas a receber" aberto, para um documento criado com forma de pagamento "Dinheiro" na
  abertura, com uma linha de forma de pagamento (1ª, pré-preenchida com "Dinheiro") e uma 2ª linha adicionada (vazia)
- **Quando** clico no campo "Forma de pagamento" de qualquer uma das linhas
- **Então** deveria abrir a lista de formas cadastradas (Dinheiro, PicPay, Cartão, etc.) — mesmo que filtrada,
  deveria sobrar ao menos uma opção compatível

**Obtido:** ❌ falhou — o campo entra em foco, mas nenhuma lista de opções aparece em nenhuma linha. Reportado
originalmente pelo Rômulo: "teve uma [opção] que apareceu mas depois sumiu".

**Passo a passo (reproduzível):**
1. Financeiro > Contas a Receber > Novo > forma de pagamento "Dinheiro" na abertura > salvar o documento.
2. Localizar o título em aberto > menu da linha (ícone "⋮" em Situação) > Quitar.
3. Clicar no campo "Forma de pagamento" da 1ª linha: nenhuma lista aparece.
4. Clicar em "+ Adicionar forma de pagamento" (cria uma 2ª linha, vazia); clicar no campo dela: mesmo resultado.
5. Digitar um texto de busca (ex.: "din"): o valor é registrado no campo, mas a lista de opções continua sem
   aparecer; ao clicar em outro campo, o texto digitado some (comportamento esperado do componente quando nada
   foi de fato selecionado — ver nota técnica abaixo).

**Evidência técnica (DevTools, console + Network + inspeção de DOM, no caso "Dinheiro"):**
```
// Console: sem erro no momento do clique
// Network: nenhuma chamada relacionada a forma de pagamento/gateway disparada ao clicar no campo
// DOM, após clicar e digitar "din" na 2ª linha:
document.getElementById('paymentMethods_1_paymentGateway').value === 'din'  // true — valor digitado registrado
document.querySelectorAll('.ant-select-dropdown').length === 1             // só existe 1 dropdown na página inteira,
                                                                             // e pertence a outro campo (filtro de
                                                                             // Cliente da tela de fundo), oculto
```

**Nota técnica — por que o texto digitado some ao trocar de campo:** esse campo só guarda o texto digitado como
busca temporária; vira valor real apenas se o usuário clica numa opção da lista. O código limpa a busca no
`onBlur` de propósito (`onBlur:function(){return L("")}`). Como a lista nunca aparece (no caso "Dinheiro"), nunca
há o que clicar, e o campo sempre volta vazio. Não é um bug à parte — é consequência do achado principal.

**Causa técnica da refatoração (corrigida, 06/10/2026):** a hipótese inicial (componente com `name="paymentId"`
fixo, item 1 das notas técnicas do card) **foi descartada** após inspecionar o JS servido em HMG — o componente já
aceita `name`/`label`/`required`. A causa real está no filtro por `paymentType.code` descrito acima, não na
refatoração do autocomplete (essa parte do plano do dev parece já estar feita).

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

## Workaround encontrado (desbloqueia o teste)

Editar o documento a receber e trocar a forma de pagamento de abertura para **"A Prazo"** libera a seleção de
várias formas no modal de quitação. Com isso dá pra seguir e executar os critérios 1–8 e os complementares
(B1-B3, N1-N3) da tabela BDD, usando documentos abertos como "A Prazo".

## Pendências

- [ ] Reportar no INTG-2727: o filtro de formas de pagamento por forma de abertura do documento (Dinheiro = zero
  opções) não está na "Regra de Negócio" do card — perguntar ao time se é intencional ou é o bug.
- [ ] Mapear a regra completa (qual forma de abertura libera quais formas na quitação) — hoje só temos 3 pontos
  (Dinheiro→nenhuma, A Prazo→várias, Pix→Dinheiro/PicPay), não a tabela inteira de `paymentType.code`.
- [ ] Com o workaround (abrir como "A Prazo"), executar os critérios 1–8 e os complementares (B1-B3, N1-N3).
- [ ] Confirmar com o time a discrepância do INTG-2726 (Backend): status no Jira é "Pronto Para Teste", mas a
  descrição técnica do card ainda fala em "gaps a resolver" — qual das duas está desatualizada?
- [ ] Depois que o dev corrigir: reexecutar os critérios 1–8 e os complementares (B1-B3, N1-N3), com vídeo JAM.
- [ ] Perguntar ao dev: N1 (valor 0,00) e N3 (forma duplicada) — comportamento esperado?
- [ ] Ponto já sinalizado pelo próprio card: exibição de desconto/acréscimo no recibo com várias formas depende da
  definição do Backend (INTG-2726) — só testar depois que isso for definido.
- [ ] Antes do PR: mesclar a `main` na branch do card.
