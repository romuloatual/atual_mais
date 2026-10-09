# Regressão: Vendas

Fluxos críticos do módulo Vendas: Venda Rápida (PDV V2), Pedidos e emissão de NFC-e. Cada spec usa a tag `@regression` e o nome `<assunto>.regression.spec.ts`.

**Situação:** ainda sem testes. O primeiro alvo é o fluxo feliz da **Venda Rápida V2** (`/pdv-v2`): item, cliente, pagamento em Dinheiro e faturar.

**Antes de escrever:**
- Fluxos e regras: [`docs/telas/venda-rapida.md`](../../../docs/telas/venda-rapida.md), [`docs/telas/pedidos.md`](../../../docs/telas/pedidos.md) e [`docs/fluxos-principais.md`](../../../docs/fluxos-principais.md).
- Pré-condição conhecida: Configurações padrões > Venda > "Venda Rápida: Tipo de faturamento" = `0-Outro`.
- A Venda Rápida **V1** está bloqueada (INTG-3435); automatizar só a V2.
- Cada venda cria um pedido no HMG: definir a limpeza antes de rodar em lote.

Convenção de pastas: [`../../README.md`](../../README.md).
