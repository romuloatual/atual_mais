import type { APIRequestContext } from '@playwright/test';
import { lerAmbiente } from './ambiente';

// Faz login na API e devolve o token de acesso.
export async function obterToken(request: APIRequestContext): Promise<string> {
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
  return corpo.access_token as string;
}