# Modelo de caso de teste — INTG-XXXX

Copie este formato para cada cenário testado (manual ou como roteiro para automação) e anexe
o preenchido no próprio card do Jira. **Texto enxuto, evidência à vontade** (print, vídeo, payload).

## Tipos de cenário (cubra os três em cada card)

| Tipo | O que valida | Exemplo |
| --- | --- | --- |
| **Caminho feliz** (happy path) | O que deve dar certo | Preencher Telefone e Celular válidos e ver os dois no impresso |
| **Negativo** | Dado inválido deve ser barrado | Digitar letras em campo numérico: o campo não pode aceitar (depende da validação do dev) |
| **Borda** | Estourar o limite | Campo aceita 10 caracteres: tentar com 11 |

Com muito card na fila, priorize: 1 feliz + 1 negativo + 1 borda por campo/regra. O restante entra só se o card exigir.

## Formato (BDD)

**Cenário N — [tipo: feliz / negativo / borda] [nome curto]**

- **Dado** [estado inicial e dados]
- **Quando** [ação do usuário]
- **Então** [resultado esperado, conforme o critério de aceite]

**Obtido:** [o que aconteceu de fato] — ✅ passou / ❌ falhou

**Evidência:** [print, vídeo, payload ou PDF]

---

Exemplo real (INTG-2676, Cenário 1):

**Cenário 1 — feliz: Telefone + Celular, impressão Bobina**

- **Dado** a Venda Rápida V2 com o item 012 e o cliente 102 selecionado
- **Quando** edito Telefone e Celular no modal, confirmo e finalizo a venda com a impressão Bobina 80mm
- **Então** o impresso exibe `Contato:` com o telefone e o celular

**Obtido:** _(preencher após executar)_

**Evidência:** _(anexar)_
