# Regressão: Cadastros

Módulo **Cadastros** do menu do sistema (`/records`). Teste de **tela**, tag `@regression`, nome `<assunto>.regression.spec.ts`.

## Áreas com pasta pronta

| Área | Rota | Prioridade | Primeiro alvo |
| --- | --- | --- | --- |
| [`produtos/`](./produtos) Produtos | `/records/products/products` | P2 | cadastrar um produto e vendê-lo no PDV |

## Outras áreas do módulo (sem pasta ainda: nasce com o primeiro teste)

| Área | Rota | Help |
| --- | --- | --- |
| Marcas, Grade, Grupo, Lista de preço, Serviços, Unidade de medida | `/records/products/*` | [Marcas](https://www.atualsistemas.net.br/solucoes/IntegraMais/Marcas.html) |
| Segurança: Funcionários, Perfil de usuário, Usuários | `/records/security/*` | [Usuarios](https://www.atualsistemas.net.br/solucoes/IntegraMais/Usuarios.html) |
| Cidades | `/records/general/cities` | [Cidades](https://www.atualsistemas.net.br/solucoes/IntegraMais/Cidades.html) |

**Situação:** ainda sem testes. Mapa completo do sistema: [`docs/mapa-do-sistema.md`](../../../docs/mapa-do-sistema.md). Convenção de pastas: [`../../README.md`](../../README.md).
