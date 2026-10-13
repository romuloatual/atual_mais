# Métricas do QA

Poucos números, mensais, que mostram **se a qualidade está chegando ao cliente** e **se o fluxo de entrega está fluindo**. Os dados já existem (Jira, Clockify, GitHub); aqui definimos o que medir e como juntar.

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
| **4. Tempo de teste do card** | quanto tempo um card espera entre a entrega do dev e o veredito? | de "Prontos para testar" até sair de Testando (mediana e pior caso) | Jira, histórico de status |

**Indicadores complementares** (o script já calcula os três primeiros):

| Indicador | O que mostra | Cuidado |
| --- | --- | --- |
| **Tempo de correção de Defeito** | quanto o time leva para corrigir um erro que chegou ao cliente | usar a **mediana** dos resolvidos (com quantidade par, é a média dos dois valores centrais) |
| **Idade dos Defeitos abertos** | o que a mediana esconde: os que ainda não foram corrigidos | **sempre mostrar junto** com a mediana |
| **Fila por status** | quantos itens estão em cada etapa hoje (ex.: Testando, Pronto Para Teste) | só vira conclusão sobre o fluxo depois de confirmar o que cada status significa e de quem é a vez |
| **Escapes por área** | em qual área os erros chegam ao cliente | exige o "Resumo do pai" na exportação (o pai do Defeito é o Projeto) |
| **Saúde do CI** | runs verdes ÷ total | está na aba Actions do GitHub |

**Leitura:** escapes e eficiência de detecção andam juntos. O ideal é escapes baixos e detecção alta; escapes subindo em uma **área** específica (ex.: Contas a Receber) pede ação naquela área.

## Como calcular (3 comandos)

1. **Exportar do Jira** (CSV, todos os campos). Filtro sugerido: `project = INTG AND (created >= -120d OR resolved >= -120d)`.
2. **Guardar fora do Git:** em `exports/` ou com o nome `jira-AAAA-MM.csv` (ambos ignorados pelo `.gitignore`; a exportação tem dados internos).
3. **Rodar:**

```bash
npm run metricas -- exports/jira-2026-10.csv
```

**Outra forma de obter os dados:** pelo conector do Jira do Claude, **somente leitura** (consultas por tipo, status e datas). Serve para o mesmo cálculo, com dois cuidados: as **contagens são aproximadas** quando a consulta mistura vários tipos, e resultados grandes são salvos em arquivo. Em qualquer dos caminhos, nada é escrito no Jira.

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

## Cuidados com os dados do Jira (vistos na primeira extração, 13/10/2026)

- **Data de resolução não é data de entrega:** vários cards são fechados em lote (mesmo carimbo de data e hora). Por isso "cards entregues" e "aprovação de primeira" por data de resolução **não são confiáveis** até o time fechar o card na data real.
- **O pai de Defeito e de BUG é o *Projeto* (a área)**, não o card que originou o erro. Dá para medir escapes **por área**, mas não separar regressão de dívida antiga. Ligar o Defeito ao card de origem (link "relates to") resolveria.
- **Status em uso:** além de Testando e Refação existem Pronto Para Teste, Versão, Deploy, IMPEDIMENTO QA, Impedimento Dev, Negados e Revisão de Código. Antes de medir tempo, confirmar o que cada um significa e quem está com o card.
- **Só os resolvidos enganam:** a mediana de correção ignora os Defeitos ainda abertos, que podem ser os mais antigos. Mostrar sempre a **idade dos abertos** ao lado.
- **Processo escrito x prática:** o documento do Jira diz que o Bug (subtarefa) fica em **Refação**, mas na extração de 13/10/2026 quase todos estavam em Testando ou Concluído. Antes de usar "fila" como métrica, alinhar o significado de cada status.
- **Contagem aproximada:** o conector devolve contagens aproximadas para consultas com vários tipos; conferir contra a lista antes de usar o número.
- **Dados internos:** extração e relatório preenchido ficam em `exports/` (ignorado pelo Git); o repositório é público.

## Rotina mensal (~30 minutos)

1. Exportar o CSV do Jira e rodar o `npm run metricas`.
2. Preencher o [modelo de relatório mensal](./TEMPLATE-relatorio-mensal.md) (1 página): números, o que mudou e **uma** ação sugerida.
3. Levar ao supervisor. Interpretar é mais importante que contar: "escapes subiram em Contas a Receber" leva a ação; um número solto, não.

## A confirmar com o time

- O Jira guarda o **histórico de status** com datas acessível? **(ainda não verificado)**
- Existe **campo ou link** para a origem do defeito? **Respondido em 13/10/2026: não.** O pai do Defeito é o Projeto (a área). Falta ligar ao card de origem.
- Há **histórico de meses anteriores** para a linha de base (e a partir de quando os tipos BUG, Bug (subtarefa) e Defeito são usados de forma consistente)?
- Quem pode criar **filtros e painéis** no Jira (nós não mexemos lá)?
