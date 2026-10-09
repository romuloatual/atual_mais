import { test, expect } from '@playwright/test';
import { obterToken } from './helpers/auth';
import { criarTitulo, quitarTitulo } from './helpers/receivable';

test('quitação com 1 forma pelo valor total', { tag: '@api' }, async ({ request }) => {
  const token = await obterToken(request);
  const titulo = await criarTitulo(request, token, 100);

  const resposta = await quitarTitulo(request, token, {
    tituloId: titulo.id,
    formas: [{ paymentGatewayId: '1', checkingAccountId: 1, valor: 100 }],
  });

  const corpo = await resposta.json();
  console.log('HTTP', resposta.status(), '| chaves:', Object.keys(corpo).join(','));
  const conta = corpo.receivables[0];
  console.log('qtd:', corpo.receivables.length, '| campos:', Object.keys(conta).join(','));
  console.log('status:', conta.status, '| amount:', conta.amount, '| totalPaid:', conta.totalPaid, '| total:', conta.total);
  console.log(`Título: id=${titulo.id} documento=${titulo.documentNumber}`);

  expect(resposta.status()).toBe(200);
});