# Roadmap — Montando o setor de QA do zero (Atual Mais)

Cronograma prático pra quem está começando um setor de QA hoje, sem nada pronto antes.
As caixas já marcadas são coisas que já fizemos juntos nesta configuração inicial —
você não está no dia 1, está entrando na Fase 2.

> Ajuste os prazos pra sua realidade (carga de trabalho, se tem mais alguém no time, etc.).
> O que importa é a **ordem**: fundação antes de processo, processo antes de escalar automação.

---

## Fase 0 — Fundação técnica (feito)

- [x] Definir ambientes de teste e a regra de uso (HMG → PREPROD → Produção)
- [x] Documentar dados de teste fiscal (NFC-e, certificado digital)
- [x] Escolher o stack de automação (Playwright + TypeScript + Node)
- [x] Criar o projeto de automação e subir pro GitHub (`romuloatual/atual_mais`)
- [x] Escrever o guia de onboarding do setor (PDF, identidade visual da empresa)
- [x] Definir convenção de organização dos testes (`tests/regression/` vs `tests/cards/`, tags)
- [x] Configurar CI no GitHub Actions (regressão em todo push/PR, suíte completa à noite)
- [x] Publicar relatório de execução no GitHub Pages
- [x] Decidir a estratégia de teste de API (Playwright `request`, sem ferramenta separada)
- [x] Fluxo de cards no Jira, tipos de item e modelos de comentário e de card de defeito ([`docs/jira-fluxo-de-trabalho.md`](./docs/jira-fluxo-de-trabalho.md), `tests/cards/TEMPLATE-*.md`)
- [x] Evidência por card em modelo único, conferida por `npm run check:evidencias`
- [x] Mapa do sistema (módulos, áreas e rotas do painel, ligados ao Help) e estrutura de pastas por módulo e área, com README ([`docs/mapa-do-sistema.md`](./docs/mapa-do-sistema.md))
- [x] Documentos vivos de telas e de falhas ([`docs/telas/`](./docs/telas/README.md), [`docs/falhas/`](./docs/falhas/README.md))

---

## Fase 1 — Fechar a fundação (esta semana)

- [ ] **Settings → Pages** do repositório: definir "Source" como GitHub Actions (passo manual pendente)
- [ ] Rodar `npm test` local pela primeira vez contra HMG e confirmar que passa (suíte vazia, mas valida a config)
- [ ] Conseguir os acessos que faltam: Jira, Clockify, Clarity, certificado digital (se aplicável)
- [ ] Definir como a autenticação vai funcionar nos testes (login via UI? token de API? usuário de teste dedicado?) e configurar como secret no GitHub Actions

## Fase 2 — Mapear risco antes de automatizar (semana 1-2)

- [x] Listar os módulos/telas do Atual Mais por **frequência de uso** e **impacto de um bug** (fiscal e pagamento primeiro) — feito a partir do manual oficial, documentado em [`docs/fluxos-principais.md`](./docs/fluxos-principais.md) e no mapa mental "Fluxos Principais do Atual Mais e como usar" (Venda Rápida, Pedidos, Orçamento, Ordem de Serviço, Caixa, Entrada de NF, Clientes, Produtos)
- [ ] Para cada módulo crítico, listar os fluxos "caminho feliz" que, se quebrarem, geram o maior estrago
- [ ] Dessa lista, escolher os 2-3 **módulos** (ex.: Vendas) que viram a base da suíte `tests/regression/`. Regressão é macro (um conjunto de testes por módulo), não tela por tela
- [ ] **Shift-left:** ler o card e o BDD **antes** de o dev começar e apontar furos de lógica ou critério ausente (hoje só testamos depois de pronto)
- [ ] Definir a "Definição de Pronto" de QA: o que precisa estar verdade pra um card ser considerado testado (validado em HMG? evidência anexada? automatizado se crítico?)

## Fase 3 — Primeiros testes reais (semana 2-4)

- [ ] Escrever o primeiro teste de tela em `tests/regression/vendas/venda-rapida/` (Venda Rápida V2, com a tag do card, ex.: `@INTG-2645`), usando os seletores já mapeados
- [ ] Escrever 1-2 testes em `tests/regression/` para os fluxos mais críticos identificados na Fase 2
- [ ] Rodar a suíte no CI (push real) e confirmar que o relatório publica certo no GitHub Pages
- [ ] Escrever o primeiro teste de API com a `request` fixture do Playwright (escolher um endpoint simples pra validar o padrão antes de escalar)
- [ ] **Conferência no banco (SQL, somente leitura):** onde houver acesso, checar se o que a tela grava bate com o banco (ex.: quitação, bruto x líquido). Depende de o time liberar o acesso
- [ ] Ajustar o fluxo de trabalho conforme a prática mostra o que não funciona (é normal a convenção mudar um pouco no início)

## Fase 4 — Consolidar o processo (mês 1-2)

- [ ] Formalizar o fluxo bug → card → teste → automação → CI num único lugar (o guia de onboarding já tem a base; revisar depois de rodar de verdade)
- [ ] Definir critério objetivo de "quando o teste de um card merece entrar em `regression/`" (ex.: 2+ regressões no mesmo fluxo, ou fluxo usado todo dia)
- [ ] Configurar alerta de falha da CI (ex.: notificação no Slack/Teams/e-mail quando a suíte de regressão quebra)
- [ ] Definir com o supervisor o fluxo de Parcial/Reprovado sem subtarefa (hoje "a definir" no doc do Jira)
- [ ] Levantar uma métrica simples de baseline: quantos bugs chegaram em produção nos últimos meses, pra comparar depois

## Fase 5 — Mostrar valor e escalar (mês 2-3+)

- [ ] Comparar a métrica de bugs em produção antes/depois de ter QA e automação
- [ ] Medir tempo de ciclo de validação (tempo entre "card pronto pra teste" e "validado")
- [ ] Se o time crescer, definir revisão de código pros testes (PR review dos arquivos de teste, não só do produto)
- [ ] Avaliar se vale a pena expandir cobertura (Venda Rápida V1, mais módulos) ou aprofundar (testes de carga, visual regression, etc.)
- [ ] Revisitar este roadmap — ele é o ponto de partida, não o plano final

---

## Referências rápidas

- Guia de onboarding completo: [`Guia_Onboarding_QA_Automacao_Atual_Mais.pdf`](./Guia_Onboarding_QA_Automacao_Atual_Mais.pdf)
- Convenção de testes: [`tests/README.md`](./tests/README.md)
- Workflow de CI: [`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml)
- Relatório publicado: https://romuloatual.github.io/atual_mais/
