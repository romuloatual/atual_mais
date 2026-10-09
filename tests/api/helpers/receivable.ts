import type { APIRequestContext } from '@playwright/test';
import { lerAmbiente } from './ambiente';

const CLIENTE_TESTE_ID = '103'; // cliente de teste do HMG (empresa romulo)
const FORMA_A_PRAZO_ID = '2'; // forma de pagamento "A Prazo"

// Cria um título a receber e devolve o id dele.
export async function criarTitulo(request: APIRequestContext, token: string, valor: number) {
  const amb = lerAmbiente();
  const data = new Date().toISOString().slice(0, 10) + 'T12:00:00';
  // Número único, porque o sistema não aceita o mesmo documento duas vezes para o mesmo cliente.
  const documentNumber = String(Date.now()).slice(-9);

  const resposta = await request.post(`${amb.apiUrl}/api/v1/receivable`, {
    headers: { Authorization: `bearer ${token}`, schema: amb.tenant },
    data: {
      customer: { id: CLIENTE_TESTE_ID },
      paymentGateway: { id: FORMA_A_PRAZO_ID },
      documentNumber,
      installmentNumber: '1',
      issueDate: data,
      dueDate: data,
      amount: valor,
    },
  });

  if (!resposta.ok()) {
    throw new Error(`Criar título falhou (HTTP ${resposta.status()}): ${await resposta.text()}`);
  }
  const corpo = await resposta.json();
  return { id: corpo.id as number, documentNumber };
}