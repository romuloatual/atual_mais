# Criar documento em Contas a Receber grava várias contas

**Tipo: Defeito** (reproduzido em **produção** e no HMG, 08/10/2026) · Severidade alta (lançamento financeiro duplicado) · Tela: [Contas a receber](../telas/contas-a-receber-quitacao.md)

**Resumo:** ao salvar um documento novo, o botão Salvar não bloqueia nem mostra carregamento durante a gravação (que levou de 1 a 9 s). Cada clique envia uma requisição idêntica. O backend valida duplicidade por cliente + número, mas só depois que a gravação anterior termina; as simultâneas passam todas.

**Evidência (HMG, documento 5500, R$ 100):** 9 cliques em Salvar → 9 requisições de criação com corpo idêntico; **6 criaram conta** (ids 71 a 76) e 3 foram recusadas com "Já existe um documento com o número 5500 para este cliente". As 6 respostas chegaram quase juntas. Produção: reproduzido pelo Rômulo, sem captura de rede.

**Falta provar:** que **1 clique só** duplica (testar e aguardar a resposta).

**Correção sugerida:** front: desabilitar Salvar com indicador de carregamento; backend: restrição única (cliente + número) ou bloqueio, e analisar a lentidão.

**Evidência completa:** captura de rede na pasta local do QA (anexar ao card).
