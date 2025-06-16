import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Produto, FavoritoInfo, FavoritesContextType } from "../types";

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favoritos, setFavoritos] = useState<FavoritoInfo[]>(() => {
    try {
      const savedFavoritos = localStorage.getItem("favoritos");
      return savedFavoritos ? JSON.parse(savedFavoritos) : [];
    } catch (error) {
      console.error("Erro ao carregar favoritos do localStorage:", error);
      return [];
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    } catch (error) {
      console.error("Erro ao salvar favoritos no localStorage:", error);
    }
  }, [favoritos]);

  const toggleFavorito = useCallback(
    (produto: Produto, produtos: Produto[]) => {
      setFavoritos((prev) => {

        if (prev.some((f) => f.produtoId === produto.id)) {
          return prev.filter((f) => f.produtoId !== produto.id);
        }

        const categoriasCount = new Map<number, number>();
        produto.categorias.forEach((categoriaId) => {
          categoriasCount.set(categoriaId, 0);
        });

        prev.forEach((fav) => {
          const favProduto = produtos.find((p) => p.id === fav.produtoId);
          if (favProduto) {
            favProduto.categorias.forEach((categoriaId) => {
              if (categoriasCount.has(categoriaId)) {
                categoriasCount.set(
                  categoriaId,
                  (categoriasCount.get(categoriaId) || 0) + 1
                );
              }
            });
          }
        });

        const categoriasComLimite = Array.from(categoriasCount.entries())
          .filter(([, count]) => count >= 2)
          .map(([categoriaId]) => categoriaId);

        if (categoriasComLimite.length > 0) {

          const produtoParaRemover = prev.find((fav) => {
            const favProduto = produtos.find((p) => p.id === fav.produtoId);
            return favProduto?.categorias.some((catId) =>
              categoriasComLimite.includes(catId)
            );
          });

          if (produtoParaRemover) {

            return [
              ...prev.filter(
                (f) => f.produtoId !== produtoParaRemover.produtoId
              ),
              { produtoId: produto.id, timestamp: Date.now() },
            ];
          }
        }

        return [...prev, { produtoId: produto.id, timestamp: Date.now() }];
      });
    },
    []
  );

  const isFavorite = useCallback(
    (produtoId: number) => {
      return favoritos.some((f) => f.produtoId === produtoId);
    },
    [favoritos]
  );

  const getFavoritosCount = useCallback(() => {
    return favoritos.length;
  }, [favoritos]);

  const value = {
    favoritos,
    toggleFavorito,
    isFavorite,
    getFavoritosCount,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
