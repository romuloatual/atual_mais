# Venda Rápida (regras do Help)

Fonte: [Help — Venda rápida](https://www.atualsistemas.net.br/solucoes/IntegraMais/Vendarapida.html), lido em 08/10/2026. Marca **📖** = documentado no manual, ainda **não confirmado por teste nosso**.
⚠️ O artigo descreve o fluxo da versão anterior (campo "Comando" no fechamento); o PDV V2 pode diferir. Confirmar na V2.

| # | Regra | Grau |
| --- | --- | --- |
| V1 | Itens entram por **SKU**, **código de barras** (Enter para confirmar) ou **pesquisa por descrição** (F4); quantidade diferente de 1 com `Qtd * código` (Alt+Q) | 📖 |
| V2 | Desconto no item: Alt+P, em % ou valor; desconto/acréscimo na venda: Alt+A | 📖 |
| V3 | Cancelar item: Alt+I; cancelar venda: Alt+C (pede confirmação) | 📖 |
| V4 | Fechamento (tecla END): se não houver cliente, abre a busca; depois pede o vendedor; depois a tela de fechamento | 📖 |
| V5 | No fechamento escolhe-se a **Operação de venda** (NFC-e) e as formas de pagamento; **pagamento parcial** em mais de uma forma é permitido (ex.: R$ 20 = R$ 10 dinheiro + R$ 10 cartão) | 📖 |
| V6 | Ao finalizar, o sistema cria o pedido e emite o cupom (NFC-e), com opção de visualizar | 📖 |
| V7 | Os dados do **Cliente à Vista** podem ser editados na venda e saem no cupom fiscal | 📖 (relaciona com o INTG-2676) |
| V8 | Cliente, vendedor e operação padrão vêm de "Configurações padrões" (Empresas) | 📖 |

Ver também: [`docs/fluxos-principais.md`](../fluxos-principais.md).

## Finalidade

Vender no balcão (PDV) de forma rápida: lançar itens, aplicar desconto, informar cliente e vendedor, receber em uma ou mais formas e emitir o cupom (NFC-e).

**Como acessar:** Vendas > Venda Rápida.

**Depende de:** **Operação** de venda, **Forma de pagamento**, produtos (SKU/código de barras) e, nas Configurações padrões da Empresa, cliente, vendedor e operação padrão.

## Falhas conhecidas

- _nenhuma registrada ainda_
