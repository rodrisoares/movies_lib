import { Outlet } from "react-router-dom";
import Navbar from "../features/ui/layout/Navbar";
import { FavoritesProvider } from "./providers/FavoritesProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

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
