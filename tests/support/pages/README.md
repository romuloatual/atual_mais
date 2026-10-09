# Mapas de tela (page objects)

Cada arquivo guarda os **seletores e as ações de uma tela**, para os testes não repetirem seletor. Se a tela mudar, ajusta-se um arquivo só.

**Onde fica:** `tests/support/pages/<módulo>/<área>.page.ts`, espelhando as pastas de `regression/` (ex.: `vendas/venda-rapida.page.ts`).

**Regras:**
- Um arquivo por área (tela).
- Só **ações e leituras** (abrir, preencher, clicar, ler um valor). A **conferência** (`expect`) fica no teste, não aqui.
- Seletores estáveis: `id`, `role` ou texto visível e `data-testid`. **Nunca** classes de CSS Modules com hash.
- O login não entra aqui: ele vem do `support/auth.ts`.

**Modelo:**

```ts
import type { Page } from '@playwright/test';

export class VendaRapidaPage {
  constructor(private readonly page: Page) {}

  async abrir() {
    await this.page.goto('/pdv-v2');
  }
}
```

**Situação:** vazia. O primeiro mapa nasce com o primeiro teste de [`regression/vendas/venda-rapida/`](../../regression/vendas/venda-rapida), partindo de [`docs/telas/venda-rapida.md`](../../../docs/telas/venda-rapida.md).

**Antes do primeiro teste de tela:** o `baseURL` do `playwright.config.ts` aponta para `backoffice.hmg...`, mas o painel da empresa de teste é `<empresa>.hmg.atualmais.com.br` (ex.: o smoke usa `QA_PAINEL_URL`). Defina o endereço certo antes de escrever o teste.

Convenção de pastas: [`../../README.md`](../../README.md).
