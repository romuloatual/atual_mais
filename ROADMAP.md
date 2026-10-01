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

---

## Fase 1 — Fechar a fundação (esta semana)

- [ ] **Settings → Pages** do repositório: definir "Source" como GitHub Actions (passo manual pendente)
- [ ] Rodar `npm test` local pela primeira vez contra HMG e confirmar que passa (suíte vazia, mas valida a config)
- [ ] Conseguir os acessos que faltam: Jira, Clockify, Clarity, certificado digital (se aplicável)
- [ ] Definir como a autenticação vai funcionar nos testes (login via UI? token de API? usuário de teste dedicado?) e configurar como secret no GitHub Actions

## Fase 2 — Mapear risco antes de automatizar (semana 1-2)

- [x] Listar os módulos/telas do Atual Mais por **frequência de uso** e **impacto de um bug** (fiscal e pagamento primeiro) — feito a partir do manual oficial, documentado no mapa mental em "Fluxos Principais do Atual Mais e como usar" (Venda Rápida, Pedidos, Orçamento, Ordem de Serviço, Caixa, Entrada de NF, Clientes, Produtos)
- [ ] Para cada módulo crítico, listar os fluxos "caminho feliz" que, se quebrarem, geram o maior estrago
- [ ] Dessa lista, escolher as 3-5 telas que viram a base da suíte `tests/regression/`
- [ ] Definir a "Definição de Pronto" de QA: o que precisa estar verdade pra um card ser considerado testado (validado em HMG? evidência anexada? automatizado se crítico?)

## Fase 3 — Primeiros testes reais (semana 2-4)

- [ ] Escrever o primeiro teste em `tests/cards/` (ex.: `INTG-2645.spec.ts`) usando os seletores já mapeados da tela de Venda Rápida V2
- [ ] Escrever 1-2 testes em `tests/regression/` para os fluxos mais críticos identificados na Fase 2
- [ ] Rodar a suíte no CI (push real) e confirmar que o relatório publica certo no GitHub Pages
- [ ] Escrever o primeiro teste de API com a `request` fixture do Playwright (escolher um endpoint simples pra validar o padrão antes de escalar)
- [ ] Ajustar o fluxo de trabalho conforme a prática mostra o que não funciona (é normal a convenção mudar um pouco no início)

## Fase 4 — Consolidar o processo (mês 1-2)

- [ ] Formalizar o fluxo bug → card → teste → automação → CI num único lugar (o guia de onboarding já tem a base; revisar depois de rodar de verdade)
- [ ] Definir critério objetivo de "quando promover um teste de `cards/` pra `regression/`" (ex.: 2+ regressões no mesmo fluxo, ou fluxo usado todo dia)
- [ ] Configurar alerta de falha da CI (ex.: notificação no Slack/Teams/e-mail quando a suíte de regressão quebra)
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
