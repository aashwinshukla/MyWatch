// OMDb API calls

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';

/**
 * Search for movies/shows by title
 * @param {string} query - The search term (e.g. "inception")
 * @returns {Promise<Array>} - Array of search results
 */
export async function searchMovies(query) {
  // Build the URL with search parameter and API key
  const url = `${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;

  try {
    // Make the request
    const response = await fetch(url);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // OMDb returns { Response: "True", Search: [...] } on success
    // or { Response: "False", Error: "..." } on failure
    if (data.Response === 'False') {
      console.warn('OMDb API error:', data.Error);
      return []; // Return empty array if no results or error
    }

    // Return the array of results
    return data.Search || [];

  } catch (error) {
    console.error('Failed to search movies:', error);
    return []; // Return empty array on network error
  }
}

// TODO: Implement getDetails(imdbID) following the same pattern
// Endpoint: ?i=tt1375666&apikey=YOUR_KEY
// Returns a single object with full movie details


