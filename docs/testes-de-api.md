# Testes de API

> **Em uma frase:** testes que falam direto com o servidor do HMG, sem navegador, para provar o que o backend aceita e responde. Hoje cobrem a **quitação de Contas a Receber** (INTG-2726 e INTG-2727). Não substituem o teste da tela.

## Para rodar

| Passo | O que fazer |
| --- | --- |
| 1 | `npm install` |
| 2 | copiar `.env.example` para `.env` e preencher (o `.env` é ignorado pelo Git; **nunca** subir senha ou token) |
| 3 | `npm run test:api` |

| Variável do `.env` | O que é | Onde achar |
| --- | --- | --- |
| `QA_API_URL` | API do HMG | já vem no modelo |
| `QA_TENANT` | empresa (cabeçalho `schema`) | início da URL do painel (ex.: `romulo`) |
| `QA_APP_BASIC` | identificação do app, **só o código depois de `Basic `** | DevTools > Network > `oauth/token` > Request Headers, num login novo |
| `QA_USER`, `QA_PASS` | usuário de teste do HMG | idealmente um usuário dedicado, não administrador |

Senha com `$` ou `#` vai entre aspas simples. O `npm test` e o CI **não** rodam `@api` (precisam do `.env` e criam dados). Se o login der **HTTP 503**, o HMG está fora do ar: tente depois.

## O que existe

| Arquivo | Para que serve |
| --- | --- |
| `tests/support/ambiente.ts` | lê o `.env` e **recusa rodar fora do HMG** |
| `tests/support/auth.ts` | login por `POST /oauth/token` |
| `tests/api/login.api.spec.ts` | o login devolve um token |
| `tests/api/financeiro/contas-a-receber/receivable.ts` | ajudantes: criar, quitar e excluir título |
| `.../criar-titulo.api.spec.ts` | cria um título de R$ 100 |
| `.../quitacao.api.spec.ts` | 6 casos de quitação |

## Casos de quitação (título de R$ 100)

| Caso | Esperado |
| --- | --- |
| 1 forma de 100 | 200, `PAID`, pago 100, restante 0 |
| 2 formas (60 + 40) | 200, `PAID`, pago 100, restante 0 |
| 1 forma de 100 + desconto 10 | 200, `PAID`, pago 90, restante 0 |
| 1 forma de 100 + acréscimo 10 | 200, `PAID`, pago 110, restante 0 |
| 1 forma de 60 | 200, `PAID_PARTIALLY`, pago 60, restante 40 |
| formas somando 110 | **400** (soma maior que o título) |

**Regra do backend:** `payments[].amount` é o valor **bruto**; pago = soma − desconto + acréscimo; restante = título − soma. Na resposta, `total` é o **restante**.

## Aprendizados para qualquer teste de API

| Aprendizado | O que fazer |
| --- | --- |
| Com `Bearer` (B maiúsculo) o HMG responde **500** | usar `bearer` em minúsculo, como o painel |
| Toda chamada precisa do cabeçalho `schema` | enviar a empresa sempre |
| Quitações simultâneas do mesmo cliente e conta dão **409** | rodar o arquivo em fila (`test.describe.configure({ mode: 'default' })`) |
| `POST /receivable/payment` devolve os dados em `receivables[]` | ler o primeiro item |
| O sistema recusa o mesmo documento duas vezes para o cliente | o ajudante gera número novo a cada título |

## Dados de teste e limpeza

Cada título criado é **real** no HMG (cliente 103, forma A Prazo) e o documento começa com **`QA`**. Uma rodada de `tests/api` cria 7 títulos, exclui 2 sozinha e deixa **5 quitados** (4 pagos e 1 parcial).

| Situação do título | Pode excluir? | Como |
| --- | --- | --- |
| **Aberto** | sim (`DELETE /api/v1/receivable/{id}` responde 200) | os testes que deixam o título aberto se limpam sozinhos |
| **Pago** ou **Pago parcial** | **não**: o servidor responde **400** `receivable.error.delete.status.invalid`; a tela também não oferece "Excluir" | fica no HMG; é preciso um procedimento do time |

- **Limpeza em lote:** `npm run limpar:titulos` mostra uma **prévia** (cliente 103; documentos `QA...`, de 9 dígitos ou `5500`); com `-- --executar` exclui e mostra o HTTP de cada um.
- `excluirTitulo` só aceita documento com prefixo `QA` (trava de segurança).
- **Não ligar estes testes ao CI** enquanto não houver limpeza, para não encher o HMG.

## Limites

- Provam o **backend**, não a tela (a modal enviando o valor líquido, no INTG-2727, só aparece no teste de interface).
- Rodam **só em HMG**.
