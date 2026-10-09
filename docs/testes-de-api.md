# Testes de API (Playwright `request`)

Testes que falam direto com o backend do HMG, sem abrir navegador. Hoje cobrem o contrato da **quitação de contas a receber** (INTG-2726/INTG-2727). Não substituem o teste da tela: provam o que o backend aceita e responde.

## Antes de rodar

1. `npm install` (traz o `dotenv`).
2. Copie `.env.example` para `.env` e preencha (o `.env` é ignorado pelo Git; **nunca** suba senha ou token).

| Variável | O que é | Onde achar |
| --- | --- | --- |
| `QA_API_URL` | API do HMG | já vem no modelo |
| `QA_TENANT` | empresa (cabeçalho `schema`) | primeiro trecho da URL do painel (ex.: `romulo`) |
| `QA_APP_BASIC` | identificação do app no login, **só o código depois de `Basic `** | DevTools > Network > `oauth/token` > Request Headers, num login novo |
| `QA_USER`, `QA_PASS` | usuário de teste do HMG | uso do QA (idealmente um usuário dedicado, não administrador) |

Valores com `$` ou `#` na senha vão entre aspas simples no `.env`.

## Como rodar

```bash
npm run test:api
```

(equivale a `npx playwright test tests/api --project=chromium`). O `npm test` e o CI **não** rodam os testes `@api` (`--grep-invert @api`): eles precisam do `.env` e criam dados no HMG.

`--project=chromium` roda uma vez só (sem ele, o mesmo teste de API repetiria em 3 navegadores).

## Estrutura

| Arquivo | Para que serve |
| --- | --- |
| `tests/api/helpers/ambiente.ts` | lê o `.env`, avisa qual variável falta e **recusa rodar fora do HMG** |
| `tests/api/helpers/auth.ts` | login por `POST /oauth/token`, devolve o token |
| `tests/api/helpers/receivable.ts` | `criarTitulo` e `quitarTitulo` |
| `tests/api/login.api.spec.ts` | o login devolve um token |
| `tests/api/criar-titulo.api.spec.ts` | cria um título de R$ 100 |
| `tests/api/quitacao.api.spec.ts` | 6 casos de quitação, em tabela de dados |

## Casos de quitação cobertos (título de R$ 100)

| Caso | Esperado |
| --- | --- |
| 1 forma de 100 | 200, `PAID`, pago 100, restante 0 |
| 2 formas (60 + 40) | 200, `PAID`, pago 100, restante 0 |
| 1 forma de 100 com desconto 10 | 200, `PAID`, pago 90, restante 0 |
| 1 forma de 100 com acréscimo 10 | 200, `PAID`, pago 110, restante 0 |
| 1 forma de 60 | 200, `PAID_PARTIALLY`, pago 60, restante 40 |
| formas somando 110 | 400 (soma maior que o título) |

Regra do backend (provada por API no INTG-2727): `payments[].amount` é o valor **bruto**; total pago = soma − desconto + acréscimo; restante = título − soma. Na resposta, o campo `total` é o **restante**.

## Aprendizados que valem para qualquer teste de API

- **Cabeçalho `Authorization: bearer <token>` com `b` minúsculo.** Com `Bearer` o HMG responde 500 (`NullPointerException`, `PermissionInterceptor`). O painel usa minúsculo. Observação para o dev: o padrão HTTP trata os dois como iguais.
- **Cabeçalho `schema`** com a empresa em toda chamada.
- **Quitações simultâneas do mesmo cliente e conta dão 409.** Por isso o arquivo de quitação roda em fila (`test.describe.configure({ mode: 'default' })`). Em outro arquivo que quite títulos do mesmo cliente, repita essa linha.
- **A resposta de `POST /receivable/payment` vem em `receivables[]`.** Os valores ficam dentro do primeiro item.
- **Documento único por cliente:** o sistema recusa o mesmo número duas vezes. O helper gera número novo a cada título.

## Massa de dados e limpeza

Cada teste cria um título real no HMG (cliente de teste 103, forma A Prazo). O número do documento começa com **`QA`** para filtrar e excluir depois. Cada rodada de `tests/api` (8 testes) cria 7 títulos e exclui 2 sozinha; ficam 5 quitados (4 pagos e 1 parcial) no HMG.

- **Exclusão (capturada no HMG em 09/10/2026):** `DELETE /api/v1/receivable/{id}`, sem corpo, responde 200 com corpo vazio. A tela só mostra "Excluir" para título **Aberto** (e com a permissão de exclusão); título Pago ou Pago parcial não tem a opção. **O servidor também recusa**: o `DELETE` de título **Pago** ou **Pago parcial** responde **400** com `receivable.error.delete.status.invalid` (regra do backend: só se exclui título Aberto; verificado em 09/10/2026 com `npm run limpar:titulos -- --executar`); só título **Aberto** é excluído (200).
- Quitados por completo saem do filtro "Aberto"; use "Pago" ou "Todos". Os testes que deixam o título **aberto** (criar título e soma maior que o título) **se limpam sozinhos** com `excluirTitulo`, que só aceita documento com prefixo `QA` (trava de segurança). Os que quitam (5 dos 6 casos) deixam o título pago ou parcial no HMG.
- **Limpeza em lote:** `npm run limpar:titulos` mostra a prévia (cliente 103; documentos `QA...`, de 9 dígitos ou `5500`); `npm run limpar:titulos -- --executar` exclui e mostra o HTTP de cada um. O filtro "Aberto" da API traz também os Pago parcial. Título quitado é recusado pelo servidor (400) e fica no HMG.
- **Não ligue estes testes ao CI automático** enquanto não houver limpeza, para não encher o HMG.

## Limites

- Provam o backend, não a tela (a modal enviando o valor líquido no INTG-2727 só se vê pelo teste manual ou de interface).
- Rodam só em HMG (trava em `ambiente.ts`).
