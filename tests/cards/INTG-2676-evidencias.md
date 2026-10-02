# INTG-2676 — Validação manual

HMG, empresa `romulo`, PDV LOJA001, 02/10/2026.

**Status:** Cenário 1 reprovado (cliente à vista, Bobina). Cenários 7 e 8 (Pedido de Venda) aprovados.

## O que o card pede

Telefone e celular digitados na edição do cliente à vista (Venda Rápida V2) devem sair no pedido
impresso, em Bobina e A4. No Pedido de Venda, validar só que a impressão continua certa (regressão).

**Onde está hoje no HMG:** o modal já tem os dois campos, mas só o telefone é enviado, o pedido não tem
campo de celular e a impressão lê o cadastro do cliente (vazio no cliente à vista).

## Cenários

Venda Rápida V2, editando o **cliente à vista** (código 1) pelo lápis:

| # | Telefone | Celular | Impressão | Status |
| --- | --- | --- | --- | --- |
| 1 | informado | informado | Bobina | **Reprovado** |
| 2 | informado | informado | A4 | Pendente |
| 3 | informado | vazio | Bobina | Pendente |
| 4 | vazio | informado | Bobina | Pendente |
| 5 | vazio | vazio | Bobina | Pendente |
| 9 | informado | vazio | A4 | Pendente |
| 10 | vazio | informado | A4 | Pendente |
| 11 | vazio | vazio | A4 | Pendente |
| 6 | informado | informado | Bobina, reabrindo o modal depois de salvar (persistência) | Pendente |

Pedido de Venda, com **cliente cadastrado** (102) que já tem telefone e celular no cadastro (regressão):

| # | Impressão | Status |
| --- | --- | --- |
| 7 | Bobina | **Aprovado** |
| 8 | A4 | **Aprovado** |

Os cenários 1 a 5 e 9 a 11 cobrem as 8 combinações do critério de aceite (Bobina e A4 × com/sem
telefone × com/sem celular).

## Checklist do INTG-2645 (a repetir, segundo o critério de aceite)

| # | Item | Resultado | Evidência |
| --- | --- | --- | --- |
| 1 | Venda Rápida, cliente com tel e cel, Bobina: Contato mostra tel / cel | Passou com cliente cadastrado; **reprovado com cliente à vista** | pedido 16 (102); cenário 1 |
| 2 | Venda Rápida, cliente com tel e cel, A4 | Passou | pedido 22 |
| 3 | Pedido de Venda, Bobina: 2 números, sem duplicar o celular | Passou | pedido 21 |
| 4 | Pedido de Venda, A4: 2 números, sem duplicar | Passou | pedido 21 |
| 5 | Cliente só com telefone: mostra só o telefone | Passou (Bobina) | pedido 23: `Contato: (27) 3322-1100` |
| 6 | Cliente só com celular: mostra só o celular | Passou (A4) | pedido 24: `Contato: (27) 97766-5544` |
| 7 | Cliente sem contato: exibe `-` | Passou | pedidos 17 e 18 (cliente à vista) |
| 8 | Máscara: fixo `(XX) XXXX-XXXX`, celular `(XX) XXXXX-XXXX` | Passou | pedidos 16 e 21 |
| 9 | Bobina e A4 com os mesmos números e ordem (telefone, celular) | Passou no Pedido de Venda; pendente na Venda Rápida | pedido 21 |
| 10 | Sem regressão nos demais campos (nome, CPF/CNPJ, endereço, itens, pagamentos, total) | Passou | pedidos 16, 17, 18 e 21 |

Os itens 2, 5 e 6 foram executados com o cliente cadastrado 102. Para os itens 5 e 6, o telefone e o
celular foram alterados no cadastro completo (Pessoas > Clientes) e depois restaurados.

**Confirmado:** alterando o cadastro, a impressão muda junto, ou seja, o `Contato` do pedido é lido
do cadastro do cliente no momento da impressão.

**Observações:**
- O modal de edição da Venda Rápida só grava valores preenchidos. Apagar o celular ali e confirmar não
  altera o cadastro; para esvaziar um número é preciso usar o cadastro completo.
- O rótulo "Pedido NNNNNNNN" na tela de venda mostra o número do pedido anterior, e não o da venda em curso.

## Resumo

- **Regra do INTG-2645:** o Contato vem do **cadastro do cliente** (telefone e celular). Antes dele, a
  Venda Rápida imprimia só o telefone.
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

## Cenários 7 e 8: Pedido de Venda, cliente cadastrado (regressão)

Steps: Vendas > Pedidos > Novo; Cliente 102 (Maria das Dores), operação 1000; Produto 012 (1 un);
Transporte > Continuar; Faturas > Dinheiro > Gerar; Salvar; Mais Opções > Modelo de Impressão.

**Resultado Esperado:** Contato com telefone e celular do cadastro, em Bobina e A4.

**Resultado Obtido (pedido 00000021):** **Aprovado** nos dois formatos:
`Contato: (27) 3322-1100 / (27) 97766-5544`.

**Observação:** no passo Transporte, o bloco de endereço do pedido tem um único campo
`phone` ("Telefone de contato") e veio vazio, embora o cliente tenha telefone e celular no cadastro.

## Comparação

| Fluxo | Cliente | Contato impresso |
| --- | --- | --- |
| Pedido de Venda | 102 (cadastrado) | Telefone e celular |
| Venda Rápida V2 | CLIENTE A VISTA | Vazio |

## Pendências

- [ ] Confirmar com o desenvolvedor se o código do INTG-2676 está no HMG.
- [ ] Perguntar ao desenvolvedor: o card prevê criar um campo de celular no `billingAddress` (backend),
  enviá-lo (front) e fazer a impressão ler do pedido? Hoje o pedido não tem onde guardar o celular.
- [x] Obter o checklist do INTG-2645 (incluído acima).
- [ ] Executar os cenários pendentes (2 a 6 e 9 a 11) depois da resposta do desenvolvedor.

## Bug (rascunho para o card)

**Celular informado na edição do cliente à vista (Venda Rápida V2) não é enviado nem impresso.**

Passos: Venda Rápida V2, item 012, manter CLIENTE A VISTA, lápis, preencher Telefone e Celular,
Confirmar, finalizar e imprimir o pedido. Esperado: telefone e celular no Contato. Obtido: Contato
vazio; a requisição `POST /sales-order` envia só `billingAddress.phone`, o `billingAddress` do pedido
não tem campo de celular e a impressão lê o contato do cadastro do cliente (vazio no cliente à vista).
