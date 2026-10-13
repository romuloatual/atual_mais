// Calcula as métricas de QA a partir de uma EXPORTAÇÃO CSV do Jira. Só lê o arquivo: não acessa o Jira.
//   npm run metricas -- caminho/da/exportacao.csv
// Como exportar e o que cada número significa: docs/metricas-qa.md
// O CSV pode ter dados internos: guarde fora do Git (o .gitignore ignora "exports/" e "jira-*.csv").
import { readFileSync } from 'node:fs';

const arquivo = process.argv[2];
if (!arquivo || arquivo === '--ajuda') {
  console.log('Uso: npm run metricas -- <exportacao-jira.csv>\nVeja docs/metricas-qa.md para exportar o CSV do Jira (filtro do projeto INTG, todos os campos).');
  process.exit(arquivo ? 0 : 1);
}

// ---------- utilidades ----------
const sem = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// CSV (RFC 4180): aspas, vírgulas e quebras de linha dentro de campo; delimitador "," ou ";" detectado.
function lerCsv(texto) {
  texto = texto.replace(/^﻿/, '');
  const primeira = texto.split(/\r?\n/, 1)[0];
  const delim = (primeira.match(/;/g) || []).length > (primeira.match(/,/g) || []).length ? ';' : ',';
  const linhas = [];
  let campo = '', linha = [], aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === delim) { linha.push(campo); campo = ''; }
    else if (c === '\n') { linha.push(campo.replace(/\r$/, '')); linhas.push(linha); linha = []; campo = ''; }
    else campo += c;
  }
  if (campo !== '' || linha.length) { linha.push(campo.replace(/\r$/, '')); linhas.push(linha); }
  return linhas.filter((l) => l.some((x) => x !== ''));
}

const MESES = { jan: 1, fev: 2, feb: 2, mar: 3, abr: 4, apr: 4, mai: 5, may: 5, jun: 6, jul: 7, ago: 8, aug: 8, set: 9, sep: 9, out: 10, oct: 10, nov: 11, dez: 12, dec: 12 };
function lerData(s) {
  s = String(s ?? '').trim();
  if (!s) return null;
  let a, m, d;
  let r = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (r) { a = +r[1]; m = +r[2]; d = +r[3]; }
  else if ((r = s.match(/(\d{1,2})[\/\-.]([A-Za-zç]{3,4}|\d{1,2})[\/\-.](\d{2,4})/))) {
    d = +r[1];
    m = /^\d+$/.test(r[2]) ? +r[2] : MESES[sem(r[2]).slice(0, 3)];
    a = +r[3] < 100 ? 2000 + +r[3] : +r[3];
  }
  if (!a || !m || !d) return null;
  let h = 0, mi = 0;
  const t = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (t) { h = +t[1]; mi = +t[2]; if (/pm/i.test(t[3] || '') && h < 12) h += 12; if (/am/i.test(t[3] || '') && h === 12) h = 0; }
  return new Date(Date.UTC(a, m - 1, d, h, mi));
}
const mesDe = (dt) => `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`;
const dias = (a, b) => (b - a) / 86400000;
const media = (v) => (v.length ? v.reduce((x, y) => x + y, 0) / v.length : null);
const fmt = (n, c = 1) => (n === null || n === undefined || Number.isNaN(n) ? 'n/d' : n.toFixed(c).replace('.', ','));
const pct = (n) => (n === null ? 'n/d' : `${(n * 100).toFixed(0)}%`);

// ---------- colunas (nomes em inglês ou português) ----------
const ALIAS = {
  chave: ['issue key', 'chave da item', 'chave do item', 'chave da issue', 'chave'],
  idIssue: ['issue id', 'id da issue', 'id do item'],
  tipo: ['issue type', 'tipo de item', 'tipo de issue', 'tipo'],
  status: ['status'],
  criado: ['created', 'criado', 'criada'],
  resolvido: ['resolved', 'resolvido', 'resolvida'],
  pai: ['parent', 'principal', 'pai', 'parent key', 'parent id'],
  titulo: ['summary', 'resumo'],
};
const linhas = lerCsv(readFileSync(arquivo, 'utf8'));
if (linhas.length < 2) { console.error('CSV vazio ou sem dados.'); process.exit(1); }
const cab = linhas[0].map(sem);
const col = {};
for (const [k, nomes] of Object.entries(ALIAS)) {
  for (const n of nomes) { const i = cab.indexOf(n); if (i !== -1) { col[k] = i; break; } }
}
const obrig = ['chave', 'tipo', 'criado'];
const faltam = obrig.filter((k) => col[k] === undefined);
if (faltam.length) {
  console.error(`Não achei as colunas obrigatórias: ${faltam.join(', ')}.\nColunas do arquivo: ${linhas[0].join(' | ')}`);
  process.exit(1);
}

// ---------- classificação por tipo de item ----------
function classe(tipo) {
  const t = sem(tipo);
  const ehSub = /(subtarefa|sub-tarefa|sub-task|subtask)/.test(t);
  if (t === 'defeito') return 'defeito';
  if (/^bug/.test(t) && ehSub) return 'bugSub';
  if (t === 'bug') return 'bug';
  if (ehSub || /(test case|projeto|automacao)/.test(t)) return 'ignorar';
  return 'card';
}

const itens = [];
let datasRuins = 0;
for (const l of linhas.slice(1)) {
  const criado = lerData(l[col.criado]);
  if (!criado) { datasRuins++; continue; }
  itens.push({
    chave: l[col.chave], id: col.idIssue !== undefined ? l[col.idIssue] : null, tipo: l[col.tipo], classe: classe(l[col.tipo]),
    criado, resolvido: col.resolvido !== undefined ? lerData(l[col.resolvido]) : null,
    pai: col.pai !== undefined ? (l[col.pai] || '').trim() : '',
  });
}
// Se "Parent" vier como número (id), traduz para a chave do card.
const porId = new Map(itens.filter((i) => i.id).map((i) => [i.id, i.chave]));
for (const i of itens) if (/^\d+$/.test(i.pai) && porId.has(i.pai)) i.pai = porId.get(i.pai);
const cardsComRetrabalho = new Set(itens.filter((i) => i.classe === 'bugSub' && i.pai).map((i) => i.pai));

// ---------- por mês ----------
const meses = new Map();
const mes = (m) => { if (!meses.has(m)) meses.set(m, { escapes: 0, bug: 0, bugSub: 0, entregues: 0, retrabalho: 0, tempos: [] }); return meses.get(m); };
for (const i of itens) {
  const m = mes(mesDe(i.criado));
  if (i.classe === 'defeito') m.escapes++;
  if (i.classe === 'bug') m.bug++;
  if (i.classe === 'bugSub') m.bugSub++;
}
for (const i of itens) {
  if (!i.resolvido) continue;
  const m = mes(mesDe(i.resolvido));
  if (i.classe === 'card') { m.entregues++; if (cardsComRetrabalho.has(i.chave)) m.retrabalho++; }
  if (i.classe === 'defeito') m.tempos.push(dias(i.criado, i.resolvido));
}

const ordem = [...meses.keys()].sort();
const tot = { escapes: 0, detectados: 0, entregues: 0, retrabalho: 0, tempos: [] };
console.log(`# Métricas de QA (${arquivo})\n`);
console.log('| Mês | Escapes (Defeito no cliente) | Detectados antes (BUG + Bug subtarefa) | Eficiência de detecção | Cards entregues | Com retrabalho | Aprovação de primeira | Correção de Defeito (média / máx, dias) |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const k of ordem) {
  const m = meses.get(k);
  const det = m.bug + m.bugSub;
  const dre = det + m.escapes > 0 ? det / (det + m.escapes) : null;
  const apr = m.entregues > 0 ? 1 - m.retrabalho / m.entregues : null;
  tot.escapes += m.escapes; tot.detectados += det; tot.entregues += m.entregues; tot.retrabalho += m.retrabalho; tot.tempos.push(...m.tempos);
  console.log(`| ${k} | ${m.escapes} | ${det} | ${pct(dre)} | ${m.entregues} | ${m.retrabalho} | ${pct(apr)} | ${fmt(media(m.tempos))} / ${fmt(m.tempos.length ? Math.max(...m.tempos) : null)} |`);
}
const dreT = tot.detectados + tot.escapes > 0 ? tot.detectados / (tot.detectados + tot.escapes) : null;
const aprT = tot.entregues > 0 ? 1 - tot.retrabalho / tot.entregues : null;
console.log(`| **Total** | **${tot.escapes}** | **${tot.detectados}** | **${pct(dreT)}** | **${tot.entregues}** | **${tot.retrabalho}** | **${pct(aprT)}** | **${fmt(media(tot.tempos))} / ${fmt(tot.tempos.length ? Math.max(...tot.tempos) : null)}** |`);

console.log('\n## Como ler e limites dos dados\n');
console.log('- **Mês** de escapes e detectados = mês de **criação** do item; cards entregues e correção de Defeito = mês de **resolução**.');
console.log('- **Cards entregues** = itens que não são Bug, Defeito, subtarefa, Test Case, Projeto nem Automação, com data de resolução.');
console.log(`- **Retrabalho** = card entregue que teve ao menos 1 **Bug (subtarefa)** como filha${col.pai === undefined ? ' (**coluna de pai não encontrada: este número não é confiável**)' : ''}.`);
console.log('- **Tempo de teste do card (Testando até deploy)** não vem na exportação padrão: precisa do histórico de status do Jira (relatório "Control Chart" ou app de tempo em status). Veja docs/metricas-qa.md.');
if (col.resolvido === undefined) console.log('- **Coluna de resolução não encontrada:** cards entregues e correção de Defeito ficam em zero ou n/d.');
if (datasRuins) console.log(`- ${datasRuins} linha(s) ignoradas por data de criação ilegível.`);
console.log(`\nTipos encontrados: ${[...new Set(itens.map((i) => i.tipo))].map((t) => `${t} → ${classe(t)}`).join('; ')}`);
