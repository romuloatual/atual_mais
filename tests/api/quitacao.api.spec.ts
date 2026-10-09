import { test, expect } from '@playwright/test';
import { obterToken } from './helpers/auth';
import { criarTitulo, excluirTitulo, quitarTitulo } from './helpers/receivable';

// Quitações simultâneas do mesmo cliente e conta dão 409 (conflito); por isso este arquivo roda em fila.
test.describe.configure({ mode: 'default' });

// Forma "Dinheiro" e conta corrente 1 do HMG (as mesmas do doc 0007).
const DINHEIRO = { paymentGatewayId: '1', checkingAccountId: 1 };

type Caso = {
  nome: string;
  formas: number[]; // valor de cada forma enviada
  desconto?: number;
  acrescimo?: number;
  http: number; // resposta esperada
  status?: string;
  totalPaid?: number;
  restante?: number; // vem no campo "total" da resposta
  limpar?: boolean; // o título continua Aberto: o teste o exclui no fim (quitado não dá para excluir pela tela)
};

// Título sempre de R$ 100. Regra do backend: pago = soma - desconto + acréscimo; restante = título - soma.
const casos: Caso[] = [
  { nome: '1 forma pelo valor total', formas: [100], http: 200, status: 'PAID', totalPaid: 100, restante: 0 },
  { nome: '2 formas somando o total', formas: [60, 40], http: 200, status: 'PAID', totalPaid: 100, restante: 0 },
  { nome: 'desconto de 10 (forma com valor bruto)', formas: [100], desconto: 10, http: 200, status: 'PAID', totalPaid: 90, restante: 0 },
  { nome: 'acréscimo de 10 (forma com valor bruto)', formas: [100], acrescimo: 10, http: 200, status: 'PAID', totalPaid: 110, restante: 0 },
  { nome: 'pagamento parcial', formas: [60], http: 200, status: 'PAID_PARTIALLY', totalPaid: 60, restante: 40 },
  { nome: 'soma maior que o título é recusada', formas: [110], http: 400, limpar: true },
];

for (const c of casos) {
  test(`quitação: ${c.nome}`, { tag: '@api' }, async ({ request }) => {
    const token = await obterToken(request);
    const titulo = await criarTitulo(request, token, 100);
    console.log(`${c.nome} -> título id=${titulo.id} documento=${titulo.documentNumber}`);

    const resposta = await quitarTitulo(request, token, {
      tituloId: titulo.id,
      formas: c.formas.map((valor) => ({ ...DINHEIRO, valor })),
      desconto: c.desconto,
      acrescimo: c.acrescimo,
    });

    try {
      if (resposta.status() !== c.http) {
        console.log('corpo da resposta:', (await resposta.text()).slice(0, 300));
      }

      expect(resposta.status()).toBe(c.http);
      if (c.http === 200) {
        const conta = (await resposta.json()).receivables[0];
        expect(conta.status).toBe(c.status);
        expect(conta.totalPaid).toBe(c.totalPaid);
        expect(conta.total).toBe(c.restante);
      }
    } finally {
      if (c.limpar) {
        const exclusao = await excluirTitulo(request, token, titulo);
        console.log(`Título ${titulo.id} excluído: HTTP ${exclusao.status()}`);
        expect(exclusao.status()).toBe(200);
      }
    }
  });
}