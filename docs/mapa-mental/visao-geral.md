# Mapa mental — visão geral

Desenho dos ramos principais do guia de QA. O GitHub renderiza o diagrama abaixo automaticamente.
O detalhe completo de cada ramo está em [`guia-onboarding-qa.md`](./guia-onboarding-qa.md).
Imagem do mesmo mapa, para abrir fora do GitHub: [`visao-geral.png`](./visao-geral.png).

Para alterar o mapa, edite o texto em `guia-onboarding-qa.md` (fonte de verdade) e ajuste o diagrama abaixo.

```mermaid
mindmap
  root((Guia de QA e Automação))
    1 Objetivo
    2 Setor de QA
      Analisar cards e bugs
      Desenhar cenários
      Validar manualmente
      Automatizar o crítico
      Documentar para reproduzir
    3 Ferramentas
      Jira
      Clockify
      Clarity
      GitHub e Actions
      VS Code e Playwright
      JAM e DevTools
      Claude
    4 Ambientes
      HMG primeiro
      PREPROD se crítico
      Produção nunca
    5 Dados fiscais
      Homologação
      Séries altas
      Certificado digital
      Dados de NFC-e
    6 Fluxo de trabalho
      Receber o card
      Mapear cenários
      Validar em HMG
      Avaliar automação
      Documentar e atualizar o card
    7 Projeto de automação
      tests smoke
      tests regression
      tests cards
      Scripts npm
    8 CI
      Smoke primeiro
      Regressão em todo push
      Suíte completa às 3h
      Relatório publicado
    9 Boas práticas
      Seletores estáveis
      Evitar classes com hash
      DevTools e iframes
    10 Documentar teste e bug
      Cenário
      Steps
      Esperado e Obtido
      Observações
    11 Entrada no setor
      Checklist do primeiro dia
      Tags smoke regression e card
      Pipeline de CI
    12 Regras
      Card no Jira
      Tempo no Clockify
      Sempre HMG
      Evidências
    13 Identidade visual
      Verde 00A886
      Cinza 666666
    14 Fluxos principais
      Venda Rápida
      Pedidos
      Orçamento e OS
      Caixa
      Entrada de NF
      Clientes e Produtos
    Primeiros passos
      Fase 1 Máquina
      Fase 2 Acesso ao código
      Fase 3 Instalar o projeto
      Fase 4 Outras ferramentas
      Fase 5 Entender antes de testar
      Fase 6 Ambiente de homologação
      Fase 7 Primeiro card
    Glossário
      Seletor e Tag
      CI e PR
      SPA
      Regressão e Smoke
```
