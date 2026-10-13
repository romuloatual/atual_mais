# Métricas do QA

Poucos números, mensais, que mostram **se a qualidade está chegando ao cliente** e **se o QA ajuda ou atrasa a entrega**. Os dados já existem (Jira, Clockify, GitHub); aqui definimos o que medir e como juntar.

## Princípios

- Medir **resultado**, nunca "quantidade de bugs achados" (isso premiaria um código ruim) e **nunca pessoas**.
- **Começar pequeno:** 4 métricas. Depois de 3 meses de linha de base, definir metas.
- O número só vale se o **registro** estiver certo (veja "O que o QA registra").

## As métricas

| Métrica | O que responde | Fórmula | Fonte |
| --- | --- | --- | --- |
| **1. Escapes** | quantos erros chegaram ao cliente? | itens do tipo **Defeito** criados no mês | Jira |
| **2. Eficiência de detecção** | o QA pega os erros antes do cliente? | `(BUG + Bug subtarefa)` ÷ `(BUG + Bug subtarefa + Defeito)` | Jira |
| **3. Aprovação de primeira** | a entrega chega boa? | `1 − (cards com Bug subtarefa ÷ cards entregues)` no mês | Jira |
| **4. Tempo de teste do card** | o QA é gargalo? | de "Prontos para testar" até sair de Testando (média e pior caso) | Jira, histórico de status |

Extras, quando houver base: **tempo de correção de Defeito** (o script já calcula, em dias) e **saúde do CI** (runs verdes ÷ total, na aba Actions).

**Leitura:** escapes e eficiência de detecção andam juntos. O ideal é escapes baixos e detecção alta; escapes subindo em uma **área** específica (ex.: Contas a Receber) pede ação naquela área.

## Como calcular (3 comandos)

1. **Exportar do Jira** (CSV, todos os campos). Filtro sugerido: `project = INTG AND (created >= -120d OR resolved >= -120d)`.
2. **Guardar fora do Git:** em `exports/` ou com o nome `jira-AAAA-MM.csv` (ambos ignorados pelo `.gitignore`; a exportação tem dados internos).
3. **Rodar:**

```bash
npm run metricas -- exports/jira-2026-10.csv
```

O script **só lê o arquivo**, não acessa o Jira. Ele reconhece colunas em inglês e português (`Issue Type` ou `Tipo de item`, `Created` ou `Criado`, `Resolved` ou `Resolvido`, `Parent` ou `Principal`) e mostra uma tabela por mês, mais o total, pronta para o relatório. Se faltar uma coluna obrigatória, ele diz quais colunas o arquivo tem.

## O que o QA registra (a contribuição mais importante)

| Registro | Por quê |
| --- | --- |
| Tipo certo: **BUG**, **Bug (subtarefa)** ou **Defeito** | é o que permite contar escapes e detecção |
| **Bug (subtarefa)** sempre dentro do card (com pai) | sem pai não dá para calcular aprovação de primeira |
| Defeito **ligado ao card que o originou**, quando se sabe, ou rótulo "pré-existente" | separa regressão nova de dívida antiga |
| **Tempo no Clockify** em todo card | base do tempo de teste |
| Comentário de veredito no modelo | permite contar aprovações de primeira |

## Limites que precisam ficar claros

- **Tempo de teste do card (métrica 4)** não vem na exportação padrão. Precisa do **histórico de status**: relatório "Control Chart" do Jira, um app de "tempo em status", ou o Clockify como aproximação. **A confirmar** com o supervisor qual está disponível.
- **Aprovação de primeira** é uma **aproximação**: conta o card entregue que teve ao menos um Bug (subtarefa). Cards reprovados sem subtarefa (caso ainda sem regra definida) **não aparecem** como retrabalho.
- Mês de **escapes e detectados** = mês de criação do item. **Cards entregues** e **correção de Defeito** = mês de resolução.

## Rotina mensal (~30 minutos)

1. Exportar o CSV do Jira e rodar o `npm run metricas`.
2. Preencher o [modelo de relatório mensal](./TEMPLATE-relatorio-mensal.md) (1 página): números, o que mudou e **uma** ação sugerida.
3. Levar ao supervisor. Interpretar é mais importante que contar: "escapes subiram em Contas a Receber" leva a ação; um número solto, não.

## A confirmar com o time

- O Jira guarda o **histórico de status** com datas acessível?
- Existe **campo ou link** para a origem do defeito?
- Há **histórico de meses anteriores** para a linha de base (e a partir de quando os tipos BUG, Bug (subtarefa) e Defeito são usados de forma consistente)?
- Quem pode criar **filtros e painéis** no Jira (nós não mexemos lá)?
