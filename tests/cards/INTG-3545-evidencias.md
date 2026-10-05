# INTG-3545 — Validação manual

**Card:** `[DEFEITO] (Frontend) {Venda Rápida V2} Vr. Unitário maior gera desconto em vez de acréscimo`
https://integramais.atlassian.net/browse/INTG-3545

HMG, empresa `romulo`, PDV LOJA001. **Status:** em execução.

## O que o card diz

No modal "Desconto / Acréscimo por item", um Vr. Unitário com milhar (ex.: `1.800,00`) é lido sem remover o separador de
milhar (vira `1,80`), então um valor **maior** que o original gera **desconto**. Ocorre com 4 ou mais dígitos inteiros.
Workaround: usar os campos Acréscimo (% ou valor). Os demais campos do modal já funcionam com milhar.

**Esperado:** Vr. Unitário maior calcula **Acréscimo** (valor e %); menor calcula **Desconto**; o parsing trata o milhar
como nos outros campos do modal.

## Cenários (BDD)

Fluxo base: `/pdv-v2` > item > `Alt+P` (desconto no item) > modal "Desconto / Acréscimo por item" > informar o valor.
Item de teste: `045` Calça Jeans Feminina, R$ 123,50 (os produtos do HMG não passam de R$ 1.000).

| # | Tipo | Dado | Quando | Então | Obtido |
| --- | --- | --- | --- | --- | --- |
| 1 | Feliz (defeito) | item R$ 123,50 | Vr. Unitário `1.800,00` | Acréscimo R$ 1.676,50 e %, Total R$ 1.800,00 | Pendente |
| 2 | Regressão | item R$ 123,50 | Vr. Unitário `100,00` | Desconto R$ 23,50 e %, Total R$ 100,00 | Pendente |
| 3 | Borda | item R$ 123,50 | `999,99` e `1.000,00` | acréscimo correto nos dois | Pendente |
| 4 | Borda | item R$ 123,50 | `10.000,00` e `1.000.000,00` | acréscimo correto | Pendente |
| 5 | Borda | item R$ 123,50 | igual ao original | sem desconto nem acréscimo | Pendente |
| 6 | Negativo | item R$ 123,50 | `abc`, vazio, `0,00`, negativo | barra ou trata sem quebrar o cálculo | Pendente |
| 7 | Variação | item R$ 123,50 | `1800`, `1800,00`, `1.800,5` | igual ao cenário 1 | Pendente |
| 8 | Regressão | item R$ 123,50 | milhar no campo Acréscimo e no Desconto | continuam corretos | Pendente |
| 9 | Fim a fim | cenário 1 | finalizar a venda | Total do pagamento e do impresso = R$ 1.800,00 | Pendente |
| 10 | Regressão | item R$ 1.631,80 | `1.200,00` | Desconto R$ 431,80 (26,46%) | Pendente (precisa de produto de milhar) |

## Evidência

_(preencher após executar: valores exibidos no modal, print e Vr. Total do item)_

## Pendências

- [ ] Produto de teste de R$ 1.631,80 para o cenário 10 (aguardando autorização para cadastrar no HMG).
- [ ] Antes do PR: mesclar a `main` na branch do card.
