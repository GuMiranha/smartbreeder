import React, { useState } from "react";
import type { Produto } from "../../types";
import { ProductModal } from "./../ProductModal/ProductModal";
import "./ProductCard.css";

interface ProductCardProps {
  produto: Produto;
  isFavorite: boolean;
  onToggleFavorite: (produtoId: number) => void;
  filters: {
    minPrice: number | null;
    maxPrice: number | null;
    variacoes: {
      estoque?: string;
      cor?: string;
      voltagem?: string;
      tamanho?: string;
    };
  };
}

const formatarNome = (nome: string | null): string =>
  nome || "Nome desconhecido";
const formatarDescricao = (descricao: string | null): string =>
  descricao || "Descrição não disponível";
const formatarPreco = (preco: string | number | null): string => {
  if (preco === null) return "Preço não disponível";
  const precoNumero = typeof preco === "string" ? parseFloat(preco) : preco;
  return `R$ ${precoNumero.toFixed(2)}`;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  produto,
  isFavorite,
  onToggleFavorite,
  filters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".favorite-button")) return;
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="product-card" onClick={handleCardClick}>
        <div className="product-image-placeholder" />
        <div className="product-info">
          <h3>{formatarNome(produto.nome)}</h3>
          <p className="description">{formatarDescricao(produto.descricao)}</p>
          <p className="price">{formatarPreco(produto.preco)}</p>
        </div>
        <button
          className={`favorite-button ${isFavorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(produto.id);
          }}
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <ProductModal
        produto={produto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        filters={filters}
      />
    </>
  );
};
