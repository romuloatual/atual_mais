# Configuração > Integrações de e-commerce (Nuvemshop)

Fonte: card INTG-3131, testes em HMG de 15 e 16/10/2026 e código do `erp-api` e do `erp-app`. Marcas: ✅ confirmado · 🟡 inferido · ❓ dúvida · ❌ defeito · 📖 só do manual ou do dev.

## Finalidade

Conectar uma loja virtual da Nuvemshop ao Atual+: os produtos do Atual+ são publicados na loja e as compras feitas no site entram como pedido não faturado.

**Como acessar:** Configuração > Integrações de e-commerce (`/config/ecommerce`).

**Depende de:** uma loja do Atual+ (uma integração por loja), vendedor e operação, produtos ativos com SKU, preço e estoque no depósito da loja, o app da Nuvemshop configurado no ambiente e a função "Integrações de e-commerce" no perfil do usuário.

## O que a tela faz

- **Nova integração:** Loja, E-commerce, Vendedor e Operação são obrigatórios; Forma de pagamento, Usuário e Depósito são opcionais.
- **Ações da linha:** Conectar ou Reconectar, Editar, Desconectar e Excluir.
- **Colunas:** Conexão (Aguardando conexão, Conectada, Desconectada), Sincronização (Ativa, Pausada), número da loja na Nuvemshop e última sincronização de produtos e de pedidos.

## Comportamentos observados

| # | Comportamento | Grau | Fonte / onde |
| --- | --- | --- | --- |
| E1 | A integração nasce **Aguardando conexão** e **Pausada**; só a conexão libera a chave de sincronização | ✅ | HMG, INTG-3131 |
| E2 | Loja e E-commerce **não mudam** ao editar; uma loja do Atual+ só pode ter **uma** integração ("Esta loja já tem uma integração de e-commerce. Cada loja pode ter só uma.") | ✅ | HMG |
| E3 | **Conectar** pelo botão do Atual+ leva à Nuvemshop; na primeira vez pede **Aceitar** (vale 10 min); com o app já instalado, não pede e volta direto | ✅ | HMG; dev |
| E4 | A sincronização roda a cada **15 minutos** (:00, :15, :30, :45), para produtos e para pedidos | ✅ | HMG; dev |
| E5 | **Produtos:** chegam nome, preço, estoque, SKU e marca; produto com grade vira **uma variação por SKU**; a descrição é igual ao nome e não vão grupo nem imagens | ✅ | HMG; dev |
| E6 | **Pedidos:** a compra do site entra como pedido **EM PROGRESSO** (não faturado), com o vendedor e a operação da integração, itens, frete e total iguais aos do site; a fatura sai na forma configurada na integração, com documento "NS" + id da Nuvemshop | ✅ | HMG |
| E7 | **Cliente:** reaproveita o cadastro existente por e-mail ou por CPF, sem criar outro e sem alterar nome ou dados | ✅ | HMG |
| E8 | O pedido já importado **não reaparece** nos ciclos seguintes; pedidos anteriores à conexão não entram | ✅ / 📖 | HMG; dev |
| E9 | **Pausar** para a sincronização até religar; **Desconectar** (com confirmação) deixa Desconectada e Pausada, e Reconectar volta Conectada e Ativa | ✅ | HMG |
| E10 | **Excluir** é **bloqueado** se a integração já importou pedido ("Desative ou desconecte a integração"); sem pedidos, exclui | ✅ | HMG |
| E11 | Sem a função no perfil, o menu some e a rota abre a página 403 | ✅ | HMG |
| E12 | O pedido importado **não baixa estoque** no Atual+, enquanto a Nuvemshop baixa o dela | ✅ | HMG; regra de baixa a definir |
| E13 | Reconectar logado em **outra loja** da Nuvemshop troca a loja da integração sem aviso e os pedidos da loja anterior deixam de entrar | ❌ | HMG |

## O que o sistema não faz (conforme o dev)

Alerta de venda nova, grupo e imagens, atualização de pedido por mudança de pagamento ou cancelamento no site, retorno de nota fiscal, rastreio e cancelamento para a loja, atualização imediata (só a cada 15 min), desconexão ao desinstalar o app pela Nuvemshop e reenvio de produto excluído na loja.

## Falhas conhecidas

- **INTG-3747:** cada produto é publicado em duas cópias e só uma delas é atualizada.
- Observações do INTG-3131, sem card próprio: retorno da primeira conexão para um endereço sem a empresa, troca de loja ao reconectar, reenvio de produtos excluídos, página 403 em chinês e a regra de baixa de estoque do pedido importado.
