import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

function SearchBar({ onSearch, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);
  const inputRef = useRef(null);

  // Update local state if initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Fires only when user stops typing
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery]);

  // Keyboard shortcut: press / to focus search
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if not already typing in an input/textarea
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault(); // Prevent "/" from being typed
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="relative flex items-center w-full max-w-xl">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies or shows... (press / to focus)"
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
