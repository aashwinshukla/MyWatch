import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDetails } from '../api/omdb';
import { getBackdrop } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

function TitleDetail() {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [backdrop, setBackdrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [copied, setCopied] = useState(false);

  const { watchlist, dispatch, ACTIONS } = useWatchlist();
  const inWatchlist = watchlist.some(item => item.imdbID === imdbID);
  const watchlistItem = watchlist.find(item => item.imdbID === imdbID);

  // Load note when component mounts or watchlist changes
  useEffect(() => {
    if (watchlistItem?.note) {
      setNoteText(watchlistItem.note);
    } else {
      setNoteText('');
    }
  }, [watchlistItem]);


  useEffect(() => {
    document.title = 'Title — MyWatch';
  }, []);
  useEffect(() => {
    getDetails(imdbID).then(data => {
      if (!data) {
        setError('Movie not found');
        setLoading(false);
      } else {
        setMovie(data);
        getBackdrop(data.Title).then(url => {
          setBackdrop(url);
          setLoading(false);
        });
      }
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
        note: '',
      }
    });
    toast.success('Added to Watchlist!');
  };

  const handleRemove = () => {
    dispatch({ type: ACTIONS.REMOVE_FROM_WATCHLIST, payload: imdbID });
    toast.error('Removed From Watchlist!')
  };

  const handleToggleWatched = () => {
    const willbeWatched = !watchlist.find(item.imdbID === imdbID)?.watched;
    dispatch({ type: ACTIONS.TOGGLE_WATCHED, payload: imdbID });

    if(willbeWatched){
      toast.success('Marked as Watched');
    }else{
      toast('Marked as Unwatched!', { icon: '👀'});
    }
  };

  const handleSaveNote = () => {
    dispatch({
      type: ACTIONS.UPDATE_NOTE,
      payload: { imdbID, note: noteText }
    });
    toast.success('Note saved!');
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link Copied to Clipboard!');
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  const isWatched = watchlist.find(item => item.imdbID === imdbID)?.watched;

  return (
    <div className="relative min-h-screen">

      {/* ── Background layer — HD backdrop from TMDB, falls back to OMDb poster ── */}
      <div className="fixed inset-x-0 top-0 h-[85vh] -z-10">
        <img
          src={backdrop || (movie.Poster !== 'N/A' ? movie.Poster : '')}
          alt=""
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/40 to-zinc-950" />
      </div>

      {/* ── Info card ── */}
      <div className="relative z-10 mt-[45vh] mx-4 md:mx-auto max-w-4xl bg-zinc-900/70 backdrop-blur-md rounded-3xl shadow-2xl px-8 pt-4 pb-16 min-h-[65vh] mb-10">

        {/* Poster + title */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-end -mt-16 mb-6">
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : ''}
            alt={movie.Title}
            className="w-32 h-48 object-cover rounded-xl shadow-2xl shrink-0 border-2 border-zinc-700"
          />
          <div className="md:pt-10 flex flex-col justify-end text-center md:text-left">
            <h1 className="text-white text-3xl font-bold leading-tight">{movie.Title}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
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

          <button
            onClick={handleShareLink}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors bg-zinc-700 hover:bg-zinc-600 text-white flex items-center gap-2"
          >
            {copied ? (
              <>
                <span>✓</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span>🔗</span>
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Personal Note - only show if in watchlist */}
        {inWatchlist && (
          <div className="mb-8 border-t border-zinc-800 pt-6">
            <label className="text-zinc-400 text-sm font-medium mb-2 block">
              Personal Note
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Why do you want to watch this? Who recommended it? Add your thoughts here..."
              className="w-full bg-zinc-800 text-white placeholder-zinc-500 text-sm px-4 py-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-red-500 transition-colors resize-none"
              rows={3}
            />
            <button
              onClick={handleSaveNote}
              className="mt-2 px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save Note
            </button>
          </div>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800 pt-6">
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
