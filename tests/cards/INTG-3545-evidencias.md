# INTG-3545 — Validação manual

**Card:** `[DEFEITO] (Frontend) {Venda Rápida V2} Vr. Unitário maior gera desconto em vez de acréscimo`
https://integramais.atlassian.net/browse/INTG-3545

HMG, empresa `romulo`, PDV LOJA001, 05/10/2026. **Status:** o defeito **não reproduz** no HMG; aguardando retorno do time.

## O que o card diz

No modal "Desconto / Acréscimo por item", um Vr. Unitário com milhar (ex.: `1.800,00`) seria lido como `1,80`, e um valor **maior**
que o original geraria **desconto**. Esperado: maior calcula **Acréscimo**, menor calcula **Desconto**, com milhar como nos outros campos.

## Cenários (BDD)

Fluxo base: `/pdv-v2` > item `051` iPhone 11 (R$ 1.631,80, o preço do exemplo do card) > `Alt+P` > modal > informar o valor > Tab.
Executado por mim (navegador do Claude) e pelo Rômulo (Chrome), com o mesmo resultado.

| # | Tipo | Quando (Vr. Unitário) | Então | Obtido |
| --- | --- | --- | --- | --- |
| 1 | Feliz (defeito) | `1.800,00` | Acréscimo R$ 168,20 (10,31%), Total R$ 1.800,00 | ✅ não reproduz: acréscimo 168,20 (10,31%); carrinho +168,20 e R$ 1.800,00 |
| 2 | Regressão | `1.200,00` e `1200` | Desconto R$ 431,80 (26,46%) | ✅ |
| 3 | Borda | `999,99` e `1.000,00` | desconto correto | ✅ 631,81 e 631,80 (38,72%) |
| 4 | Borda | `10.000,00`, `10000`, `1.000.000,00` | acréscimo correto | ✅ 8.368,20 (512,82%) e 998.368,20 (61.182,02%) |
| 5 | Borda | igual ao original (`1.631,80`) | sem desconto nem acréscimo | ✅ |
| 6 | Negativo | `abc`, vazio, `0,00`, `-5,00` | barra ou trata | ⚠️ não barra: os três primeiros dão Total 0 e Desconto 100%; `-5,00` perde o sinal e vira `5,00` (desconto 99,69%) |
| 7 | Variação | `1800` e `1.800,5` | igual ao cenário 1 | ✅ 168,20 e 168,70 (10,34%) |
| 8 | Regressão | Vr. Acréscimo `1.000,00`; Vr. Desconto `1.000,00` | 61,28%; totais 2.631,80 e 631,80 | ✅ |
| 9 | Fim a fim | cenário 1, finalizar a venda | pagamento e impresso R$ 1.800,00 | Carrinho ✅; venda não finalizada |

Nota: os campos mostram valores sem decimais (`168,2`, `1.800`); o card espera `168,20` (só formatação).

## Pendências

- [ ] Time/dev: o HMG já tem a correção? O defeito foi visto em outro schema/versão (`company8`)? Pedir os passos exatos e o print do card.
- [ ] Item 6 (valor vazio, `abc`, `0,00` e negativo viram 100% de desconto sem aviso): perguntar se é o comportamento esperado.
- [ ] Cenário 9 (finalizar venda) se for preciso fechar fim a fim. Antes do PR: mesclar a `main` na branch do card.
