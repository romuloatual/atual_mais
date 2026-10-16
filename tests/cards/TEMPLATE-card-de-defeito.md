# Modelo de card de defeito (Jira)

Padrão que o time de desenvolvimento já usa nos cards (ex.: INTG-2727, INTG-3545), com a seção **Fora de Escopo** acrescentada. Siga **a mesma ordem de seções**.
Descreva o comportamento **correto** (Objetivo, Regras de Negócio e Cenários BDD), não só o erro. Sem dado real de cliente, token ou senha, e sem o nome do produto usado no teste.

**Título:** `[BUG]` se achado antes de chegar ao cliente, `[DEFEITO]` se achado no cliente (produção), seguido de `(Camada) {Módulo} descrição curta do problema` · Se for achado durante outro card, abra como
**subtarefa** dele (tipo **Bug (subtarefa)**, atribuída ao responsável do card original); se já existia antes (comparar com produção), abra **card próprio** ligado ao de origem.

**Ocorrência no Cliente** entra em **todo** bug: no `[BUG]` achado em HMG, o schema é o de teste (ex.: `romulo (HMG)`) e "Desde" diz qual card introduziu. 
**Aguardar:** se o card depende de outro, a primeira linha é `Aguardar: [link do card]`.

```
Aguardar: [link do card, só se houver dependência]

Resumo
[O que acontece e por quê, em linguagem de negócio. Se a causa foi provada (payload, comparação), diga como; hipótese vai marcada como hipótese.]
Impacto: [o que sai errado para o usuário, em uma frase.]

Ocorrência no Cliente
* Schema(s): [tenant onde ocorre; ex.: company8 (produção) ou romulo (HMG)]
* Tela: [caminho de telas]
* Desde: [introduzido por qual card, ou "não identificado" / "pré-existente"]
* Frequência: [sempre / quando ...]
* Impacto operacional: [o que o usuário não consegue fazer ou o que sai errado]
* Workaround: [como contornar, ou "nenhum"]

Objetivo
[O que precisa passar a funcionar, em 1 frase.]

Regras de Negócio
* [Regra esperada, uma por linha.]
* ⚠️ [Ponto a validar com o time, se houver.]

Cenários BDD
Contexto: Dado [estado inicial e dados]

* Cenário: [nome]
   * Quando [ação]
   * Então [resultado esperado]
* Cenário (Não-regressão): [o que não pode quebrar]
   * Quando [ação]
   * Então [resultado esperado]

Fora de Escopo
* [O que foi visto durante o teste mas não faz parte deste bug: vira observação no comentário do card ou outro item. Uma por linha.]

Observações e Evidências
* [Evidência técnica: payload/requisição (sem token), tela, versão/ambiente. Marque o que foi provado e o que é hipótese.]
* Evidências: [link de tests/cards/INTG-XXXX-evidencias.md na branch do card] e JAM [link].
* Roteiro de Reteste (QA): [o que repetir depois da correção, um caso por vez].
```

**Severidade e prioridade:** preencha nos campos do Jira (ex.: título quitado com valor errado = alta).

**Para que serve "Fora de Escopo":** separa o que o bug cobre do que apareceu junto (outros comportamentos, melhorias, pontos para o dev), para o bug não virar uma lista de assuntos. O que for relevante vai como observação no comentário final do card; o que depende de decisão vira pergunta ao time.
