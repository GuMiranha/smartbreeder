import { useState, useEffect } from "react";
import { ProductCard } from "./components/ProductCard/ProductCard";
import { CategoryFilter } from "./components/CategoryFilter/CategoryFilter";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { Header } from "./components/Header/Header";
import AddFilters from "./components/AddFilters/AddFIlters";
import { FavoritesProvider, useFavorites } from "./contexts/FavoritesContext";
import type { Categoria, Produto } from "./types";
import { api } from "./services/api";
import "./App.css";

type Tab = "produtos" | "favoritos";

const ITEMS_PER_PAGE = 12;

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("produtos");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<{
    minPrice: number | null;
    maxPrice: number | null;
    variacoes: {
      estoque?: string;
      cor?: string;
      voltagem?: string;
      tamanho?: string;
    };
  }>({
    minPrice: null,
    maxPrice: null,
    variacoes: {},
  });
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableVoltages, setAvailableVoltages] = useState<string[]>([]);
  const [availableStocks, setAvailableStocks] = useState<string[]>([]);

  const { favoritos, toggleFavorito, isFavorite } = useFavorites();

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await api.getCategorias();
        setCategorias(data);  

        setSelectedCategory(null);
      } catch (err) {
        setError("Erro ao carregar categorias");
        console.error(err);
      }
    };

    const loadVariationOptions = async () => {
      try {
        const [colors, sizes, voltages, stocks] = await Promise.all([
          api.getUniqueColors(),
          api.getUniqueSizes(),
          api.getUniqueVoltages(),
          api.getUniqueStocks(),
        ]);
        setAvailableColors(colors);
        setAvailableSizes(sizes);
        setAvailableVoltages(voltages);
        setAvailableStocks(stocks);
      } catch (err) {
        console.error("Erro ao carregar opções de variação:", err);
      }
    };

    loadCategorias();
    loadVariationOptions();
  }, []);

  useEffect(() => {
    const loadProdutos = async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        const data = await api.getProdutosPorCategoria(selectedCategory);
        setProdutos(data);
        setHasMore(data.length > ITEMS_PER_PAGE);
      } catch (err) {
        setError("Erro ao carregar produtos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProdutos();
  }, [selectedCategory]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const filtrarProdutos = (produtos: Produto[]) => {
    const searchTermLower = searchTerm.toLowerCase().trim();

    return produtos.filter((produto) => {
      const nomeMatch =
        searchTerm === "" ||
        (produto.nome === null && searchTermLower.startsWith("n")) ||
        (produto.nome?.toLowerCase().includes(searchTermLower) ?? false);

      const categoriaMatch =
        selectedCategory === null ||
        produto.categorias.includes(selectedCategory);

      const preco =
        typeof produto.preco === "string"
          ? parseFloat(produto.preco)
          : produto.preco;
      const precoMatch =
        (filters.minPrice === null ||
          (preco !== null && preco >= filters.minPrice)) &&
        (filters.maxPrice === null ||
          (preco !== null && preco <= filters.maxPrice));

      const variacoesMatch =
        produto.variacao?.some((variacao) => {
          return (
            (!filters.variacoes.estoque ||
              variacao.estoque === filters.variacoes.estoque) &&
            (!filters.variacoes.cor ||
              variacao.cor === filters.variacoes.cor) &&
            (!filters.variacoes.voltagem ||
              variacao.voltagem === filters.variacoes.voltagem) &&
            (!filters.variacoes.tamanho ||
              variacao.tamanho === filters.variacoes.tamanho)
          );
        }) ?? true;

      return nomeMatch && categoriaMatch && precoMatch && variacoesMatch;
    });
  };

  const produtosFiltrados = filtrarProdutos(
    activeTab === "favoritos"
      ? produtos.filter((produto) =>
          favoritos.some(
            (f: { produtoId: number }) => f.produtoId === produto.id
          )
        )
      : produtos
  );

  const produtosPaginados = produtosFiltrados.slice(0, page * ITEMS_PER_PAGE);
  const temMaisProdutos = produtosPaginados.length < produtosFiltrados.length;

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="app-content">
        <aside className="sidebar">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            categories={categorias}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          <AddFilters
            onApplyFilters={handleApplyFilters}
            availableColors={availableColors}
            availableSizes={availableSizes}
            availableVoltages={availableVoltages}
            availableStocks={availableStocks}
          />
        </aside>
        <main className="products-grid">
          {loading && page === 1 ? (
            <div className="loading">Carregando produtos...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : produtosFiltrados.length === 0 ? (
            <div className="no-products">
              {activeTab === "favoritos"
                ? "Nenhum produto favoritado"
                : searchTerm
                ? "Nenhum produto encontrado para esta busca"
                : "Nenhum produto encontrado"}
            </div>
          ) : (
            <>
              {produtosPaginados.map((produto) => (
                <ProductCard
                  key={produto.id}
                  produto={produto}
                  isFavorite={isFavorite(produto.id)}
                  onToggleFavorite={() => toggleFavorito(produto, produtos)}
                  filters={filters}
                />
              ))}
              {temMaisProdutos && (
                <button onClick={loadMore} className="load-more">
                  Carregar mais
                </button>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <AppContent />
    </FavoritesProvider>
  );
}

export default App;
