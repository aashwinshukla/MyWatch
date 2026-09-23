import { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/ui/MovieCard';
import PageWrapper from '../components/layout/PageWrapper';

function Watchlist() {
  const { watchlist } = useWatchlist();
  const [filter, setFilter] = useState('all'); // all, movie, series, watched, unwatched
  const [sort, setSort] = useState('newest'); // newest, oldest, title

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
    if (sort === 'oldest') return new Date(a.addedAt) - new Date(b.addedAt);
    return new Date(b.addedAt) - new Date(a.addedAt); // newest first
  });

  return (
    <PageWrapper>
      <h1 className="text-white text-2xl font-bold mb-6">My Watchlist</h1>

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
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Empty state */}
      {watchlist.length === 0 && (
        <div className="text-zinc-400 text-center mt-20">Your watchlist is empty — add some movies!</div>
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
