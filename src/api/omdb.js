// OMDb API client

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';

/**
 * Search for movies/shows by title
 * @param {string} query - Search term
 * @returns {Promise<Array>} - Array of search results
 */
export async function searchMovies(query) {
  const url = `${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.Response === 'False') {
      console.warn('OMDb API error:', data.Error);
      return [];
    }

    return data.Search || [];
  } catch (error) {
    console.error('Failed to search movies:', error);
    return [];
  }
}

/**
 * Get full details for a movie/show by IMDb ID
 * @param {string} imdbID - IMDb ID (e.g. "tt1375666")
 * @returns {Promise<Object|null>}
 */
export async function getDetails(imdbID) {
  const url = `${BASE_URL}?i=${encodeURIComponent(imdbID)}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.Response === 'False') {
      console.warn('OMDb API error:', data.Error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
    return null;
  }
}