import { test, expect } from '@playwright/test';
import { obterToken } from '../support/auth';

test('login por API devolve um token de acesso', { tag: '@api' }, async ({ request }) => {
  const token = await obterToken(request);
  expect(token.length).toBeGreaterThan(20);
});