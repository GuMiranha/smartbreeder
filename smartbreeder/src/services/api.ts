import type { Categoria, Produto, Variacao } from "../types";
import { categorias, produtos } from "../mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {

  async getProdutos(): Promise<Produto[]> {
    await delay(1000); 
    return produtos;
  },


  async getCategorias(): Promise<Categoria[]> {
    await delay(800);
    return categorias;
  },

  async getProdutosPorCategoria(
    categoriaId: number | null
  ): Promise<Produto[]> {
    await delay(600); 
    if (categoriaId === null) {
      return produtos;
    }
    return produtos.filter(
      (produto) =>
        produto.categorias && produto.categorias.includes(categoriaId)
    );
  },

  async getUniqueVariations<T extends keyof Variacao>(
    field: T
  ): Promise<string[]> {
    await delay(300); 
    const uniqueValues = new Set<string>();
    produtos.forEach((produto) => {
      produto.variacao?.forEach((variation) => {
        const value = variation[field];
        if (typeof value === "string" && value) {
          uniqueValues.add(value);
        }
      });
    });
    return Array.from(uniqueValues).sort();
  },

  async getUniqueColors(): Promise<string[]> {
    return this.getUniqueVariations("cor");
  },

  async getUniqueSizes(): Promise<string[]> {
    return this.getUniqueVariations("tamanho");
  },

  async getUniqueVoltages(): Promise<string[]> {
    return this.getUniqueVariations("voltagem");
  },

  async getUniqueStocks(): Promise<string[]> {
    return this.getUniqueVariations("estoque");
  },
};
