// OMDb API client
import toast from "react-hot-toast";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

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
      if(response.status===401){
        toast.error('Invalid API key. Check your Configuration.');
      }else if(response.status === 429){
        toast.error('Too many requests. Please wait a moment.');
      }else{
        toast.error('Failed to Search Movie. Try again.');
      }
      return [];
    }

    const data = await response.json();

    if (data.Response === 'False') {
      
      return [];
    }

    return data.Search || [];
  } catch (error) {
    console.error('Failed to search movies:', error);
    toast.error('Connection Failed. Check your Internet.');
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
      if(response.status===401){
        toast.error('Invalid API key. Check your Configuration.');
      }else if(response.status === 429){
        toast.error('Too many requests. Please wait a moment.');
      }else{
        toast.error('Failed to Search Movie. Try again.');
      }

      return null;
    }
    
    const data = await response.json();

    if (data.Response === 'False') {
      toast.error('Movie not found');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
    toast.error('Connection failed. Check your Internet.');
    return null;
  }
}