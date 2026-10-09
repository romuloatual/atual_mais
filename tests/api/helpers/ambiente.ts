import 'dotenv/config';

// Lê uma variável do .env e avisa com clareza se ela não existe.
function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`Variável ${nome} não definida. Preencha o .env (modelo: .env.example).`);
  }
  return valor;
}

export function lerAmbiente() {
  const ambiente = {
    apiUrl: obrigatoria('QA_API_URL'),
    tenant: obrigatoria('QA_TENANT'),
    appBasic: obrigatoria('QA_APP_BASIC'),
    usuario: obrigatoria('QA_USER'),
    senha: obrigatoria('QA_PASS'),
  };

  // Trava: teste de API só roda em HMG, nunca em produção.
  if (!ambiente.apiUrl.includes('hmg')) {
    throw new Error(`QA_API_URL não parece HMG (${ambiente.apiUrl}). Teste de API só roda em HMG.`);
  }
  return ambiente;
}