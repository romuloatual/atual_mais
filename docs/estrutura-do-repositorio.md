# Estrutura do repositório (mapa visual)

Um desenho do que existe e **para que serve cada pasta**. Para saber por onde começar, volte ao [`README.md`](../README.md).

## O mapa

```
atual_mais/
├─ README.md                      porta de entrada: "Comece aqui" e o índice
├─ Guia_Onboarding (PDF)          manual de introdução ao setor, visual e direto
├─ ROADMAP.md                     o plano do setor, fase a fase
├─ .env.example                   modelo das variáveis (o .env real nunca vai ao Git)
├─ package.json                   os comandos (npm test, npm run test:api...)
├─ playwright.config.ts           configuração dos testes
│
├─ .github/workflows/             o robô do GitHub (CI): roda os testes a cada envio
├─ scripts/                       utilitários (ex.: limpeza dos títulos de teste)
│
├─ docs/                          documentação de processos e de conhecimento
│  ├─ jira-fluxo-de-trabalho.md     como trabalhar o card no Jira
│  ├─ git-fluxo-de-trabalho.md      branches, push, CI depois do push
│  ├─ mapa-do-sistema.md            módulos, telas e rotas do sistema
│  ├─ fluxos-principais.md          os 8 fluxos mais importantes
│  ├─ testes-de-api.md              como rodar e cuidar dos testes de API
│  ├─ glossario.md                  termos em linguagem simples
│  └─ telas/                        finalidade e comportamento de cada tela
│
└─ tests/                         os testes, por CAMADA e por MÓDULO
   ├─ smoke/                        a tela abre? (rápido, roda primeiro)
   ├─ regression/<módulo>/<área>/   teste de tela dos fluxos críticos
   ├─ api/<módulo>/<área>/          teste do servidor, sem navegador
   ├─ cards/                        evidências dos cards e os modelos
   └─ support/                      caixa de ferramentas compartilhada
```

## Cada parte em uma frase

| Pasta ou arquivo | O que é |
| --- | --- |
| **`README.md`** | A porta de entrada. Resume a estrutura e leva para cada documento |
| **Guia de Onboarding (PDF)** | O manual de introdução ao setor. Foi feito para ser **visual e direto**, sem excesso de texto, para ninguém se perder |
| **`docs/`** | Onde ficam os **processos, fluxos e informações gerais** de como o sistema funciona |
| **`docs/telas/`** | A **finalidade e o comportamento de cada tela**. É atualizada conforme os cards são testados |
| **`tests/`** | Os testes, divididos em **camadas** e **módulos**: a camada define **quando** o teste roda; o módulo define **o assunto** |
| **`tests/smoke/`** | Testes **rápidos** que confirmam que o básico funciona, em segundos (ex.: a tela abre) |
| **`tests/regression/`** | Testes de **tela** dos fluxos mais críticos, por módulo e área. Protegem contra quebra depois de mudanças |
| **`tests/api/`** | Testes do **servidor**, sem navegador, para saber se o backend responde certo |
| **`tests/cards/`** | A **evidência** de cada card, quando necessário, e os modelos. Não tem teste |
| **`tests/support/`** | A **caixa de ferramentas** compartilhada, para não reescrever a mesma coisa várias vezes |
| **`.github/workflows/`** | A receita do **robô do GitHub (CI)**: roda os testes sozinho a cada envio e mostra verde ou vermelho |
| **`scripts/`** | Utilitários de apoio, como a limpeza dos títulos de teste no HMG |

## Como ler as pastas de teste

```
tests / <camada> / <módulo> / <área>
         │           │          └─ a tela (ex.: venda-rapida)
         │           └─ o item do menu do sistema (ex.: vendas)
         └─ quando roda: smoke, regression ou api
```

Exemplo: `tests/regression/vendas/venda-rapida/` é o teste de **tela** (camada) do módulo **Vendas** (módulo) na tela **Venda Rápida** (área).

## Detalhes de cada parte

| Quero saber mais sobre... | Abro |
| --- | --- |
| as pastas de teste, tags e regras | [`tests/README.md`](../tests/README.md) |
| os módulos e áreas do sistema | [`docs/mapa-do-sistema.md`](./mapa-do-sistema.md) |
| o fluxo no Jira e no Git | [`docs/jira-fluxo-de-trabalho.md`](./jira-fluxo-de-trabalho.md), [`docs/git-fluxo-de-trabalho.md`](./git-fluxo-de-trabalho.md) |
| o que é cada termo | [`docs/glossario.md`](./glossario.md) |
