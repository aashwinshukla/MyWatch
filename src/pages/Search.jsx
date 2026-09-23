import { useState, useEffect } from 'react';
import SearchBar from '../components/ui/SearchBar';
import PageWrapper from '../components/layout/PageWrapper';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/ui/MovieCard';
import { getRandomQuery } from '../utils/randomQuery';

const STORAGE_KEY = 'search_state';

function Search() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // Restore search state or load random movies on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem(STORAGE_KEY);
    
    if (savedState) {
      // Restore previous search
      const { query: savedQuery, movies: savedMovies } = JSON.parse(savedState);
      setQuery(savedQuery);
      setMovies(savedMovies);
      setLoading(false);
    } else {
      // Load random movies
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
      setError('No movies found');
      setMovies([]);
    } else {
      setMovies(results);
    }

    setLoading(false);
  };

  return (
    <PageWrapper>
      <SearchBar onSearch={handleSearch} />

      {loading && <div className="text-white text-center mt-20">Loading...</div>}
      {error && <div className="text-red-500 text-center mt-10">{error}</div>}

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
