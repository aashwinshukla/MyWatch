// localStorage wrapper for watchlist persistence

const STORAGE_KEY = 'mywatch_watchlist';

/**
 * Get the entire watchlist from localStorage
 * @returns {Array}
 */
export function getWatchlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load watchlist:', error);
    return [];
  }
}

/**
 * Save the entire watchlist to localStorage
 * @param {Array} items
 */
export function saveWatchlist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save watchlist:', error);
  }
}
