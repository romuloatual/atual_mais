# Falhas encontradas

Histórico das falhas achadas nos testes. O **Jira** guarda decisão e status; aqui fica o **detalhe e a evidência resumida**. Falha corrigida **não sai daqui**: vira candidata a teste de regressão.

**Regras:** sem dado real de cliente, token ou senha (veja `docs/lgpd-evidencias.md` quando existir na `main`); a captura de rede completa fica na pasta local do QA e é anexada ao card. Se a falha pertence a um card, o arquivo aponta para a evidência do card. Use o modelo de card de defeito (`tests/cards/TEMPLATE-card-de-defeito.md`).

**Tipos (Jira):** **BUG** = achado antes do cliente · **Defeito** = achado no cliente (produção).

| Data | Falha | Tipo | Onde ocorre | Status | Jira | Arquivo |
| --- | --- | --- | --- | --- | --- | --- |
| 08/10/2026 | Salvar documento sem bloqueio de duplo envio cria várias contas | **Defeito** | HMG e produção | aberta, card a abrir | — | [`criacao-documento-duplicado`](./2026-10-08-contas-a-receber-criacao-documento-duplicado.md) |
| 08/10/2026 | Modal de quitação envia o valor da forma como líquido; backend espera bruto | **Bug (subtarefa)** do INTG-2727 | HMG | aberta, subtarefa a abrir | — | [`modal-bruto-liquido`](./2026-10-08-contas-a-receber-quitacao-modal-bruto-liquido.md) |
| 08/10/2026 | Recibo imprime acréscimo como "Juros" e restante da Bobina inconsistente | **Defeito** | produção e HMG | aberta, card a abrir | — | [`recibo-acrescimo-juros`](./2026-10-08-contas-a-receber-recibo-acrescimo-juros.md) |

Telas relacionadas: [`../telas/`](../telas/README.md).
