# Forma de pagamento (regras do Help)

Fonte: [Help — Forma de pagamento](https://www.atualsistemas.net.br/solucoes/IntegraMais/Formadepagamento.html), lido em 08/10/2026. **📖** = documentado no manual, ainda não confirmado por teste nosso.

| # | Regra | Grau |
| --- | --- | --- |
| F1 | **Tipo de Forma** define se a forma gera parcela em Contas a Receber ou Contas a Pagar | 📖 |
| F2 | **Formas para Recebimento** define com quais formas a parcela criada por esta forma pode ser **quitada**. É o que filtra as opções da modal de quitação (veja M5 em [`contas-a-receber-quitacao.md`](./contas-a-receber-quitacao.md)) | 📖 |
| F3 | **Parcelas**: nas formas que geram contas a receber, o número informado é o **máximo de parcelas permitidas** | 📖 |
| F4 | **Taxa do cartão** (ex.: 10%): exige preencher **Autorização do Cartão** e **Administradora** na venda; assim a taxa é aplicada e a venda gera conta a receber | 📖 |

## Finalidade

Cadastrar as formas e condições de pagamento usadas em vendas e contas (tipo, parcelas, taxa do cartão e com quais formas a parcela pode ser quitada).

**Como acessar:** Faturamento > Forma de pagamento.

**Depende de:** **Administradora** e **Conta corrente** (taxa do cartão) e as demais formas (campo "Formas para Recebimento").

## Falhas conhecidas

- _nenhuma registrada ainda_
