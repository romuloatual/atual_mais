# Modelo de caso de teste — INTG-XXXX

Copie este formato para cada cenário testado (manual ou como roteiro para automação) e anexe
o preenchido no próprio card do Jira.

---

**Cenário N: [nome curto do que está sendo testado]**

Step1: ...
Step2: ...
Step3: ...

**Resultado Esperado:** [o que deveria acontecer, de acordo com o critério de aceite do card]

**Resultado Obtido:** [o que de fato aconteceu ao executar os steps]

**Observações:** [contexto extra — ambiente, dados usados, bugs não relacionados encontrados no caminho, etc.]

---

Exemplo real (INTG-2676, Cenário 1):

**Cenário 1: Telefone + Celular preenchidos, impressão Bobina**

Step1: Digitar 012 > Enter
Step2: Clica em cliente Avista > Seleciona Cliente 102
Step3: Clica em Editar > Alterar Telefone > Alterar Celular
Step4: Confirmar
Step5: END Pagamento > Selecionar Vendedor
Step6: Selecionar vendedor > Clicar no vendedor
Step7: Adicionar Pagamento > Dinheiro > Confirma
Step8: F1 Opções > Modelo de Impressão Comum bobina 80mm
Step9: END Finalizar Venda
Step10: Faturar NFC-E

**Resultado Esperado:** Cupom impresso exibe telefone e celular do cliente.

**Resultado Obtido:** _(preencher após executar)_

**Observações:** _(preencher após executar)_
