# Recibo de quitação imprime o acréscimo como "Juros" e o restante da Bobina é inconsistente

**Tipo: Defeito** (existe na **produção** e no HMG) · Severidade média · Tela: [Quitação e recibo](../telas/contas-a-receber-quitacao.md)

**Resumo:** nos recibos A4 e Bobina, o acréscimo informado sai na linha "Juros" (a linha "Acréscimos" fica zerada) e, na Bobina, o "RESTANTE" da parcela diverge do "TOTAL RESTANTE" do resumo (exemplos: 0,00 contra 10,00; −50,00; 100,00 contra 50,00). O dado gravado está correto (PAID, `totalPaid` e `increaseAmount` certos): o erro é só no recibo.

**Na produção também:** o A4 mostrava pago R$ 0,00 e restante igual à parcela. **No HMG isso foi corrigido** pelo INTG-2727 (o A4 passou a listar a forma e os números batem).

**Evidência:** recibos de produção (documentos 557, 558, 559, 561) e HMG (0006, 0007, 1017), guardados na pasta local do QA (contêm CNPJ/CPF, não sobem ao GitHub).

**Esperado:** acréscimo na linha "Acréscimos"; restante da parcela igual ao total restante.
