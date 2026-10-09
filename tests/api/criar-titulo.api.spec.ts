import { test, expect } from '@playwright/test';
import { obterToken } from './helpers/auth';
import { criarTitulo } from './helpers/receivable';

test('cria um título a receber de R$ 100', { tag: '@api' }, async ({ request }) => {
  const token = await obterToken(request);
  const titulo = await criarTitulo(request, token, 100);
  console.log(`Título criado: id=${titulo.id} documento=${titulo.documentNumber}`);
  expect(titulo.id).toBeGreaterThan(0);
});