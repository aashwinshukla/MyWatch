import { useState, useEffect } from 'react';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/ui/MovieCard';
import PageWrapper from '../components/layout/PageWrapper';
import { getRandomQuery } from '../utils/randomQuery';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Home — MyWatch';
  }, []);

  useEffect(() => {
    const loadMultipleSearches = async () => {
      const queries = [getRandomQuery(), getRandomQuery(), getRandomQuery()];
      const allResults = [];
      
      for (const query of queries) {
        const results = await searchMovies(query);
        if (results && results.length > 0) {
          allResults.push(...results);
        }
      }
      
      if (allResults.length === 0) {
        setError('Failed to load movies');
      } else {
        // Remove duplicates by imdbID and limit to 25 movies
        const unique = Array.from(new Map(allResults.map(m => [m.imdbID, m])).values()).slice(0, 25);
        setMovies(unique);
      }
      setLoading(false);
    };
    
    loadMultipleSearches();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  return (
    <PageWrapper>
      <h1 className="text-white text-2xl font-bold mb-6">Popular Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </PageWrapper>
  );
}

export default Home;
