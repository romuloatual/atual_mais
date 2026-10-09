# Atual Mais: QA

Repositório do setor de QA do Atual Mais: **evidências dos cards, testes automatizados (Playwright), modelos e a documentação de como trabalhamos**.

## Comece aqui: o caminho de um card, em 6 passos

| # | Passo | Detalhe em |
| --- | --- | --- |
| 1 | **Prepare a máquina:** instale o Node.js e rode `npm install` e `npx playwright install` | este README, abaixo |
| 2 | **Pegue um card** em *Prontos para testar*: mude a flag para **Testando** e se atribua em *Revisor QA* | [`docs/jira-fluxo-de-trabalho.md`](./docs/jira-fluxo-de-trabalho.md) |
| 3 | **Crie a sua branch** a partir da `main`: `card/INTG-XXXX` (confira o número na URL do card) | [`docs/git-fluxo-de-trabalho.md`](./docs/git-fluxo-de-trabalho.md) |
| 4 | **Teste no HMG** e registre em `tests/cards/INTG-XXXX-evidencias.md` (copie o modelo `TEMPLATE-evidencias.md`) | [`tests/cards/README.md`](./tests/cards/README.md) |
| 5 | **Comente o veredito** no card. Se achou defeito: abra uma **subtarefa** (modelo de defeito) e deixe o card em Testando | [`docs/jira-fluxo-de-trabalho.md`](./docs/jira-fluxo-de-trabalho.md) |
| 6 | **Confira e envie:** `npm run check:evidencias`, `git push`; o PR só abre quando o card termina | [`docs/git-fluxo-de-trabalho.md`](./docs/git-fluxo-de-trabalho.md) |

> Primeira vez? Leia o **[Guia de Onboarding (PDF)](./Guia_Onboarding_QA_Automacao_Atual_Mais.pdf)**, começando pelo "Mapa visual" (páginas 2 e 3). Dúvida em um termo? Veja o **[glossário](./docs/glossario.md)**.

## Quero fazer... então abro

| Quero... | Abro |
| --- | --- |
| entender o sistema (módulos, telas, rotas) | [`docs/mapa-do-sistema.md`](./docs/mapa-do-sistema.md) |
| entender como uma tela funciona | [`docs/telas/`](./docs/telas/README.md) |
| ver os fluxos mais importantes do sistema | [`docs/fluxos-principais.md`](./docs/fluxos-principais.md) |
| abrir um bug ou defeito | [`tests/cards/TEMPLATE-card-de-defeito.md`](./tests/cards/TEMPLATE-card-de-defeito.md) |
| ver falhas já encontradas | [`docs/falhas/`](./docs/falhas/README.md) |
| escrever um teste automatizado | [`tests/README.md`](./tests/README.md) |
| rodar os testes de API | [`docs/testes-de-api.md`](./docs/testes-de-api.md) |
| configurar a empresa de teste fiscal (NFC-e/NF-e) | Guia de Onboarding, seção 5 |
| entender um termo | [`docs/glossario.md`](./docs/glossario.md) |
| ver o plano do setor | [`ROADMAP.md`](./ROADMAP.md) |

## Regras rápidas

1. Todo teste está vinculado a um card no Jira.
2. Testes automatizados rodam **só em HMG**, nunca em produção.
3. **Nunca** versione senha, token ou `.env`. O Jira guarda a decisão e o resumo; o detalhe fica no Git.
4. Depois de cada push na `main`, **confira o CI** (aba Actions) e **atualize as branches de card abertas**.
5. Seletores: prefira `id`, `role`/texto visível ou `data-testid`; evite classes com hash do CSS Modules.

## Comandos

| Comando | Para que serve |
| --- | --- |
| `npm test` | roda a suíte, sem os testes de API |
| `npm run test:smoke` / `test:regression` | só a fumaça / só a regressão |
| `npm run test:api` | testes de API (só em HMG, precisa do `.env`; veja [`docs/testes-de-api.md`](./docs/testes-de-api.md)) |
| `npm run test:card -- @INTG-2645` | testes marcados com a tag de um card |
| `npm run check:evidencias` | confere se as evidências seguem o modelo |
| `npm run test:headed` / `test:ui` / `test:report` / `test:codegen` | ver o navegador / interface do Playwright / último relatório / gravar um teste |

Para os **testes de API**: copie `.env.example` para `.env` e preencha com o usuário de teste do HMG.

## Onde está cada regra (fonte única)

Cada assunto tem **um** documento completo; os outros só resumem e apontam para ele.

| Assunto | Fonte | Estado |
| --- | --- | --- |
| Fluxo do card no Jira, tipos de item, subtarefa | [`docs/jira-fluxo-de-trabalho.md`](./docs/jira-fluxo-de-trabalho.md) | Pronto; um caso "a confirmar" com o supervisor |
| Git: branches, push, CI depois do push | [`docs/git-fluxo-de-trabalho.md`](./docs/git-fluxo-de-trabalho.md) | Pronto |
| Pastas de teste e tags | [`tests/README.md`](./tests/README.md) | Pronto |
| Evidência e modelos de card | [`tests/cards/README.md`](./tests/cards/README.md) | Pronto |
| Módulos e rotas do sistema | [`docs/mapa-do-sistema.md`](./docs/mapa-do-sistema.md) | Pronto; 2 nomes a confirmar |
| Comportamento de cada tela | [`docs/telas/`](./docs/telas/README.md) | **Em construção** (1 de 6 telas confirmada por teste) |
| Falhas encontradas | [`docs/falhas/`](./docs/falhas/README.md) | Vivo, atualizado a cada card |
| Ambientes e dados fiscais de teste | Guia de Onboarding, seções 4 e 5 | Pronto |

## Para quem mantém o CI

O workflow [`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml) roda o **smoke primeiro** e depois a regressão (push/PR) ou a suíte completa sem API (todo dia, 03:00); o disparo manual escolhe. A API nunca roda no CI. O quadro completo está em [`tests/README.md`](./tests/README.md). O relatório de cada execução fica publicado em **https://romuloatual.github.io/atual_mais/**.

> Setup único: em **Settings → Pages** do repositório, defina "Source" como **GitHub Actions**. Sem isso o passo de deploy falha.
