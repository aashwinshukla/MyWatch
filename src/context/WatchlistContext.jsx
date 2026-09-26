import { createContext, useContext, useReducer, useEffect } from 'react';
import { getWatchlist, saveWatchlist } from '../utils/storage';

const WatchlistContext = createContext();

const ACTIONS = {
  LOAD_WATCHLIST: 'LOAD_WATCHLIST',
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  TOGGLE_WATCHED: 'TOGGLE_WATCHED',
  UPDATE_NOTE: 'UPDATE_NOTE',
};

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

    case ACTIONS.UPDATE_NOTE:
      return state.map(item =>
        item.imdbID === action.payload.imdbID
          ? { ...item, note: action.payload.note }
          : item
      );

    default:
      return state;
  }
}

export function WatchlistProvider({ children }) {
  const [watchlist, dispatch] = useReducer(watchlistReducer, []);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = getWatchlist();
    dispatch({ type: ACTIONS.LOAD_WATCHLIST, payload: stored });
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    saveWatchlist(watchlist);
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, dispatch, ACTIONS }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return context;
}
