# INTG-2676 — Validação manual

HMG, empresa `romulo`, PDV LOJA001. Execuções de 02/10 a 05/10/2026.

**Status:** à vista (Venda Rápida V2) **reprovado**; cliente cadastrado e Pedido de Venda **aprovados**.
Aguardando resposta do desenvolvimento sobre o escopo do cliente à vista (ver Pendências).

## O que o card pede

Telefone e celular digitados na edição do cliente à vista (Venda Rápida V2) devem sair no pedido impresso
(Bobina e A4). No Pedido de Venda, validar só que a impressão continua certa (regressão).

## Resumo

- O campo **Contato** impresso vem do **cadastro do cliente** (`phoneNumber`, `cellphoneNumber`), regra do INTG-2645.
- **Cliente cadastrado (102):** edição pelo modal grava no cadastro e imprime os dois números. Funciona.
- **Cliente à vista (id 1):** genérico e não editável, sem esses campos. O Confirmar do modal não chama a API;
  o `POST /sales-order` leva só `billingAddress.phone` (sem celular). Resultado: `Contato: -`.
- Preencher Nome e CPF reais no modal não muda nada (cenário N0).

## Cenários (BDD)

Pré-condição: Configurações padrões > Venda > "Venda Rápida — Tipo de faturamento" = `0-Outro`
(vazio mostra `undefined` no popup de faturamento, bug à parte).

**Fluxo base (Venda Rápida V2):** `/pdv-v2` > item `012` (2 Enters) > lápis ao lado do cliente > preencher >
Confirmar > `END` > Dinheiro > `F1` modelo > `END` Finalizar > **Faturar (Outros)** (5 s a 2 min) > **Visualizar**.

| # | Tipo | Dado | Quando | Então | Obtido |
| --- | --- | --- | --- | --- | --- |
| 1 | Feliz | à vista, Tel + Cel | Bobina | Contato com os dois | ❌ `Contato: -` (pedidos 17 A4 e 18 bobina; 2 execuções) |
| 2 | Feliz | à vista, Tel + Cel | A4 | idem | Pendente |
| 3 | Feliz | à vista, só Tel | Bobina | só o telefone | Pendente |
| 4 | Feliz | à vista, só Cel | Bobina | só o celular | Pendente |
| 5 | Feliz | à vista, nenhum | Bobina | `-` | Pendente |
| 9 a 11 | Feliz | à vista, só Tel / só Cel / nenhum | A4 | idem 3 a 5 | Pendente |
| 6 | Feliz | à vista, Tel + Cel; reabrir o lápis | Bobina | campos continuam preenchidos | Pendente |
| 7 | Regressão | Pedido de Venda, cliente 102 | Bobina | `(27) 3322-1100 / (27) 97766-5544` | ✅ pedido 21 |
| 8 | Regressão | Pedido de Venda, cliente 102 | A4 | idem | ✅ pedido 21 |
| 12 | Feliz | Venda Rápida, cliente 102 editado pelo modal | Bobina / A4 | grava no cadastro e imprime os dois | ✅ pedidos 16 e 22 |
| N0 | Negativo | à vista, Nome `Cliente Teste QA`, CPF `529.982.247-25`, Tel + Cel | Confirmar e faturar | cria/persiste cliente e imprime contato | ❌ pedido 25: `Cliente: 1 – CLIENTE A VISTA`, `Contato: -`; nenhum cliente criado |
| N1 | Negativo | Tel `abcXYZ!@#` | digitar | letras barradas | ❌ aceita |
| N2 | Negativo | Cel `abcXYZ!@#` | digitar | letras barradas | ❌ aceita |
| N3 | Negativo | Tel e Cel `27abc33` | digitar | letras barradas | ❌ aceita |
| N4 | Negativo | Tel `12`, Cel `abc` | Confirmar | erro, modal aberto | ❌ fecha sem aviso |
| B1 | Borda | 16 dígitos no Tel | digitar | respeita o limite | ✅ corta em 11 |
| B2 | Borda | 17 dígitos no Cel | digitar | respeita o limite | ✅ corta em 11 |

Notas:
- Os campos são `type=text`, sem `maxlength`/`pattern`/`inputmode`. A máscara só age com dígitos puros; com letras é desligada.
- Tel e Cel aceitam 11 dígitos nos dois (sem distinção fixo/celular). A validação esperada depende do dev.
- N1 a N4 não foram finalizados em venda (evita pedidos de lixo no HMG).
- Pedido de Venda (7 e 8): Novo > Cliente `102` (lupa), Operação `1000`, Vendedor `VENDEDOR-CAIXA` > item `012` >
  Faturas Dinheiro > Salvar > Mais Opções > Modelo de Impressão. O "Telefone de contato" do Transporte vem vazio.

## Checklist do INTG-2645

| # | Item | Resultado | Evidência |
| --- | --- | --- | --- |
| 1 | Venda Rápida, tel + cel, Bobina | Passou (102); **reprovado com à vista** | pedido 16; cenário 1 |
| 2 | Venda Rápida, tel + cel, A4 | Passou | pedido 22 |
| 3 | Pedido de Venda, Bobina: 2 números, sem duplicar | Passou | pedido 21 |
| 4 | Pedido de Venda, A4 | Passou | pedido 21 |
| 5 | Só telefone: mostra só o telefone | Passou | pedido 23 |
| 6 | Só celular: mostra só o celular | Passou | pedido 24 |
| 7 | Sem contato: `-` | Passou | pedidos 17 e 18 |
| 8 | Máscara fixo `(XX) XXXX-XXXX`, celular `(XX) XXXXX-XXXX` | Passou | pedidos 16 e 21 |
| 9 | Bobina e A4 com os mesmos números | Passou no Pedido de Venda; pendente na Venda Rápida | pedido 21 |
| 10 | Sem regressão nos demais campos | Passou | pedidos 16, 17, 18, 21 |

Itens 5 e 6: telefone/celular alterados no cadastro completo (Pessoas > Clientes) e restaurados depois.
Alterar o cadastro muda a impressão: o Contato é lido do cadastro no momento de imprimir.

## Evidência técnica

`POST /api/v1/sales-order` (200, pedido 17), Telefone `2733889900`, Celular `27955443322`: o celular **não é enviado**.

```json
"customer": {"id": "1"},
"billingAddress": {
  "name": "CLIENTE A VISTA", "recipientName": "CLIENTE A VISTA",
  "cnpj": "99999999999", "city": null, "zipCode": null,
  "phone": "2733889900"
}
```

A resposta (pedido 19) devolve `billingAddress` (id 16) com `phone` e **sem campo de celular**.

De onde a impressão lê (`GET /api/v1/customer`, trecho): o 102 tem os campos e imprime mesmo com `contacts: []`;
o à vista não tem nenhum dos dois.

```json
{ "id": 102, "name": "Maria das Dores",
  "phoneNumber": "2733221100", "cellphoneNumber": "27977665544", "contacts": [] }
{ "id": 1, "name": "CLIENTE A VISTA", "cnpj": "99999999999", "contacts": [] }
```

`POST /api/v1/invoice` (pedido 25, fatura 26, `status: COMPLETED`, "Faturado com sucesso"): o `customer` devolvido é
o cadastro genérico, **sem** `phoneNumber` nem `cellphoneNumber`:

```json
"customer": { "id": 1, "name": "CLIENTE A VISTA", "cnpj": "99999999999", "stateRegistration": "ISENTO",
              "customer": true, "carrier": false, "employee": false, "finance": false, "supplier": false }
```

Três provas de que o Contato não vem do `billingAddress`: (1) o à vista não tem os campos no cadastro; (2) o telefone
digitado foi no `billingAddress.phone` e o impresso saiu `Contato: -`; (3) no cliente 102, alterar o cadastro altera o
impresso. Falta o dev confirmar qual chamada alimenta a impressão (não muda a conclusão).

Origem de cada bloco do impresso: `Telefone:` do topo e o bloco `End/Bairro/CEP/Cidade/UF` são da **empresa** (iguais a
Configuração > Empresas > Dados Gerais: (21) 9706-8530, Rua teste, 29780000, São Gabriel da Palha/ES). O cliente 102 não tem
endereço cadastrado (Pessoas > Clientes > 102 > Endereços: "Não há dados") e o pedido 21 imprime esse endereço mesmo assim.
O `billingAddress` do pedido traz os dados do **comprador** (`name`/`cnpj` = CLIENTE A VISTA/99999999999, não os da
empresa) e a impressão não lê nem o telefone nem o endereço dele.

PDFs: pedido 18 (bobina, `Contato: -`), pedido 22 (102, com os dois números), pedido 25 (`05-10-2026.pdf`, N0).

## Pendências

- [x] Código do INTG-2676 no HMG: sim (João Victor, 20/08: grava telefone/celular no cadastro pelo Venda Rápida V2).
- [x] Hipótese Nome + CPF reais: descartada (N0).
- [ ] Perguntar ao dev: para o à vista (genérico, não editável), os dados vão para o cadastro dele ou só para o
  pedido? Haverá campo de celular no `billingAddress` e a impressão lerá do pedido? O card cita
  `customer.cellphoneNumber`, que o à vista não tem.
- [ ] Perguntar ao dev: o bloco `End/Bairro/CEP/Cidade/UF` do impresso, dentro da área do Cliente, é o endereço da
  empresa por desenho ou deveria mostrar o do cliente? (dúvida, não bug)
- [ ] Perguntar ao dev: o modal deve validar letras e número incompleto (N1 a N4)?
- [ ] Executar 2 a 6 e 9 a 11 depois da resposta (esperado igual ao cenário 1).
- [ ] Antes do PR: mesclar a `main` na branch do card.

## Bug (rascunho, não abrir ainda)

Depende da resposta do dev sobre o escopo do cliente à vista.

**`[BUG] (FrontEnd) {Vendas/Venda Rápida V2 e Pedido de Venda} Inserir dados da edição do cliente à vista na Impressão do Pedido`**

**Passos:** fluxo base acima, cliente à vista, lápis, Tel e Cel preenchidos, Bobina ou A4, Visualizar.
**Esperado:** `Contato: (telefone) / (celular)`. **Obtido:** `Contato: -`.

**Causa provável:** o front envia só `billingAddress.phone`; o `billingAddress` não tem celular; a impressão lê
o cadastro do cliente, e o à vista não tem os campos e não é editável.

**Pergunta ao dev:** a impressão do à vista deve ler o contato do pedido (`billingAddress`) ou o pedido deve
gravar telefone e celular nos campos do cliente?

## Bugs fora do escopo (abrir à parte)

- `[BUG] (FrontEnd) {Vendas/Venda Rápida V2} Popup de faturamento exibe "undefined" quando o tipo de faturamento da Venda Rápida não está configurado`
  Reproduzir: deixar "Venda Rápida — Tipo de faturamento" vazio e finalizar uma venda.
- `[BUG] (FrontEnd) {Vendas/Venda Rápida V2} Edição do cliente ignora campos apagados (só grava valores preenchidos)`
  Reproduzir: editar o 102 no modal, apagar o celular e confirmar; o cadastro mantém o número.
- O rótulo "Pedido NNNNNNNN" na tela de venda mostra o número do pedido anterior.
