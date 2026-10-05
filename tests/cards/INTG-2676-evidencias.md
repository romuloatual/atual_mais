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

## Passo a passo

**Pré-condição:** Configurações padrões > aba Venda > "Venda Rápida — Tipo de faturamento" = `0-Outro`.
Vazio, o popup de faturamento mostra a palavra `undefined` (bug separado).

### Venda Rápida V2, cliente à vista (cenários 1 a 6 e 9 a 11)

| Step | Ação | O que se vê / observação |
| --- | --- | --- |
| 1 | Abrir a Venda Rápida V2 (`/pdv-v2`) | Tela CAIXA LIVRE, cliente CLIENTE A VISTA |
| 2 | Digitar `012` no campo de produto e dar Enter **duas vezes** | O 1º Enter carrega o produto e o 2º adiciona. Item: Água Mineral sem Gás 500ml, R$ 1,98 |
| 3 | Manter o CLIENTE A VISTA (não selecionar cliente) | |
| 4 | Clicar no lápis ao lado do nome do cliente | Abre "Dados do cliente" com Telefone e Celular vazios |
| 5 | Preencher Telefone e Celular conforme o cenário e clicar em **Confirmar** | O modal fecha sem popup e sem chamada à API |
| 6 | `END` (Pagamento) > Adicionar Pagamento > Dinheiro > Confirmar (R$ 1,98) | O vendedor fica memorizado (a seleção é pulada) |
| 7 | `F1 Opções` e escolher o modelo conforme o cenário | O padrão volta para "Folha A4" a cada venda; conferir que o escolhido ficou como "atual" |
| 8 | `END` (Finalizar Venda) > **Faturar (Outros)** | Leva de 5 segundos a 2 minutos |
| 9 | **Visualizar** e salvar o PDF | Conferir o campo **Contato** do pedido |

O que muda em cada cenário (Steps 5 e 7):

| Cenário | Step 5: preencher | Step 7: modelo |
| --- | --- | --- |
| 1 | Telefone e Celular | Bobina |
| 2 | Telefone e Celular | A4 |
| 3 | só Telefone | Bobina |
| 4 | só Celular | Bobina |
| 5 | nenhum | Bobina |
| 9 | só Telefone | A4 |
| 10 | só Celular | A4 |
| 11 | nenhum | A4 |
| 6 | Telefone e Celular; depois do Confirmar, **clicar no lápis de novo** e conferir se os dois campos continuam preenchidos | Bobina |

**Resultado esperado (todos):** o Contato exibe o que foi preenchido, `telefone / celular`, sem " / "
sobrando e `-` quando nenhum foi informado.

**Resultado obtido, cenário 1: reprovado.** `Contato: -` nos pedidos 00000017 (A4, pela tela de
Pedidos) e 00000018 (bobina, pelo PDV). O resultado se repetiu em 2 execuções (manual e automatizada).

### Pedido de Venda, cliente cadastrado (cenários 7 e 8, regressão)

| Step | Ação | O que se vê / observação |
| --- | --- | --- |
| 1 | Vendas > Pedidos > **Novo** | Tela "Criar novo pedido" |
| 2 | Dados Gerais: Cliente `102` (clicar na lupa), Operação `1000 Vendas`, Vendedor `VENDEDOR-CAIXA` > Continuar | O nome do cliente só aparece depois da lupa |
| 3 | Produtos > Adicionar Produto > `012` > Salvar Produto > Continuar | Item de R$ 1,98 |
| 4 | Transporte > Continuar | O campo "Telefone de contato" do endereço vem **vazio**, embora o cliente tenha os dois números |
| 5 | Faturas: Forma de Pagamento `Dinheiro` > Gerar > Salvar | Pedido criado com status CONCLUÍDO |
| 6 | Na linha do pedido: Mais Opções > Modelo de Impressão > escolher Folha A4 ou bobina > OK | Cenário 8 = A4, cenário 7 = bobina |
| 7 | Salvar o PDF no diálogo de impressão do navegador | Conferir o campo **Contato** |

**Resultado esperado:** Contato com telefone e celular do cadastro, em Bobina e A4.

**Resultado obtido (pedido 00000021): aprovado** nos dois formatos:
`Contato: (27) 3322-1100 / (27) 97766-5544`.

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
- **Cliente à vista (id 1):** o cadastro não tem `phoneNumber` nem `cellphoneNumber` (a impressão lê
  esses dois campos do cliente) e o modal só envia `billingAddress.phone`.
  O campo Contato do pedido sai vazio.
- **Por que o cliente à vista é diferente:** ele é um cliente genérico (código 1) e não é editável. O
  Confirmar do modal não chama a API e não grava no cadastro. O que se digita fica só na venda e só
  pode chegar à impressão pelo pedido.
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

De onde a impressão lê (DevTools, `GET /api/v1/customer`, lista de clientes), trecho:

```json
{ "id": 102, "name": "Maria das Dores",
  "phoneNumber": "2733221100", "cellphoneNumber": "27977665544", "contacts": [] }
{ "id": 1, "name": "CLIENTE A VISTA", "cnpj": "99999999999", "contacts": [] }
```

O cliente 102 tem os campos `phoneNumber` e `cellphoneNumber`; o cliente 1 (à vista) não tem nenhum
dos dois. O 102 tem `contacts: []` e mesmo assim imprime, então a impressão usa esses campos.

Confirmado no DevTools (resposta do `POST /sales-order`, pedido 00000019): o servidor devolve
`billingAddress` (id 16) com `phone` preenchido e **sem nenhum campo de celular**. O telefone fica no
pedido, mas o campo Contato impresso continua vazio.

### Teste da hipótese dos comentários do Jira (05/10/2026): Nome e CPF reais no modal

Hipótese (comentário de 20/08): preencher Nome e CPF reais no modal do cliente à vista faria o sistema criar
ou persistir um cliente, e o contato sairia no pedido.

| Passo | Resultado |
| --- | --- |
| Modal do cliente à vista: Nome `Cliente Teste QA`, CPF `529.982.247-25`, Telefone `(27) 3344-5566`, Celular `(27) 9 3344-5566` | Campos aceitos |
| Confirmar | Modal fecha, a venda exibe "Cliente Teste QA". Sem popup de sucesso e sem chamada de API de cliente |
| Finalizar (Dinheiro, Faturar Outros) e Visualizar | Pedido **00000025** emitido (HMG levou ~1 min para faturar) |
| Campo do cliente no impresso | `Cliente: 1 – CLIENTE A VISTA (99999999999)`: nome e CPF digitados **foram ignorados** |
| Campo Contato no impresso | `Contato: -` |
| Pessoas > Clientes | Só existem 102 e CLIENTE A VISTA: **nenhum cliente foi criado** |

**Conclusão:** a hipótese não se confirma. Preencher Nome e CPF reais não cria cliente, não persiste nada e
o impresso sai igual (cliente 1, Contato vazio). PDF do pedido: `05-10-2026.pdf`.

### Cenários negativos e de borda: campos Telefone e Celular do modal (05/10/2026)

Modal "Dados do cliente" do CLIENTE A VISTA (Venda Rápida V2). Orientação do consultor de QA: cobrir
caminho feliz, negativo e borda. O caminho feliz já está nos cenários 1 a 6.

| # | Tipo | Dado / Quando | Então (esperado) | Obtido |
| --- | --- | --- | --- | --- |
| N1 | Negativo | Digitar `abcXYZ!@#` no Telefone | Campo não aceita letras e símbolos | ❌ Aceita e mostra `abcXYZ!@#` |
| N2 | Negativo | Digitar `abcXYZ!@#` no Celular | Idem | ❌ Aceita |
| N3 | Negativo | Digitar `27abc33` (dígitos + letras) no Telefone e no Celular | Letras barradas | ❌ Aceita `27abc33` nos dois |
| N4 | Negativo | Confirmar com Telefone `12` (incompleto) e Celular `abc` | Mensagem de erro e modal aberto | ❌ Modal fecha sem erro nem aviso |
| B1 | Borda | Digitar 16 dígitos no Telefone | Respeita o limite do campo | ✅ Corta em 11 dígitos (`27334455667`) |
| B2 | Borda | Digitar 17 dígitos no Celular | Respeita o limite do campo | ✅ Corta em 11 dígitos (`27933445566`) |

**Observações:**
- Os campos são `type=text`, sem `maxlength`, `pattern` nem `inputmode`. Quando só há dígitos, a máscara aplica
  e limita em 11; com letras no meio, a máscara é desligada e o campo guarda o texto como veio.
- O Telefone aceita 11 dígitos (formato de celular) e o Celular também: não há distinção entre os dois.
- A validação esperada depende do desenvolvedor: confirmar se letras e números incompletos devem ser barrados.
- Não finalizei venda com esses valores (evita pedidos de lixo no HMG); o `POST /sales-order` envia `phone`
  como veio do modal.

## Comparação

| Fluxo | Cliente | Contato impresso |
| --- | --- | --- |
| Pedido de Venda | 102 (cadastrado) | Telefone e celular |
| Venda Rápida V2 | CLIENTE A VISTA | Vazio |

## Pendências

- [x] Confirmar com o desenvolvedor se o código do INTG-2676 está no HMG (João Victor, 20/08: sim; grava
  telefone/celular no cadastro do cliente pelo Venda Rápida V2).
- [x] Testar a hipótese Nome + CPF reais no modal do à vista: não cria cliente e não imprime contato
  (ver "Teste da hipótese" acima).
- [ ] Perguntar ao desenvolvedor, com o cliente à vista genérico e não editável: os dados devem ir para o
  cadastro dele ou só para o pedido? Haverá campo de celular no `billingAddress`, e a impressão lerá do
  pedido? O card cita `customer.cellphoneNumber`, que o à vista não tem.
- [ ] Perguntar ao desenvolvedor sobre N1 a N4: o modal deve validar letras e número incompleto?
- [ ] Validar com cliente cadastrado, manualmente: editar o 102 no modal, conferir se grava no cadastro e se
  imprime (a digitação automatizada não persistiu nesse caso).
- [x] Obter o checklist do INTG-2645 (incluído acima).
- [ ] Executar os cenários pendentes (2 a 6 e 9 a 11) depois da resposta do desenvolvedor.

## Bug (rascunho para o card)

> Status: **rascunho, não abrir ainda.** Falta o desenvolvedor confirmar se o cliente à vista está no escopo
> da correção entregue (ver Pendências). Até lá, tratar como dúvida de escopo.

**`[BUG] (FrontEnd) {Vendas/Venda Rápida V2 e Pedido de Venda} Inserir dados da edição do cliente à vista na Impressão do Pedido`**

**Resumo:** o celular informado na edição do cliente à vista não é enviado nem impresso.

**Ambiente:** HMG, empresa `romulo`, PDV LOJA001.

**Pré-condição:** Configurações padrões > aba Venda > "Venda Rápida — Tipo de faturamento" = `0-Outro`.

**Passos:**
1. Abrir a Venda Rápida V2 e adicionar o item `012`.
2. Manter o cliente padrão **CLIENTE A VISTA** (não selecionar outro).
3. Clicar no lápis ao lado do nome do cliente.
4. Preencher **Telefone** e **Celular** e clicar em Confirmar.
5. `END`, pagar em Dinheiro, escolher a impressão (Bobina ou A4) e finalizar com **Faturar (Outros)**.
6. Clicar em **Visualizar** e conferir o campo **Contato** do pedido.

**Resultado esperado:** `Contato: (telefone) / (celular)` com os números informados no passo 4.

**Resultado obtido:** `Contato: -` (vazio).

**Causa provável:**
- O front envia só `billingAddress.phone` no `POST /api/v1/sales-order`; o celular não é enviado.
- O `billingAddress` do pedido não tem campo de celular.
- A impressão lê `phoneNumber` e `cellphoneNumber` do **cadastro do cliente**, e o cliente à vista não
  os tem e não é editável.

**Evidências a anexar:** PDF do pedido 00000018 (bobina, `Contato: -`), PDF do pedido 00000022 (cliente 102,
com os dois números, para comparação), trecho do `POST /sales-order` e print do DevTools da lista de clientes.

**Pergunta ao desenvolvimento:** a impressão do cliente à vista deve ler o contato do pedido
(`billingAddress`) ou o pedido deve gravar telefone e celular nos campos do cliente?

## Bugs fora do escopo do card (abrir à parte)

- `[BUG] (FrontEnd) {Vendas/Venda Rápida V2} Popup de faturamento exibe "undefined" quando o tipo de faturamento da Venda Rápida não está configurado`
  Reproduzir: deixar "Venda Rápida — Tipo de faturamento" vazio em Configurações padrões e finalizar uma venda.
- `[BUG] (FrontEnd) {Vendas/Venda Rápida V2} Edição do cliente ignora campos apagados (só grava valores preenchidos)`
  Reproduzir: editar o cliente 102 no modal, apagar o celular e confirmar; o cadastro mantém o número.
