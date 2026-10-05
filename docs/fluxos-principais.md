# Fluxos principais do Atual Mais e como usar

Os 8 fluxos mais importantes para o QA, escolhidos pelo critério de risco do projeto (frequência de uso ×
impacto de um bug), priorizando o caminho **vendas → fiscal → financeiro → compras**. É o mesmo critério da
regra de PREPROD do guia (vendas, entradas, tributos, orçamentos, OS) e resolve o item "mapear risco" da
Fase 2 do [`ROADMAP.md`](../ROADMAP.md).

Fonte: manual oficial do Atual Mais (https://www.atualsistemas.net.br/solucoes/IntegraMais/HelpAtualMais.html)
e o que foi observado nos testes em HMG.

| # | Fluxo | Caminho no sistema |
| --- | --- | --- |
| 1 | Venda Rápida | Vendas > Venda Rápida |
| 2 | Pedidos | Vendas > Pedidos |
| 3 | Orçamento | Vendas > Orçamentos |
| 4 | Ordem de Serviço | Vendas > Ordem de Serviço |
| 5 | Caixa | Financeiro > Caixa |
| 6 | Entrada de NF | Compras > Entrada de NF |
| 7 | Clientes | Pessoas > Clientes |
| 8 | Produtos | Cadastros > Mercadorias > Produtos |

---

## 1. Venda Rápida

**O que é:** venda via operação de Saída, referente a NFC-e (ou faturamento "Outros", conforme a
configuração). Cupom ou pedido na hora.

**Como usar:**
- `Alt+D` seleciona o cliente (o cliente à vista pode ser editado durante a venda).
- Adicionar item por SKU, código de barras ou busca (`F4`). No campo de produto, o 1º Enter carrega e o 2º adiciona.
- `Alt+P` desconto no item; `Alt+A` desconto/acréscimo na venda.
- `END` fecha o pagamento; `F1` escolhe o formato de impressão (Bobina 80mm ou A4).

**Atenção QA:**
- **Cliente à vista (código 1) é genérico e não é editável.** O que se digita no modal fica só na venda e
  não grava no cadastro. O Contato impresso vem do **cadastro do cliente** (`phoneNumber`, `cellphoneNumber`),
  então o cliente à vista imprime `Contato: -` (ver INTG-2676).
- O modal de edição do cliente só grava valores preenchidos; apagar um campo não altera o cadastro.
- O popup de faturamento depende de Configurações padrões > Venda > "Venda Rápida — Tipo de faturamento".
  Vazio, ele mostra `undefined`. Com `0-Outro`, o faturamento é "Outros" e o documento impresso é o **pedido**
  (sem valor fiscal), e não o cupom da NFC-e.
- O modelo de impressão volta para "Folha A4" a cada venda; confira o modelo marcado como "atual" no `F1 Opções`.

## 2. Pedidos

**O que é:** venda via operação de Saída, pode ser NF-e ou NFC-e. A tela também lista as vendas feitas pela
Venda Rápida.

**Como usar:** Novo > Operação, Cliente e Vendedor > Produtos > Transporte > Faturas (forma de pagamento) >
Salvar > Mais Opções (imprimir, clonar, gerar NFC-e/NF-e, emitir promissória/carnê).

**Sub-fluxos de alto risco fiscal:**
- **Devolução de venda:** só em pedidos já faturados.
- **Carta de correção:** só em notas modelo 55 (NF-e).
- **Estorno:** só depois que o prazo de cancelamento expira: 30 minutos para NFC-e, 24 horas para NF-e.

**Atenção QA:**
- O prazo de 30 min / 24 h do estorno é um caso clássico de **valor-limite**: testar logo antes e logo depois.
- A impressão do pedido usa o telefone e o celular do **cadastro do cliente**, nos modelos Bobina e A4.

## 3. Orçamento

**O que é:** proposta sem emissão fiscal; pode virar Pedido depois ("Transformar em Pedido").

**Como usar:** Novo > Vendedor e Cliente > Adicionar Item > Condição de pagamento > Gerar > Salvar.

**Atenção QA:** um orçamento já transformado em Pedido só pode ser excluído depois que o Pedido gerado for
excluído (dependência entre registros; testar a ordem errada de exclusão).

## 4. Ordem de Serviço

**O que é:** igual ao Orçamento, mas para serviços; não emite NFS-e.

**Particularidade:** se a OS tiver Produto **e** Serviço, ao transformar em venda são gerados **dois pedidos
independentes** (um do produto, outro do serviço, que sempre fatura como faturamento simples, não fiscal).

**Atenção QA:** conferir se cliente, vendedor e valores batem nos dois pedidos gerados.

## 5. Caixa

**O que é:** central de entradas e saídas financeiras; é onde caem os valores de toda venda.

**Atenção QA:**
- Lançamento avulso só pode ser **excluído dentro do mês corrente** (depois disso é preciso um lançamento
  reverso) e só pode ser **incluído até 30 dias retroativos**: valores-limite por data.
- Registros vindos de venda ou de NF não podem ser excluídos diretamente.

## 6. Entrada de NF

**O que é:** entrada de nota fiscal de compra, manual ou por importação de XML (que cadastra Fornecedor e
Transportadora automaticamente).

**Atenção QA:**
- Depois de salva, a NF não pode ser editada (só excluir e recadastrar), e a exclusão só vale até 30 dias
  retroativos.
- A configuração de preço/markup nessa tela atualiza o Cadastro de Produtos: bom candidato a teste de efeito
  colateral entre módulos.

## 7. Clientes

**O que é:** base de tudo; usado em toda venda, pedido, orçamento e OS.

**Como é guardado:** telefone e celular ficam em **campos separados** (`phoneNumber` e `cellphoneNumber`) no
cadastro completo (Pessoas > Clientes > Dados Gerais).

**Atenção QA:**
- A impressão do pedido lê esses dois campos do cadastro; se o cadastro mudar, a impressão muda junto.
- O cliente **CLIENTE A VISTA** (código 1) é genérico, não tem esses campos e não é editável.
- O `billingAddress` do pedido (endereço de cobrança) só tem um campo `phone`, sem celular.

## 8. Produtos

**O que é:** base de preço e estoque usada em toda venda.

**Atenção QA:** produto já movimentado não pode ser excluído ("Registro possui movimento. Impossível
excluir."); só pode ser desativado pelo Status. Teste: tentar excluir um produto já vendido deve bloquear.
