# Pedidos (regras do Help)

Fonte: [Help — Pedidos](https://www.atualsistemas.net.br/solucoes/IntegraMais/Pedidos.html), lido em 08/10/2026. **📖** = documentado no manual, ainda não confirmado por teste nosso.

| # | Regra | Grau |
| --- | --- | --- |
| P1 | Criação em etapas: dados gerais (operação, cliente, vendedor) → produtos → transporte → faturas (forma de pagamento + Gerar) | 📖 |
| P2 | O campo Vendedor lista **só funcionários com a função Vendedor** | 📖 |
| P3 | Transporte vem preenchido se o cliente tem **endereço Favorito** | 📖 |
| P4 | **Excluir pedido** só se **não faturado e sem nota emitida** | 📖 |
| P5 | **Devolução de venda** só para pedido **faturado**; gera um novo pedido Concluído com a nota de devolução | 📖 |
| P6 | **Carta de correção** só para nota **modelo 55** (NF-e) | 📖 |
| P7 | **Estorno** só depois do prazo de cancelamento: **30 minutos (NFC-e)** e **24 horas (NF-e)**. Exige duas operações: Estorno de Entrada de Venda e Estorno do Estorno. Usar só se não for possível a Devolução de Venda | 📖 |
| P8 | Depois de concluído, "Mais Opções" permite imprimir, clonar, gerar NFC-e/NF-e, faturar, emitir promissória e carnê | 📖 |

**Valores-limite para testar (borda):** 29, 30 e 31 minutos (NFC-e) e 23h59, 24h e 24h01 (NF-e).
