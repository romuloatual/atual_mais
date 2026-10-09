# Regressão: Compras

Módulo **Compras** do menu do sistema (`/inventory`). Teste de **tela**, tag `@regression`, nome `<assunto>.regression.spec.ts`.

## Áreas com pasta pronta

| Área | Rota | Prioridade | Primeiro alvo |
| --- | --- | --- | --- |
| [`entrada-de-nf/`](./entrada-de-nf) Entrada de NF | `/inventory/entries` | P1 | lançar uma entrada de nota e conferir estoque e financeiro |

## Outras áreas do módulo (sem pasta ainda: nasce com o primeiro teste)

| Área | Rota | Help |
| --- | --- | --- |
| Estoque | `/inventory/stock` | [EstoqueProduto](https://www.atualsistemas.net.br/solucoes/IntegraMais/EstoqueProduto.html) |
| Manutenção de inventário | `/inventory/management` | [ManutencaodeInventario](https://www.atualsistemas.net.br/solucoes/IntegraMais/ManutencaodeInventario.html) |

**Situação:** ainda sem testes. Mapa completo do sistema: [`docs/mapa-do-sistema.md`](../../../docs/mapa-do-sistema.md). Convenção de pastas: [`../../README.md`](../../README.md).
