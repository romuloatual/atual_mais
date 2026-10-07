# Como trabalhar os cards no Jira (setor de QA)

Guia curto do dia a dia no Jira. O trabalho no Git está em [`git-fluxo-de-trabalho.md`](./git-fluxo-de-trabalho.md).

## Passo a passo — pegar e testar um card

1. **Pegue só cards da coluna "Prontos para testar".**
2. Abra o card. No canto superior direito, mude a flag de **"Pronto para testar"** para **"Testando"**.
3. Ainda no lado direito, em **"Revisor QA"**, atribua o card a você.
4. Confira o número do card na URL do Jira antes de criar branch ou arquivo (ex.: `.../browse/INTG-2727`).
5. Valide o que o card pede e registre em `tests/cards/INTG-XXXX-evidencias.md` (veja o [padrão](../tests/cards/README.md)).
6. Comente o resultado no card usando o [modelo de comentário](../tests/cards/TEMPLATE-comentario-jira.md).

## Depois do teste

| Resultado | O que fazer |
| --- | --- |
| 🟢 Aprovado | Mova o card para **deploy** e comente: `Card movido para deploy` |
| 🟡 Parcial / 🔴 Reprovado | _A definir_ (para onde o card volta e quem avisar) |

## Regras que valem sempre

- QA aprova **em HMG**. A conclusão diz "liberado para o próximo ambiente", nunca "pronto para produção".
- Nunca cite o nome do produto usado no teste; descreva pelo valor ou pela característica relevante.
- Siga sempre os padrões do repositório [`romuloatual/atual_mais`](https://github.com/romuloatual/atual_mais).

_Em breve mais._
