# Como trabalhar os cards no Jira (setor de QA)

> **Em uma frase:** pegue o card em "Prontos para testar", teste em HMG, registre a evidência no Git e deixe no Jira só a **decisão e o resumo**. O trabalho no Git está em [`git-fluxo-de-trabalho.md`](./git-fluxo-de-trabalho.md).

## Pegar e testar um card

| # | O que fazer |
| --- | --- |
| 1 | Pegue **só** cards da coluna **"Prontos para testar"** |
| 2 | No canto superior direito, mude a flag para **"Testando"** |
| 3 | Do lado direito, em **"Revisor QA"**, atribua o card a você |
| 4 | Confira o número do card **na URL** antes de criar branch ou arquivo (`.../browse/INTG-2727`) |
| 5 | Valide o que o card pede e registre em `tests/cards/INTG-XXXX-evidencias.md` ([padrão](../tests/cards/README.md)) |
| 6 | Comente o resultado no card, no [modelo de comentário](../tests/cards/TEMPLATE-comentario-jira.md) |

## Depois do teste

| Resultado | O que fazer |
| --- | --- |
| 🟢 Aprovado | mova o card para **deploy** e comente `Card movido para deploy` |
| 🟡 Parcial / 🔴 Reprovado, com defeito a corrigir | abra uma **subtarefa** (seção "Subtarefa de bug", abaixo) |
| Outros casos de Parcial / Reprovado | ⏳ **a confirmar com o supervisor** (sem regra definida) |

## Tipos de item (confira o ícone antes de criar)

Regra do supervisor (08/10/2026).

| Tipo | Quando usar |
| --- | --- |
| **Bug (subtarefa)** (bug vermelho) | defeito achado ao testar, **antes do cliente**, aberto **dentro** do card |
| **BUG** | o mesmo caso, mas **sem card pai** (card próprio) |
| **Defeito** | achado **no cliente** (produção) |
| Subtarefa | tarefa comum dentro de um card; **não** é para bug |

**Responsável:** na subtarefa, o responsável do card original; no card próprio (BUG ou Defeito), quem o abriu.

## Tipos de card que o QA encontra

| Tipo | O que costuma ser | O que o QA faz |
| --- | --- | --- |
| **História**, **Novo recurso** | funcionalidade, com critérios de aceite e BDD | testa pelos critérios: feliz, negativo e borda |
| **Tarefa**, **Tarefa Extra** | trabalho pontual ou técnico ("Extra" surgiu fora do planejado) | confere o pedido, sem inventar escopo |
| **Bug**, **Bug (subtarefa)** | erro **antes** do cliente | retesta depois da correção |
| **Defeito** | erro **no cliente** | retesta e compara com a produção |
| **Test Case**, **Automação** | caso registrado; trabalho de teste automatizado | seguem o fluxo do time |
| **Projeto** | agrupador de cards | só consulta |

_As definições gerais (exceto Bug, Bug (subtarefa) e Defeito) são o significado comum do tipo: confirmar com o supervisor._

## Como ler um card

| Ordem | Parte | O que fazer com ela |
| --- | --- | --- |
| 1 | **Título** `[TIPO] (Camada) {Módulo} descrição` | a camada diz se é Frontend ou Backend |
| 2 | **"Aguardar: INTG-XXXX"** | o card depende de outro: confira se já está pronto |
| 3 | **Resumo e Objetivo** | o que muda e por quê |
| 4 | **Regra de Negócio e BDD** | **é o que o QA testa** |
| 5 | **Notas técnicas** | apoio ao dev; **não são critério** e podem estar desatualizadas |
| 6 | **Ocorrência no Cliente** (cards de defeito) | schema, tela, desde quando, frequência, impacto e workaround |

Antes de testar, **confira o status real do card** no Jira: o texto pode estar desatualizado.

## Subtarefa de bug

Regra do supervisor (08/10/2026). Se o teste achou um defeito que exige correção, abra uma subtarefa de bug (use o [modelo](../tests/cards/TEMPLATE-card-de-defeito.md)):

| Item | Status |
| --- | --- |
| **Card testado** | continua em **Testando** (não vai para deploy) |
| **Subtarefa** | **Refação** |

```
Refação ──▶ Revisão de Código ──▶ Pronto Para Teste ──▶ Testando
(dev corrige)  (outro dev revisa)   (volta ao QA)        (QA reteste)
```

Por isso é normal ver subtarefa de bug em **Testando**: ela voltou da correção e está em reteste.

| # | O que fazer |
| --- | --- |
| 1 | **Atribua a subtarefa** ao responsável do card original |
| 2 | **Comente no card principal:** `Aguardar subtarefa INTG-XXXX` |
| 3 | Corrigida, **reteste** o que ela cobre e o que o card pedia; depois siga o fluxo normal (aprovado → deploy) |

⏳ **A confirmar:** quando o card testado **já é uma subtarefa** (ex.: INTG-3131), o Jira não aceita subtarefa dentro dela. Onde registrar o bug?

## Regras que valem sempre

- QA aprova **em HMG**: a conclusão é "liberado para o próximo ambiente", nunca "pronto para produção".
- Nunca cite o nome do produto usado no teste; descreva pelo valor ou pela característica.
- Siga os padrões do repositório [`romuloatual/atual_mais`](https://github.com/romuloatual/atual_mais).

## Como documentar no Jira

**Regra de ouro:** o Jira guarda a **decisão e o resumo**; o detalhe fica no Git (`tests/cards/INTG-XXXX-evidencias.md`) e no vídeo (JAM).

| Faça | Evite |
| --- | --- |
| **um comentário por veredito**; correção ou descoberta nova vira comentário novo, começando por "Complemento" | reescrever um comentário antigo |
| comentário curto no [modelo](../tests/cards/TEMPLATE-comentario-jira.md), com o detalhe por link | comentário longo como documento |
| um **item próprio** para cada problema com dono diferente, ligado ao card de origem | juntar vários problemas num só |
| separar **fato** ("provado por API/payload") de **hipótese** ("parece que") | afirmar sem prova |
| anexos com dado real **tarjados** | CPF/CNPJ, token ou senha |

### Onde registrar cada achado

| Achado | Onde |
| --- | --- |
| Veredito e complementos | comentários do próprio card (só acrescentar) |
| Defeito do que o card entrega | **subtarefa** tipo **Bug (subtarefa)**, com passos, esperado x obtido e evidência |
| Dúvida de regra entre dois cards | link "relates to"; só a pergunta ao time |
| Defeito que já existia (comparar com produção) | **card próprio** (**BUG** ou **Defeito**), ligado ao card, escrevendo "pré-existente" |
| Comportamento que o card não define | pergunta ao dev ou ao PO; não é bug até alguém confirmar |

O **detalhe de uma falha** (capturas de rede, comparações) fica na pasta local do QA e anexado ao card. O repositório é público e **não guarda falhas abertas**.

### O mínimo em todo bug

Use o [modelo de defeito](../tests/cards/TEMPLATE-card-de-defeito.md).

| # | Item |
| --- | --- |
| 1 | Título `[BUG]` (antes do cliente) ou `[DEFEITO]` (no cliente) + `(Camada) {Módulo} descrição` |
| 2 | Ambiente e versão (para comparar, cite produção e HMG) |
| 3 | Passos curtos, resultado esperado e obtido |
| 4 | Evidência: payload (sem token) e JAM |
| 5 | Severidade e prioridade (quitação que fecha título com valor errado é alta) |
| 6 | Regressão? Cite o card que introduziu; se já existia, escreva "pré-existente" |

### Depois de abrir o bug

- **Anote o reteste no próprio bug** (ex.: "reteste com desconto e com acréscimo, um por vez").
- O **status do card segue o veredito**: Parcial ou Reprovado não vai para deploy.
- **Label de origem**, se o Jira tiver (`encontrado-pelo-qa`, `pre-existente`), ajuda a medir depois quantos defeitos escapam.
