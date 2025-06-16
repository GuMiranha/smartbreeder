import React from "react";
import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log("SearchBar - Novo valor:", newValue);
    onChange(newValue);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={value}
        onChange={handleChange}
        className="search-input"
      />
      {value && (
        <button
          className="clear-search"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
        >
          ×
        </button>
      )}
    </div>
  );
};
