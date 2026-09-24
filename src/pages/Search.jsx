import { useState, useEffect } from 'react';
import SearchBar from '../components/ui/SearchBar';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/ui/MovieCard';
import { getRandomQuery } from '../utils/randomQuery';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'search_state';

function Search() {

  useEffect(() => {
    document.title = 'Search — MyWatch';
  }, []);

  // Initialize state from sessionStorage if available
  const getSavedState = () => {
    const savedState = sessionStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return { query: '', movies: [] };
  };

  const savedState = getSavedState();
  const [movies, setMovies] = useState(savedState.movies);
  const [loading, setLoading] = useState(savedState.movies.length === 0);
  
  const [query, setQuery] = useState(savedState.query);

  // Load random movies on mount only if no saved state
  useEffect(() => {
    if (movies.length === 0) {
      searchMovies(getRandomQuery()).then(results => {
        if (results && results.length > 0) setMovies(results);
        setLoading(false);
      });
    }
  }, []);

  // Save search state whenever it changes
  useEffect(() => {
    if (!loading && movies.length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ query, movies }));
    }
  }, [query, movies, loading]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) {
      setQuery('');
      setLoading(true);
      const results = await searchMovies(getRandomQuery());
      if (results && results.length > 0) setMovies(results);
      setLoading(false);
      return;
    }

    setQuery(searchQuery);
    setLoading(true);
    setError(null);

    const results = await searchMovies(searchQuery);

    if (!results || results.length === 0) {
      toast.error('No movies found for "'+searchQuery+'"');
      setMovies([]);
    } else {
      setMovies(results);
    }

    setLoading(false);
  };

  return (
    <PageWrapper>
      <SearchBar onSearch={handleSearch} initialQuery={query} />

      {loading && <LoadingSpinner />}


      {!loading && movies.length > 0 && (
        <>
          <h1 className="text-white text-2xl font-bold my-6">
            {query ? `Results for "${query}"` : 'Discover'}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </>
      )}
    </PageWrapper>
  );
}

export default Search;
