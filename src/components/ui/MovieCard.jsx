import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchlistContext';

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { watchlist, dispatch, ACTIONS } = useWatchlist();

  const inWatchlist = watchlist.some(item => item.imdbID === movie.imdbID);

  const handleAdd = () => {
    dispatch({ type: ACTIONS.ADD_TO_WATCHLIST, payload: movie });
  };

  const handleRemove = () => {
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHLIST, payload: movie.imdbID });
  };

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/title/${movie.imdbID}`)}
    >
      {/* Poster */}
      {movie.Poster !== 'N/A' ? (
        <img src={movie.Poster} alt={movie.Title} />
      ) : (
        <div>No Image</div>
      )}

      {/* Info */}
      <h2>{movie.Title}</h2>
      <p>{movie.Year}</p>
      <p>{movie.Type}</p>

      {/* Add / Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent card click from firing
          inWatchlist ? handleRemove() : handleAdd();
        }}
      >
        {inWatchlist ? 'Remove' : 'Add to Watchlist'}
      </button>
    </div>
  );
}

export default MovieCard;
