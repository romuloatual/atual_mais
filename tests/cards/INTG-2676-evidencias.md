# INTG-2676 — Validação manual

HMG, empresa `romulo`, PDV LOJA001, 02 a 05/10/2026. **Status:** cliente à vista **reprovado**; cliente cadastrado e
Pedido de Venda **aprovados**. Aguardando o dev sobre o escopo do cliente à vista.

**Card:** telefone e celular digitados na edição do cliente à vista (Venda Rápida V2) devem sair no pedido impresso
(Bobina e A4). No Pedido de Venda, só regressão.

## Conclusão

- O **Contato** impresso vem do **cadastro do cliente** (`phoneNumber`, `cellphoneNumber`), não do `billingAddress`.
- Cliente cadastrado (102): o modal faz `PUT /customer/102`, grava no cadastro e imprime os dois números.
- Cliente à vista (id 1): genérico, não editável e sem esses campos. O modal não faz chamada nenhuma, então o Contato sai `-`.

## Cenários (BDD)

Pré-condição: Configurações padrões > Venda > "Venda Rápida — Tipo de faturamento" = `0-Outro`.
Fluxo base: `/pdv-v2` > item > lápis do cliente > preencher > Confirmar > `END` > Dinheiro > `F1` modelo > `END` > Faturar (Outros) > Visualizar.

| # | Tipo | Dado | Quando | Então | Obtido |
| --- | --- | --- | --- | --- | --- |
| 1 | Feliz | à vista, Tel + Cel | Bobina | Contato com os dois | ❌ `-` (pedidos 17 e 18) |
| 2 | Feliz | à vista, Tel + Cel | A4 | idem | ❌ `-` (29) |
| 3 | Feliz | à vista, só Tel | Bobina | só o telefone | Pendente (refazer) |
| 4 | Feliz | à vista, só Cel | Bobina | só o celular | Pendente |
| 5 | Feliz | à vista, nenhum | Bobina | `-` | Pendente |
| 6 | Feliz | à vista, Tel + Cel, reabrir o lápis | Bobina | campos mantidos e Contato com os dois | Modal ✅; impresso ❌ `-` (33) |
| 9 | Feliz | à vista, só Tel | A4 | só o telefone | ❌ `-` (30) |
| 10 | Feliz | à vista, só Cel | A4 | só o celular | ❌ `-` (31) |
| 11 | Feliz | à vista, nenhum | A4 | `-` | ✅ (32) |
| 7 e 8 | Regressão | Pedido de Venda, cliente 102 | Bobina e A4 | `(27) 3322-1100 / (27) 97766-5544` | ✅ (21) |
| 12 | Feliz | Venda Rápida, 102 editado pelo modal | Bobina e A4 | grava e imprime os dois | ✅ (16 e 22) |
| N0 | Negativo | à vista com Nome e CPF reais + Tel + Cel | Confirmar e faturar | cria cliente e imprime contato | ❌ cliente 1, `-`, nada criado (25) |
| N1 a N3 | Negativo | Tel/Cel com `abcXYZ!@#` ou `27abc33` | digitar | letras barradas | ❌ aceita |
| N4 | Negativo | Tel `12`, Cel `abc` | Confirmar | erro e modal aberto | ❌ fecha sem aviso |
| B1 e B2 | Borda | 16 dígitos no Tel, 17 no Cel | digitar | respeita o limite | ✅ corta em 11 |

Notas: produto `012` ficou sem estoque, os cenários 2 a 11 de 05/10 usaram o `010`. Bobina: o cabeçalho tem o `Contato`
da empresa e o do cliente vem abaixo. N1 a N4 não foram faturados. Os campos são `type=text`, sem `maxlength`/`pattern`.

## Checklist do INTG-2645

| Item | Resultado | Evidência |
| --- | --- | --- |
| Venda Rápida tel + cel, Bobina e A4 | Passou (102); **reprovado com à vista** | pedidos 16, 22 |
| Pedido de Venda Bobina e A4, 2 números sem duplicar | Passou | 21 |
| Só telefone / só celular / sem contato (`-`) | Passou | 23, 24, 17 e 18 |
| Máscara `(XX) XXXX-XXXX` e `(XX) XXXXX-XXXX` | Passou | 16, 21 |
| Bobina e A4 com os mesmos números | Passou no Pedido de Venda; pendente na Venda Rápida | 21 |
| Sem regressão nos demais campos | Passou | 16, 17, 18, 21 |

## Evidência técnica (DevTools)

| | Cliente à vista (1) | Cliente 102 |
| --- | --- | --- |
| Confirmar no modal | nenhuma chamada | `PUT /api/v1/customer/102` (200) |
| `billingAddress` do `POST /sales-order` | nome e CNPJ do cliente, `phone`, **sem celular** | idem: `phone: "2733221100"`, **sem celular** |
| `customer` no cadastro | sem `phoneNumber` e `cellphoneNumber` | com os dois |
| Contato impresso | `-` | telefone / celular |

O 102 imprime o celular mesmo sem ele estar no `billingAddress`, então a impressão lê o cadastro. Alterar o cadastro altera o impresso.

```json
"billingAddress": { "name": "CLIENTE A VISTA", "recipientName": "CLIENTE A VISTA", "cnpj": "99999999999",
                    "city": null, "zipCode": null, "phone": "2733889900" }   // POST /sales-order, pedido 17
{ "id": 102, "phoneNumber": "2733221100", "cellphoneNumber": "27977665544" }   // GET /customer
{ "id": 1, "name": "CLIENTE A VISTA", "cnpj": "99999999999", "contacts": [] }  // GET /customer e invoice
```

No impresso, `Telefone:` do topo e o `End/Bairro/CEP/Cidade/UF` são da **empresa** (Dados Gerais); o 102 não tem endereço
cadastrado e imprime o mesmo. PDFs: pedidos 18 (bobina), 22 (102) e 25 (`05-10-2026.pdf`, N0).

## Pendências

- [x] Código no HMG (João Victor, 20/08: grava no cadastro pelo Venda Rápida V2). [x] Hipótese Nome + CPF: descartada (N0).
- [ ] Dev: para o à vista, os dados vão para o cadastro ou só para o pedido? O `billingAddress` terá celular e a impressão lerá dele? (O card cita `customer.cellphoneNumber`.)
- [ ] Dev: o endereço da empresa no bloco do Cliente é intencional? O modal deve validar letras e número incompleto (N1 a N4)?
- [ ] Refazer 3, 4 e 5 (Bobina). Antes do PR: mesclar a `main` na branch do card.

## Bug (rascunho, não abrir ainda, depende do escopo)

**`[BUG] (FrontEnd) {Vendas/Venda Rápida V2 e Pedido de Venda} Inserir dados da edição do cliente à vista na Impressão do Pedido`**
Passos: fluxo base, cliente à vista, Tel e Cel, Visualizar. Esperado: `Contato: (tel) / (cel)`. Obtido: `Contato: -`.
Causa provável: a impressão lê o cadastro; o à vista não é editável e o `billingAddress` só leva o telefone fixo.

## Bugs fora do escopo (abrir à parte)

- `[BUG] (FrontEnd) {Vendas/Venda Rápida V2} Popup de faturamento exibe "undefined" quando o tipo de faturamento não está configurado`
- `[BUG] (FrontEnd) {Vendas/Venda Rápida V2} Edição do cliente ignora campos apagados (só grava valores preenchidos)`
- O rótulo "Pedido NNNNNNNN" mostra o número do pedido anterior.
