# Regressão: Configuração

Módulo **Configuração** do menu do sistema (`/config`). Teste de **tela**, tag `@regression`, nome `<assunto>.regression.spec.ts`.

## Outras áreas do módulo (sem pasta ainda: nasce com o primeiro teste)

| Área | Rota | Help |
| --- | --- | --- |
| Empresas | `/config/companies` | [Empresas](https://www.atualsistemas.net.br/solucoes/IntegraMais/Empresas.html) |
| Fiscal: CEST, CFOP, NCM, Regra de imposto | `/config/fiscal/*` | [Regradeimposto](https://www.atualsistemas.net.br/solucoes/IntegraMais/Regradeimposto.html) |
| Tributos: regime, enquadramento, benefício, fórmula, base de cálculo, natureza da receita, motivo de desoneração | `/config/tax/*` | [Regime](https://www.atualsistemas.net.br/solucoes/IntegraMais/Regime.html) |

Configuração de ambiente e fiscal. Em HMG, mexe em dado compartilhado: teste automatizado só em empresa de teste e com cuidado. Prioridade baixa para automação de tela.

**Situação:** ainda sem testes. Mapa completo do sistema: [`docs/mapa-do-sistema.md`](../../../docs/mapa-do-sistema.md). Convenção de pastas: [`../../README.md`](../../README.md).
