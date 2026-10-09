import type { APIRequestContext } from '@playwright/test';
import { lerAmbiente } from './ambiente';

const CLIENTE_TESTE_ID = '103'; // cliente de teste do HMG (empresa romulo)
const FORMA_A_PRAZO_ID = '2'; // forma de pagamento "A Prazo"

// Cria um título a receber e devolve o id dele.
export async function criarTitulo(request: APIRequestContext, token: string, valor: number) {
  const amb = lerAmbiente();
  const data = new Date().toISOString().slice(0, 10) + 'T12:00:00';
  // Número único, porque o sistema não aceita o mesmo documento duas vezes para o mesmo cliente.
  // Prefixo QA marca o título como de teste (facilita filtrar e excluir depois).
  const documentNumber = 'QA' + String(Date.now()).slice(-5) + String(Math.floor(Math.random() * 100)).padStart(2, '0');

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

type Forma = { paymentGatewayId: string; checkingAccountId: number; valor: number };

// Quita um título com uma ou mais formas de pagamento.
// Devolve a resposta "crua", para o teste poder conferir tanto o sucesso (200) quanto o erro (400).
export async function quitarTitulo(
  request: APIRequestContext,
  token: string,
  opcoes: { tituloId: number; formas: Forma[]; desconto?: number; acrescimo?: number },
) {
  const amb = lerAmbiente();
  return request.post(`${amb.apiUrl}/api/v1/receivable/payment`, {
    headers: { Authorization: `bearer ${token}`, schema: amb.tenant },
    data: {
      paymentDate: new Date().toISOString().slice(0, 19),
      increaseAmount: opcoes.acrescimo ?? 0,
      discountAmount: opcoes.desconto ?? 0,
      items: [{ id: opcoes.tituloId }],
      payments: opcoes.formas.map((f) => ({
        paymentGateway: { id: f.paymentGatewayId },
        checkingAccount: { id: f.checkingAccountId },
        amount: f.valor,
      })),
    },
  });
}