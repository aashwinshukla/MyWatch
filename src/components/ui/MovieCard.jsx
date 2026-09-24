import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchlistContext';
import toast from 'react-hot-toast';

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { watchlist, dispatch, ACTIONS } = useWatchlist();

  const inWatchlist = watchlist.some(item => item.imdbID === movie.imdbID);
  const watchlistItem = watchlist.find(item => item.imdbID === movie.imdbID);
  const isWatched = watchlistItem?.watched || false;

  const handleAdd = () => {
    dispatch({ type: ACTIONS.ADD_TO_WATCHLIST, payload: movie });
  };

  const handleRemove = () => {
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHLIST, payload: movie.imdbID });
  };

  return (
    <div
      className="bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-200 flex flex-col"
      onClick={() => navigate(`/title/${movie.imdbID}`)}
    >
      {/* Poster */}
      <div className="relative">
        {movie.Poster !== 'N/A' ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full aspect-2/3 object-cover"
          />
        ) : (
          <div className="w-full aspect-2/3 bg-zinc-700 flex items-center justify-center text-zinc-400 text-sm">
            No Image
          </div>
        )}
        
        {/* Watched badge */}
        {isWatched && (
          <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
            <span className="text-lg">✓</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h2 className="text-white text-sm font-semibold line-clamp-2">{movie.Title}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-zinc-400 text-xs">{movie.Year}</span>
          <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full capitalize">{movie.Type}</span>
        </div>

        {/* Add / Remove button */}
        <button
          className={`mt-auto pt-3 text-xs font-medium py-1.5 rounded-md transition-colors ${
            inWatchlist
              ? 'bg-zinc-600 hover:bg-red-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if(inWatchlist){
              handleRemove();
              toast.error('Removed from Watchlist');              
            }else{
              handleAdd();
              toast.success('Added to Watchlist!');
            }
          }}
        >
          {inWatchlist ? 'Remove' : '+ Watchlist'}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
