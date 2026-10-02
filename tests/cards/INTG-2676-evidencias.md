# INTG-2676 — Validação manual

HMG, empresa `romulo`, PDV LOJA001, 02/10/2026.

**Status: Cenário 1 reprovado** (cliente à vista, Bobina).

## O que o card pede

Telefone e celular digitados na edição do cliente à vista (Venda Rápida V2) devem sair no pedido
impresso, em Bobina e A4. No Pedido de Venda, validar só que a impressão continua certa (regressão).

**Onde está hoje no HMG:** o modal já tem os dois campos, mas só o telefone é enviado, o pedido não tem
campo de celular e a impressão lê o cadastro do cliente (vazio no cliente à vista).

## Resumo

- **Cliente cadastrado:** a impressão busca telefone e celular do cadastro (INTG-2645). Funciona.
- **Cliente à vista (id 1):** o cadastro não tem contatos e o modal só envia `billingAddress.phone`.
  O campo Contato do pedido sai vazio.
- **Causa:** o `billingAddress` do pedido só tem o campo `phone`; não existe campo de celular. O
  telefone é gravado no pedido, mas a impressão lê o contato do **cadastro do cliente** (vazio no
  cliente à vista), e não do pedido.

## Evidência

`POST /api/v1/sales-order` (200, pedido 00000017), Telefone `2733889900`, Celular `27955443322`:

```json
"customer": {"id": "1"},
"billingAddress": {
  "name": "CLIENTE A VISTA", "recipientName": "CLIENTE A VISTA",
  "cnpj": "99999999999", "city": null, "zipCode": null,
  "phone": "2733889900"
}
```

O telefone vai em `phone`; **o celular não é enviado**.

Confirmado no DevTools (resposta do `POST /sales-order`, pedido 00000019): o servidor devolve
`billingAddress` (id 16) com `phone` preenchido e **sem nenhum campo de celular**. O telefone fica no
pedido, mas o campo Contato impresso continua vazio.

## Cenário 1: Telefone + Celular, impressão Bobina (cliente à vista)

Step1: Digitar `012`, Enter, Enter
Step2: Manter CLIENTE A VISTA (não selecionar cliente)
Step3: Clicar no lápis de edição do cliente
Step4: Preencher Telefone e Celular e Confirmar
Step5: `END` > Dinheiro > Confirmar
Step6: `F1 Opções` > Comum bobina (80mm)
Step7: `END` Finalizar Venda > Faturar (Outros)
Step8: Visualizar

**Resultado Esperado:** a impressão exibe telefone e celular informados.

**Resultado Obtido:** `Contato: -` (vazio), nos pedidos 00000017 (A4, pela tela de Pedidos) e
00000018 (bobina, pelo PDV).

**Observações:**
- Pré-condição: Configurações padrões > Venda > "Venda Rápida — Tipo de faturamento" = `0-Outro`.
  Vazio, o popup de faturamento mostra a palavra `undefined` (bug separado).
- O Confirmar do cliente à vista não chama a API e não mostra popup.
- Resultado repetido em 2 execuções com cliente à vista (manual e automatizada).

## Pendências

- [ ] Confirmar com o desenvolvedor se o código do INTG-2676 está no HMG.
- [ ] Perguntar ao desenvolvedor: o card prevê criar um campo de celular no `billingAddress` (backend),
  enviá-lo (front) e fazer a impressão ler do pedido? Hoje o pedido não tem onde guardar o celular.
- [ ] Obter o checklist do INTG-2645.
- [ ] Matriz do critério de aceite: A4, só telefone, só celular, nenhum, persistência e Pedido de Venda.

## Bug (rascunho para o card)

**Celular informado na edição do cliente à vista (Venda Rápida V2) não é enviado nem impresso.**

Passos: Venda Rápida V2, item 012, manter CLIENTE A VISTA, lápis, preencher Telefone e Celular,
Confirmar, finalizar e imprimir o pedido. Esperado: telefone e celular no Contato. Obtido: Contato
vazio; a requisição `POST /sales-order` envia só `billingAddress.phone`, o `billingAddress` do pedido
não tem campo de celular e a impressão lê o contato do cadastro do cliente (vazio no cliente à vista).
