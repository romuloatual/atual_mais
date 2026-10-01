# Testes de fumaça (smoke)

Checagem rápida e rasa de que o sistema "está de pé": as telas principais abrem e as
ações mais básicas funcionam, sem validar regra de negócio a fundo. Não é um teste de
um card específico nem de regressão — é só pra confirmar que nada está catastroficamente
quebrado antes de gastar tempo com testes mais profundos.

- Toda spec dessa pasta deve ter a tag `@smoke`.
- Roda **primeiro**, em toda execução de CI, antes da suíte de regressão/completa — se o
  smoke falhar, o restante da suíte nem chega a rodar (gate rápido).
- Mantenha os testes aqui bem simples e baratos de manter: abrir tela, confirmar que
  carregou, uma ação básica. Nada de validar detalhes de negócio aqui — isso é trabalho
  da suíte de regressão ou dos testes de card.

```ts
import { test, expect } from '@playwright/test';

test('Venda Rápida V2 abre sem erro', { tag: '@smoke' }, async ({ page }) => {
  // ...
});
```

Veja a convenção completa em [`../README.md`](../README.md).
