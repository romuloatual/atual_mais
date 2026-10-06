# INTG-1005 — Validação manual

**Card:** `Acréscimo por item no fechamento do Pedido de Venda grava como desconto negativo (erro na emissão da NF)`
https://integramais.atlassian.net/browse/INTG-1005

**Criticidade alta** (card de 2023). Uma tentativa de correção anterior não funcionou (comentário de 23/11/2023).
Relacionados: INTG-3546 (melhoria de UI, % Acréscimo por item), INTG-3547 (bug de Unidade de Medida, sem relação direta).

HMG, empresa `romulo`, PDV LOJA001. **Status:** em execução.

## O que o card pede

No **Pedido de Venda**, ao editar o **Valor Total** de um item para um valor **maior** que o subtotal (qtd × valor unitário):
1. O sistema deve tratar a diferença como **acréscimo** do item, nunca como desconto negativo.
2. O **total do pedido enviado ao backend** no fechamento deve somar os acréscimos dos itens (hoje só soma os descontos).
3. O percentual de acréscimo deve ser calculado e salvo, como já ocorre com o desconto.
4. O pedido deve fechar e a nota fiscal deve emitir sem erro.

**Causa raiz (já identificada pelo dev):** o total enviado ao backend no fechamento fica **menor** que o total exibido no
rodapé (que está correto), porque não soma o acréscimo. O backend rejeita porque a soma dos pagamentos não bate com o
total do pedido. Segundo o dev, não precisa mudar banco nem DTO — a correção é só no front.

## Cenários (BDD, do card)

Fluxo base: Vendas > Pedidos > Novo > Cliente e Vendedor > Produtos (item de subtotal conhecido) > editar **Valor Total**
do item > Transporte > Faturas (forma de pagamento = soma do total do rodapé) > Salvar/Fechar.

| # | Tipo | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- | --- |
| 1 | Feliz (o bug) | item com subtotal R$ 800,00 | Valor Total do item `850,00` | aloca R$ 50,00 como acréscimo (não desconto negativo); total enviado ao backend inclui o acréscimo; pedido fecha e NF emite sem erro | Pendente |
| 2 | Regressão | mesmo item | Valor Total `750,00` (menor) | calcula desconto normalmente, como já ocorre | Pendente |

## Evidência técnica a coletar

- Payload enviado ao fechar o pedido: campo de desconto/acréscimo do item e o **total do pedido**, comparado ao total do rodapé.
- Se o pedido falhar ao fechar: a mensagem de erro exata.
- Se fechar: tentar gerar a NFC-e/NF-e e registrar se emite sem erro.

## Pendências

- [ ] Confirmar se a correção já está em HMG (o card é de 2023 com tentativa anterior falha).
- [ ] Executar os cenários 1 e 2.
- [ ] Se o cenário 1 falhar, capturar o payload (DevTools) mostrando o total divergente.
- [ ] Antes do PR: mesclar a `main` na branch do card.
