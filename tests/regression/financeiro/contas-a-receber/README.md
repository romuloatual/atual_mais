# Regressão: Financeiro / Contas a Receber

Rota: `/financial/bills-to-receive` · Prioridade: **P1** · Help: [Contasareceber](https://www.atualsistemas.net.br/solucoes/IntegraMais/Contasareceber.html)

Comportamento da tela: [`docs/telas/contas-a-receber-quitacao.md`](../../../../docs/telas/contas-a-receber-quitacao.md).

**Primeiro alvo:** quitar um título pela modal (vários tipos de forma, desconto, acréscimo) e conferir o recibo.

**Cuidados:**
- O contrato da quitação já é coberto por API em [`tests/api/financeiro/contas-a-receber/`](../../../api/financeiro/contas-a-receber).
- Falhas conhecidas que valem teste: [`docs/falhas/`](../../../../docs/falhas/README.md).
- Título quitado não pode ser excluído (o servidor responde 400): teste de tela que quita deixa dado no HMG.

**Situação:** ainda sem testes. Teste de card entra aqui com a tag do card (`['@regression', '@INTG-XXXX']`).
