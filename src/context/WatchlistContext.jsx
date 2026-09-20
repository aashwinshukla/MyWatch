import { createContext, useContext, useReducer, useEffect } from 'react';
import { getWatchlist, saveWatchlist } from '../utils/storage';

// Create the context
const WatchlistContext = createContext();

// Action types
const ACTIONS = {
  LOAD_WATCHLIST: 'LOAD_WATCHLIST',
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  TOGGLE_WATCHED: 'TOGGLE_WATCHED',
};

// Reducer function - handles state updates
function watchlistReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_WATCHLIST:
      return action.payload;

    case ACTIONS.ADD_TO_WATCHLIST:
      return [...state, action.payload];

    case ACTIONS.REMOVE_FROM_WATCHLIST:
        return [...state, action.payload];

    case ACTIONS.TOGGLE_WATCHED:
        return action.payload;
    
    // TODO: Implement REMOVE_FROM_WATCHLIST
    // Filter out the item with matching imdbID

    // TODO: Implement TOGGLE_WATCHED
    // Map through state, find matching imdbID, toggle its 'watched' property

    default:
      return state;
  }
}

// Provider component
export function WatchlistProvider({ children }) {
  const [watchlist, dispatch] = useReducer(watchlistReducer, []);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = getWatchlist();
    dispatch({ type: ACTIONS.LOAD_WATCHLIST, payload: stored });
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (watchlist.length >= 0) {
      saveWatchlist(watchlist);
    }
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, dispatch, ACTIONS }}>
      {children}
    </WatchlistContext.Provider>
  );
}

// Custom hook to use the context
export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return context;
}
