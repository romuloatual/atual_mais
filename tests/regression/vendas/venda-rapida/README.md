# Regressão: Vendas / Venda Rápida (PDV V2)

Rota: `/pdv-v2` · Prioridade: **P1** · Help: [Vendarapida](https://www.atualsistemas.net.br/solucoes/IntegraMais/Vendarapida.html)

Comportamento da tela: [`docs/telas/venda-rapida.md`](../../../../docs/telas/venda-rapida.md). Mapa de tela: [`support/pages/vendas/venda-rapida.page.ts`](../../../support/pages/vendas/venda-rapida.page.ts).

## Testes

| Arquivo | O que prova |
| --- | --- |
| `venda-feliz.regression.spec.ts` | 1 item (SKU 010) pago em Dinheiro é faturado em "Outros": o pedido é criado (200), a nota `OTHER` fica `COMPLETED` e o popup "Faturamento realizado com sucesso" aparece |

## Como funciona (e por quê)

- **Login por API:** o teste não digita usuário e senha; a sessão vem de `support/fixtures.ts`.
- **Configurações padrões:** no painel elas ficam **só no navegador** (`localStorage`, por loja), não no servidor. Um navegador novo começa sem cliente, vendedor e operação, e o pedido falha com "The given id must not be null!". A fixture cria o padrão em `support/configuracoes-padrao.ts` (cliente à vista, `VENDEDOR-CAIXA`, operação `Vendas`/1000: ids do HMG).
- **Espera o carrinho:** só aperta `END` depois de "Itens: 01"; antes disso a tecla se perde.
- **Botões por texto:** muitos botões desta tela não são `button` de verdade; a referência é o texto (ou o `dialog`).

## Cuidados

- **Cada execução cria um pedido real no HMG** (e uma nota "Outros"). Definir a limpeza antes de rodar em lote.
- Depende do **SKU 010** (Biscoito Recheado Chocolate 140g) e de "Tipo de faturamento" = `0-Outro` (configuração da empresa).
- **Sem credenciais (`.env`), o teste é pulado** (não falha); fora do Chromium também. Por isso o CI não o executa hoje.
- A **V1** (`/sales/fast`) está bloqueada (INTG-3435): só a V2.

## Próximos casos

Cliente cadastrado, desconto no item, pagamento parcial em duas formas, NFC-e (precisa de certificado) e a impressão do pedido. Teste de card entra aqui com a tag do card (`['@regression', '@INTG-XXXX']`).
