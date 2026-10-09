import type { APIRequestContext } from '@playwright/test';
import { lerAmbiente } from './ambiente';

export type Sessao = { access_token: string; refresh_token?: string };

// Faz login na API e devolve a sessão (token de acesso e de renovação).
export async function obterSessao(request: APIRequestContext): Promise<Sessao> {
  const amb = lerAmbiente();

  const resposta = await request.post(`${amb.apiUrl}/oauth/token`, {
    headers: { Authorization: `Basic ${amb.appBasic}`, schema: amb.tenant },
    form: { grant_type: 'password', username: amb.usuario, password: amb.senha, client: 'web' },
  });

  if (!resposta.ok()) {
    // Nunca imprimir usuário, senha ou token na mensagem de erro.
    throw new Error(`Login via API falhou (HTTP ${resposta.status()}). Confira o .env.`);
  }

  const corpo = await resposta.json();
  return { access_token: corpo.access_token as string, refresh_token: corpo.refresh_token as string | undefined };
}

// Só o token de acesso (para os testes de API).
export async function obterToken(request: APIRequestContext): Promise<string> {
  return (await obterSessao(request)).access_token;
}