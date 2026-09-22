import SearchBar from '../components/ui/SearchBar';
import PageWrapper from '../components/layout/PageWrapper';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/ui/MovieCard';
import { useState, useEffect } from 'react';
import { Result } from 'postcss';

function Search() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {

    searchMovies({query}).then(results => {
      if (!results || results.length === 0) {
        setError('No movies found');
      } else {
        setMovies(results);
      }
      setLoading(false);
    })

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;



  }, []);


  return  <div>
            <PageWrapper>
              <SearchBar/>
              <h1 className="text-white text-2xl font-bold mb-6">{query}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map(movie => (
                  <MovieCard key={movie.imdbID} movie={movie} />
                ))}
              </div>
            </PageWrapper>
          </div>;
}

export default Search;
