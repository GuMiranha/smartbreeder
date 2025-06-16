import type { Produto, Categoria } from "./types";
import produtosData from "../src/data/produtos_com_variacoes.json";
import categoriasData from "../src/data/categorias.json";

export const produtos: Produto[] = produtosData as Produto[];
export const categorias: Categoria[] = categoriasData as Categoria[];