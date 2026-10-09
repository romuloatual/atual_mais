# Telas do Atual Mais: finalidade e comportamento (documento vivo)

Para cada tela ou fluxo registramos **para que ela serve e como ela se comporta**, com a fonte (Help ou teste). Regra de negócio entra só como comportamento **confirmado**. Um arquivo por tela; atualizamos **no fim de cada card**, junto com a evidência. Modelo: [`TEMPLATE-tela.md`](./TEMPLATE-tela.md). Falhas encontradas: [`../falhas/`](../falhas/README.md).

## Como ler

| Marca | Significa |
| --- | --- |
| ✅ **Confirmada** | está no card ou foi vista em teste/payload; a fonte está citada |
| 🟡 **Inferida** | deduzida de poucos exemplos; pode mudar com mais testes |
| ❓ **Dúvida** | ninguém confirmou ainda; é pergunta ao time/dev, não bug |
| 📖 **Help** | está no manual do usuário ([HelpAtualMais](https://www.atualsistemas.net.br/solucoes/IntegraMais/Bemvindo.html)); **ainda não confirmado por teste nosso**. O manual pode estar desatualizado |
| ❌ **Defeito** | comportamento que contradiz a regra esperada; vira bug/card |

Cada regra traz **fonte** (card, teste ou requisição) e **onde foi vista** (produção = conta de teste; HMG).

## Como usar este documento

Os arquivos começam com o que o **manual (Help)** diz e vão sendo **confirmados ou corrigidos a cada card testado**.

1. **Antes de testar:** leia o arquivo do módulo e use as regras para escrever os cenários (feliz, negativo e borda).
2. **Durante o teste:** o que bate com o manual vira ✅; o que diverge vira ❌ (defeito) ou ❓ (pergunta ao time), com a fonte do teste.
3. **Ao fechar o card:** atualize as linhas no mesmo commit da evidência.

Cuidados: 📖 **não é verdade confirmada**, não use como critério de aprovação sem testar. Se o manual divergir do sistema, **o sistema vence** (e o Help pode precisar de ajuste). Só amplie um módulo quando um card cair nele.

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
