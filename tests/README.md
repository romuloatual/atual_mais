# Organização dos testes

Os testes ficam divididos em duas pastas, com convenções de tag diferentes.

## `regression/` — suíte de regressão

Cobre as telas e fluxos mais usados do sistema (ex.: Venda Rápida V2, Pedido de Venda,
Dados do Cliente). É a rede de segurança que roda **automaticamente em todo push/PR** e
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
# Só a suíte de regressão
npm run test:regression

# Só os testes de um card específico
npm run test:card -- @INTG-2645
```
