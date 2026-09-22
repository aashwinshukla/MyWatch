import { useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import PageWrapper from '../components/layout/PageWrapper';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/ui/MovieCard';

function Search() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false); // false by default — nothing searched yet
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(''); // tracks what the user searched

  // This runs when SearchBar calls onSearch with a new query
  const handleSearch = async (searchQuery) => {
    // If query is empty, clear results and stop
    if (!searchQuery) {
      setMovies([]);
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

      {/* Loading state */}
      {loading && <div className="text-white text-center mt-20">Loading...</div>}

      {/* Error state */}
      {error && <div className="text-red-500 text-center mt-10">{error}</div>}

      {/* Empty state - before any search */}
      {!loading && !error && movies.length === 0 && !query && (
        <div className="text-zinc-400 text-center mt-20">Type something to search...</div>
      )}

      {/* Results */}
      {!loading && movies.length > 0 && (
        <>
          <h1 className="text-white text-2xl font-bold my-6">Results for "{query}"</h1>
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
