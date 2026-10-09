# Mapa do sistema (módulos, áreas e rotas)

Estrutura do Atual Mais como o **próprio sistema** a organiza (menu e rotas do painel, lidos em 09/10/2026), ligada ao artigo do Help de cada área. É a base das pastas de `tests/`: **módulo = item do menu**, **área = tela dentro do módulo**.

**Prioridade de automação:** P1 = fluxo crítico (fiscal e pagamento), P2 = importante, sem marca = só configuração ou apoio. Áreas com pasta pronta aparecem em **negrito**.

## Vendas (`/sales`)

| Área | Rota | Help | Prioridade | Pasta de teste |
| --- | --- | --- | --- | --- |
| **Venda Rápida (PDV V2)** | `/pdv-v2 e /sales/fast-v2` | [Vendarapida](https://www.atualsistemas.net.br/solucoes/IntegraMais/Vendarapida.html) | P1 | `tests/regression/vendas/venda-rapida/` |
| **Pedidos** | `/sales/orders` | [Pedidos](https://www.atualsistemas.net.br/solucoes/IntegraMais/Pedidos.html) | P1 | `tests/regression/vendas/pedidos/` |
| **Orçamento** | `/sales/estimate` | [Orcamento](https://www.atualsistemas.net.br/solucoes/IntegraMais/Orcamento.html) | P2 | `tests/regression/vendas/orcamento/` |
| **Ordem de Serviço** | `/sales/order-service` | [OrdemdeServico](https://www.atualsistemas.net.br/solucoes/IntegraMais/OrdemdeServico.html) | P2 | `tests/regression/vendas/ordem-de-servico/` |
| Condicional | `/sales/conditional` | [Condicional](https://www.atualsistemas.net.br/solucoes/IntegraMais/Condicional.html) |  |  |
| Inutilização de NF | `/sales/disablement` | [InutilizacaodeNF](https://www.atualsistemas.net.br/solucoes/IntegraMais/InutilizacaodeNF.html) |  |  |

## Compras (`/inventory`)

| Área | Rota | Help | Prioridade | Pasta de teste |
| --- | --- | --- | --- | --- |
| **Entrada de NF** | `/inventory/entries` | [EntradadeNF](https://www.atualsistemas.net.br/solucoes/IntegraMais/EntradadeNF.html) | P1 | `tests/regression/compras/entrada-de-nf/` |
| Estoque | `/inventory/stock` | [EstoqueProduto](https://www.atualsistemas.net.br/solucoes/IntegraMais/EstoqueProduto.html) |  |  |
| Manutenção de inventário | `/inventory/management` | [ManutencaodeInventario](https://www.atualsistemas.net.br/solucoes/IntegraMais/ManutencaodeInventario.html) |  |  |

## Financeiro (`/financial`)

| Área | Rota | Help | Prioridade | Pasta de teste |
| --- | --- | --- | --- | --- |
| **Contas a Receber** | `/financial/bills-to-receive` | [Contasareceber](https://www.atualsistemas.net.br/solucoes/IntegraMais/Contasareceber.html) | P1 | `tests/regression/financeiro/contas-a-receber/` |
| **Caixa** | `/financial/statement (a confirmar)` | [Caixa](https://www.atualsistemas.net.br/solucoes/IntegraMais/Caixa.html) | P2 | `tests/regression/financeiro/caixa/` |
| Contas a Pagar | `/financial/bills-to-pay` | [Contasapagar](https://www.atualsistemas.net.br/solucoes/IntegraMais/Contasapagar.html) |  |  |
| Boletos | `/financial/bank-slip` | [Boleto1](https://www.atualsistemas.net.br/solucoes/IntegraMais/Boleto1.html) |  |  |
| Cadastros gerais (plano de contas, bancos, contas correntes, moeda, departamento, grupo DRE, tarifas) | `/financial/general/*` | [Planodecontas](https://www.atualsistemas.net.br/solucoes/IntegraMais/Planodecontas.html) |  |  |

## Pessoas (`/people`)

| Área | Rota | Help | Prioridade | Pasta de teste |
| --- | --- | --- | --- | --- |
| **Clientes** | `/people/general/customer` | [Clientes](https://www.atualsistemas.net.br/solucoes/IntegraMais/Clientes.html) | P2 | `tests/regression/pessoas/clientes/` |
| Fornecedores | `/people/general/supplier` | [Fornecedores](https://www.atualsistemas.net.br/solucoes/IntegraMais/Fornecedores.html) |  |  |
| Transportadoras | `/people/general/carrier` | [Transportadoras](https://www.atualsistemas.net.br/solucoes/IntegraMais/Transportadoras.html) |  |  |
| Classificação de cliente | `/people/general/customerClassification` | [Classificacaodocliente](https://www.atualsistemas.net.br/solucoes/IntegraMais/Classificacaodocliente.html) |  |  |
| Financeiras (a confirmar o nome no sistema) | `/people/general/financial` | [Administradoras](https://www.atualsistemas.net.br/solucoes/IntegraMais/Administradoras.html) |  |  |

## Faturamento (`/revenues`)

| Área | Rota | Help | Prioridade | Pasta de teste |
| --- | --- | --- | --- | --- |
| Operação | `/revenues/operation` | [Operacao](https://www.atualsistemas.net.br/solucoes/IntegraMais/Operacao.html) |  |  |
| Forma de pagamento | `/revenues/payment-gateway` | [Formadepagamento](https://www.atualsistemas.net.br/solucoes/IntegraMais/Formadepagamento.html) |  |  |
| Preço de venda | `/revenues/sale-price` | [Precodevenda](https://www.atualsistemas.net.br/solucoes/IntegraMais/Precodevenda.html) |  |  |

## Cadastros (`/records`)

| Área | Rota | Help | Prioridade | Pasta de teste |
| --- | --- | --- | --- | --- |
| **Produtos** | `/records/products/products` | [Produtos](https://www.atualsistemas.net.br/solucoes/IntegraMais/Produtos.html) | P2 | `tests/regression/cadastros/produtos/` |
| Marcas, Grade, Grupo, Lista de preço, Serviços, Unidade de medida | `/records/products/*` | [Marcas](https://www.atualsistemas.net.br/solucoes/IntegraMais/Marcas.html) |  |  |
| Segurança: Funcionários, Perfil de usuário, Usuários | `/records/security/*` | [Usuarios](https://www.atualsistemas.net.br/solucoes/IntegraMais/Usuarios.html) |  |  |
| Cidades | `/records/general/cities` | [Cidades](https://www.atualsistemas.net.br/solucoes/IntegraMais/Cidades.html) |  |  |

## Configuração (`/config`)

| Área | Rota | Help | Prioridade | Pasta de teste |
| --- | --- | --- | --- | --- |
| Empresas | `/config/companies` | [Empresas](https://www.atualsistemas.net.br/solucoes/IntegraMais/Empresas.html) |  |  |
| Fiscal: CEST, CFOP, NCM, Regra de imposto | `/config/fiscal/*` | [Regradeimposto](https://www.atualsistemas.net.br/solucoes/IntegraMais/Regradeimposto.html) |  |  |
| Tributos: regime, enquadramento, benefício, fórmula, base de cálculo, natureza da receita, motivo de desoneração | `/config/tax/*` | [Regime](https://www.atualsistemas.net.br/solucoes/IntegraMais/Regime.html) |  |  |

## Relatórios (`/analytics/report`)

| Área | Rota | Help | Prioridade | Pasta de teste |
| --- | --- | --- | --- | --- |
| Relatórios | `/analytics/report` | [Relatorios](https://www.atualsistemas.net.br/solucoes/IntegraMais/Relatorios.html) |  |  |

## Como usar

- **Escolher o que automatizar:** comece pelas áreas P1 (Venda Rápida, Pedidos, Contas a Receber, Entrada de NF), que são os fluxos de maior risco (fiscal e pagamento).
- **Criar teste:** ponha na pasta da área; se a área ainda não tem pasta, ela nasce com o primeiro teste (módulo > área, sem mais níveis).
- **Documentar a tela:** o comportamento fica em [`docs/telas/`](./telas/README.md), e as falhas em [`docs/falhas/`](./falhas/README.md).
- **Dúvida de regra:** o Help (coluna Help) é o ponto de partida; o que for confirmado em teste sobe para `docs/telas/`.

> Pontos a confirmar: "Caixa" ser `/financial/statement`, e o nome de "Financeiras" em Pessoas. As rotas vêm do código do painel; o menu pode esconder áreas conforme a permissão do usuário.
