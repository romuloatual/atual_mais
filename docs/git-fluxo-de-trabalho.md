# Como versionar e trabalhar com Git (setor de QA)

Guia curto do dia a dia. **Git** guarda o histórico dos nossos arquivos (evidências, testes, docs); o **GitHub** é a cópia
online, onde todo mundo vê o trabalho. Repositório: `romuloatual/atual_mais`.

## A regra em uma frase

> **Cada card tem a sua branch. O que serve a todos (docs, modelos, testes gerais, scripts) vai direto na `main`. O PR só abre quando o card termina. Depois de cada push na `main`, as branches de card abertas são atualizadas.**

| O que é | Onde vai | Por quê |
| --- | --- | --- |
| Validação e testes de um card (`tests/cards/INTG-XXXX-evidencias.md`) | branch `card/INTG-XXXX` | o trabalho do card fica isolado até ser concluído |
| Docs gerais (README, ROADMAP, `docs/`, templates, guia) | direto na `main` | todos precisam ter tudo, sem esperar um card |
| Testes e código de apoio (`tests/smoke`, `regression`, `api`, `support`, `scripts/`, CI) | direto na `main` | servem a todos os módulos e cards |

A evidência de um card (`INTG-XXXX-evidencias.md`) só chega à `main` quando o PR do card é aprovado; até lá ela existe **só na branch do card**.

**Palavras que aparecem:** *branch* = uma linha de trabalho separada; *commit* = uma "foto" salva do que mudou;
*push* = enviar os commits ao GitHub; *PR (pull request)* = pedido para juntar a branch na `main`.

## Passo a passo — um card novo

1. **Confira o número do card na URL do Jira** (ex.: `.../browse/INTG-2727`). Não use o primeiro número que aparece no
   texto do card: ele pode ser de uma dependência (já houve branch criada com o número errado).
2. Crie a branch a partir da `main` atualizada:

```bash
git checkout main && git pull
git checkout -b card/INTG-XXXX
```

3. Copie o modelo e preencha durante a validação: `tests/cards/TEMPLATE-evidencias.md` → `tests/cards/INTG-XXXX-evidencias.md`.
4. Salve o trabalho **várias vezes** (commit pequeno e frequente) e envie:

```bash
git add tests/cards/INTG-XXXX-evidencias.md
git commit -m "INTG-XXXX: o que foi feito, em uma linha"
git push -u origin card/INTG-XXXX
```

5. Ao concluir o card: confira o padrão, junte a `main` na sua branch e só então abra o PR:

```bash
npm run check:evidencias
git checkout main && git pull
git checkout card/INTG-XXXX && git merge main
git push
```

## Passo a passo — documentação geral (vai na `main`)

```bash
git checkout main && git pull
# edite o arquivo (README, docs/, templates...)
git add <arquivo>
git commit -m "Descrição curta do que mudou"
git push origin main
git checkout card/INTG-XXXX && git merge main    # traz a novidade para a branch do card
```

## Depois de cada push na `main`

1. **Confira o CI:** abra a aba **Actions** do GitHub e veja se o run do seu push ficou verde. Um run vermelho que ninguém olha vira rotina.
2. **Atualize as branches de card abertas** (merge da `main` em cada uma) e envie:

```bash
for b in card/INTG-1005 card/INTG-2676 card/INTG-2727; do   # as branches abertas
  git checkout $b && git merge origin/main && git push origin $b
done
git checkout main
npm run check:evidencias        # as evidências continuam no padrão?
```

Se der conflito, resolva mantendo os dois lados e rode `npm run check:evidencias` antes de enviar.

## Mensagem de commit

- Card: `INTG-XXXX: o que foi feito` (ex.: `INTG-2727: evidencias no modelo padrao`).
- Docs e testes gerais: `tipo: o que mudou`, sem o número do card. Tipos usados: `docs`, `test`, `feat`, `chore`, `refactor` (ex.: `test: quitacao por API com 6 casos`).
- Sem acentos nas mensagens evita caracteres quebrados em alguns terminais.

## Fazer e evitar

| Fazer | Evitar |
| --- | --- |
| `git status` antes de commitar e de dizer "feito" | Dizer que enviou sem conferir o `git status` |
| Commits pequenos, um assunto por commit | Um commit gigante no fim do card |
| `git merge main` na branch do card | **Rebase** em branch que já foi enviada (reescreve o histórico e atrapalha quem usa a branch) |
| Confirmar o autor (`git config user.name`) | Commitar com o usuário errado |
| Docs gerais direto na `main` | Deixar documentação geral presa na branch de um card |
| Nunca guardar senha, token ou credencial em arquivo versionado. Segredos ficam no `.env`, que o Git ignora (modelo: `.env.example`) | Colar dados reais de cliente em evidências (usar só dados de teste) |
| `git add` **pelo nome do arquivo** e conferir o `git status` antes do commit | `git add .` ou `git add -A` sem olhar o que entra (pode levar um segredo ou lixo) |
| Confirmar que o `.env` está ignorado: `git check-ignore -v .env` | Subir senha ou token "só por um minuto": o repositório é público e o histórico guarda tudo |
| Trocar de branch só com a árvore limpa (ou usar `git stash`) | Trocar de branch com alterações soltas |

## Quando algo dá errado

| Situação | O que significa | O que fazer |
| --- | --- | --- |
| `rejected ... fetch first` ou `non-fast-forward` | O GitHub tem commits que você ainda não tem | `git pull` (ou `git merge origin/main`), resolva e envie de novo |
| Conflito no merge (`<<<<<<<` no arquivo) | Duas pessoas mudaram o mesmo trecho | Abra o arquivo, deixe a versão certa, apague as marcas, `git add` e `git commit` |
| `Internal Server Error` / erro 500 no push | Falha do lado do GitHub, não sua | Espere uns minutos e repita; se persistir, veja githubstatus.com |
| Alterações soltas atrapalham a troca de branch | O Git protege o que você não salvou | `git stash` (guarda), troque de branch, `git stash pop` (devolve) |
| Commitei na branch errada | Acontece | Não force nada: peça ajuda antes de usar `reset` |
| Branch com nome errado | Número do card trocado | `git branch -m novo-nome` e atualize o remoto (peça ajuda se já foi enviada) |

## Comandos que mais usamos

| Comando | Para que serve |
| --- | --- |
| `git status` | ver o que mudou e em qual branch você está |
| `git branch --show-current` | mostrar só o nome da branch atual |
| `git log --oneline -5` | ver os últimos 5 commits |
| `git diff` | ver as mudanças ainda não salvas |
| `git pull` | trazer as novidades do GitHub |
| `git stash` / `git stash pop` | guardar e devolver alterações soltas |

> Em caso de dúvida **antes** de apagar, forçar ou reescrever algo: pare e pergunte. Comandos como `git push --force` e
> `git reset --hard` podem apagar trabalho de forma definitiva.
