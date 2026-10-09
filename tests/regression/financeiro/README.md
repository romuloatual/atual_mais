# Regressão: Financeiro

Fluxos críticos do módulo Financeiro pela **tela**: Contas a Receber, quitação e recibo. Cada spec usa a tag `@regression` e o nome `<assunto>.regression.spec.ts`.

**Situação:** ainda sem testes de tela. O contrato da quitação já é coberto por API em [`tests/api/financeiro/contas-a-receber/`](../../api/financeiro/contas-a-receber) (sob demanda, fora do CI).

**Organização:** uma pasta por área, criada com o primeiro teste dela (ex.: `contas-a-receber/`).

**Antes de escrever:**
- Regras e comportamento: [`docs/telas/contas-a-receber-quitacao.md`](../../../docs/telas/contas-a-receber-quitacao.md).
- Falhas conhecidas que valem teste: [`docs/falhas/`](../../../docs/falhas/README.md) (modal envia valor líquido, recibo com acréscimo como "Juros", criação duplicada).
- Título quitado não pode ser excluído (o servidor responde 400): teste de tela que quita deixa dado no HMG.

Convenção de pastas: [`../../README.md`](../../README.md).
