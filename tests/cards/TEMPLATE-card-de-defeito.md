# Modelo de card de defeito (Jira)

Padrão que o time de desenvolvimento já usa nos cards `[DEFEITO]` (ex.: INTG-3545). Siga **a mesma ordem de seções**.
Descreva o comportamento **correto** (Objetivo, Regra e BDD), não só o erro. Sem dado real de cliente, token ou senha.

**Título:** `[BUG]` se achado antes de chegar ao cliente, `[DEFEITO]` se achado no cliente (produção), seguido de `(Camada) {Módulo} descrição curta do problema` · Se for achado durante outro card, abra como
**subtarefa** dele (tipo **Bug (subtarefa)**, atribuída ao responsável do card original); se já existia antes (comparar com produção), abra **card próprio** ligado ao de origem.

```
Resumo
[O que acontece e por quê, em linguagem de negócio. Se a causa foi provada (payload, comparação), diga como; hipótese vai marcada como hipótese.]

Ocorrência no Cliente
* Schema(s): [tenant onde ocorre; ex.: romulo (HMG), company8 (produção)]
* Tela: [caminho de telas]
* Desde: [introduzido por qual card, ou "não identificado" / "pré-existente"]
* Frequência: [sempre / quando ...]
* Impacto operacional: [o que o usuário não consegue fazer ou o que sai errado]
* Workaround: [como contornar, ou "nenhum"]

Objetivo
[O que precisa passar a funcionar, em 1 frase.]

Regra de Negócio
* [Regra esperada, uma por linha.]

Cenário BDD Principal
  Contexto: Dado [estado inicial e dados]
  Cenário: [nome]
    Quando [ação]
    Então [resultado esperado]
  Cenário (não-regressão): [o que não pode quebrar]

Observações
[Evidência: arquivo de evidência do card e link do JAM; reteste combinado; relacionados.]
```

**Severidade e prioridade:** preencha nos campos do Jira (ex.: título quitado com valor errado = alta).
