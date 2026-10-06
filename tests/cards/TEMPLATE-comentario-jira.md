# Modelo de comentário de validação para o Jira

Use este formato ao comentar no card, depois de preencher o `INTG-XXXX-evidencias.md`. Ele resume o que já está
detalhado no arquivo; não repita tudo, só o que decide o veredito.

```
STATUS DO TESTE: 🟢/🟡/🔴 [Aprovado/Parcial/Reprovado] em [ambiente] (Ref: INTG-XXXX)
Evidência (JAM): [link do vídeo, se houver]
Resumo da Cobertura de Teste: [1-2 linhas do que foi testado e por quê]
Cenários Validados:

* 1. [Nome curto do grupo de cenário]
   * [dado/ação → resultado, em 1 linha]
   * [outro, se houver]
* 2. [Próximo grupo]
   * ...

Fora do Escopo / Observações Registradas:

* [achado que não decide o veredito, mas vale registrar — ex.: comportamento de campo não coberto pelo card]
* [outro card relacionado, se aplicável]

Conclusão: [uma linha — aprovado/reprovado em HMG] e liberado para o próximo ambiente.
```

## Regras

- 🟢 Aprovado = os critérios do card passaram, mesmo com observações à parte. 🟡 Parcial = passou em parte, falta algo
  do próprio card. 🔴 Reprovado = o card não funciona como pedido.
- "Cenários Validados" segue a ordem do card: primeiro os critérios de aceite, depois extras relevantes (ex.: emissão
  fiscal, payload técnico).
- "Fora do Escopo" nunca muda o status; é onde entram achados de campos sem validação, configs do ambiente, etc.
- QA aprova **em HMG**; a conclusão diz "liberado para o próximo ambiente" (PREPROD/Produção), nunca "pronto para
  produção" — essa decisão não é do QA.
- Link para o arquivo completo (`tests/cards/INTG-XXXX-evidencias.md`) quando o comentário não couber tudo.

Exemplo real: INTG-3545 e INTG-1005 (ver os respectivos `tests/cards/INTG-XXXX-evidencias.md`).
