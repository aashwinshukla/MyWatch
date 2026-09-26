import { useState, useEffect } from 'react';
import { searchMovies } from '../api/omdb';
import { searchTMDB } from '../api/tmdb';
import { getRandomQuery } from '../utils/randomQuery';
import { useWatchlist } from '../context/WatchlistContext';
import SearchBar from '../components/ui/SearchBar';
import MovieCard from '../components/ui/MovieCard';
import PersonCard from '../components/ui/PersonCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageWrapper from '../components/layout/PageWrapper';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'search_state';

function Search() {
  useEffect(() => {
    document.title = 'Search — MyWatch';
  }, []);

  const getSavedState = () => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return { query: '', movies: [], people: [] };
  };

  const savedState = getSavedState();
  const [movies, setMovies] = useState(savedState.movies);
  const [people, setPeople] = useState(savedState.people || []);
  const [query, setQuery] = useState(savedState.query);
  const [loading, setLoading] = useState(savedState.movies.length === 0);

  // Load random movies on mount only if no saved state
  useEffect(() => {
    if (movies.length === 0) {
      searchMovies(getRandomQuery()).then(results => {
        if (results && results.length > 0) setMovies(results);
        setLoading(false);
      });
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (!loading && (movies.length > 0 || people.length > 0)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ query, movies, people }));
    }
  }, [query, movies, people, loading]);

  const handleSearch = async (searchQuery) => {
    // Empty query — reset to random discovery
    if (!searchQuery) {
      setQuery('');
      setLoading(true);
      setPeople([]);
      const results = await searchMovies(getRandomQuery());
      if (results && results.length > 0) setMovies(results);
      setLoading(false);
      return;
    }

    setQuery(searchQuery);
    setLoading(true);
    setPeople([]);

    const { movies: movieResults, people: peopleResults } = await searchTMDB(searchQuery);

    setPeople(peopleResults);

    if (!movieResults || movieResults.length === 0) {
      toast.error(`No results found for "${searchQuery}"`);
      setMovies([]);
    } else {
      setMovies(movieResults);
    }

    setLoading(false);
  };

  return (
    <PageWrapper>
      <SearchBar onSearch={handleSearch} initialQuery={query} />

      {loading && <LoadingSpinner />}

      {!loading && (movies.length > 0 || people.length > 0) && (
        <>
          {/* People section — only shows when searching by name */}
          {people.length > 0 && (
            <div className="mb-8 mt-6">
              <h2 className="text-white text-xl font-bold mb-4">People</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {people.map(person => (
                  <PersonCard key={person.tmdbID} person={person} />
                ))}
              </div>
            </div>
          )}

          {/* Movies & Shows section */}
          {movies.length > 0 && (
            <div className="mt-6">
              <h2 className="text-white text-xl font-bold mb-4">
                {query ? `Movies & Shows for "${query}"` : 'Discover'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map(movie => (
                  <MovieCard key={movie.imdbID} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}

export default Search;
