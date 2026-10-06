# INTG-1005 — Validação manual

**Card:** `Acréscimo por item no fechamento do Pedido de Venda grava como desconto negativo (erro na emissão da NF)`
https://integramais.atlassian.net/browse/INTG-1005

**Criticidade alta** (card de 2023, uma tentativa de correção anterior falhou). Correção atual já entregue pelo dev
(João Victor), branch `fix/order-item-increase-total-INTG-1005`, revisão de código **OK** (Winicios).
Relacionados: INTG-3546 (UI do % Acréscimo), INTG-3547 (bug de Unidade de Medida, sem relação), INTG-3197 (modal de
liberação de desconto acima do limite, em staging).

HMG, empresa `romulo`, PDV LOJA001. **Status:** em execução — validação independente da correção do dev.

## O que o card pede

No **Pedido de Venda**, ao editar o **Valor Total** de um item para um valor **maior** que o subtotal (qtd × valor
unitário): tratar a diferença como **acréscimo** (nunca desconto negativo); o total enviado ao backend no fechamento
deve somar os acréscimos (hoje só somava descontos); o pedido deve fechar (CONCLUÍDO) e a NF emitir sem erro.

**Causa (confirmada pelo dev):** o total enviado ao backend no fechamento não somava os acréscimos dos itens, só os
descontos — o rodapé da tela já mostrava o valor certo, mas o total enviado ficava menor, e o backend rejeitava por a
soma dos pagamentos não bater com o total do pedido. Correção só no front: o total enviado passou a somar os acréscimos
igual ao rodapé, arredondado em 2 casas. Sem mudança de banco/DTO.

**Testes do próprio dev no HMG (não substituem a nossa validação):**

| Cenário | Pedido | Item (increase/discount) | Total do pedido | Resultado |
| --- | --- | --- | --- | --- |
| Acréscimo (13,96 → 20,00) | 64 | increase 6,04 | 20,00 | Concluído e faturado ✅ |
| Desconto, sem regressão (13,96 → 13,00) | 65 | discount 0,96 | 13,00 | Concluído ✅ |

## Cenários (BDD) — nosso teste independente

Fluxo (do próprio dev): Vendas > Pedidos > Novo > Cliente e Vendedor > Produtos (item) > editar **Valor Total** no item
> Transporte > Faturas (forma de pagamento = **valor do rodapé**) > Salvar/Fechar.

| # | Tipo | Dado | Quando | Então | Obtido |
| --- | --- | --- | --- | --- | --- |
| 1 | Feliz (o card) | item com subtotal conhecido | Valor Total maior (acréscimo) | item grava em `increase` (não desconto negativo); total enviado = rodapé; pedido CONCLUÍDO; NF emite sem erro | Pendente |
| 2 | Regressão | mesmo item | Valor Total menor (desconto) | grava em `discount`; pedido CONCLUÍDO, como antes | Pendente |
| 3 | Combinado | pedido com 2+ itens | um item com acréscimo e outro com desconto | total do pedido bate com o rodapé | Pendente |

**Atenção ao montar os cenários:**
- Usar **desconto abaixo do limite da empresa** (10% no HMG) nos cenários de desconto — acima disso o backend retorna
  422 e pede liberação (modal do INTG-3197, fora do escopo aqui).
- **Não** editar o Total no rodapé diretamente — isso manda a diferença para "Outras despesas"/"Desconto" do pedido,
  é outro fluxo e não foi tocado por esta correção.
- O **% Acréscimo não aparece na tela** (fica vazio) — está correto, é escopo do INTG-3546, não deste card.

## Evidência técnica a coletar

- Payload do fechamento (DevTools): campo de desconto/acréscimo do item e o total do pedido, comparado ao rodapé.
- Status final do pedido (CONCLUÍDO/EM ANDAMENTO) e se a NF emite sem erro.
- Se falhar: a mensagem de erro exata.

## Pendências

- [ ] Executar os cenários 1, 2 e 3.
- [ ] Se falhar, capturar o payload mostrando o total divergente e comparar com a causa descrita pelo dev.
- [ ] Antes do PR: mesclar a `main` na branch do card.
