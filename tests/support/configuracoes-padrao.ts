// "Configurações padrões" do painel: ficam salvas SÓ no navegador (localStorage, uma chave por loja),
// não no servidor. Um navegador novo (como o do teste) começa sem elas: sem cliente, sem vendedor e
// sem operação, e o pedido falha com "The given id must not be null!". Por isso o teste as cria.
// Os ids são do HMG (empresa de teste, loja LOJA001).
export const LOJA = 'LOJA001';

export const configuracoesPadrao = {
  customerFastsale: { label: 'CLIENTE A VISTA', value: '1', key: '1', extra: '1' },
  sellerFastSale: { label: 'VENDEDOR-CAIXA', value: '3', key: '3', disabled: false },
  operationFastSale: { label: 'Vendas', value: '1000', key: '1000', extra: '1000' },
  orderPrintModel: 'FA',
};
