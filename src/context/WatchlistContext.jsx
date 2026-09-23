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
      return state.filter(item => item.imdbID !== action.payload);

    case ACTIONS.TOGGLE_WATCHED:
      return state.map(item =>
        item.imdbID === action.payload
          ? { ...item, watched: !item.watched }
          : item
      );

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
    
    // Add timestamps to old entries that don't have addedAt
    const withTimestamps = stored.map((item, index) => {
      if (!item.addedAt) {
        // Use a timestamp in the past, staggered by index so they have different times
        return { 
          ...item, 
          addedAt: new Date(Date.now() - (stored.length - index) * 1000).toISOString() 
        };
      }
      return item;
    });
    
    dispatch({ type: ACTIONS.LOAD_WATCHLIST, payload: withTimestamps });
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
