import { useFavoritesContext } from "../contexts/FavoritesContext";

// Hook wrapper para manter compatibilidade com a API existente
export const useFavorites = () => {
  return useFavoritesContext();
};