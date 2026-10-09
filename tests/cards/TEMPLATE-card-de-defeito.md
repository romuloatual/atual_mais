# Modelo de card de defeito (Jira)

Padrão que o time de desenvolvimento já usa nos cards (ex.: INTG-2727, INTG-3545). Siga **a mesma ordem de seções**.
Descreva o comportamento **correto** (Objetivo, Regra e BDD), não só o erro. Sem dado real de cliente, token ou senha.

**Título:** `[BUG]` se achado antes de chegar ao cliente, `[DEFEITO]` se achado no cliente (produção), seguido de `(Camada) {Módulo} descrição curta do problema` · Se for achado durante outro card, abra como
**subtarefa** dele (tipo **Bug (subtarefa)**, atribuída ao responsável do card original); se já existia antes (comparar com produção), abra **card próprio** ligado ao de origem.

**Ocorrência no Cliente** só entra no `[DEFEITO]` (achado em produção). No `[BUG]` achado em HMG, omita.
**Aguardar:** se o card depende de outro, a primeira linha é `Aguardar: [link do card]`.

```
Aguardar: [link do card, só se houver dependência]

Resumo
[O que acontece e por quê, em linguagem de negócio. Se a causa foi provada (payload, comparação), diga como; hipótese vai marcada como hipótese.]

Ocorrência no Cliente   (somente [DEFEITO])
* Schema(s): [tenant onde ocorre; ex.: company8 (produção)]
* Tela: [caminho de telas]
* Desde: [introduzido por qual card, ou "não identificado" / "pré-existente"]
* Frequência: [sempre / quando ...]
* Impacto operacional: [o que o usuário não consegue fazer ou o que sai errado]
* Workaround: [como contornar, ou "nenhum"]

Objetivo
[O que precisa passar a funcionar, em 1 frase.]

Regra de Negócio
* [Regra esperada, uma por linha.]
* ⚠️ [Ponto a validar com o time, se houver.]

Cenário BDD Principal
Funcionalidade: [nome]
  Como [papel]
  Quero [ação]
  Para [benefício]

  Contexto:
    Dado [estado inicial e dados]

  Cenário: [nome]
    Quando [ação]
    Então [resultado esperado]

  Cenário (não-regressão): [o que não pode quebrar]
    Quando [ação]
    Então [resultado esperado]

Notas técnicas
* [Evidência técnica: payload/requisição (sem token), tela, versão/ambiente. Marque o que foi provado e o que é hipótese.]
* [Evidência: tests/cards/INTG-XXXX-evidencias.md e link do JAM.]
* [Reteste combinado e relacionados.]
```

**Severidade e prioridade:** preencha nos campos do Jira (ex.: título quitado com valor errado = alta).
