# INTG-XXXX — Validação manual

> Modelo padrão do arquivo de evidências de um card. Siga **sempre** esta ordem de seções.
> O arquivo mostra o **estado final**, não a ordem das descobertas. Sem "quem fez o quê". Texto enxuto, evidência à vontade.

**Card:** `[TIPO] (Camada) {Módulo} Título do card`
https://integramais.atlassian.net/browse/INTG-XXXX

**Criticidade [alta/média/baixa].** **Status: [🟢 APROVADO / 🟡 PARCIAL / 🔴 REPROVADO] em HMG.**
Entrega do dev ([nome]), branch `[branch]`, revisão de código [OK/pendente]. Relacionados: [cards e por quê].

HMG, empresa `romulo`, PDV LOJA001, [data]. Cliente [código] ([nome]).
Evidência em vídeo (JAM): [link ou "pendente"]

## O que o card pede

[2 a 4 linhas, com as regras de negócio do card.]

## Critérios do card (BDD) executados

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| 1 | [estado e dados] | [ação] | [esperado pelo card] | ✅/❌ [resultado, com nº do documento/pedido] |

[Se algo falhou: 2 a 3 linhas "Em resumo" em linguagem simples.]

## Complementares — negativo e borda (não decidem o veredito)

| # | Tipo | Quando | Então (esperado) | Obtido |
| --- | --- | --- | --- | --- |
| N1 | Negativo | [dado inválido] | [barrado ou tratado] | ✅/⚠️/❌ [resultado] |
| B1 | Borda | [limite] | [comportamento] | ✅/⚠️/❌ [resultado] |

## Passo a passo (reproduzível)

**Fluxo base:** [caminho de telas, uma vez só.]

**Cenário N — [nome]:** passos numerados curtos e o resultado final.

## Evidência técnica (payload/requisição, quando houver)

```json
// enviado
// resposta
```

- [O que o payload prova, em 1 linha por ponto.]

## Print/preview

- [Arquivos e telas que servem de prova.]

## Observação de processo

- [Dados de teste criados, incidentes evitados, o que não se sabe.]

## Pendências

- [ ] [item]
- [ ] Antes do PR: mesclar a `main` na branch do card.
