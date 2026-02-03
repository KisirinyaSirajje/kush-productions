'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, Film, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/lib/api/client';

interface SearchResult {
  id: string;
  title: string;
  type: 'movie' | 'food';
  image: string;
  price?: number;
  genre?: string;
  category?: string;
  rating?: number;
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  type?: 'all' | 'movies' | 'foods';
}

export default function EnhancedSearch({ 
  placeholder = 'Search movies, foods...', 
  onSearch,
  type = 'all'
}: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trending, setTrending] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fetch trending items
  useEffect(() => {
    fetchTrending();
  }, [type]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTrending = async () => {
    try {
      let trendingItems: SearchResult[] = [];

      if (type === 'all' || type === 'movies') {
        const moviesRes = await apiClient.get('/api/movies');
        const moviesData = moviesRes.data;
        const topMovies = moviesData.movies
          .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3)
          .map((m: any) => ({
            id: m.id,
            title: m.title,
            type: 'movie' as const,
            image: m.posterUrl,
            price: m.price,
            genre: m.genre,
            rating: m.rating,
          }));
        trendingItems = [...trendingItems, ...topMovies];
      }

      if (type === 'all' || type === 'foods') {
        const foodsRes = await apiClient.get('/api/foods');
        const foodsData = foodsRes.data;
        const topFoods = foodsData.foods
          .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3)
          .map((f: any) => ({
            id: f.id,
            title: f.name,
            type: 'food' as const,
            image: f.imageUrl,
            price: f.price,
            category: f.category,
            rating: f.rating,
          }));
        trendingItems = [...trendingItems, ...topFoods];
      }

      setTrending(trendingItems);
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      let searchResults: SearchResult[] = [];

      if (type === 'all' || type === 'movies') {
        const moviesRes = await apiClient.get('/api/movies');
        const moviesData = moviesRes.data;
        const movieResults = moviesData.movies
          .filter((m: any) => 
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.genre?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
          .map((m: any) => ({
            id: m.id,
            title: m.title,
            type: 'movie' as const,
            image: m.posterUrl,
            price: m.price,
            genre: m.genre,
            rating: m.rating,
          }));
        searchResults = [...searchResults, ...movieResults];
      }

      if (type === 'all' || type === 'foods') {
        const foodsRes = await apiClient.get('/api/foods');
        const foodsData = foodsRes.data;
        const foodResults = foodsData.foods
          .filter((f: any) => 
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.category?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
          .map((f: any) => ({
            id: f.id,
            title: f.name,
            type: 'food' as const,
            image: f.imageUrl,
            price: f.price,
            category: f.category,
            rating: f.rating,
          }));
        searchResults = [...searchResults, ...foodResults];
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);

    // Debounce search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(value);
      if (onSearch) onSearch(value);
    }, 300);
  };

  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleResultClick = (result: SearchResult) => {
    saveSearch(query);
    setIsOpen(false);
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2.5 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              if (onSearch) onSearch('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-50 max-h-[500px] overflow-y-auto">
          {query && results.length > 0 ? (
            /* Search Results */
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                Search Results ({results.length})
              </div>
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.type === 'movie' ? `/movies/${result.id}` : `/foods/${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    {result.image ? (
                      <Image
                        src={result.image}
                        alt={result.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {result.type === 'movie' ? '🎬' : '🍔'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {result.type === 'movie' ? (
                        <Film className="w-4 h-4 text-purple-500" />
                      ) : (
                        <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                      )}
                      <h4 className="font-medium text-sm truncate">{result.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {result.type === 'movie' ? result.genre : result.category}
                      </span>
                      {result.rating && (
                        <span className="text-xs text-yellow-600">
                          ⭐ {result.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  {result.price && (
                    <div className="text-sm font-semibold text-primary">
                      UGX {result.price.toLocaleString()}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : query && !loading && results.length === 0 ? (
            /* No Results */
            <div className="p-8 text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No results found for &quot;{query}&quot;</p>
            </div>
          ) : (
            /* Recent Searches & Trending */
            <div className="p-2">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}

              {trending.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground px-3 py-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending Now
                  </div>
                  {trending.map((item) => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={item.type === 'movie' ? `/movies/${item.id}` : `/foods/${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {item.type === 'movie' ? '🎬' : '🍔'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {item.type === 'movie' ? (
                            <Film className="w-4 h-4 text-purple-500" />
                          ) : (
                            <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                          )}
                          <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        </div>
                        {item.rating && (
                          <span className="text-xs text-yellow-600">
                            ⭐ {item.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="p-8 text-center text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
