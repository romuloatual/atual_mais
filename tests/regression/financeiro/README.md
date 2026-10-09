# Regressão: Financeiro

Módulo **Financeiro** do menu do sistema (`/financial`). Teste de **tela**, tag `@regression`, nome `<assunto>.regression.spec.ts`.

## Áreas com pasta pronta

| Área | Rota | Prioridade | Primeiro alvo |
| --- | --- | --- | --- |
| [`contas-a-receber/`](./contas-a-receber) Contas a Receber | `/financial/bills-to-receive` | P1 | quitar um título pela modal (vários tipos de forma, desconto, acréscimo) e conferir o recibo |
| [`caixa/`](./caixa) Caixa | `/financial/statement (a confirmar)` | P2 | abrir, movimentar e fechar o caixa |

## Outras áreas do módulo (sem pasta ainda: nasce com o primeiro teste)

| Área | Rota | Help |
| --- | --- | --- |
| Contas a Pagar | `/financial/bills-to-pay` | [Contasapagar](https://www.atualsistemas.net.br/solucoes/IntegraMais/Contasapagar.html) |
| Boletos | `/financial/bank-slip` | [Boleto1](https://www.atualsistemas.net.br/solucoes/IntegraMais/Boleto1.html) |
| Cadastros gerais (plano de contas, bancos, contas correntes, moeda, departamento, grupo DRE, tarifas) | `/financial/general/*` | [Planodecontas](https://www.atualsistemas.net.br/solucoes/IntegraMais/Planodecontas.html) |

**Situação:** ainda sem testes. Mapa completo do sistema: [`docs/mapa-do-sistema.md`](../../../docs/mapa-do-sistema.md). Convenção de pastas: [`../../README.md`](../../README.md).
