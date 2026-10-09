import type { Locator, Page } from '@playwright/test';

// Mapa da tela Venda Rápida V2 (/pdv-v2). Só ações e leituras; a conferência fica no teste.
// Obs.: vários botões dessa tela são elementos genéricos (não "button"), por isso o texto é a referência.
export class VendaRapidaPage {
  constructor(private readonly page: Page) {}

  async abrir() {
    await this.page.goto('/pdv-v2');
    await this.campoProduto().waitFor();
  }

  campoProduto(): Locator {
    return this.page.locator('#code');
  }

  // Digita o SKU e dá Enter: a tela carrega o produto e já o adiciona ao carrinho.
  async adicionarProduto(sku: string) {
    await this.campoProduto().fill(sku);
    await this.campoProduto().press('Enter');
  }

  itemNoCarrinho(nome: RegExp): Locator {
    return this.page.getByText(nome).first();
  }

  // Só aperta END depois que o item entrou no carrinho (senão a tecla se perde).
  async esperarItens(quantidade: number) {
    await this.page.getByText(`Itens: ${String(quantidade).padStart(2, '0')}`).waitFor();
  }

  // Tecla END abre o pagamento (cliente e vendedor já vêm das configurações padrões).
  async irParaPagamento() {
    await this.page.keyboard.press('End');
    await this.page.getByText('Adicionar Pagamento').first().waitFor();
  }

  // No modal escolhe Dinheiro; o valor já vem preenchido com o total.
  async pagarEmDinheiro() {
    await this.page.getByText('Dinheiro', { exact: true }).first().click();
    await this.page.getByText('Valor (R$)').waitFor();
    await this.page.getByText('Confirmar', { exact: true }).click();
    await this.page.getByText('Finalizar Venda').waitFor();
  }

  // O botão "Finalizar Venda" (atalho END) abre o popup que pergunta o tipo de faturamento.
  async finalizarFaturandoOutros() {
    await this.page.getByText('Finalizar Venda').click();
    await this.page.getByText('Faturar (Outros)').click();
  }

  // O texto aparece em dois elementos do mesmo popup; o diálogo é a referência única.
  popupFaturado(): Locator {
    return this.page.getByRole('dialog', { name: 'Faturamento realizado com sucesso' });
  }

  // Fecha o popup "Deseja imprimir o pedido?" sem imprimir.
  async fecharSemImprimir() {
    await this.popupFaturado().getByRole('button', { name: 'Cancelar' }).click();
  }
}
