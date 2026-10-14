# Roadmap do setor de QA (Atual Mais)

> **Em uma frase:** a fundação está pronta; o que falta é **dados e ambiente confiáveis**, **mais fluxos automatizados** e **fechar combinados com o time**. Atualizado em 13/10/2026.

## Onde estamos

| Pilar | Situação | O que já temos | O que falta |
| --- | --- | --- | --- |
| **1. Qualidade desde o início** | 🟡 parcial | Leitura do BDD e conferência do status real do card antes de testar | Ler o card **antes** do dev começar; participar do refinamento (a confirmar se o QA pode) |
| **2. Automação** | 🟡 base pronta, pouca cobertura | 10 testes: smoke (no CI), 1 fluxo de tela (Venda Rápida) e 8 de API (quitação). CI com smoke como gate, regressão a cada push e suíte noturna | Mais fluxos críticos; credenciais no CI (hoje o teste de tela é pulado); API fora do CI |
| **3. Métricas** | 🟡 base pronta | Doc, modelo de relatório e script ([`docs/metricas-qa.md`](./docs/metricas-qa.md)); linha de base de outubro calculada | Tempo de teste por card (precisa do histórico de status); primeira rotina mensal |
| **4. Engenharia de qualidade** | 🟡 parcial | Leitura do código do painel, captura de payloads, prova de causa por API | Acesso a banco (SQL), performance, segurança, logs |
| **5. Dados e ambiente** | 🔴 fraco | `.env` fora do Git, trava de HMG, prefixo `QA`, script de limpeza | HMG com 503 em 13/10; título quitado e pedido de teste não se apagam; ids fixos no código; sem gerador de dados nem rotina de reset |

## Próximos passos (em ordem)

| # | Foco | Por quê | Quem destrava |
| --- | --- | --- | --- |
| 1 | **Ambiente e dados:** estabilidade do HMG, rotina de limpeza, usuário dedicado `QA_AUTOMACAO` | sem isso nada se sustenta | time + supervisor |
| 2 | **Mais 3 a 5 fluxos críticos** (próximos do Venda Rápida: cliente cadastrado, desconto, pagamento parcial) e **credenciais no CI** | a regressão rodar de verdade a cada push | QA (depende do HMG) |
| 3 | **Métricas:** exportar o CSV todo mês, medir o tempo em Testando e fechar o significado dos demais status | mostra valor com pouco esforço | QA + supervisor |
| 4 | **Shift-left:** ler o BDD dos próximos cards antes do dev | pega furo de lógica antes de codar | supervisor |
| 5 | **SQL, performance, segurança e testes da API Pública** (Swagger em `/api/public`) | só depois que o resto estiver firme; a API Pública ainda não está habilitada na nossa empresa | time (acesso ao banco e habilitação da API) |

## Depende de outras pessoas

| Pendência | Com quem |
| --- | --- |
| Estabilidade e reset do HMG; limpeza dos dados de teste | time |
| Trocar a senha do `root` ou criar o `QA_AUTOMACAO` | você / time |
| O QA pode participar do refinamento? | supervisor |
| O CI bloqueia o código quando falha (proteção de branch)? | time |
| Fluxo de Parcial/Reprovado sem subtarefa | supervisor |
| Significado de Versão, Deploy, IMPEDIMENTO QA, Impedimento Dev e Negados | supervisor |
| Fechar o card na data real e ligar o Defeito ao card de origem | time |
| Acessos que faltam: Clockify, Clarity, certificado digital (a confirmar) | time |
| Liberar acesso de leitura ao banco (SQL) | time |

## O que falta, por tema

| Tema | Itens |
| --- | --- |
| **Mapeamento de risco** | listar os fluxos "caminho feliz" de cada módulo crítico; escolher 2 a 3 módulos que viram a base da regressão; definir a "Definição de Pronto" de QA |
| **Testes** | próximos casos do Venda Rápida (inclui impressão e limpeza dos pedidos de teste); 1 a 2 testes de regressão nos fluxos mais críticos; conferência no banco (SQL, só leitura) |
| **Processo** | critério de quando um teste de card entra em `regression/` (ex.: 2 ou mais regressões no mesmo fluxo); alerta de falha do CI (Slack, Teams ou e-mail); revisar o fluxo bug → card → teste → automação → CI depois de rodar de verdade |
| **Escalar (mês 2 a 3+)** | comparar escapes antes e depois do QA; revisão de código dos testes se o time crescer; expandir cobertura (Venda Rápida V1, mais módulos) ou aprofundar (carga, visual) |

## Já feito

| Área | Entregas |
| --- | --- |
| **Fundação** | ambientes e regra de uso (HMG → PREPROD → Produção); stack Playwright + TypeScript; repositório `romuloatual/atual_mais`; dados de teste fiscal documentados |
| **CI** | GitHub Actions (smoke como gate, regressão em push e PR, suíte às 03:00); relatório no GitHub Pages |
| **Organização** | `tests/` por camada, módulo e área; mapa do sistema; documento vivo de telas; README "Comece aqui" e glossário |
| **Jira** | fluxo de cards, tipos de item e modelos de comentário e de defeito; evidência por card em modelo único, conferida por `npm run check:evidencias` |
| **Automação** | login por API; 8 testes de API de quitação; teste de tela do Venda Rápida (fluxo feliz) |
| **Métricas** | doc, modelo mensal, script e linha de base de outubro |
| **Guia** | PDF de onboarding (v1.13) na identidade visual da empresa |

## Referências

- [Guia de onboarding (PDF)](./Guia_Onboarding_QA_Automacao_Atual_Mais.pdf) · [Convenção de testes](./tests/README.md) · [Workflow de CI](./.github/workflows/playwright.yml)
- Relatório publicado: https://romuloatual.github.io/atual_mais/

> Os prazos dependem da sua carga e do time. O que importa é a **ordem**: fundação antes de processo, processo antes de escalar a automação.
