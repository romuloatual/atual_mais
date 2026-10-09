# Regressão: Vendas

Módulo **Vendas** do menu do sistema (`/sales`). Teste de **tela**, tag `@regression`, nome `<assunto>.regression.spec.ts`.

## Áreas com pasta pronta

| Área | Rota | Prioridade | Primeiro alvo |
| --- | --- | --- | --- |
| [`venda-rapida/`](./venda-rapida) Venda Rápida (PDV V2) | `/pdv-v2 e /sales/fast-v2` | P1 | fluxo feliz: item, cliente, pagamento em Dinheiro e faturar |
| [`pedidos/`](./pedidos) Pedidos | `/sales/orders` | P1 | criar pedido e faturar |
| [`orcamento/`](./orcamento) Orçamento | `/sales/estimate` | P2 | criar orçamento e converter em pedido |
| [`ordem-de-servico/`](./ordem-de-servico) Ordem de Serviço | `/sales/order-service` | P2 | abrir e faturar uma OS |

## Outras áreas do módulo (sem pasta ainda: nasce com o primeiro teste)

| Área | Rota | Help |
| --- | --- | --- |
| Condicional | `/sales/conditional` | [Condicional](https://www.atualsistemas.net.br/solucoes/IntegraMais/Condicional.html) |
| Inutilização de NF | `/sales/disablement` | [InutilizacaodeNF](https://www.atualsistemas.net.br/solucoes/IntegraMais/InutilizacaodeNF.html) |

**Situação:** ainda sem testes. Mapa completo do sistema: [`docs/mapa-do-sistema.md`](../../../docs/mapa-do-sistema.md). Convenção de pastas: [`../../README.md`](../../README.md).
