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
| `npm run test:regression` | Roda só a suíte de regressão (tag `@regression`) |
| `npm run test:card -- @INTG-2645` | Roda só os testes de um card específico |

## Estrutura

- `playwright.config.ts` - configuração global (baseURL, navegadores, timeouts, relatórios)
- `tests/regression/` - testes das telas/fluxos mais usados, sempre com a tag `@regression`.
  Roda automaticamente em todo push/PR e também à noite (agendado), pra pegar quando um
  card quebra outra funcionalidade do mesmo processo/tela.
- `tests/cards/` - um arquivo por card do Jira, com a tag do card (ex.: `@INTG-2645`).
  Roda sob demanda enquanto o card está em andamento; cenários críticos/recorrentes são
  promovidos para `regression/` depois de validados.

Veja a convenção completa em [`tests/README.md`](./tests/README.md).

## CI

O workflow [`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml) roda:

- **Push/PR para `main`:** só a suíte de regressão (feedback rápido).
- **Todo dia às 03:00 (horário de Brasília):** a suíte completa (regressão + cards).
- **Manual (`workflow_dispatch`):** você escolhe rodar regressão ou tudo.

O relatório HTML de cada execução fica disponível como artefato do workflow por 14 dias, e
também publicado (sempre a versão mais recente) em:

**https://romuloatual.github.io/atual_mais/**

> Setup único necessário: em **Settings → Pages** do repositório, defina "Source" como
> **GitHub Actions**. Sem isso o passo de deploy do workflow falha.

## Documentação

Consulte [`Guia_Onboarding_QA_Automacao_Atual_Mais.pdf`](./Guia_Onboarding_QA_Automacao_Atual_Mais.pdf) para o guia completo de onboarding do setor de QA: ambientes, ferramentas, fluxo de trabalho, boas práticas de seletores e checklist de entrada.

## Regras rápidas

- Todo teste deve estar vinculado a um card no Jira.
- Os testes automatizados rodam por padrão contra o ambiente HMG - nunca contra produção.
- Evite seletores baseados em classes com hash do CSS Modules; prefira `id`, `role`/texto visível ou `data-testid`.
