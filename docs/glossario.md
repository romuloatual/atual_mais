# Glossário

Os termos que aparecem nos documentos, em linguagem simples. Em ordem de assunto.

## Jira e processo

| Termo | Quer dizer |
| --- | --- |
| **Card** | uma tarefa do Jira (melhoria, defeito, etc.) que o QA testa. Número no formato `INTG-2727` |
| **Subtarefa** | um card filho de outro. Quando o teste acha um defeito, abre-se uma subtarefa do tipo *Bug (subtarefa)* |
| **Refação** | o status da subtarefa que o dev precisa corrigir |
| **BUG / Defeito** | **BUG**: achado antes de chegar ao cliente. **Defeito**: achado no cliente (produção) |
| **Veredito** | o resultado do teste do card: aprovado, parcial ou reprovado |
| **Evidência** | a prova do que foi testado: o arquivo `INTG-XXXX-evidencias.md` mais prints, vídeo ou payload |
| **JAM** | extensão do navegador que grava o passo a passo, usada como evidência em vídeo |

## Ambientes

| Termo | Quer dizer |
| --- | --- |
| **HMG** | homologação: o ambiente de teste. **Todo teste roda aqui** |
| **PREPROD** | ambiente intermediário, usado quando o card mexe em algo crítico |
| **Produção** | o ambiente do cliente. **Nunca** se automatiza nele |
| **Empresa de teste / schema** | a empresa usada nos testes no sistema (no HMG, a `romulo`) |
| **NFC-e / NF-e** | nota fiscal eletrônica (do consumidor / geral). Teste fiscal só em homologação |

## Tipos de teste

| Termo | Quer dizer |
| --- | --- |
| **Smoke (fumaça)** | teste rápido que só confere se a tela abre. Roda primeiro e, se falhar, o resto nem começa |
| **Regressão** | teste que confirma que uma regra importante **continua certa** depois de mudanças |
| **Teste de API** | teste que fala direto com o servidor, sem abrir o navegador. Aqui roda só sob demanda |
| **Cenário feliz / negativo / borda** | feliz: o que deve dar certo. Negativo: dado inválido que deve ser barrado. Borda: o limite (ex.: 10 caracteres, testar com 11) |
| **BDD (Dado / Quando / Então)** | jeito de escrever um cenário: o estado inicial, a ação e o resultado esperado |
| **Tag** | etiqueta no teste (`@smoke`, `@regression`, `@api`, `@INTG-2727`) para rodar só um grupo |
| **Payload** | os dados enviados ou recebidos numa chamada ao servidor |

## Automação e Git

| Termo | Quer dizer |
| --- | --- |
| **Playwright** | a ferramenta que automatiza o navegador e os testes |
| **Mapa de tela (page object)** | arquivo que guarda como achar os botões e campos de uma tela, para os testes não repetirem isso |
| **Seletor** | o "endereço" de um botão ou campo na tela (`#id`, texto, etc.) |
| **CI / Actions** | o robô do GitHub que roda os testes depois de cada envio. Vermelho = algo falhou |
| **Gate** | uma porta de segurança: se o smoke falha, o resto da suíte não roda |
| **Branch** | uma linha de trabalho separada. Cada card tem a sua (`card/INTG-XXXX`) |
| **Commit** | uma "foto" salva do que mudou, com uma mensagem curta |
| **Push** | enviar os commits ao GitHub |
| **Merge** | juntar o trabalho de uma branch em outra |
| **PR (pull request)** | o pedido para juntar a branch do card na `main`; só abre quando o card termina |
| **`.env`** | arquivo local com usuário e senha de teste. **Nunca** vai para o Git |

Faltou um termo? Acrescente aqui, em uma linha.
