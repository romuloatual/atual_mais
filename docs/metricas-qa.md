# Métricas do QA

> **Em uma frase:** poucos números, todo mês, para saber se a qualidade chega ao cliente e se o fluxo de entrega está fluindo. Medimos o **processo**, nunca pessoas.

## As 4 métricas

| # | Métrica | Pergunta | Cálculo | Fonte |
| --- | --- | --- | --- | --- |
| 1 | **Escapes** | quantos erros chegaram ao cliente? | itens **Defeito** criados no mês | Jira |
| 2 | **Eficiência de detecção** | pegamos os erros antes do cliente? | `(BUG + Bug subtarefa) ÷ (BUG + Bug subtarefa + Defeito)` | Jira |
| 3 | **Aprovação de primeira** | a entrega chega boa? | `1 − cards com Bug subtarefa ÷ cards entregues` | Jira |
| 4 | **Tempo de teste do card** | quanto o card espera entre a entrega do dev e o veredito? | de "Prontos para testar" até sair de Testando (mediana e pior caso) | Jira, histórico de status |

**Não medir:** "quantidade de bugs achados" (premiaria um código ruim) nem pessoas.

## Indicadores complementares

| Indicador | Mostra | Cuidado |
| --- | --- | --- |
| Tempo de correção de Defeito | quanto leva para corrigir um erro do cliente | usar a **mediana** dos resolvidos |
| Idade dos Defeitos abertos | o que a mediana esconde | mostrar **sempre junto** |
| Fila por status | onde os itens estão hoje | confirmar o significado de cada status |
| Escapes por área | onde os erros chegam ao cliente | precisa do "Resumo do pai" |
| Saúde do CI | runs verdes ÷ total | aba Actions |

## Como calcular

```
Jira  ──▶  CSV em exports/  ──▶  npm run metricas -- arquivo.csv  ──▶  relatório de 1 página
       (ou conector, só leitura)
```

1. **Exportar** do Jira (CSV, todos os campos): `project = INTG AND (created >= -120d OR resolved >= -120d)`.
2. **Guardar fora do Git:** `exports/` ou `jira-AAAA-MM.csv` (ambos ignorados; são dados internos).
3. **Rodar** o comando acima. O script só **lê o arquivo**, não acessa o Jira.

## O que o QA registra

| Registro | Para quê |
| --- | --- |
| Tipo certo: **BUG**, **Bug (subtarefa)** ou **Defeito** | contar escapes e detecção |
| **Bug (subtarefa)** sempre dentro do card | calcular aprovação de primeira |
| Defeito ligado ao **card de origem** (ou rótulo "pré-existente") | separar regressão de dívida antiga |
| **Tempo no Clockify** em todo card | base do tempo de teste |
| Comentário de veredito no modelo | contar aprovações de primeira |

## Cuidados com os dados

| Cuidado | O que fazer |
| --- | --- |
| **Resolução em lote:** cards fechados no mesmo minuto | fechar na data real; sem isso, "cards entregues" e "aprovação de primeira" **não são confiáveis** |
| **Pai do Defeito é o Projeto** (a área), não o card | ligar ao card de origem |
| **Só os resolvidos enganam** | mostrar a idade dos abertos ao lado |
| **Status:** **Testando** = card em teste; **Refação** = subtarefa de bug aberta durante o teste. Na exportação, 36 de 80 Bugs (subtarefa) estavam em Testando | conferir se são subtarefas que deveriam estar em Refação ou cards pai; contar bugs pelo **tipo**, não pelo status |
| **Contagem aproximada** do conector em consultas com vários tipos | conferir contra a lista |
| **Dados internos** | só em `exports/`; o repositório é público |

## Rotina mensal (~30 min)

1. Exportar o CSV e rodar `npm run metricas`.
2. Preencher o [modelo de relatório](./TEMPLATE-relatorio-mensal.md) (1 página) com **uma** ação sugerida.
3. Levar ao supervisor. Interpretar vale mais que contar.

## A confirmar com o time

| Pergunta | Situação |
| --- | --- |
| O histórico de status do Jira está acessível? | ainda não verificado |
| Existe link para o card de origem do defeito? | **não** (o pai é o Projeto) |
| Desde quando os tipos BUG, Bug (subtarefa) e Defeito são usados de forma consistente? | a confirmar |
| Quem pode criar filtros e painéis no Jira? (nós não mexemos lá) | a confirmar |
