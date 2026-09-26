import { useState, useEffect } from 'react';
import SearchBar from '../components/ui/SearchBar';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/ui/MovieCard';
import { getRandomQuery } from '../utils/randomQuery';
import toast from 'react-hot-toast';
import { searchTMDB } from '../api/tmdb';
import PersonCard from '../components/ui/PersonCard';
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
    return { query: '', movies: [], people: [] };
  };

  const savedState = getSavedState();
  const [movies, setMovies] = useState(savedState.movies);
  const [loading, setLoading] = useState(savedState.movies.length === 0);
  const [people, setPeople] = useState(savedState.people || []);
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
    if (!loading && (movies.length > 0 || people.length > 0)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ query, movies, people }));
    }
  }, [query, movies, people, loading]);

  const handleSearch = async (searchQuery) => {
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
      toast.error('No results found for "' + searchQuery + '"');
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
        {/* People section — only shows when there are person results */}
        {people.length > 0 && (
          <div className="mb-8">
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
          <>
            <h2 className="text-white text-xl font-bold mb-4">
              {query ? `Movies & Shows for "${query}"` : 'Discover'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map(movie => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          </>
        )}
      </>
    )}
    </PageWrapper>
  );
}

export default Search;
