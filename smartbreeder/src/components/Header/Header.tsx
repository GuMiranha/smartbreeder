import React, { memo } from "react";
import { useFavorites } from "../../contexts/FavoritesContext";
import "./Header.css";

interface HeaderProps {
  activeTab: "produtos" | "favoritos";
  onTabChange: (tab: "produtos" | "favoritos") => void;
}

export const Header: React.FC<HeaderProps> = memo(
  ({ activeTab, onTabChange }) => {
    const { getFavoritosCount } = useFavorites();
    const favoritosCount = getFavoritosCount();

    return (
      <header className="app-header">
        <div className="header-content">
          <h1>Lista de Produtos</h1>
          <div className="favorites-counter">
            <span className="favorites-icon">★</span>
            <span className="favorites-count">{favoritosCount}</span>
          </div>
        </div>
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "produtos" ? "active" : ""}`}
            onClick={() => onTabChange("produtos")}
          >
            Produtos
          </button>
          <button
            className={`tab-button ${
              activeTab === "favoritos" ? "active" : ""
            }`}
            onClick={() => onTabChange("favoritos")}
          >
            Favoritos
          </button>
        </div>
      </header>
    );
  }
);
