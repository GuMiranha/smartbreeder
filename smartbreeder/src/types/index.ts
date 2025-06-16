export interface Categoria {
  id: number;
  nome: string;
}

export interface Variacao {
  estoque: string;
  vendedor: string;
  fabricante: string;
  cor: string;
  voltagem: string;
  tamanho: string;
  garantia: string;
  peso: string | null;
  dimensoes: string | null;
}

export interface Produto {
  id: number;
  nome: string | null;
  descricao: string | null;
  preco: string | number | null;
  estoque: number;
  categorias: number[];
  variacao: Variacao[] | null;
}

export interface FavoritoInfo {
  produtoId: number;
  timestamp: number;
}

export interface FavoritesContextType {
  favoritos: FavoritoInfo[];
  toggleFavorito: (produto: Produto, produtos: Produto[]) => void;
  isFavorite: (produtoId: number) => boolean;
  getFavoritosCount: () => number;
}

export interface ProductCardProps {
  produto: Produto;
  isFavorite: boolean;
  onToggleFavorite: (produtoId: number) => void;
}

export interface ProductModalProps {
  produto: Produto;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (produtoId: number) => void;
}

export interface CategoryFilterProps {
  categories: Categoria[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface HeaderProps {
  activeTab: "produtos" | "favoritos";
  onTabChange: (tab: "produtos" | "favoritos") => void;
}
