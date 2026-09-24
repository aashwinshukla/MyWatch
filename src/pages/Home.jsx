import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/ui/MovieCard';
import PageWrapper from '../components/layout/PageWrapper';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { getRandomQuery } from '../utils/randomQuery';

function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  

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
        toast.error('Failed to load movies');
      } else {
        // Remove duplicates by imdbID and limit to 25 movies
        const unique = Array.from(new Map(allResults.map(m => [m.imdbID, m])).values()).slice(0, 25);
        setMovies(unique);
      }
      setLoading(false);
    };
    
    loadMultipleSearches();
  }, []);

  if (loading) return <PageWrapper><LoadingSpinner /></PageWrapper>;
  // Remove the error div - errors now show as toasts
  // if (error) return <div>...</div>;  ← Delete this line


  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto mb-8">
        <div 
          className="relative flex items-center w-full cursor-pointer"
          onClick={() => navigate('/search')}
        >
          <input
            placeholder="Search movies or shows..."
            readOnly
            className="w-full bg-zinc-800 text-white placeholder-zinc-500 text-sm px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
          />
        </div>
      </div>
      
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
