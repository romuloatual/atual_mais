# INTG-2676 — Validação manual

**Card:** (título exato a conferir no Jira) Telefone e celular do cliente à vista na impressão do pedido, Venda Rápida V2
https://integramais.atlassian.net/browse/INTG-2676

**Criticidade: não informada no card.** **Status: 🔴 REPROVADO em HMG** para o cliente à vista; cliente cadastrado e Pedido de Venda aprovados.
Entrega do dev (João Victor), branch do card, revisão de código pendente. Relacionados: INTG-3102 (pai), INTG-2645 (impressão com telefone e celular).

HMG, empresa `romulo`, PDV LOJA001, 02 a 08/10/2026. Cliente à vista (id 1) e cliente 102.
Evidência em vídeo (JAM): pendente

## O que o card pede

Na Venda Rápida V2, telefone e celular digitados na edição do cliente à vista devem sair no pedido impresso (Bobina e A4),
persistidos e devolvidos pela API. No Pedido de Venda, apenas regressão. Pré-condição: Configurações padrões > Venda >
"Venda Rápida — Tipo de faturamento" = `0-Outro`.

## Critérios do card (BDD) executados

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| 1 | à vista, Telefone + Celular | imprimir em Bobina | Contato com os dois números | ❌ `-` (pedidos 17 e 18) |
| 2 | à vista, Telefone + Celular | imprimir em A4 | idem | ❌ `-` (29) |
| 3 | à vista, só Telefone | imprimir em Bobina | só o telefone | ❌ `-` (08/10; a consulta de impressão não traz telefone) |
| 4 | à vista, só Celular | imprimir em Bobina | só o celular | ❌ `-` (08/10, gravado: o celular não vai em nenhum campo do pedido) |
| 5 | à vista, nenhum contato | imprimir em Bobina | `-` | ⚠️ `-` esperado, não conferido (08/10, venda 1; PDF sem texto extraível) |
| 6 | à vista, Tel + Cel, reabrir o lápis | imprimir em Bobina | campos mantidos e Contato com os dois | Modal ✅; impresso ❌ `-` (33) |
| 7 | à vista, só Telefone | imprimir em A4 | só o telefone | ❌ `-` (30) |
| 8 | à vista, só Celular | imprimir em A4 | só o celular | ❌ `-` (31) |
| 9 | à vista, nenhum contato | imprimir em A4 | `-` | ✅ (32) |
| 10 | Pedido de Venda, cliente 102 | imprimir em Bobina e A4 | `(27) 3322-1100 / (27) 97766-5544` | ✅ (21) |
| 11 | Venda Rápida, cliente 102 editado pelo modal | imprimir em Bobina e A4 | grava e imprime os dois | ✅ (16 e 22) |

Em resumo: com cliente **cadastrado** o contato sai certo. Com cliente **à vista** o contato nunca sai: o celular não é
enviado, o telefone vai só no endereço de cobrança do pedido, e a impressão lê o cadastro do cliente à vista, que não tem contato.

Checklist do INTG-2645: telefone e celular nos dois formatos, máscara `(XX) XXXX-XXXX` e `(XX) XXXXX-XXXX`, sem duplicar
e sem regressão nos demais campos: ✅ com o 102 (pedidos 16, 21, 22, 23 e 24); ❌ com o à vista.

## Complementares — negativo e borda (não decidem o veredito)

| # | Tipo | Quando | Então (esperado) | Obtido |
| --- | --- | --- | --- | --- |
| N0 | Negativo | à vista com Nome e CPF reais + Tel + Cel, faturar | cria cliente e imprime contato | ❌ continua cliente 1, `-`, nada criado (25) |
| N1 | Negativo | Tel/Cel com `abcXYZ!@#` | letras barradas | ❌ aceita |
| N2 | Negativo | Tel/Cel com `27abc33` | letras barradas | ❌ aceita |
| N3 | Negativo | Tel `12` e Cel `abc`, Confirmar | erro e modal aberto | ❌ fecha sem aviso |
| B1 | Borda | 16 dígitos no Tel, 17 no Cel | respeita o limite | ✅ corta em 11 |

Os campos são `type=text`, sem `maxlength`/`pattern`. N1 a N3 não foram faturados e o card não pede validação (ponto para o dev).

## Passo a passo (reproduzível)

**Fluxo base:** `/pdv-v2` > item > lápis do cliente > preencher > Confirmar > `END` > Dinheiro > `F1` modelo > `END` > Faturar (Outros) > Visualizar.

**Cenário 1 a 4 (à vista):** no lápis, preencher Telefone e/ou Celular, seguir o fluxo base e abrir o impresso. Resultado: `Contato: -`.
**Cenário 5:** sem contato, mesmo fluxo: `Contato: -`.
**Cenário 11:** trocar o cliente para o 102, editar os números e Confirmar: o modal faz `PUT /api/v1/customer/102` e o impresso mostra os dois.

## Evidência técnica (payload/requisição, quando houver)

| | Cliente à vista (1) | Cliente 102 |
| --- | --- | --- |
| Confirmar no modal | nenhuma chamada | `PUT /api/v1/customer/102` (200) |
| `POST /sales-order` | `customer: {id: 1}`; `billingAddress` só com `phone` (ou `phone: null` só com celular); **sem celular** | idem: `phone: "2733221100"`, sem celular |
| `GET /customer/{id}` | sem `phoneNumber` e `cellphoneNumber`; `contacts` vazio | com os dois |
| Contato impresso | `-` | telefone / celular |

```json
{ "customer": { "id": 1 }, "printRecipientCoupon": true,
  "billingAddress": { "phone": "2799999999" } }   // POST /sales-order, só com Telefone
{ "customer": { "id": 1 }, "billingAddress": { "phone": null } }              // só com Celular: o número não aparece no corpo
{ "id": 1, "name": "CLIENTE A VISTA", "contacts": [] }                        // GET /customer/1 (consulta da impressão)
{ "id": 102, "phoneNumber": "2733221100", "cellphoneNumber": "27977665544" }  // GET /customer/102
```

- O 102 imprime o celular mesmo sem ele estar no `billingAddress`: a impressão lê o cadastro do cliente.
- Leitura do código servido (minificado, a confirmar com o dev): o modal tem `phoneNumber` e `cellphoneNumber`, mas o pedido só lê `phoneNumber` (para `billingAddress.phone`); para cliente editável o pedido leva `printRecipientCoupon: true`. A nota do card (campo único "phone") está desatualizada.
- Impresso: `Telefone:` do topo e `End/Bairro/CEP/Cidade/UF` são da **empresa** (Dados Gerais).

## Print/preview

- PDFs: pedidos 18 (bobina), 22 (102), 25 (N0), venda 1 (sem contato, PDF sem texto) e venda 2 (com contato, `Contato: -`), em `Cards/INTG-2676/Evidencias`.
- Imagens do corpo do `sales-order` e da divergência cliente × à vista, em `Cards/INTG-2676`.

## Observação de processo

- Os cenários 3 e 4 de 08/10 foram conferidos pelos dados que a impressão lê (`customer/1`); o PDF renderizado não foi inspecionado nesses dois. O 3 foi feito sem o gravador de requisições, o 4 foi gravado do início ao fim.
- Os pedidos de teste de 08/10 não tiveram o número anotado (a excluir). Produto `012` ficou sem estoque; os cenários de 05/10 usaram o `010`.
- Fora do escopo, a abrir à parte: popup de faturamento mostra "undefined" sem tipo de faturamento configurado; edição do cliente ignora campos apagados; rótulo "Pedido NNNNNNNN" mostra o número do pedido anterior; `POST /atual-mais/thankyou/webhook` responde 401 após faturar.
- Subtarefa de bug (Bug (subtarefa), em Refação): texto no padrão do time redigido; número `INTG-XXXX` a preencher quando aberta.

## Pendências

- [x] Código no HMG (João Victor, 20/08). [x] Hipótese Nome + CPF descartada (N0).
- [ ] Dev: para o à vista, os dados vão para o cadastro (único e compartilhado) ou só para o pedido, com a impressão lendo do pedido? O card cita `customer.cellphoneNumber`.
- [ ] Dev: o endereço da empresa no bloco do Cliente é intencional? O modal deve validar letras e número incompleto (N1 a N3)? O que é `printRecipientCoupon`?
- [ ] Abrir a subtarefa e comentar `Aguardar subtarefa INTG-XXXX`; gravar o JAM.
- [ ] Antes do PR: mesclar a `main` na branch do card.
