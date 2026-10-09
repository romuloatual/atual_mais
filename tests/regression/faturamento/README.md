# Regressão: Faturamento

Módulo **Faturamento** do menu do sistema (`/revenues`). Teste de **tela**, tag `@regression`, nome `<assunto>.regression.spec.ts`.

## Outras áreas do módulo (sem pasta ainda: nasce com o primeiro teste)

| Área | Rota | Help |
| --- | --- | --- |
| Operação | `/revenues/operation` | [Operacao](https://www.atualsistemas.net.br/solucoes/IntegraMais/Operacao.html) |
| Forma de pagamento | `/revenues/payment-gateway` | [Formadepagamento](https://www.atualsistemas.net.br/solucoes/IntegraMais/Formadepagamento.html) |
| Preço de venda | `/revenues/sale-price` | [Precodevenda](https://www.atualsistemas.net.br/solucoes/IntegraMais/Precodevenda.html) |

Configura o que as vendas usam (operação e formas de pagamento). Documentado em [`docs/telas/operacao.md`](../../../docs/telas/operacao.md) e [`docs/telas/forma-de-pagamento.md`](../../../docs/telas/forma-de-pagamento.md). Teste de tela só quando um fluxo de Vendas ou Financeiro depender de uma configuração daqui.

**Situação:** ainda sem testes. Mapa completo do sistema: [`docs/mapa-do-sistema.md`](../../../docs/mapa-do-sistema.md). Convenção de pastas: [`../../README.md`](../../README.md).
