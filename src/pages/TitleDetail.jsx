import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDetails } from '../api/omdb';
import { useWatchlist } from '../context/WatchlistContext';

function TitleDetail() {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { watchlist, dispatch, ACTIONS } = useWatchlist();
  const inWatchlist = watchlist.some(item => item.imdbID === imdbID);

  useEffect(() => {
    getDetails(imdbID).then(data => {
      if (!data) {
        setError('Movie not found');
      } else {
        setMovie(data);
      }
      setLoading(false);
    });
  }, [imdbID]);

  const handleAdd = () => {
    dispatch({
      type: ACTIONS.ADD_TO_WATCHLIST,
      payload: {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Type: movie.Type,
        watched: false,
        addedAt: new Date().toISOString(),
      }
    });
  };

  const handleRemove = () => {
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHLIST, payload: imdbID });
  };

  const handleToggleWatched = () => {
    dispatch({ type: ACTIONS.TOGGLE_WATCHED, payload: imdbID });
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  const isWatched = watchlist.find(item => item.imdbID === imdbID)?.watched;

  return (
    <div className="relative min-h-screen bg-zinc-950">

      {/* ── Background poster layer ── */}
      {/* This sits behind everything, covers the top portion of the screen */}
      <div className="absolute inset-0 h-[70vh] overflow-hidden">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : ''}
          alt={movie.Title}
          className="w-full h-full object-cover object-top scale-105"
        />
        {/* Blur overlay — gets stronger towards the bottom */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />
        {/* Gradient fade into the info card below */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-zinc-950" />
      </div>

      {/* ── Info card layer ── */}
      {/* Sits on top of the poster, starts partway down, like a document coming out of a folder */}
      <div className="relative z-10 mt-[35vh] mx-auto max-w-4xl bg-zinc-900 rounded-t-3xl shadow-2xl px-8 pt-8 pb-16 min-h-[65vh]">

        {/* Poster thumbnail + title side by side */}
        <div className="flex gap-6 -mt-20 mb-6">
          {/* Small poster sticking up above the card */}
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : ''}
            alt={movie.Title}
            className="w-32 h-48 object-cover rounded-xl shadow-2xl flex-shrink-0 border-2 border-zinc-700"
          />
          {/* Title and meta */}
          <div className="pt-10 flex flex-col justify-end">
            <h1 className="text-white text-3xl font-bold leading-tight">{movie.Title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-zinc-400 text-sm">{movie.Year}</span>
              <span className="text-zinc-400 text-sm">•</span>
              <span className="text-zinc-400 text-sm">{movie.Runtime}</span>
              <span className="text-zinc-400 text-sm">•</span>
              <span className="text-zinc-400 text-sm">{movie.Rated}</span>
              {movie.imdbRating !== 'N/A' && (
                <>
                  <span className="text-zinc-400 text-sm">•</span>
                  <span className="text-yellow-400 text-sm font-semibold">⭐ {movie.imdbRating}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Genre badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {movie.Genre.split(', ').map(genre => (
            <span key={genre} className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full">
              {genre}
            </span>
          ))}
        </div>

        {/* Plot */}
        <p className="text-zinc-300 text-sm leading-relaxed mb-6">{movie.Plot}</p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={inWatchlist ? handleRemove : handleAdd}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              inWatchlist
                ? 'bg-zinc-700 hover:bg-red-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {inWatchlist ? 'Remove from Watchlist' : '+ Add to Watchlist'}
          </button>

          {inWatchlist && (
            <button
              onClick={handleToggleWatched}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isWatched
                  ? 'bg-green-700 hover:bg-zinc-700 text-white'
                  : 'bg-zinc-700 hover:bg-green-700 text-white'
              }`}
            >
              {isWatched ? '✓ Watched' : 'Mark as Watched'}
            </button>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-6">
          {[
            { label: 'Director', value: movie.Director },
            { label: 'Writer', value: movie.Writer },
            { label: 'Actors', value: movie.Actors },
            { label: 'Language', value: movie.Language },
            { label: 'Country', value: movie.Country },
            { label: 'Awards', value: movie.Awards },
          ].map(({ label, value }) =>
            value && value !== 'N/A' ? (
              <div key={label}>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{label}</p>
                <p className="text-zinc-300 text-sm">{value}</p>
              </div>
            ) : null
          )}
        </div>

      </div>
    </div>
  );
}

export default TitleDetail;
