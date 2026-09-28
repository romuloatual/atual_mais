# Atual Mais - QA Automation

Testes automatizados end-to-end do setor de QA do Projeto Atual Mais, usando [Playwright](https://playwright.dev/).

## Como começar

```bash
npm install
npx playwright install
```

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm test` | Roda toda a suíte de testes |
| `npm run test:headed` | Roda os testes com o navegador visível |
| `npm run test:ui` | Abre a interface interativa do Playwright |
| `npm run test:report` | Abre o último relatório de execução |
| `npm run test:codegen` | Grava ações no navegador e gera código de teste automaticamente |

## Estrutura

- `playwright.config.ts` - configuração global (baseURL, navegadores, timeouts, relatórios)
- `tests/` - arquivos de teste (`*.spec.ts`)

## Documentação

Consulte [`Guia_Onboarding_QA_Automacao_Atual_Mais.pdf`](./Guia_Onboarding_QA_Automacao_Atual_Mais.pdf) para o guia completo de onboarding do setor de QA: ambientes, ferramentas, fluxo de trabalho, boas práticas de seletores e checklist de entrada.

## Regras rápidas

- Todo teste deve estar vinculado a um card no Jira.
- Os testes automatizados rodam por padrão contra o ambiente HMG - nunca contra produção.
- Evite seletores baseados em classes com hash do CSS Modules; prefira `id`, `role`/texto visível ou `data-testid`.
