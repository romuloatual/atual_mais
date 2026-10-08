# Regras de negócio do Atual Mais (documento vivo)

Registramos aqui o que **descobrimos testando**: como cada tela ou fluxo realmente se comporta e qual regra está por trás.
Um arquivo por tela/fluxo. Atualizamos **no fim de cada card**, junto com a evidência.

## Como ler

| Marca | Significa |
| --- | --- |
| ✅ **Confirmada** | está no card ou foi vista em teste/payload; a fonte está citada |
| 🟡 **Inferida** | deduzida de poucos exemplos; pode mudar com mais testes |
| ❓ **Dúvida** | ninguém confirmou ainda; é pergunta ao time/dev, não bug |
| 📖 **Help** | está no manual do usuário ([HelpAtualMais](https://www.atualsistemas.net.br/solucoes/IntegraMais/Bemvindo.html)); **ainda não confirmado por teste nosso**. O manual pode estar desatualizado |
| ❌ **Defeito** | comportamento que contradiz a regra esperada; vira bug/card |

Cada regra traz **fonte** (card, teste ou requisição) e **onde foi vista** (produção = conta de teste; HMG).

## Regras para escrever aqui

- Só fatos e a fonte. Hipótese vai marcada como 🟡 ou ❓.
- Nenhum dado real: valores fictícios, sem CPF/CNPJ, sem token. Veja `docs/lgpd-evidencias.md`.
- Mudou o comportamento depois de uma entrega? Atualize a regra e a data, não crie outra.

## Índice

| Tela / fluxo | Arquivo |
| --- | --- |
| Contas a Receber > Quitação (e recibo) | [`contas-a-receber-quitacao.md`](./contas-a-receber-quitacao.md) |
| Venda Rápida | [`venda-rapida.md`](./venda-rapida.md) |
| Pedidos (devolução, estorno, carta de correção) | [`pedidos.md`](./pedidos.md) |
| Caixa | [`caixa.md`](./caixa.md) |
| Forma de pagamento | [`forma-de-pagamento.md`](./forma-de-pagamento.md) |
| Operação | [`operacao.md`](./operacao.md) |
