# INTG-3131 — Validação manual

> Roteiro de teste preparado em 13/10/2026, **antes** da execução. Todos os campos "Obtido" estão pendentes (⏳). Nenhuma senha ou dado de acesso entra neste arquivo.

**Card:** `[SUBTAREFA] (Backend) {Integrações} 2272-[Ecommerce][Backend] Criação de Integração com e-commerce NuvemShop`
https://integramais.atlassian.net/browse/INTG-3131

**Criticidade média.** **Status: ⏳ EM TESTE em HMG** (provisório: 🟡 PARCIAL se grupo e alerta de venda nova seguirem fora do escopo).
Entrega do dev (Eleno), revisão de código a confirmar. Branches: `erp-api` `feature/INTG-3131-nuvemshop-ecommerce-integration`, `erp-backoffice` `feature/INTG-3131-nuvemshop-migration`, `erp-app` `feature/INTG-3131-nuvemshop-config-page`. Relacionado: INTG-2272 (card pai, em Impedimento Dev).

HMG, empresa de teste [a definir, com poucos produtos ativos], 13/10/2026. Loja demo da Nuvemshop [a definir].
Evidência em vídeo (JAM): pendente

## O que o card pede

Integrar o Atual+ à Nuvemshop: enviar do cadastro de produtos SKU, descrição, estoque, valor de venda, marca e grupo; a compra feita no site cai como **pedido não faturado** na tela de Pedidos, com **alerta de venda nova**; a configuração fica no menu Configurações, em Integrações. O card **não traz cenários BDD**; os critérios abaixo vêm do texto do card (C1 a C6) e do roteiro de QA do dev (CT-01 a CT-18).

**Fora do escopo desta entrega, segundo o dev (não registrar como bug):** descrição igual ao nome do produto; grupo (categoria) e imagens não enviados; produto inativado continua publicado; alerta de venda nova inexistente; número do pedido da Nuvemshop não aparece na tela; pagamento ou cancelamento feitos depois no site não atualizam o pedido; nota fiscal, rastreio e cancelamento não voltam à loja; atualização a cada 15 minutos; desinstalar o app pela Nuvemshop não desconecta no Atual+.

## Critérios do card (BDD) executados

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| C1 | integração configurada em Configurações | abrir o menu | existe a opção de integração com e-commerce (Integrações de e-commerce) | ⏳ |
| C2 | produto cadastrado e ativo | passa o ciclo de sincronização | SKU, estoque, valor de venda e marca chegam à loja | ⏳ |
| C3 | produto cadastrado e ativo | passa o ciclo de sincronização | **descrição** chega à loja | ⏳ (dev informa: igual ao nome) |
| C4 | produto com grupo | passa o ciclo de sincronização | **grupo** chega à loja | ⏳ (dev informa: não enviado) |
| C5 | compra feita no site | passa o ciclo de importação | pedido **não faturado** na tela de Pedidos | ⏳ |
| C6 | compra feita no site | pedido importado | **alerta** de que chegou venda nova | ⏳ (dev informa: não existe) |
| CT-01 | loja, e-commerce, vendedor e operação escolhidos | criar a integração em `/config/ecommerce` | status Aguardando conexão e sincronização Pausada | ⏳ |
| CT-02 | integração criada | Conectar e autorizar na loja demo em até 10 min | volta ao Atual+ Conectada, Ativa e com o número da loja | ⏳ |
| CT-03 | produto simples ativo | próximo ciclo | publicado com nome, preço, estoque, SKU e marca iguais ao Atual+ | ⏳ |
| CT-04 | produto com grade | próximo ciclo | uma variação por SKU, com o estoque de cada uma | ⏳ |
| CT-05 | produto já publicado | mudar preço e estoque no Atual+ | atualizado no próximo ciclo, sem duplicar | ⏳ |
| CT-06 | produtos publicados | comprar na vitrine (grade e simples, pagamento "A combinar") | pedido feito no site | ⏳ |
| CT-07 | pedido do site | passa o ciclo | pedido EM PROGRESSO na loja da integração, com vendedor e operação configurados | ⏳ |
| CT-08 | pedido importado | abrir o pedido | cliente com CPF, e-mail e telefone; endereço com bairro e cidade corretos | ⏳ |
| CT-09 | pedido importado | conferir itens | SKUs, quantidades, preços e total iguais ao site; pagamento aguardando | ⏳ |
| CT-10 | pedido importado | ver o número | segue a série de pedidos da loja | ⏳ |
| CT-11 | pedido já importado | passam novos ciclos | o pedido não reaparece | ⏳ |
| CT-12 | cliente já criado | segundo pedido com o mesmo CPF | não cria outro cliente | ⏳ |
| CT-13 | loja já integrada | criar outra integração na mesma loja | recusada ("Esta loja já tem uma integração de e-commerce. Cada loja pode ter só uma.") | ⏳ |
| CT-14 | integração conectada | pausar e reativar a sincronização | pausada não sincroniza; reativada volta | ⏳ |
| CT-15 | integração conectada | Desconectar e Reconectar | desconectada para a sincronização; reconectada volta a Conectada | ⏳ |
| CT-16 | integração com pedidos importados | tentar excluir | bloqueada ("Esta integração já importou pedidos e não pode ser excluída...") | ⏳ |
| CT-17 | autorização gerada | aceitar depois de 10 min | erro ("Não foi possível conectar a loja") e a integração não muda | ⏳ |
| CT-18 | usuário sem a função | abrir o menu e a rota | não vê o menu e `/config/ecommerce` é bloqueado | ⏳ |

**Em resumo:** a decidir após a execução. C3, C4 e C6 já devem falhar pelo que o dev informou; o veredito depende de o supervisor confirmar que ficam fora do escopo.

## Complementares — negativo e borda (não decidem o veredito)

| # | Tipo | Quando | Então (esperado) | Obtido |
| --- | --- | --- | --- | --- |
| N1 | Negativo | ativar a sincronização antes de conectar | a chave "Sincronização ativa" fica desabilitada | ⏳ |
| N2 | Negativo | editar integração existente | Loja e E-commerce ficam desabilitados | ⏳ |
| N3 | Negativo | salvar sem vendedor ou sem operação | "Selecione o vendedor" / "Selecione a operação" | ⏳ |
| N4 | Negativo | mesma loja Nuvemshop em duas lojas do Atual+ | "Não foi possível conectar a loja"; a primeira continua conectada | ⏳ |
| N5 | Negativo | excluir integração sem pedidos | "Integração de e-commerce excluída" | ⏳ |
| N6 | Negativo | ambiente sem o app configurado | opção "Nuvemshop (não configurado neste ambiente)" não pode ser escolhida | ⏳ |
| N7 | Negativo (segurança) | abrir o callback com `state` adulterado ou `code` inválido | erro tratado; nenhum token gravado em outra empresa | ⏳ |
| N8 | Negativo | outra empresa abre a lista de integrações | não vê a integração da primeira | ⏳ |
| N9 | Negativo | produto sem SKU ou sem estoque | tratado sem derrubar o ciclo; falha visível no log | ⏳ |
| B1 | Borda | pedido com frete, cupom de desconto e quantidade maior que 1 | total, frete e desconto iguais ao site | ⏳ |
| B2 | Borda | pedido importado | efeito no estoque igual ao de um pedido feito pela tela (item entra sem depósito, segundo o dev) | ⏳ |
| B3 | Borda | produto com nome especial (acento, aspas, `&`) e preço com centavos | enviado sem corromper | ⏳ |
| B4 | Borda | dois pedidos quase ao mesmo tempo | ambos importados, sem duplicar | ⏳ |
| R1 | Regressão | após o deploy dos 3 projetos | Pedidos, Cadastro de Produtos e Configurações seguem normais; produto alterado não é reenviado em loop | ⏳ |

## Passo a passo (reproduzível)

**Pré-requisitos (confirmar com o dev antes):** os 3 projetos (`erp-api`, `erp-backoffice` com a migration `V20260929120000`, `erp-app`) estão juntos em HMG; a URL de redirecionamento do app na Nuvemshop aponta para o HMG; variáveis do `erp-api` configuradas; empresa de teste com **poucos produtos ativos** (a primeira carga envia todos, a 2 por segundo).

**Fluxo base:** Configurações > Integrações de e-commerce (`/config/ecommerce`) > Nova integração > Conectar (sempre pelo botão do Atual+) > autorizar na Nuvemshop > aguardar o ciclo (15 min) > conferir produtos na loja > comprar na vitrine > conferir o pedido em Pedidos.

**Preparação (QA):**
1. Loja demo criada pelo portal de parceiros, com "Loja online" e o meio de pagamento "A combinar" ativos e uma forma de entrega.
2. No Atual+, liberar a função "Integrações de e-commerce" ao perfil de teste; ter 1 produto simples e 1 com grade, vendedor, operação e uma cidade cadastrada para o comprador.

**Cenários:** seguir a ordem CT-01 a CT-18, depois os complementares. Registrar o número do pedido e a hora de cada ciclo.

## Evidência técnica (payload/requisição, quando houver)

```json
// a capturar no DevTools (Network): criação da integração, URL de autorização e retorno do callback
// a capturar: o pedido importado (cliente, itens, totais)
```

- A preencher depois da execução: o que a resposta prova (número do pedido, SKU, estoque enviado).
- Consulta de log do Grafana, pronta no roteiro do dev: usar quando um ciclo não sincronizar.

## Print/preview

- ⏳ Tela da integração (Aguardando conexão, Conectada, Pausada).
- ⏳ Produto na loja (simples e com grade) e o mesmo no Atual+.
- ⏳ Pedido do site e o pedido importado em Pedidos.

## Observação de processo

- Nenhum dado de acesso (conta da loja, conta de parceiro) é copiado para este arquivo ou para comentários; esses acessos ficam fora do repositório.
- Confirmar que o teste roda em **HMG** com a loja demo, e não no tenant de produção do cliente piloto.
- O card é uma **subtarefa** do INTG-2272: subtarefa não aceita subtarefa; perguntar ao supervisor onde registrar os bugs encontrados.
- O roteiro do dev está num artefato público externo; não copiar dele nada além dos casos.

## Pendências

- [ ] Confirmar com o dev: deploy em HMG, URL de redirecionamento, variáveis e empresa de teste.
- [ ] Supervisor: confirmar se descrição, grupo e alerta de venda nova ficam fora do escopo (define Parcial ou Aprovado).
- [ ] Supervisor: onde registrar bugs (card pai ou item ligado).
- [ ] Executar CT-01 a CT-18 e os complementares; gravar o JAM.
- [ ] Antes do PR: mesclar a `main` na branch do card.
