# Organização dos testes

Os testes ficam divididos em três pastas, com convenções de tag diferentes.

| | `smoke/` | `regression/` | `cards/` |
| --- | --- | --- | --- |
| Profundidade | Rasa (tela abre, ação básica funciona) | Funda (regra de negócio específica) | Funda (o que o card pede) |
| Abrangência | Todos os módulos principais | Um módulo inteiro (macro), ex.: Vendas | Só o escopo do card |
| Quando roda | Primeiro, sempre, bem rápido | Todo push/PR | Sob demanda |
| Objetivo | "O sistema não está pegando fogo" | "Essa regra específica continua certa" | "Esse card específico funciona" |

## `smoke/` — testes de fumaça

Checagem rápida e rasa de que as telas principais abrem e as ações mais básicas
funcionam. Roda **primeiro** em toda execução de CI — se falhar, o resto da suíte nem
chega a rodar (gate rápido, barato de manter).

- Toda spec dessa pasta deve ter a tag `@smoke`.

```ts
import { test, expect } from '@playwright/test';

test('Venda Rápida V2 abre sem erro', { tag: '@smoke' }, async ({ page }) => {
  // ...
});
```

## `regression/` — suíte de regressão

É uma suíte **macro**, organizada por **módulo** (ex.: Vendas, Financeiro, Compras), e não por
tela solta. Cada módulo reúne os fluxos que, se quebrarem, geram o maior estrago (ex.: em
Vendas: Venda Rápida, Pedido, Orçamento). Testar tela por tela gasta energia demais. É a rede de segurança que roda **automaticamente em todo push/PR** e
também à noite (agendado), pra pegar quando uma alteração em um card quebra outra
funcionalidade do mesmo processo/tela.

- Um teste entra aqui quando o cenário é **crítico ou recorrente o suficiente** para
  valer a pena rodar sempre.
- Toda spec dessa pasta deve ter a tag `@regression`.

```ts
import { test, expect } from '@playwright/test';

test('cliente à vista mantém telefone e celular separados no cupom', { tag: '@regression' }, async ({ page }) => {
  // ...
});
```

## `cards/` — testes por card

Um arquivo por card do Jira (ex.: `INTG-2645.spec.ts`), criado junto com a validação
daquele card específico. Roda sob demanda enquanto o card está em andamento.

- Toda spec dessa pasta deve ter a tag do card (ex.: `@INTG-2645`).
- Se o cenário for crítico/recorrente, "promova" o teste (ou uma versão dele) para
  `regression/` depois que o card for validado e fechado.

```ts
import { test, expect } from '@playwright/test';

test('impressão em bobina não concatena telefone e celular', { tag: '@INTG-2645' }, async ({ page }) => {
  // ...
});
```

## Rodando por tag

```bash
# Só a suíte de fumaça
npm run test:smoke

# Só a suíte de regressão
npm run test:regression

# Só os testes de um card específico
npm run test:card -- @INTG-2645
```
