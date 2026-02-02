import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './shared/store';
import { ThemeProvider } from "./app/providers/ThemeProvider";

import App from "./app/App";
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Search from "./pages/Search";
import AllMovies from "./pages/AllMovies";
import Favorites from "./pages/Favorites";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<App /> }>
              <Route path="/" element={<Home />} />
              <Route path="/all-movies" element={<AllMovies />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="movie/:id" element={<Movie />} />
              <Route path="search" element={<Search />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
