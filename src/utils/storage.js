// localStorage wrapper for watchlist persistence

const STORAGE_KEY = 'mywatch_watchlist';

/**
 * Get the entire watchlist from localStorage
 * @returns {Array} - Array of watchlist items
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
 * @param {Array} items - Array of watchlist items to save
 */
export function saveWatchlist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save watchlist:', error);
  }
}

/**
 * Add a single item to the watchlist
 * @param {Object} item - Movie/show object with imdbID
 */
export function addToWatchlist(item) {
  try {
    const items = getWatchlist();
    items.push(item);
    saveWatchlist(items);
  } catch (error) {
    console.error('Failed to add to watchlist:', error);
  }
}

/**
 * Remove an item from the watchlist by IMDb ID
 * @param {string} id - The imdbID of the item to remove
 */
export function removeFromWatchlist(id) {
  try {
    const items = getWatchlist();
    const updatedItems = items.filter(item => item.imdbID !== id);
    saveWatchlist(updatedItems);
  } catch (error) {
    console.error('Failed to remove from watchlist:', error);
  }
}

/**
 * Check if an item exists in the watchlist
 * @param {string} id - The imdbID to check
 * @returns {boolean}
 */
export function isInWatchlist(id) {
  try {
    const items = getWatchlist();
    return items.some(item => item.imdbID === id);
  } catch (error) {
    console.error('Failed to check watchlist:', error);
    return false;
  }
}