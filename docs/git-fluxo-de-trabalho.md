# Como versionar e trabalhar com Git (setor de QA)

> **Em uma frase:** cada card tem a sua branch; o que serve a todos vai direto na `main`; o PR só abre quando o card termina; e, depois de cada push na `main`, você confere o CI e atualiza as branches de card abertas.

**Git** guarda o histórico dos arquivos (evidências, testes, docs). O **GitHub** é a cópia online: `romuloatual/atual_mais`.

| Palavra | Quer dizer |
| --- | --- |
| *branch* | uma linha de trabalho separada |
| *commit* | uma "foto" salva do que mudou |
| *push* | enviar os commits ao GitHub |
| *PR* (pull request) | pedido para juntar a branch na `main` |

## Onde cada coisa vai

| O que é | Onde vai |
| --- | --- |
| Evidência e testes de um card (`tests/cards/INTG-XXXX-evidencias.md`) | branch `card/INTG-XXXX`; só chega à `main` quando o PR é aprovado |
| Docs gerais (README, ROADMAP, `docs/`, templates, guia) | direto na `main` |
| Testes e apoio (`smoke`, `regression`, `api`, `support`, `scripts/`, CI) | direto na `main` |

## Um card novo

| # | O que fazer |
| --- | --- |
| 1 | **Confira o número do card na URL do Jira** (`.../browse/INTG-2727`), não o primeiro número do texto: pode ser de uma dependência (já houve branch com o número errado) |
| 2 | Crie a branch a partir da `main` atualizada |
| 3 | Copie `TEMPLATE-evidencias.md` para `tests/cards/INTG-XXXX-evidencias.md` e preencha durante a validação |
| 4 | Salve com commits **pequenos e frequentes** e envie |
| 5 | Ao concluir: rode o conferidor, junte a `main` na branch e só então abra o PR |

```bash
# passo 2
git checkout main && git pull
git checkout -b card/INTG-XXXX

# passo 4
git add tests/cards/INTG-XXXX-evidencias.md
git commit -m "INTG-XXXX: o que foi feito, em uma linha"
git push -u origin card/INTG-XXXX

# passo 5
npm run check:evidencias
git checkout main && git pull
git checkout card/INTG-XXXX && git merge main
git push
```

## Documentação geral (vai na `main`)

```bash
git checkout main && git pull
# edite o arquivo (README, docs/, templates...)
git add <arquivo>
git commit -m "docs: o que mudou"
git push origin main
```

## Depois de cada push na `main`

| # | O que fazer |
| --- | --- |
| 1 | **Conferir o CI:** aba **Actions** do GitHub; o run do seu push deve ficar verde. Run vermelho que ninguém olha vira rotina |
| 2 | **Atualizar as branches de card abertas** (merge da `main` em cada uma) e enviar |
| 3 | `npm run check:evidencias`: as evidências continuam no padrão? |

```bash
for b in card/INTG-1005 card/INTG-2676; do   # liste aqui as branches abertas
  git checkout $b && git merge origin/main && git push origin $b
done
git checkout main
```

Se der conflito, mantenha os dois lados e rode `npm run check:evidencias` antes de enviar.

## Mensagem de commit

| Tipo de trabalho | Formato | Exemplo |
| --- | --- | --- |
| Card | `INTG-XXXX: o que foi feito` | `INTG-2727: evidencias no modelo padrao` |
| Docs e testes gerais | `tipo: o que mudou` (`docs`, `test`, `feat`, `chore`, `refactor`) | `test: quitacao por API com 6 casos` |

Sem acentos nas mensagens evita caracteres quebrados em alguns terminais.

## Fazer e evitar

| Fazer | Evitar |
| --- | --- |
| `git status` antes de commitar e de dizer "feito" | dizer que enviou sem conferir |
| commits pequenos, um assunto por commit | um commit gigante no fim do card |
| `git merge main` na branch do card | **rebase** em branch já enviada (reescreve o histórico) |
| `git add` **pelo nome do arquivo** | `git add .` ou `-A` sem olhar o que entra |
| confirmar o autor (`git config user.name`) | commitar com o usuário errado |
| segredos só no `.env`, que o Git ignora (modelo: `.env.example`); conferir com `git check-ignore -v .env` | subir senha ou token "só por um minuto": o repositório é público e o histórico guarda tudo |
| só dados de teste nas evidências | dados reais de cliente |
| trocar de branch com a árvore limpa (ou `git stash`) | trocar com alterações soltas |

## Quando algo dá errado

| Situação | O que fazer |
| --- | --- |
| `rejected ... fetch first` ou `non-fast-forward` (o GitHub tem commits que você não tem) | `git pull` (ou `git merge origin/main`), resolva e envie de novo |
| conflito no merge (`<<<<<<<` no arquivo) | deixe a versão certa, apague as marcas, `git add` e `git commit` |
| erro 500 no push | falha do GitHub: espere uns minutos e repita; veja githubstatus.com |
| alterações soltas atrapalham a troca de branch | `git stash`, troque de branch, `git stash pop` |
| commitei na branch errada | não force nada: peça ajuda antes de usar `reset` |
| branch com nome errado | `git branch -m novo-nome` e atualize o remoto (peça ajuda se já foi enviada) |

## Comandos que mais usamos

| Comando | Serve para |
| --- | --- |
| `git status` | ver o que mudou e em qual branch você está |
| `git branch --show-current` | mostrar só o nome da branch |
| `git log --oneline -5` | ver os últimos 5 commits |
| `git diff` | ver as mudanças ainda não salvas |
| `git pull` | trazer as novidades do GitHub |
| `git stash` / `git stash pop` | guardar e devolver alterações soltas |

> Na dúvida **antes** de apagar, forçar ou reescrever algo: pare e pergunte. `git push --force` e `git reset --hard` podem apagar trabalho de forma definitiva.
