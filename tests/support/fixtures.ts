import { test as base, expect } from '@playwright/test';
import { lerAmbiente } from './ambiente';
import { obterSessao } from './auth';
import { LOJA, configuracoesPadrao } from './configuracoes-padrao';

// "test" para os testes de TELA: já abre o painel do HMG com a sessão feita por API,
// sem digitar usuário e senha. Chaves do localStorage = as que o próprio painel usa.
// Testes de tela criam dados reais no HMG e precisam do .env: sem credenciais (ex.: no CI)
// ou fora do Chromium, o teste é PULADO (não falha).
export const test = base.extend({
  baseURL: async ({}, use) => {
    await use(process.env.QA_USER ? lerAmbiente().painelUrl : undefined);
  },
  page: async ({ page, request, browserName }, use, testInfo) => {
    testInfo.skip(!process.env.QA_USER, 'Sem credenciais (.env): teste de tela desligado.');
    testInfo.skip(browserName !== 'chromium', 'Cria dado real no HMG: roda só no Chromium.');

    const sessao = await obterSessao(request);
    await page.addInitScript(([acesso, renovacao, chave, padroes]) => {
      localStorage.setItem('antd-pro-authority', acesso);
      if (renovacao) localStorage.setItem('antd-pro-refresh-token', renovacao);
      // Configurações padrões do painel (só existem no navegador): sem elas o PDV não tem cliente, vendedor nem operação.
      if (!localStorage.getItem(chave)) localStorage.setItem(chave, padroes);
    }, [sessao.access_token, sessao.refresh_token ?? '', `settingsDefault_${LOJA}`, JSON.stringify(configuracoesPadrao)]);
    await use(page);
  },
});

export { expect };
