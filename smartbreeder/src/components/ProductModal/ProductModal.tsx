import React from "react";
import type { Produto } from "../../types";
import "./ProductModal.css";

interface ProductModalProps {
  produto: Produto;
  isOpen: boolean;
  onClose: () => void;
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
const formatarVariacao = (
  valor: string | number | null,
  label: string
): string => (valor !== null ? valor.toString() : `${label} não disponível`);

export const ProductModal: React.FC<ProductModalProps> = ({
  produto,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  filters,
}) => {
  if (!isOpen) return null;

  const filteredVariations = produto.variacao?.filter((variacao) => {
    const { estoque, cor, voltagem, tamanho } = filters.variacoes;
    return (
      (!estoque || variacao.estoque === estoque) &&
      (!cor || variacao.cor === cor) &&
      (!voltagem || variacao.voltagem === voltagem) &&
      (!tamanho || variacao.tamanho === tamanho)
    );
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{formatarNome(produto.nome)}</h2>
          <button
            className={`favorite-button ${isFavorite ? "active" : ""}`}
            onClick={() => onToggleFavorite(produto.id)}
            aria-label={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            {isFavorite ? "★" : "☆"}
          </button>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="product-details">
            <p className="description">
              {formatarDescricao(produto.descricao)}
            </p>
            <p className="price">{formatarPreco(produto.preco)}</p>
          </div>

          {filteredVariations && filteredVariations.length > 0 ? (
            <div className="variations">
              <h3>Variações disponíveis:</h3>
              {filteredVariations.map((variacao, index) => (
                <div key={index} className="variation">
                  <p>
                    Vendedor: {formatarVariacao(variacao.vendedor, "Vendedor")}
                  </p>
                  <p>
                    Fabricante:{" "}
                    {formatarVariacao(variacao.fabricante, "Fabricante")}
                  </p>
                  <p>Cor: {formatarVariacao(variacao.cor, "Cor")}</p>
                  <p>
                    Voltagem: {formatarVariacao(variacao.voltagem, "Voltagem")}
                  </p>
                  <p>
                    Tamanho: {formatarVariacao(variacao.tamanho, "Tamanho")}
                  </p>
                  <p>
                    Garantia: {formatarVariacao(variacao.garantia, "Garantia")}
                  </p>
                  {variacao.peso && (
                    <p>Peso: {formatarVariacao(variacao.peso, "Peso")}</p>
                  )}
                  {variacao.dimensoes && (
                    <p>
                      Dimensões:{" "}
                      {formatarVariacao(variacao.dimensoes, "Dimensões")}
                    </p>
                  )}
                  <p>
                    Estoque:{" "}
                    {variacao.estoque === "sim" ? "Disponível" : "Indisponível"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="variations">
              <h3>Nenhuma variação disponível com os filtros selecionados.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
