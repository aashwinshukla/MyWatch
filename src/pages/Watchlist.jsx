import { useState, useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/ui/MovieCard';
import PageWrapper from '../components/layout/PageWrapper';

function Watchlist() {
  const { watchlist } = useWatchlist();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Calculate watched count
  const watchedCount = watchlist.filter(item => item.watched).length;

  useEffect(() => {
    document.title = 'Watchlist — MyWatch';
  }, []);

  // Apply filter
  const filtered = watchlist.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'watched') return item.watched;
    if (filter === 'unwatched') return !item.watched;
    return item.Type.toLowerCase() === filter; // 'movie' or 'series'
  });

  // Apply sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'title') return a.Title.localeCompare(b.Title);
    
    // Sort by release year
    if (sort === 'newest' || sort === 'oldest') {
      const aYear = parseInt(a.Year) || 0;
      const bYear = parseInt(b.Year) || 0;
      return sort === 'newest' ? bYear - aYear : aYear - bYear;
    }
    
    // Sort by when added to watchlist
    if (sort === 'recentlyAdded' || sort === 'firstAdded') {
      const aTime = a.addedAt ? new Date(a.addedAt).getTime() : 0;
      const bTime = b.addedAt ? new Date(b.addedAt).getTime() : 0;
      return sort === 'recentlyAdded' ? bTime - aTime : aTime - bTime;
    }
    
    return 0;
  });

  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-white text-2xl font-bold">My Watchlist</h1>
        {watchlist.length > 0 && (
          <span className="text-zinc-400 text-sm">
            {watchedCount} / {watchlist.length} watched
          </span>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-zinc-400 text-sm">Filter</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-zinc-800 text-white text-sm px-3 py-1.5 rounded-lg border border-zinc-700 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="watched">Watched</option>
            <option value="unwatched">Unwatched</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-zinc-400 text-sm">Sort</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-zinc-800 text-white text-sm px-3 py-1.5 rounded-lg border border-zinc-700 focus:outline-none"
          >
            <option value="newest">Newest (Release Year)</option>
            <option value="oldest">Oldest (Release Year)</option>
            <option value="recentlyAdded">Recently Added</option>
            <option value="firstAdded">First Added</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Empty state */}
      {watchlist.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-zinc-400 text-lg">Your watchlist is empty</p>
          <p className="text-zinc-500 text-sm mt-2">Add some movies to get started!</p>
        </div>
      )}

      {/* No results after filter */}
      {watchlist.length > 0 && sorted.length === 0 && (
        <div className="text-zinc-400 text-center mt-20">No items match this filter.</div>
      )}

      {/* Grid */}
      {sorted.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sorted.map(movie => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

export default Watchlist;
