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
| 🟡 Parcial / 🔴 Reprovado, com defeito a corrigir | Abra uma **subtarefa** e siga "Quando o card precisa de subtarefa" (abaixo) |
| Outros casos de Parcial / Reprovado | _A definir_ |

## Tipos de item no Jira (atenção ao ícone)

Regra do supervisor (08/10/2026). Confira o **ícone** na lista de tipos antes de criar.

| Tipo | Quando usar |
| --- | --- |
| **Bug (subtarefa)** (ícone de bug vermelho) | defeito achado ao testar o card, **antes de chegar ao cliente**, aberto **dentro** do card |
| **BUG** | mesmo caso, mas **sem card pai** (card próprio) |
| **Defeito** | achado **no cliente** (produção) |
| Subtarefa | tarefa comum dentro de um card; **não** é para bug |

Outros tipos da lista: Tarefa, Projeto, Novo recurso, Tarefa Extra, Test Case, História e Automação.

## Quando o card precisa de subtarefa

Regra do supervisor (08/10/2026). Se o teste encontra um defeito que exige correção, abra uma subtarefa de bug (veja o
[modelo](../tests/cards/TEMPLATE-card-de-defeito.md)) e:

| Item | Status |
| --- | --- |
| **Card que está sendo testado** | continua em **Testando** (não vai para deploy) |
| **Subtarefa** | status **Refação** |

1. **Atribua a subtarefa ao responsável do card original** (ex.: o dev que entregou o card).
2. Comente no card principal: `Aguardar subtarefa INTG-XXXX` (o número da subtarefa criada).
3. Quando a subtarefa for corrigida, reteste o que ela cobre e o que o card pedia; depois siga o fluxo normal (aprovado → deploy).

## Regras que valem sempre

- QA aprova **em HMG**. A conclusão diz "liberado para o próximo ambiente", nunca "pronto para produção".
- Nunca cite o nome do produto usado no teste; descreva pelo valor ou pela característica relevante.
- Siga sempre os padrões do repositório [`romuloatual/atual_mais`](https://github.com/romuloatual/atual_mais).

_Em breve mais._

## Como documentar no Jira (boas práticas)

**Regra de ouro:** o Jira guarda a **decisão e o resumo**; o detalhe fica em lugar versionado (evidência em
`tests/cards/INTG-XXXX-evidencias.md` e vídeo no JAM). Comentário no Jira não é documento longo.

- **Um comentário por veredito, sem reescrever o antigo.** Correção ou descoberta nova vira um comentário novo,
  começando por "Complemento". Assim o histórico mostra o que se sabia em cada momento.
- **Comentário curto no [modelo padrão](../tests/cards/TEMPLATE-comentario-jira.md); detalhe por link.**
- **Cada problema com dono diferente vira um item próprio**, ligado ao card de origem.
- **Fato separado de hipótese:** "provado por API/payload" é uma coisa; "parece que" é outra.
- **Sem dado sensível:** nada de CPF/CNPJ, token ou senha. Anexos com dado real vão tarjados.

### Onde registrar cada achado

| Achado | Onde | Como |
| --- | --- | --- |
| Veredito e complementos do card | comentários do próprio card | nunca editar; só acrescentar |
| Defeito do que o card entrega | **subtarefa** do card, tipo **Bug (subtarefa)** | passos, esperado x obtido, evidência |
| Dúvida de regra entre dois cards | link "relates to" entre os cards | só a pergunta ao time, sem duplicar o bug |
| Defeito que já existia antes do card (comparar com produção) | **card próprio**, tipo **BUG** (antes do cliente) ou **Defeito** (achado no cliente), ligado ao card | escrever "pré-existente" |
| Comportamento que o card não define | pergunta ao dev/PO nos comentários | não é bug até alguém confirmar |

### O mínimo em todo bug

Use o [modelo de card de defeito](../tests/cards/TEMPLATE-card-de-defeito.md) (mesmo padrão dos cards de defeito do time: Resumo, Ocorrência no Cliente, Objetivo, Regra de Negócio, BDD e Observações). Resumindo o que ele cobre:

1. Título no padrão `[BUG]` (antes do cliente) ou `[DEFEITO]` (achado no cliente) seguido de `(Camada) {Módulo} descrição`.
2. Ambiente e versão onde ocorre (para comparar, citar produção e HMG).
3. Passos curtos, resultado esperado e resultado obtido.
4. Evidência: payload (sem token) e JAM.
5. Severidade e prioridade (quitação que fecha título com valor errado é alta).
6. É regressão? Citar o card que introduziu; se já existia, escrever "pré-existente".

### Depois de abrir o bug

- **Anote o reteste no próprio bug** (ex.: "reteste com desconto e com acréscimo, um por vez, recibos A4 e Bobina").
- O **status do card segue o veredito**: Parcial ou Reprovado não vai para deploy.
- **Label de origem**, se o Jira tiver (ex.: `encontrado-pelo-qa`, `pre-existente`), ajuda a medir depois quantos defeitos escapam.
