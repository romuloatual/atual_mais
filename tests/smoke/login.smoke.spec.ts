import { test, expect } from '@playwright/test';

// Smoke sem credenciais: a tela de entrada do HMG abre com o campo de senha (o sistema está de pé).
const PAINEL = process.env.QA_PAINEL_URL || 'https://romulo.hmg.atualmais.com.br';

test('tela de login do HMG abre', { tag: '@smoke' }, async ({ page }) => {
  await page.goto(`${PAINEL}/user/login`);
  await expect(page.locator('input[type="password"]')).toBeVisible();
});
