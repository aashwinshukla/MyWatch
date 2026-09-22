import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  // Fires only when user stops typing
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <div className="relative flex items-center w-full max-w-xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies or shows..."
        className="w-full bg-zinc-800 text-white placeholder-zinc-500 text-sm px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-red-500 transition-colors"
      />

      {/* Only show clear button when there is text */}
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 text-zinc-400 hover:text-white transition-colors text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
