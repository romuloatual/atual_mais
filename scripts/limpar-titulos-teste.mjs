// Limpeza dos títulos de TESTE do cliente 103 no HMG.
// Por padrão só LISTA o que seria excluído (prévia). Para excluir de verdade, passe --executar.
//   npm run limpar:titulos                 -> prévia
//   npm run limpar:titulos -- --executar   -> exclui (DELETE /api/v1/receivable/{id})
// Título quitado (Pago/Pago parcial) não tem "Excluir" na tela; o servidor pode recusar. O script mostra o HTTP de cada um.
import 'dotenv/config';

const CLIENTE_TESTE_ID = 103;
// Documentos de teste: prefixo QA, 9 dígitos (primeiros testes de API) e 5500 (criação duplicada).
const ehDocumentoDeTeste = (doc) => /^QA\d+$/.test(doc) || /^\d{9}$/.test(doc) || doc === '5500';
const executar = process.argv.includes('--executar');

function obrigatoria(nome) {
  const valor = process.env[nome];
  if (!valor) throw new Error(`Variável ${nome} não definida. Preencha o .env (modelo: .env.example).`);
  return valor;
}

const api = obrigatoria('QA_API_URL');
if (!api.includes('hmg')) throw new Error(`QA_API_URL não parece HMG (${api}). Limpeza só roda em HMG.`);
const tenant = obrigatoria('QA_TENANT');

async function obterToken() {
  const resposta = await fetch(`${api}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${obrigatoria('QA_APP_BASIC')}`,
      schema: tenant,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: obrigatoria('QA_USER'),
      password: obrigatoria('QA_PASS'),
      client: 'web',
    }),
  });
  if (!resposta.ok) throw new Error(`Login via API falhou (HTTP ${resposta.status}). Confira o .env.`);
  return (await resposta.json()).access_token;
}

const token = await obterToken();
const headers = { Authorization: `bearer ${token}`, schema: tenant };

// Busca os títulos por situação (o filtro OPEN já traz Aberto e Pago parcial), sem repetir ids.
const achados = new Map();
for (const status of ['OPEN', 'PAID_PARTIALLY', 'PAID']) {
  const url =
    `${api}/api/v1/receivable?customer=true&finance=false&summary=true&status=${status}` +
    '&initialDueDate=2026-01-01T00:00:00&finalDueDate=2026-12-31T23:59:59' +
    '&baseDate=2026-10-09T10:58:01&current=1&pageSize=100&page=0&limit=100';
  const resposta = await fetch(url, { headers });
  if (!resposta.ok) throw new Error(`Listar ${status} falhou (HTTP ${resposta.status}).`);
  const corpo = await resposta.json();
  for (const t of corpo.records ?? []) {
    if (t.customer?.id === CLIENTE_TESTE_ID && ehDocumentoDeTeste(String(t.documentNumber))) achados.set(t.id, t);
  }
}

const lista = [...achados.values()].sort((a, b) => a.id - b.id);
console.log(`${executar ? 'EXCLUINDO' : 'PRÉVIA (nada será excluído)'}: ${lista.length} títulos do cliente ${CLIENTE_TESTE_ID}`);
for (const t of lista) {
  let resultado = '';
  if (executar) {
    const r = await fetch(`${api}/api/v1/receivable/${t.id}`, { method: 'DELETE', headers });
    resultado = ` -> HTTP ${r.status}`;
    if (!r.ok) {
      const msg = (await r.text()).replace(/s+/g, " ").slice(0, 160);
      resultado += ` ${msg}`;
    }
  }
  console.log(`  id=${t.id} doc=${t.documentNumber} ${t.status} valor=${t.amount}${resultado}`);
}
if (!executar && lista.length) console.log('\nPara excluir de verdade: npm run limpar:titulos -- --executar');
