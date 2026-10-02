# INTG-2676 — Registro de validação manual

Pai: INTG-3102 (Venda Rápida V2.1). Ambiente: HMG, empresa `romulo`, caixa `root`, PDV LOJA001.
Data: 02/10/2026.

## Status geral

| Item | Status |
| --- | --- |
| Cenário 1 (Tel + Cel, Bobina, cliente à vista) | **Reprovado** (3 execuções, mesmo resultado) |
| Cenários 2 a 8 | Não executados (aguardando resposta do desenvolvedor) |

## Pré-condições

- Configurações padrões > aba Venda: "Venda Rápida — Tipo de faturamento" = `0-Outro`.
  Sem isso o popup de faturamento mostra a palavra `undefined` (bug separado, abaixo).
- Cliente usado: **CLIENTE A VISTA** (código 1, CPF 999.999.999-99), selecionado por padrão, sem
  telefone/celular no cadastro (`contacts: []`).
- Modelo de impressão do PDV volta para "Folha A4" a cada venda; é preciso escolher a bobina no `F1 Opções`.

## Cenário 1: Telefone + Celular preenchidos, impressão Bobina

Step1: Digitar `012`, Enter, Enter (o 1º Enter carrega o produto, o 2º adiciona)
Step2: Não selecionar cliente (manter CLIENTE A VISTA)
Step3: Clicar no lápis de edição do cliente
Step4: Preencher Telefone e Celular (valores diferentes entre si e do cadastro) e clicar em Confirmar
Step5: `END` (Pagamento)
Step6: Adicionar Pagamento > Dinheiro > Confirmar (R$ 1,98)
Step7: `F1 Opções` > Comum bobina (80mm)
Step8: `END` Finalizar Venda > Faturar (Outros)
Step9: Visualizar (baixa o PDF do pedido)

**Resultado Esperado:** a impressão do pedido exibe telefone e celular informados no modal.

**Resultado Obtido:** `Contato: -` (vazio). Nem telefone nem celular saem no pedido.

**Observações:**
- O modal já tem os campos separados (`phoneNumber`, `cellphoneNumber`).
- O Confirmar do cliente à vista fecha o modal sem popup e **sem chamada à API**.
- Dados usados: rodada 4 Tel `2733889900` / Cel `27955443322` (pedido 17); rodada 5 Tel `2733112233` /
  Cel `27944332211` (pedido 18).

### Evidência técnica (rodada 4, requisição capturada)

`POST /api/v1/sales-order` (status 200, pedido 00000017):

```json
"customer": {"id": "1"},
"billingAddress": {
  "name": "CLIENTE A VISTA", "recipientName": "CLIENTE A VISTA",
  "cnpj": "99999999999", "city": null, "zipCode": null,
  "phone": "2733889900"
}
```

O telefone vai em `billingAddress.phone`; **o celular não é enviado** (nenhum campo `cell*` no corpo).

### Evidência de impressão

| Pedido | Formato | Origem | Campo Contato |
| --- | --- | --- | --- |
| 00000017 | A4 | Pedidos > Mais Opções > Imprimir Pedido | `-` |
| 00000018 | Bobina 80mm | PDV > Visualizar | `-` |

Com o cliente 102 (cadastrado), a impressão mostra o `Contato: (27) 3322-1100 / (27) 97766-5544`, que são
os números do **cadastro**, e não os digitados no modal. Isso indica que a impressão do pedido lê o
cadastro do cliente, e a edição feita na venda não chega nela. O lado da impressão do INTG-2645 (telefone
e celular juntos, separados por " / ") está funcionando.

## Pedidos gerados nos testes

| Pedido | Cliente | Tipo | Observação |
| --- | --- | --- | --- |
| 00000013 | Maria das Dores (102) | NFC-e 677 | Rodada 1, antes da configuração `0-Outro` |
| 00000014 | CLIENTE A VISTA | Concluído, sem NF | Venda não faturada |
| 00000015 | CLIENTE A VISTA | OTHER 492 | Tentativa de teste |
| 00000016 | Maria das Dores (102) | OTHER 493 | Rodada 3 |
| 00000017 | CLIENTE A VISTA | OTHER 494 | Rodada 4 (manual, com captura de requisição) |
| 00000018 | CLIENTE A VISTA | OTHER | Rodada 5 (bobina) |

O cliente 102 teve o cadastro alterado durante os testes (Confirmar no modal grava no cadastro, com popup
"Cliente atualizado com sucesso").

## Achados fora do escopo do card

1. Popup de faturamento exibe `undefined` quando "Venda Rápida — Tipo de faturamento" está vazio.
2. Finalizar venda levou cerca de 2 minutos em uma execução e cerca de 5 segundos em outras.
3. O vendedor fica memorizado entre vendas (o passo de seleção de vendedor é pulado).
4. Chamada `POST backoffice.messenger.atualmais.com.br/.../thankyou/webhook` retornou 401 após o faturamento.
5. O botão Confirmar do modal de cliente aparece duplicado como "Salvando..." durante o envio com o cliente 102.

## Pendências

- [ ] Confirmar com o desenvolvedor se o código do INTG-2676 está publicado no HMG e em qual versão.
- [ ] Perguntar onde o telefone se perde: o backend grava `billingAddress.phone` no pedido? A impressão lê o
  pedido ou o cadastro do cliente?
- [ ] Obter o checklist do INTG-2645 (o critério de aceite manda repeti-lo).
- [ ] Executar o restante da matriz do critério de aceite.

## Cobertura do critério de aceite (Bobina e A4 × com/sem telefone × com/sem celular)

| Combinação | Bobina | A4 |
| --- | --- | --- |
| Telefone + Celular | Reprovado (cenário 1) | Pendente |
| Só Telefone | Pendente | Pendente |
| Só Celular | Pendente | Pendente |
| Nenhum | Pendente | Pendente |
| Persistência (reabrir modal) | Pendente | — |
| Pedido de Venda, cliente cadastrado (não-regressão) | Pendente | Pendente |

## Rascunho do bug para o card

**Título:** Celular informado na edição do cliente à vista (Venda Rápida V2) não é enviado nem impresso.

**Ambiente:** HMG, empresa `romulo`, PDV LOJA001.

**Passos:** abrir a Venda Rápida V2, adicionar o item 012, manter o CLIENTE A VISTA, clicar no lápis,
preencher Telefone e Celular, Confirmar, pagar em Dinheiro, escolher a bobina 80mm, finalizar,
Faturar (Outros) e Visualizar.

**Esperado:** o pedido impresso exibe telefone e celular informados.

**Obtido:** o campo Contato do pedido sai vazio (`-`). Na requisição `POST /api/v1/sales-order` só
`billingAddress.phone` é enviado; o celular não é enviado.

**Evidências:** PDFs dos pedidos 00000017 (A4) e 00000018 (bobina) e o corpo da requisição acima.

**Dúvida para o desenvolvimento:** o código do card está no HMG? O backend grava `billingAddress.phone` no
pedido, e a impressão lê o pedido ou o cadastro?
