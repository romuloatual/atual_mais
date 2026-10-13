# Rotina diária do QA

O dia a dia em uma página. Cada etapa é um **resumo**; o detalhe completo está no documento indicado ao lado (a fonte).

```
ABRIR O DIA  →  CICLO DO CARD (repete por card)  →  AUTOMAÇÃO (quando couber)  →  FECHAR O DIA
```

## 1. Abrir o dia (5 minutos)

- [ ] **Ver o CI:** aba **Actions** do GitHub. O run da madrugada (03:00) está verde? Vermelho é o primeiro assunto do dia
- [ ] **Atualizar:** `git checkout main` e `git pull`
- [ ] **Ver a fila:** coluna **Prontos para testar** no Jira

## 2. O ciclo de cada card

Fonte: [`jira-fluxo-de-trabalho.md`](./jira-fluxo-de-trabalho.md) e [`git-fluxo-de-trabalho.md`](./git-fluxo-de-trabalho.md).

| # | O que fazer | Onde |
| --- | --- | --- |
| 1 | **Pegar o card:** flag **Testando** e você em *Revisor QA* | Jira |
| 2 | **Conferir o número** na URL e **ler o card**. Regra de Negócio e BDD são o que se testa; "Notas técnicas" não são critério e podem estar desatualizadas | Jira |
| 3 | **Criar a branch** `card/INTG-XXXX` a partir da `main` | Git |
| 4 | **Testar no HMG:** cenários feliz, negativo e borda; gravar o JAM; registrar o tempo no Clockify | sistema |
| 5 | **Registrar a evidência** em `tests/cards/INTG-XXXX-evidencias.md` (copiar o modelo) e rodar `npm run check:evidencias` | Git |
| 6 | **Comentar o veredito** no card, em texto curto, no modelo | Jira |
| 7 | **Aprovado:** mover para **deploy** e comentar "Card movido para deploy". **Defeito:** subtarefa **Bug (subtarefa)** em **Refação**, atribuída ao responsável do card; o card fica em **Testando** com "Aguardar subtarefa INTG-XXXX" | Jira |
| 8 | **Enviar a branch** (`git push`). O **PR só abre quando o card termina** | Git |
| 9 | **Atualizar a doc da tela** (`docs/telas/`) se o teste confirmou ou corrigiu algo | Git |

**Regras do ciclo:** o Jira guarda a **decisão e o resumo**; o detalhe fica no Git. Fato provado é separado de hipótese. Nunca colar CPF, token ou senha. O QA aprova **em HMG**: "liberado para o próximo ambiente", nunca "pronto para produção".

## 3. Automação (quando houver tempo)

Fonte: [`tests/README.md`](../tests/README.md).

| Situação | O que fazer |
| --- | --- |
| Cenário do card **crítico ou recorrente** | virar teste em `tests/regression/<módulo>/<área>/`, com a tag do card (sem cópia em dois lugares) |
| Provar o contrato do servidor | teste em `tests/api/` (sob demanda, só em HMG, precisa do `.env`) |
| Só conferir que a tela abre | `tests/smoke/` |
| Antes de um teste de tela novo | consultar o [mapa do sistema](./mapa-do-sistema.md) e a doc da tela |

## 4. Depois de cada push na `main` (sempre)

- [ ] **Conferir o CI** na aba Actions (verde?)
- [ ] **Atualizar as branches de card abertas** (merge da `main` nelas) e enviar
- [ ] Rodar `npm run check:evidencias`

## 5. Fechar o dia

- [ ] Cards em teste com o **status certo** no Jira e o comentário postado
- [ ] Nada de segredo versionado (`git status` antes de commitar; `git add` pelo nome do arquivo)
- [ ] Pendências para o supervisor anotadas

## Ainda a confirmar com o supervisor

O que fazer quando o resultado é **Parcial ou Reprovado e não cabe subtarefa**, e as definições de alguns tipos de card (História, Tarefa, Test Case). Até lá, **não é regra fechada**.

## Em uma frase

> **Pegar o card, testar no HMG, registrar a evidência, comentar o veredito, abrir subtarefa se houver defeito, enviar a branch e, depois de cada push, conferir o CI e atualizar as branches.**
