import { test, expect } from '../../../support/fixtures';
import { VendaRapidaPage } from '../../../support/pages/vendas/venda-rapida.page';

// Fluxo feliz do Venda Rápida V2: 1 item, pagamento em Dinheiro, faturamento "Outros".
// Dependências no HMG: SKU 010 (Biscoito Recheado Chocolate 140g) e "Tipo de faturamento" = 0-Outro.
// Cada execução cria um pedido de teste no HMG.
test('venda de 1 item em Dinheiro é faturada (Outros)', { tag: '@regression' }, async ({ page }) => {
  const venda = new VendaRapidaPage(page);

  await venda.abrir();
  await venda.adicionarProduto('010');
  await expect(venda.itemNoCarrinho(/Biscoito Recheado Chocolate 140g/i)).toBeVisible();
  await venda.esperarItens(1);

  // Escuta as duas chamadas que a tela faz ao faturar: o pedido e a nota (tipo OTHER).
  const pedido = page.waitForResponse((r) => r.url().includes('/api/v1/sales-order') && r.request().method() === 'POST');
  const nota = page.waitForResponse((r) => r.url().includes('/api/v1/invoice') && r.request().method() === 'POST');

  await venda.irParaPagamento();
  await venda.pagarEmDinheiro();
  await venda.finalizarFaturandoOutros();

  const respPedido = await pedido;
  expect(respPedido.status()).toBe(200);
  const enviado = respPedido.request().postDataJSON();
  expect(enviado.items).toHaveLength(1);
  expect(enviado.items[0].sku.id).toBe(10);
  expect(enviado.items[0].quantity).toBe(1);

  const respNota = await nota;
  expect(respNota.status()).toBe(200);
  expect((await respNota.json()).status).toBe('COMPLETED');

  await expect(venda.popupFaturado()).toBeVisible();
  await venda.fecharSemImprimir();
});
