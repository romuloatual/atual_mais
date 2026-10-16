# INTG-3131 — Validação manual

> Execução feita em HMG de 15 a 16/10/2026, a partir do roteiro preparado em 13/10. Nenhuma senha, e-mail, CPF ou dado de acesso entra neste arquivo, nem o nome dos produtos usados no teste.

**Card:** `[SUBTAREFA] (Backend) {Integrações} 2272-[Ecommerce][Backend] Criação de Integração com e-commerce NuvemShop`
https://integramais.atlassian.net/browse/INTG-3131

**Criticidade média.** **Status: 🔴 REPROVADO em HMG** pela duplicação de produtos e pela atualização de apenas uma das cópias (defeito a abrir; o supervisor define onde registrar).
Entrega do dev (Eleno). Branches: `erp-api` `feature/INTG-3131-nuvemshop-ecommerce-integration`, `erp-backoffice` `feature/INTG-3131-nuvemshop-migration`, `erp-app` `feature/INTG-3131-nuvemshop-config-page`. Relacionado: INTG-2272 (card pai, em Impedimento Dev).

HMG, empresa de teste `romulo`, 15 e 16/10/2026, com loja demo da Nuvemshop e a empresa com 54 a 57 produtos ativos.
Evidência em vídeo (JAM): https://jam.dev/c/e0639aff-2590-483f-a17c-aeb34cb0f8c0

## O que o card pede

Integrar o Atual+ à Nuvemshop: enviar do cadastro de produtos SKU, descrição, estoque, valor de venda, marca e grupo; a compra feita no site cai como **pedido não faturado** na tela de Pedidos, com **alerta de venda nova**; a configuração fica no menu Configurações, em Integrações. O card **não traz cenários BDD**; os critérios abaixo vêm do texto do card (C1 a C6) e do roteiro de QA do dev (CT-01 a CT-18).

**Fora do escopo desta entrega, segundo o dev (não registrar como bug):** descrição igual ao nome do produto; grupo (categoria) e imagens não enviados; produto inativado continua publicado; alerta de venda nova inexistente; número do pedido da Nuvemshop não aparece na tela; pagamento ou cancelamento feitos depois no site não atualizam o pedido; nota fiscal, rastreio e cancelamento não voltam à loja; atualização a cada 15 minutos; desinstalar o app pela Nuvemshop não desconecta no Atual+.

Legenda: ✅ passou · ❌ falhou · ⚠️ passou com ressalva · ⏭️ não testado.

## Critérios do card (BDD) executados

| # | Dado | Quando | Então (card) | Obtido |
| --- | --- | --- | --- | --- |
| C1 | integração configurada em Configurações | abrir o menu | existe a opção de integração com e-commerce (Integrações de e-commerce) | ✅ menu "Integrações de e-commerce" em Configurações |
| C2 | produto cadastrado e ativo | passa o ciclo de sincronização | SKU, estoque, valor de venda e marca chegam à loja | ❌ chegam corretos, mas cada produto é publicado em **duas cópias** com o mesmo SKU |
| C3 | produto cadastrado e ativo | passa o ciclo de sincronização | **descrição** chega à loja | ⚠️ chega igual ao nome (fora do escopo, segundo o dev) |
| C4 | produto com grupo | passa o ciclo de sincronização | **grupo** chega à loja | ⚠️ não chega: o produto na loja fica sem categoria (fora do escopo, segundo o dev) |
| C5 | compra feita no site | passa o ciclo de importação | pedido **não faturado** na tela de Pedidos | ✅ pedido "EM PROGRESSO" em Vendas > Pedidos |
| C6 | compra feita no site | pedido importado | **alerta** de que chegou venda nova | ⏭️ não verificado (o dev informa que não existe) |
| CT-01 | loja, e-commerce, vendedor e operação escolhidos | criar a integração em `/config/ecommerce` | status Aguardando conexão e sincronização Pausada | ✅ Aguardando conexão, Pausada, loja "-", última sincronização "Nunca" (a mensagem de criada não foi capturada) |
| CT-02 | integração criada | Conectar e autorizar na loja demo em até 10 min | volta ao Atual+ Conectada, Ativa e com o número da loja | ⚠️ conecta (Conectada, Ativa, número da loja), mas o retorno cai em `hmg.atualmais.com.br` (erro 522) e a notificação "Loja conectada ao e-commerce" não aparece |
| CT-03 | produto simples ativo | próximo ciclo | publicado com nome, preço, estoque, SKU e marca iguais ao Atual+ | ⚠️ dados iguais, porém em duas cópias |
| CT-04 | produto com grade | próximo ciclo | uma variação por SKU, com o estoque de cada uma | ✅ 3 variações (P, M e G), cada uma com seu estoque e preço |
| CT-05 | produto já publicado | mudar preço e estoque no Atual+ | atualizado no próximo ciclo, sem duplicar | ❌ não cria nova cópia, mas só a cópia de id maior recebe o preço e o estoque novos |
| CT-06 | produtos publicados | comprar na vitrine (grade e simples, pagamento "A combinar") | pedido feito no site | ✅ 4 pedidos feitos (#100 a #103) |
| CT-07 | pedido do site | passa o ciclo | pedido EM PROGRESSO na loja da integração, com vendedor e operação configurados | ✅ pedidos 00000059 a 00000063, operação Vendas, vendedor configurado |
| CT-08 | pedido importado | abrir o pedido | cliente com CPF, e-mail e telefone; endereço com bairro e cidade corretos | ⚠️ endereço (CEP, cidade, bairro, rua, número) igual ao site; CPF e telefone do endereço do pedido ficam vazios |
| CT-09 | pedido importado | conferir itens | SKUs, quantidades, preços e total iguais ao site; pagamento aguardando | ⚠️ itens, quantidades, preços, frete e total iguais; a fatura sai na forma configurada na integração (Pix) enquanto a loja diz "A combinar", e o total do documento não inclui o frete |
| CT-10 | pedido importado | ver o número | segue a série de pedidos da loja | ✅ numeração contínua da série do Atual+ |
| CT-11 | pedido já importado | passam novos ciclos | o pedido não reaparece | ✅ cerca de 15 horas depois seguia um só; também com 4 pedidos |
| CT-12 | cliente já criado | segundo pedido com o mesmo CPF | não cria outro cliente | ✅ reaproveitou o cliente com o mesmo e-mail e com o mesmo CPF (nome, e-mail ou CPF diferentes), sem criar novo e sem alterar o cadastro |
| CT-13 | loja já integrada | criar outra integração na mesma loja | recusada ("Esta loja já tem uma integração de e-commerce. Cada loja pode ter só uma.") | ✅ recusada, com o prefixo técnico "400:" na mensagem |
| CT-14 | integração conectada | pausar e reativar a sincronização | pausada não sincroniza; reativada volta | ✅ pausada não sincronizou nos ciclos seguintes; reativada voltou no ciclo seguinte |
| CT-15 | integração conectada | Desconectar e Reconectar | desconectada para a sincronização; reconectada volta a Conectada | ⚠️ funciona ("Loja desconectada do e-commerce", chave desabilitada); ao reconectar volta Conectada e Ativa mesmo se estava pausada; reconectar logado em outra loja da Nuvemshop **troca a loja da integração sem aviso** |
| CT-16 | integração com pedidos importados | tentar excluir | bloqueada ("Esta integração já importou pedidos e não pode ser excluída...") | ✅ "Esta integração já importou pedidos e não pode ser excluída. Desative ou desconecte a integração." (com prefixo "400:") |
| CT-17 | autorização gerada | aceitar depois de 10 min | erro ("Não foi possível conectar a loja") e a integração não muda | ⏭️ não testado: com o app já instalado na loja, Reconectar não mostra a tela de aceite |
| CT-18 | usuário sem a função | abrir o menu e a rota | não vê o menu e `/config/ecommerce` é bloqueado | ⚠️ menu some e a rota abre a página 403, que aparece em **chinês**; a API não foi testada direto |

**Em resumo:** 🔴 **Reprovado.** Menu, pedidos e ciclo de vida funcionam, mas a publicação de produtos duplica todos os itens e atualiza só uma cópia (C2, CT-03, CT-05); o roteiro do dev diz que "não pode aparecer um produto duplicado". Descrição, grupo e alerta de venda nova (C3, C4 e C6) seguem fora do escopo conforme o dev, a confirmar com o supervisor.

## Complementares — negativo e borda (não decidem o veredito)

| # | Tipo | Quando | Então (esperado) | Obtido |
| --- | --- | --- | --- | --- |
| N1 | Negativo | ativar a sincronização antes de conectar | a chave "Sincronização ativa" fica desabilitada | ✅ desabilitada com a integração desconectada |
| N2 | Negativo | editar integração existente | Loja e E-commerce ficam desabilitados | ✅ |
| N3 | Negativo | salvar sem vendedor ou sem operação | "Selecione o vendedor" / "Selecione a operação" | ✅ também "Selecione a loja" e "Selecione o e-commerce" |
| N4 | Negativo | mesma loja Nuvemshop em duas lojas do Atual+ | "Não foi possível conectar a loja"; a primeira continua conectada | ⏭️ não testado (precisa de uma segunda loja no Atual+) |
| N5 | Negativo | excluir integração sem pedidos | "Integração de e-commerce excluída" | ✅ |
| N6 | Negativo | ambiente sem o app configurado | opção "Nuvemshop (não configurado neste ambiente)" não pode ser escolhida | ⏭️ não testado (não dá para simular em HMG) |
| N7 | Negativo (segurança) | abrir o callback com `state` adulterado ou `code` inválido | erro tratado; nenhum token gravado em outra empresa | ✅ redireciona com `?ecommerce=erro` e a integração existente não muda |
| N8 | Negativo | outra empresa abre a lista de integrações | não vê a integração da primeira | ⏭️ não testado (precisa de uma segunda empresa em HMG) |
| N9 | Negativo | produto sem SKU ou sem estoque | tratado sem derrubar o ciclo; falha visível no log | ✅ produto sem estoque publicado como "Sem estoque", sem travar o ciclo (também em duas cópias); o log não foi consultado |
| B1 | Borda | pedido com frete, cupom de desconto e quantidade maior que 1 | total, frete e desconto iguais ao site | ⚠️ quantidade (2 e 4 unidades) e frete iguais ao site; **cupom não testado** |
| B2 | Borda | pedido importado | efeito no estoque igual ao de um pedido feito pela tela (item entra sem depósito, segundo o dev) | ⚠️ o pedido importado fica EM PROGRESSO e não baixa estoque no Atual+, enquanto a Nuvemshop baixa o dela; em 3 ciclos o Atual+ não devolveu o estoque antigo |
| B3 | Borda | produto com nome especial (acento, aspas, `&`) e preço com centavos | enviado sem corromper | ✅ íntegro (publicado em duas cópias) |
| B4 | Borda | dois pedidos quase ao mesmo tempo | ambos importados, sem duplicar | ✅ dois pedidos seguidos entraram uma vez cada |
| R1 | Regressão | após o deploy dos 3 projetos | Pedidos, Cadastro de Produtos e Configurações seguem normais; produto alterado não é reenviado em loop | ⏭️ não testado (retestar após a correção) |

## Passo a passo (reproduzível)

**Pré-requisitos (confirmados):** os 3 projetos (`erp-api`, `erp-backoffice` com a migration `V20260929120000`, `erp-app`) em HMG; a URL de redirecionamento do app na Nuvemshop aponta para o HMG (`api.hmg`, não `api-hmg`); variáveis do `erp-api` configuradas; empresa de teste.

**Fluxo base:** Configurações > Integrações de e-commerce (`/config/ecommerce`) > Nova integração > Conectar (sempre pelo botão do Atual+) > autorizar na Nuvemshop > aguardar o ciclo (15 min) > conferir produtos na loja > comprar na vitrine > conferir o pedido em Pedidos.

**Para reproduzir a duplicação:**
1. Integração conectada e ativa.
2. Cadastrar um produto simples ativo, com preço e estoque no depósito da loja.
3. Esperar o ciclo (:00, :15, :30 ou :45) e abrir a lista de produtos da loja da Nuvemshop: aparecem 2 produtos com o mesmo SKU.
4. Alterar o preço no Atual+ e esperar outro ciclo: só um dos dois muda.

## Evidência técnica (payload/requisição, quando houver)

Contagem de itens na loja da Nuvemshop, sem separar nomes:

| Quando | Produtos no Atual+ | Itens na loja | Leitura |
| --- | --- | --- | --- |
| 15/10 15:15 (1ª integração) | 54 | 107 | 53 em dobro |
| 15/10 16:30 (integração refeita) | 56 | 112 | todos em dobro |
| 16/10 09:30 (produto novo) | +1 | +2 | 2 cópias |
| 16/10 11:30 e 11:45 (2 produtos novos) | +2 | +4 | 2 cópias cada |

- Os pares têm ids vizinhos e o mesmo SKU; ao mudar preço e estoque no Atual+, só a cópia de id maior recebeu o valor novo. Hipóteses para o dev: dois processos publicando em paralelo (a trava do job é em memória) e/ou o vínculo produto → id externo guardar um só id.
- Pedido importado: operação Vendas, vendedor configurado, itens, preços, frete e total iguais ao site; fatura com documento começando por "NS" (id do pedido na Nuvemshop).
- O roteiro do dev diz: "Não pode aparecer um produto duplicado na Nuvemshop".

## Print/preview

Capturas guardadas fora do repositório (contêm dados de teste); disponíveis no JAM e com o QA:
- ✅ Tela da integração nos estados Aguardando conexão, Conectada, Pausada e Desconectada.
- ✅ Lista de produtos da loja com as cópias em dobro e a variação por SKU.
- ✅ Pedido do site e o pedido importado em Pedidos, com itens e fatura.
- ✅ Mensagens: loja repetida recusada, exclusão bloqueada, acesso negado em chinês e erro 522 após aceitar.

## Observação de processo

- Nenhum dado de acesso (conta da loja, conta de parceiro) é copiado para este arquivo ou para comentários; esses acessos ficam fora do repositório.
- O teste rodou em **HMG** com a loja demo, e não no tenant de produção do cliente piloto.
- O card é uma **subtarefa** do INTG-2272: subtarefa não aceita subtarefa; perguntar ao supervisor onde registrar o bug.
- O roteiro do dev está num artefato público externo; não copiar dele nada além dos casos.

## Pendências

- [x] Executar CT-01 a CT-18 e os complementares possíveis; gravar o JAM.
- [ ] Supervisor: onde registrar o bug (card pai como Bug (subtarefa) ou BUG próprio).
- [ ] Supervisor: confirmar se descrição, grupo e alerta de venda nova ficam fora do escopo.
- [ ] Abrir o bug da duplicação e postar o comentário final no Jira.
- [ ] Reteste após a correção; incluir os não testados (cupom, autorização expirada, mesma loja em duas lojas do Atual+, outra empresa, app não configurado, API sem permissão).
- [ ] Pontos para o dev (observações do comentário): retorno da primeira conexão, troca de loja ao reconectar, reenvio de produtos excluídos, página 403 em chinês, estoque do pedido importado.
