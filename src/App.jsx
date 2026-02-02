import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <div className="app-container">
          <Navbar />
          <Outlet />
        </div>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
