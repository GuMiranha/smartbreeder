import React from "react";
import type { Categoria } from "../../types";
import "./CategoryFilter.css";

interface CategoryFilterProps {
  categories: Categoria[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="category-filter">
      <h3>Categorias</h3>
      <div className="category-list">
        <button
          className={`category-button ${
            selectedCategory === null ? "active" : ""
          }`}
          onClick={() => onCategorySelect(null)}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            {category.nome}
          </button>
        ))}
      </div>
    </div>
  );
};
