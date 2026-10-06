# INTG-1005 — Validação manual

**Card:** `Acréscimo por item no fechamento do Pedido de Venda grava como desconto negativo (erro na emissão da NF)`
https://integramais.atlassian.net/browse/INTG-1005

**Criticidade alta** (card de 2023, uma tentativa de correção anterior falhou). **Status: APROVADO em HMG.**
Correção do dev (João Victor), branch `fix/order-item-increase-total-INTG-1005`, revisão de código OK (Winicios).
Relacionados: INTG-3546 (UI do % Acréscimo), INTG-3547 (Unidade de Medida, sem relação), INTG-3197 (liberação de
desconto acima do limite, em staging).

HMG, empresa `romulo`, PDV LOJA001, 06/10/2026. Cliente 102 (Maria das Dores).

## O que o card pede

No Pedido de Venda, Valor Total do item **maior** que o subtotal deve virar **acréscimo** (nunca desconto negativo); o
total enviado ao backend deve somar os acréscimos (antes só somava descontos); o pedido deve fechar (CONCLUÍDO) e a NF
emitir sem erro.

## Critérios do card (BDD) — executados por mim e pelo Rômulo, mesmo resultado

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| 1 | Item 045, subtotal R$123,50 | Valor Total `150,00` | acréscimo R$26,50, total enviado = rodapé, fecha sem erro | ✅ pedido 40: `increase: 26.5, discount: 0`, total 150; CONCLUÍDO |
| 2 | Item 045, subtotal R$123,50 | Valor Total `100,00` (desconto) | calcula desconto, como já ocorria | ✅ pedido 42: `discount: 23.5`, total 100; CONCLUÍDO |
| 3 | Pedido com 2 itens: 045 (acréscimo) + 010 (desconto) | fechar | total do pedido bate com o rodapé | ✅ pedido 43: total 152 = 150 + 2; CONCLUÍDO |
| 4 | Pedido 43 (misto) | Gerar NFC-e | emite sem erro | ✅ NF 678, NFC-e, chave `3226101226649600012965469000006781000006798`, status **FATURADO** |

## Evidência técnica (payload do `POST /api/v1/sales-order`, pedido 43, capturado via interceptação de XHR)

```json
// enviado
{ "total": 152,
  "items": [
    { "sku": 10, "discount": 1.04, "increase": 0, "total": 2 },
    { "sku": 45, "discount": 0, "increase": 26.5, "total": 150 }
  ]
}
// resposta
{ "id": 43, "total": 152, "status": "COMPLETED",
  "items": [
    { "sku": 10, "discount": 1.04, "increase": 0 },
    { "sku": 45, "discount": 0, "increase": 26.5 }
  ]
}
```

- O `total` enviado (152) bate com o rodapé (150 + 2), confirmando a correção: antes só somava descontos.
- O item com Valor Total maior grava em `increase` (não em `discount` negativo).
- Não há campo de percentual de acréscimo no payload — consistente com o aviso do dev (o % não é persistido, é
  calculado em tela como `increase ÷ subtotal`; isso é escopo do INTG-3546, não deste card).
- `discountAverage`/`increaseAverage` vieram `0` na resposta — são o rateio por item calculado pelo backend em outro
  momento (fatura), não neste payload; não é algo a cobrar aqui.

## Print/preview

- Formulário do item: Acréscimo 21,46% (pedido 40) e Desconto 19,03% (pedido 42), com o campo oposto desabilitado.
- Tabela de produtos do pedido 43: colunas Desc. Item e Acréscimo separadas, uma por item.
- Lista de Pedidos: 00000040 R$150,00 CONCLUÍDO; 00000042 R$100,00 CONCLUÍDO; 00000043 R$152,00 FATURADO (NF 678, NFC-e).

## Observação de processo

Durante o teste, um clique errado abriu a confirmação de exclusão do pedido 00000041 (de outro teste, não relacionado
a este card); foi cancelado a tempo e o pedido não foi afetado.

## Pendências

- [ ] Nenhuma — critérios do card atendidos. Encaminhar ao time/Jira.
- [ ] Antes do PR: mesclar a `main` na branch do card.
