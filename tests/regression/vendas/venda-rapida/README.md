# Regressão: Vendas / Venda Rápida (PDV V2)

Rota: `/pdv-v2 e /sales/fast-v2` · Prioridade: **P1** · Help: [Vendarapida](https://www.atualsistemas.net.br/solucoes/IntegraMais/Vendarapida.html)

Comportamento da tela: [`docs/telas/venda-rapida.md`](../../../../docs/telas/venda-rapida.md).

**Primeiro alvo:** fluxo feliz: item, cliente, pagamento em Dinheiro e faturar.

**Cuidados:**
- Pré-condição: Configurações padrões > Venda > "Venda Rápida: Tipo de faturamento" = `0-Outro`.
- A **V1** (`/sales/fast`) está bloqueada (INTG-3435): automatizar só a V2.
- Cada venda cria um pedido no HMG: definir a limpeza antes de rodar em lote.

**Situação:** ainda sem testes. Teste de card entra aqui com a tag do card (`['@regression', '@INTG-XXXX']`).
