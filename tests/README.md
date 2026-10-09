# Organização dos testes

Os testes são divididos por **camada** e, dentro da camada, por **módulo** (Vendas, Financeiro...). A camada define **quando** o teste roda; o módulo define **o assunto**.

| | `smoke/` | `regression/<módulo>/` | `api/<módulo>/` | `cards/` |
| --- | --- | --- | --- | --- |
| O que é | teste de tela | teste de tela | teste de API (sem navegador) | **só evidência** (`.md`), não tem teste |
| Profundidade | rasa: a tela abre, ação básica funciona | funda: regra de negócio do módulo | funda: contrato do backend | o que o card pede |
| Quando roda | primeiro, sempre, em todo CI (gate) | todo push/PR e à noite | **sob demanda**, fora do CI | não roda |
| Objetivo | "o sistema não está pegando fogo" | "essa regra continua certa" | "o backend responde como combinamos" | registrar o que foi validado |
| Tag | `@smoke` | `@regression` | `@api` | n/a |

## Onde cada coisa fica

```
tests/
├─ support/                 usado por todos os módulos (ambiente, login por API, page objects)
├─ smoke/                   uma tela por módulo abre: <assunto>.smoke.spec.ts
├─ regression/<módulo>/     regressão macro do módulo (ex.: vendas/, financeiro/)
├─ api/<módulo>/            testes de API do módulo (ex.: financeiro/) + helper só dele
└─ cards/                   evidências .md dos cards, modelos e o conferidor
```

Regras:

1. **Camada primeiro, módulo depois.** Pastas de módulo nascem com o primeiro teste.
2. **Helpers:** o de um módulo mora no módulo; o de todos, em `support/`.
3. **Nome:** `<assunto>.<camada>.spec.ts` (ex.: `quitacao.api.spec.ts`, `login.smoke.spec.ts`).
4. **API e tela não se misturam** no mesmo arquivo.
5. **`cards/` guarda evidência, não teste.** O card é registrado em `INTG-XXXX-evidencias.md`.
6. **Teste automatizado de um card** só existe se o cenário for **crítico ou recorrente**. Ele vai **direto** em `regression/<módulo>/`, com a tag do card ao lado de `@regression`, e **nunca fica copiado em dois lugares**.

## `smoke/`: testes de fumaça

Checagem rápida e rasa de que as telas principais abrem e as ações mais básicas funcionam. Roda **primeiro** em toda execução de CI: se falhar, o resto da suíte nem chega a rodar (gate rápido, barato de manter). É separado da regressão de propósito: não se repete cenário de smoke dentro dela.

- Toda spec dessa pasta deve ter a tag `@smoke`.

```ts
import { test, expect } from '@playwright/test';

test('Venda Rápida V2 abre sem erro', { tag: '@smoke' }, async ({ page }) => {
  // ...
});
```

## `regression/<módulo>/`: suíte de regressão

Suíte **macro**, organizada por **módulo** (Vendas, Financeiro, Compras), e não por tela solta. Cada módulo reúne os fluxos que, se quebrarem, geram o maior estrago (em Vendas: Venda Rápida, Pedido, Orçamento). É a rede de segurança que roda em **todo push/PR** e também à noite, para pegar quando uma alteração quebra outra funcionalidade do mesmo processo.

- Um teste entra aqui quando o cenário é **crítico ou recorrente** o suficiente para valer rodar sempre.
- Toda spec dessa pasta deve ter a tag `@regression`.
- Se o teste nasceu de um card, acrescente a **tag do card** para rastrear (`@INTG-2645`). Assim `npm run test:card -- @INTG-2645` encontra o teste sem precisar de uma pasta por card.

```ts
import { test, expect } from '@playwright/test';

test('impressão em bobina não concatena telefone e celular', { tag: ['@regression', '@INTG-2645'] }, async ({ page }) => {
  // ...
});
```

## `api/<módulo>/`: testes de API

Falam direto com o backend, sem navegador: provam o contrato (o que o servidor aceita e responde). Hoje cobrem a quitação do Financeiro.

- Toda spec dessa pasta deve ter a tag `@api`.
- Precisam do `.env` (nunca versionado) e **só rodam em HMG**; criam dados de teste que o sistema nem sempre deixa excluir. Por isso ficam **fora do CI**: rodam sob demanda, com `npm run test:api`.
- Guia completo: [`docs/testes-de-api.md`](../docs/testes-de-api.md).

## `support/`

Código compartilhado por todos os módulos: leitura do `.env` com a trava de HMG (`ambiente.ts`), login por API (`auth.ts`) e, quando existirem, os mapas de tela (page objects). O que é de **um** módulo só fica na pasta dele.

## `cards/`: evidência por card

Cada card tem `INTG-XXXX-evidencias.md` no modelo padrão (`TEMPLATE-evidencias.md`), conferido por `npm run check:evidencias`. A pasta também guarda os modelos de comentário do Jira, de caso de teste e de card de defeito. Veja [`cards/README.md`](./cards/README.md).

## Rodando

```bash
npm test                       # a suíte, sem os testes de API
npm run test:smoke             # só a suíte de fumaça
npm run test:regression        # só a suíte de regressão
npm run test:api               # só os testes de API (HMG, precisa do .env)
npm run test:card -- @INTG-2645   # só os testes marcados com a tag do card
npm run check:evidencias       # confere se as evidências seguem o modelo
```

**No CI:** push/PR roda smoke e depois regressão; o agendado das 03:00 roda smoke e a suíte completa **sem** `@api`; o manual permite escolher. A API nunca roda no CI.
