# Guia de Onboarding QA & Automação de Testes — mapa mental (texto)

Este arquivo é a **fonte de verdade** do mapa mental, guardada no Git para não se perder. Cada título `##` é
um ramo principal; os itens indentados são os sub-ramos. Versão visual: [`visao-geral.md`](./visao-geral.md).
Versão para leitura em PDF: [`Guia_Onboarding_QA_Automacao_Atual_Mais.pdf`](../../Guia_Onboarding_QA_Automacao_Atual_Mais.pdf).

> **Senhas não ficam aqui.** O repositório é público. Usuários e senhas dos ambientes são pedidos ao time.

## 1. Objetivo do Manual

- Dar autonomia rápida a quem está entrando no setor, reduzindo a dependência de explicações verbais e
  reunindo em um só lugar o necessário para começar a testar e automatizar com segurança.

## 2. Conhecendo o Setor de QA

- Responsabilidades
  - O time de QA valida as entregas do Atual Mais antes que cheguem à produção, cobrindo testes manuais e
    testes automatizados end-to-end com Playwright.
  - O trabalho envolve: analisar cards e bugs reportados, desenhar cenários de teste, validar manualmente nos
    ambientes apropriados, automatizar os fluxos mais críticos e recorrentes, e documentar resultados de forma
    que qualquer pessoa do time consiga reproduzir o que foi encontrado.
  - O Atual Mais é um ERP web (frontend React/Ant Design, via Umi) que cobre operações comerciais, fiscais,
    financeiras e administrativas; por isso, fluxos fiscais e de venda exigem atenção redobrada.
- Analisar cards e bugs
- Desenhar cenários de teste
- Validar manualmente nos ambientes
- Automatizar fluxos críticos e recorrentes
- Documentar resultados para reprodução

## 3. Ferramentas Utilizadas

- Jira: gestão de cards e bugs
  - Colunas de trabalho: "PRONTOS PARA TESTE" e "TESTANDO" (cards já em teste)
  - Board: https://integramais.atlassian.net/jira/software/c/projects/INTG/boards/2?label=Frontend
  - Solicitar para ser adicionado
- Clockify: registro de tempo
  - Solicitar para ser adicionado
- Clarity: controle de acessos
  - Solicitar para ser adicionado
- GitHub: versionamento e colaboração
  - Ser adicionado como colaborador do repositório: mesmo sendo público, só quem tem permissão dá push. Alguém
    com acesso admin adiciona em Settings > Collaborators
  - O passo a passo de setup (clonar, configurar Git, instalar dependências, rodar a suíte) está em "Primeiros
    passos", Fases 1 a 3
- GitHub Actions: pipeline de CI
- VS Code: editor de testes
- Playwright: framework de automação
- JAM: gravação de bugs
- DevTools: inspeção e seletores
- Claude: apoio na análise e na documentação

## 4. Conhecer os Ambientes de Teste

- HMG: ambiente inicial de validação/homologação (padrão para testes automatizados)
  - https://backoffice.hmg.atualmais.com.br/
  - Usuário e senha: pedir ao time (não ficam no repositório)
- PREPROD: para operações críticas
  - https://backoffice.preprod.atualmais.com.br/
- Produção: uso restrito, nunca rodar testes automatizados
  - https://backoffice.atualmais.com.br/

## 5. Preparar Dados para Testes Fiscais

- Usar ambiente de homologação
- Utilizar séries altas para evitar conflitos
- Solicitar certificado digital
- Dados fiscais para testes automatizados de NFC-e
  - Token/ID: 000001
  - Token/CSC: A8BEE0500FF3601DE0531E5FA00A9D26
  - Razão Social: SG AUTOMAÇÃO COMERCIAL LTDA ME - ATUAL SGP
  - CNPJ: 12.266.496/0001-29 · IE: 083.632.80-8

## 6. Fluxo de Trabalho

- Resumo: receber card → mapear cenários → validar manual em HMG → registrar tempo → avaliar se automatiza →
  escrever teste em `tests/cards/` → rodar local → documentar → promover para `tests/regression/` se for
  crítico → atualizar o card
  - Receber e entender o card no Jira
  - Mapear cenários de teste (caminho feliz e bordas)
  - Validar manualmente em HMG (e PREPROD, se necessário)
  - Registrar tempo no Clockify
  - Avaliar automação para cenários críticos ou recorrentes
  - Escrever ou atualizar testes em Playwright
  - Rodar a suíte localmente antes de subir o código
  - Documentar evidências e resultados no card
  - Promover testes críticos para a suíte de regressão
  - Atualizar o status no Jira

## 7. Estrutura do Projeto de Automação

- Repositório: `github.com/romuloatual/atual_mais`
  - `playwright.config.ts`: configuração global
  - `tests/smoke/`: checagem rápida e rasa de que as telas principais abrem (tag `@smoke`). Roda primeiro na CI,
    como gate antes do resto da suíte
  - `tests/regression/`: telas e fluxos mais usados (tag `@regression`). Roda em todo push/PR e à noite, e pega
    quando um card quebra outra funcionalidade do mesmo processo/tela
  - `tests/cards/`: um arquivo por card do Jira (ex.: `INTG-2645.spec.ts`), com a tag do card (ex.: `@INTG-2645`).
    Roda sob demanda enquanto o card está em andamento
- Scripts npm principais
  - `npm test`: roda todos os testes, do início ao fim
  - `npm run test:headed`: igual ao `npm test`, mas com o navegador visível
  - `npm run test:ui`: interface interativa do Playwright (rodar um por um, pausar, ver cada passo). A melhor
    ferramenta para depurar um teste que falha
  - `npm run test:report`: abre o relatório HTML da última execução
  - `npm run test:codegen`: grava o que você clica e digita e gera o código do teste
  - `npm run test:smoke`: só os testes `@smoke`
  - `npm run test:regression`: só os testes `@regression` (o mesmo que roda a cada push)
  - `npm run test:card -- @INTG-2645`: só os testes de um card específico

## 8. Integração Contínua (CI)

- O workflow do GitHub Actions roda os testes automaticamente
  - Sempre primeiro: a suíte de fumaça (`@smoke`) como gate rápido; se falhar, o resto não roda
  - Push/PR: depois do smoke, roda a suíte de regressão (feedback rápido)
  - Todo dia às 03:00: suíte completa (regressão + cards)
  - Disparo manual: regressão ou suíte completa
  - Os relatórios ficam disponíveis por 14 dias
  - Os testes nunca rodam contra produção
- Relatório sempre atualizado, sem precisar baixar nada: https://romuloatual.github.io/atual_mais/

## 9. Boas Práticas para Seletores e Testes

- Evitar classes com hash do CSS Modules
- Preferir seletores estáveis (id, role, `data-testid`)
- Usar o DevTools para capturar o HTML renderizado (o sistema é uma SPA)
- Confirmar elementos dentro de modais e iframes
- Documentar as inconsistências encontradas

## 10. Documentar um Caso de Teste e um Problema

- Todo cenário validado manualmente (passando ou falhando) é registrado no card do Jira no formato padrão,
  para qualquer pessoa reproduzir sem explicação verbal
  - Cenário: nome curto do que está sendo testado
  - Steps: Step1, Step2, Step3...
  - Resultado Esperado: o que deveria acontecer, de acordo com o card
  - Resultado Obtido: o que de fato aconteceu
  - Observações: contexto extra, ambiente, dados usados, achados fora do escopo
- Modelo pronto para copiar: `tests/cards/TEMPLATE-caso-de-teste.md`
- Ao encontrar um problema (obtido diferente do esperado), reforçar o registro
  - Informar o ambiente em que ocorreu
  - Adicionar evidências (prints, vídeos, HTML)
  - Usar o JAM para gravar o passo a passo e o momento exato do erro, quando necessário
  - Anexar o relatório do Playwright em testes automatizados

## 11. Checklist de Entrada no Setor

- Checklist do primeiro dia: acessos, VS Code configurado, `npm install`, `npx playwright install`, conhecer os
  ambientes e a convenção de tags/CI
- Convenção de tags
  - `@smoke`: testes rápidos e rasos que confirmam que as telas principais abrem. Pasta `tests/smoke/`
  - `@regression`: testes das telas mais usadas. Pasta `tests/regression/`
  - `@INTG-XXXX` (número do card): testes de um card do Jira. Pasta `tests/cards/`
- Pipeline de CI (o "robô")
  - Sempre primeiro: roda a suíte de fumaça; se as telas principais nem abrirem, o resto não roda
  - Push ou Pull Request: depois do smoke, roda só `@regression` (checagem rápida)
  - Toda madrugada, às 3h: depois do smoke, roda tudo (regressão + cards)
  - Manual: botão no GitHub para rodar só regressão ou tudo (o smoke roda antes de qualquer forma)
- Tudo isso está no arquivo `.github/workflows/playwright.yml`, a "receita" que diz ao robô quando acordar e o
  que fazer

## 12. Principais Regras

- Todo teste deve estar vinculado a um card no Jira
- Registrar tempo no Clockify
- Testes automatizados rodam contra HMG, nunca produção
- Testes novos entram em `tests/cards/` e só são promovidos se forem críticos
- Evitar seletores com hash de CSS Modules
- Documentar erros com evidências
- Usar dados fiscais só nos ambientes corretos
- Seguir o padrão visual da Atual Soluções
- Mentalidade: entender o fluxo, validar manualmente, deixar evidências

## 13. Identidade Visual

- Cores institucionais: verde (#00A886) e cinza (#666666)
- Tipografia sem serifa, com hierarquia clara
- Visual limpo, corporativo e tecnológico
- Não alterar as cores institucionais arbitrariamente

## 14. Fluxos Principais do Atual Mais

- Os 8 fluxos mais importantes (como usar e o que observar como QA): [`../fluxos-principais.md`](../fluxos-principais.md)
  - Venda Rápida, Pedidos, Orçamento, Ordem de Serviço, Caixa, Entrada de NF, Clientes e Produtos

## Primeiros passos para preparar o ambiente para os testes

- Fase 1: preparar a máquina
  - Instalar Git
  - Instalar Node.js (versão 20 ou superior, a mesma da CI)
  - Instalar o VS Code
- Fase 2: ter acesso ao código/repositório QA
  - Pedir a alguém com permissão de admin para ser adicionado como collaborator (Settings > Collaborators em
    github.com/romuloatual/atual_mais)
  - Clonar o repositório
    - `git clone https://github.com/romuloatual/atual_mais.git`
    - `cd atual_mais`
  - Configurar a identidade do Git (se ainda não houver na máquina)
    - `git config --global user.name "Seu Nome"`
    - `git config --global user.email "seu@email.com"`
  - Abrir a pasta no VS Code (ele sugere instalar a extensão do Playwright)
- Fase 3: instalar o projeto
  - `npm install`
  - `npx playwright install`
  - `npm test`
  - Hoje isso falha com "No tests found": é normal, porque `tests/regression/` e `tests/cards/` ainda não têm
    teste automatizado de verdade. Serve só para confirmar que a instalação funcionou
- Fase 4: acesso às demais ferramentas
  - Pedir acesso ao Jira
  - Criar conta e configurar o Clockify
  - Confirmar se precisa mesmo de acesso ao Clarity (herdado do guia geral; não confirmamos se o QA usa)
  - Instalar a extensão JAM no navegador
  - Solicitar certificado digital, se for mexer com teste fiscal
- Fase 5: entender antes de testar
  - Ler o guia de onboarding em PDF completo
  - Saber os 3 ambientes e a regra: HMG sempre primeiro, PREPROD se for fluxo crítico, produção nunca se testa
  - Entender a convenção de tags/CI: `@regression` (telas mais usadas, roda sempre) e `@INTG-XXXX` (card
    específico, roda sob demanda)
  - Se for fiscal, ter em mãos os dados de teste (Token/ID, CNPJ etc.; estão na seção 5)
- Fase 6: configurar o ambiente de homologação no Atual Mais
  - Solicitar o link do ambiente HMG
  - Em Configurações > Editar, preencher os Dados Gerais com o CNPJ da Atual e a Inscrição Estadual
  - Configurar Faturamento (é preciso configurar NFE e NFCE)
    - NFCE
      - Tipo: 65 - Nota Fiscal do Consumidor Eletrônica
      - Forma de Emissão: 1 Normal
      - Ambiente: 2 Homologação
      - Tipo de impressão: 0 - geração de DANFE
      - ID Token: 000001
      - Token: A8BEE0500FF3601DE0531E5FA00A9D26
      - Série e Nota Fiscal: usar numeração alta (ex.: 511)
      - Versão do QRCode: 2.0
    - NFE
      - Tipo: 55 - Nota Fiscal Eletrônica
      - Forma de Emissão: 1 Normal
      - Ambiente: 2 Homologação
      - Tipo de impressão: 1 - Danfe normal, Retrato
      - Equipamento Fiscal: 1 - satDinamico
      - Token: (vazio)
      - Série e Nota Fiscal: usar numeração alta (ex.: 511 para a série, 689 para a nota)
  - Em Configurações padrões > aba Venda, definir "Venda Rápida — Tipo de faturamento" (ex.: `0-Outro`);
    vazio, o popup de faturamento da Venda Rápida mostra `undefined`
- Fase 7: testar o primeiro card de verdade
  - 1. Pegar um card marcado como "pronto para teste" no Jira
  - 2. Ler o card e entender o que foi feito ou alterado
  - 3. Mapear os cenários: caminho feliz e casos de borda
  - 4. Validar manualmente em HMG (e PREPROD, se o card afetar algo crítico)
  - 5. Registrar o tempo gasto no Clockify
  - 6. Decidir se o cenário merece virar teste automatizado agora
  - 7. Se sim, criar `tests/cards/NOME-DO-CARD.spec.ts` com a tag `@INTG-XXXX` (o `npm run test:codegen`
       gera a base clicando na tela)
  - 8. Rodar só esse teste local: `npm run test:card -- @INTG-XXXX`
  - 9. Documentar evidências e o resultado no card do Jira
  - 10. Fazer `git add`, commit e push
  - 11. Conferir se a CI rodou certo: github.com/romuloatual/atual_mais/actions
  - 12. Atualizar o status do card no Jira

## Glossário

- Qual o objetivo do glossário? Explicar alguns jargões para quem está começando no QA, para evitar que o
  entendimento trave
- 1. Seletor: como o teste automatizado encontra um elemento na tela (ex.: um id, um texto, um botão)
- 2. Tag: uma etiqueta no código do teste (ex.: `@regression`) que permite rodar só um grupo de testes
- 3. CI (Integração Contínua): o "robô" que roda os testes automaticamente, sem precisar lembrar
- 4. SPA: tipo de site que "monta" a tela via JavaScript; por isso não dá para salvar o HTML da página, é preciso
  capturá-lo depois de carregado
- 5. PR (Pull Request): pedido de "posso juntar essa mudança de código ao principal?"
- 6. Regressão: quando uma mudança nova quebra algo que já funcionava antes
- 7. Smoke (teste de fumaça): checagem rápida e rasa de que o sistema "está de pé"; roda antes dos demais

## Rascunho (ainda em definição)

- Controle de ambiente: objetivo a definir
