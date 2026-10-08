// Confere se cada tests/cards/INTG-XXXX-evidencias.md segue o modelo padrão (TEMPLATE-evidencias.md).
// Uso: npm run check:evidencias            (todos os arquivos)
//      npm run check:evidencias -- INTG-2727 (só um card)
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const filtro = process.argv[2];

// Cabeçalho: trechos que precisam existir antes da primeira seção.
const cabecalho = ['**Card:**', 'Status:', 'Evidência em vídeo (JAM)'];
// Seções obrigatórias, nesta ordem.
const secoes = [
  '## O que o card pede',
  '## Critérios do card (BDD) executados',
  '## Complementares',
  '## Passo a passo',
  '## Evidência técnica',
  '## Print/preview',
  '## Observação de processo',
  '## Pendências',
];

const arquivos = readdirSync(dir).filter(
  (f) => /^INTG-\d+-evidencias\.md$/.test(f) && (!filtro || f.startsWith(filtro)),
);
if (!arquivos.length) {
  console.log('Nenhum INTG-XXXX-evidencias.md encontrado.');
  process.exit(0);
}

let falhou = false;
for (const f of arquivos) {
  const txt = readFileSync(join(dir, f), 'utf8');
  const erros = [];
  const id = f.replace('-evidencias.md', '');
  if (!txt.startsWith(`# ${id} — Validação manual`)) erros.push(`título deve ser "# ${id} — Validação manual"`);
  const primeiraSecao = txt.indexOf('\n## ');
  const topo = primeiraSecao === -1 ? txt : txt.slice(0, primeiraSecao);
  for (const c of cabecalho) if (!topo.includes(c)) erros.push(`cabeçalho sem "${c}"`);
  let pos = -1;
  for (const s of secoes) {
    const i = txt.indexOf(`\n${s}`);
    if (i === -1) erros.push(`falta a seção "${s}"`);
    else if (i < pos) erros.push(`seção fora de ordem: "${s}"`);
    else pos = i;
  }
  if (!/\| # \| Dado \| Quando \| Então \(card\) \| Obtido \|/.test(txt)) erros.push('tabela BDD sem as colunas Dado/Quando/Então (card)/Obtido');
  if (erros.length) {
    falhou = true;
    console.log(`❌ ${f}`);
    erros.forEach((e) => console.log(`   - ${e}`));
  } else {
    console.log(`✅ ${f}`);
  }
}
if (falhou) {
  console.log('\nModelo: tests/cards/TEMPLATE-evidencias.md');
  process.exit(1);
}
