import { test, expect } from '@playwright/test';
import { obterToken } from '../../support/auth';
import { criarTitulo, excluirTitulo } from './receivable';

test('cria um título a receber de R$ 100', { tag: '@api' }, async ({ request }) => {
  const token = await obterToken(request);
  const titulo = await criarTitulo(request, token, 100);
  console.log(`Título criado: id=${titulo.id} documento=${titulo.documentNumber}`);

  try {
    expect(titulo.id).toBeGreaterThan(0);
  } finally {
    // O título fica Aberto, então o teste se limpa (só aceita documento com prefixo QA).
    const exclusao = await excluirTitulo(request, token, titulo);
    console.log(`Título ${titulo.id} excluído: HTTP ${exclusao.status()}`);
    expect(exclusao.status()).toBe(200);
  }
});
