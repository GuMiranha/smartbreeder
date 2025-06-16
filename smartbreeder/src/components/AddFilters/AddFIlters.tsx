import React, { useState } from "react";
import "./AddFilters.css";
import type { Variacao } from "../../types";

interface AddFiltersProps {
  onApplyFilters: (filters: {
    minPrice: number | null;
    maxPrice: number | null;
    variacoes: {
      estoque?: string;
      cor?: string;
      voltagem?: string;
      tamanho?: string;
    };
  }) => void;
  availableColors: string[];
  availableSizes: string[];
  availableVoltages: string[];
  availableStocks: string[];
}

const AddFilters: React.FC<AddFiltersProps> = ({
  onApplyFilters,
  availableColors,
  availableSizes,
  availableVoltages,
  availableStocks,
}) => {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [variacoes, setVariacoes] = useState<{
    estoque?: string;
    cor?: string;
    voltagem?: string;
    tamanho?: string;
  }>({});

  const handleVariacaoChange = (field: keyof Variacao, value: string) => {
    setVariacoes((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters({ minPrice, maxPrice, variacoes });
  };

  const handleClearFilters = () => {
    setMinPrice(null);
    setMaxPrice(null);
    setVariacoes({});
    onApplyFilters({ minPrice: null, maxPrice: null, variacoes: {} });
  };

  const renderFilterSelect = (
    label: string,
    field: keyof Variacao,
    options: string[],
    value: string | undefined
  ) => (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <select
        className="filter-select"
        value={value || ""}
        onChange={(e) => handleVariacaoChange(field, e.target.value)}
        aria-label={`Selecione ${label.toLowerCase()}`}
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="add-filters-container">
      <h3 className="add-filters-title">Filtros Adicionais</h3>
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Preço</label>
          <div className="price-range">
            <input
              type="number"
              className="filter-input price-input"
              placeholder="Mín"
              value={minPrice || ""}
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : null)
              }
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              className="filter-input price-input"
              placeholder="Máx"
              value={maxPrice || ""}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : null)
              }
            />
          </div>
        </div>

        {renderFilterSelect(
          "Estoque",
          "estoque",
          availableStocks,
          variacoes.estoque
        )}
        {renderFilterSelect("Cor", "cor", availableColors, variacoes.cor)}
        {renderFilterSelect(
          "Tamanho",
          "tamanho",
          availableSizes,
          variacoes.tamanho
        )}
        {renderFilterSelect(
          "Voltagem",
          "voltagem",
          availableVoltages,
          variacoes.voltagem
        )}
      </div>

      <div className="filter-buttons">
        <button className="apply-filters-button" onClick={handleApplyFilters}>
          Aplicar Filtros
        </button>
        <button className="clear-filters-button" onClick={handleClearFilters}>
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};

export default AddFilters;
