// localStorage helpers for watchlist persistence

const STORAGE_KEY = 'mywatch_watchlist';

/**
 * Get the entire watchlist from localStorage
 * @returns {Array} - Array of watchlist items (empty array if nothing saved)
 */
export function getWatchlist() {
  try {
    // Read from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    
    // If nothing saved yet, return empty array
    if (!stored) {
      return [];
    }

    // Parse the JSON string back into an array
    return JSON.parse(stored);
  } catch (error) {
    // If parsing fails (corrupted data), log error and return empty array
    console.error('Failed to load watchlist from localStorage:', error);
    return [];
  }
}


/**
 * Save the entire watchlist to localStorage
 * @param {Array} items - Array of watchlist items to save
 */
export function saveWatchlist(items) {
  try {
    // Convert the array to a JSON string
    const jsonString = JSON.stringify(items);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    // If saving fails (storage full, disabled, etc.), log the error
    console.error('Failed to save watchlist to localStorage:', error);
  }
}

// TODO:
// addToWatchlist(item) - add one item, then save
// removeFromWatchlist(id) - remove by imdbID, then save
// isInWatchlist(id) - check if imdbID exists in the list
