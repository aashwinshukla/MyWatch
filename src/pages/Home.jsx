import { useState, useEffect } from 'react';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/ui/MovieCard';
import PageWrapper from '../components/layout/PageWrapper';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch on mount
    searchMovies('something').then(results => {
      setMovies(results);
      setLoading(false);
    });
  }, []); // empty array = only runs once when component mounts

  // loading state
  if (loading) return <div>Loading...</div>;

  // error state
  if (error) return <div>Something went wrong</div>;

  return (
    <PageWrapper>
      {
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
        </div>
      }
    </PageWrapper>
  );
}

export default Home;
