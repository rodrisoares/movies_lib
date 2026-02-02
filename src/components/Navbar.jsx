import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BiCameraMovie, BiSearchAlt2, BiStar, BiMovie, BiHeart, BiSun, BiMoon } from "react-icons/bi";
import { useTheme } from "../contexts/ThemeContext";
import SearchSuggestions from "./SearchSuggestions";

import "./Navbar.css";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("featured"); // "featured", "all" ou "favorites"
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);
  
  const { theme, toggleTheme } = useTheme();

  // URL e API key para busca de sugestões
  const searchURL = import.meta.env.VITE_SEARCH;
  const apiKey = import.meta.env.VITE_API_KEY;

  // Função para buscar sugestões
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    
    try {
      const params = new URLSearchParams();
      params.append('api_key', apiKey);
      params.append('query', encodeURIComponent(query.trim()));
      params.append('language', 'pt-BR');
      params.append('page', '1');

      const url = `${searchURL.replace(/\/$/, '')}?${params.toString()}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`Falha na requisição: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      const results = data.results.slice(0, 5); // Limitar a 5 sugestões
      
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Erro ao buscar sugestões:', err);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Efeito para buscar sugestões com debounce
  useEffect(() => {
    if (search.trim().length > 0) {
      // Limpar timeout anterior
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }

      // Configurar novo timeout
      suggestionTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(search);
      }, 300); // 300ms de delay para evitar muitas requisições
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Cleanup
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [search]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determina a tab ativa baseada na URL
  useEffect(() => {
    if (location.pathname === "/all-movies") {
      setActiveTab("all");
    } else if (location.pathname === "/favorites") {
      setActiveTab("favorites");
    } else if (location.pathname === "/" || location.pathname === "/search") {
      // Tanto a home quanto a search (sem query) mostram filmes em destaque
      setActiveTab("featured");
    }
  }, [location]);

  // Sincroniza o input com a query da URL quando estiver na página de busca
  useEffect(() => {
    if (location.pathname === "/search") {
      const urlParams = new URLSearchParams(location.search);
      const query = urlParams.get("q") || "";
      setSearch(query);
    } else {
      // Limpa o input quando sair da página de busca
      setSearch("");
    }
  }, [location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      navigate("/all-movies");
    } else if (tab === "favorites") {
      navigate("/favorites");
    } else {
      navigate("/");
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSuggestionSelect = (movie) => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/movie/${movie.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      // Se o input estiver vazio, vai para a página de busca sem query
      setSearch("");
      navigate("/search", { replace: true });
      return;
    }

    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(search)}`, { replace: true });
  };

  return (
    <nav id="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <h2>
            <Link to="/">
              <BiCameraMovie /> MoviesLib
            </Link>
          </h2>
        </div>
        
        {/* Tabs de navegação */}
        <div className="movie-tabs">
          <button 
            className={`tab-button ${activeTab === "featured" ? "active" : ""}`}
            onClick={() => handleTabChange("featured")}
          >
            <BiStar /> Filmes em destaque
          </button>
          <button 
            className={`tab-button ${activeTab === "all" ? "active" : ""}`}
            onClick={() => handleTabChange("all")}
          >
            <BiMovie /> Todos os filmes
          </button>
          <button 
            className={`tab-button ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => handleTabChange("favorites")}
          >
            <BiHeart /> Favoritos
          </button>
        </div>
      </div>
      
      <div className="search-container" ref={searchInputRef}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Pesquisar filme"
            onChange={handleInputChange}
            value={search}
            onFocus={() => search.trim() && setShowSuggestions(true)}
          />
          {search && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => {
                setSearch('');
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              title="Limpar pesquisa"
            >
              ×
            </button>
          )}
          <button type="submit">
            <BiSearchAlt2 />
          </button>
        </form>
        <SearchSuggestions 
          suggestions={suggestions} 
          isVisible={showSuggestions && !isLoadingSuggestions} 
          onSelectSuggestion={handleSuggestionSelect} 
        />
      </div>
      
      <button 
        className="theme-toggle-btn"
        onClick={toggleTheme}
        title={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      >
        {theme === 'light' ? <BiMoon /> : <BiSun />}
      </button>
    </nav>
  );
};

export default Navbar;