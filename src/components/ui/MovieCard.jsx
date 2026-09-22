// MovieCard component
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchlistContext';

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { watchlist, dispatch, ACTIONS } = useWatchlist();

  // Check if already in watchlist
  const inWatchlist = watchlist.some(item => item.imdbID === movie.imdbID);

  const handleAdd = () => {
    dispatch({ type: ACTIONS.ADD_TO_WATCHLIST, payload: movie });
  };

  const handleRemove = () => {
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHLIST, payload: movie.imdbID });
  };

  return (
    <div className='flex'>
        <link>
            
            {movie.Poster !== 'N/A' ? (
                <img src={movie.Poster} alt={movie.Title} />
                ) : (
                <div>No Image</div>
                )
            }

            <h2>Title: {movie.Title}</h2>
            <h2>Year of Release: {movie.Year}</h2>
            <h2>imdbID: {movie.imdbID}</h2>
            <h2>Type: {movie.type}</h2>
            
        </link>
        
    </div>
  );
}
