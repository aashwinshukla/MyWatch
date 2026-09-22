// TMDB — used only for HD backdrop images

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/original';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

/**
 * Search TMDB by title and return the HD backdrop image URL
 * @param {string} title - Movie/show title from OMDb
 * @returns {Promise<string|null>} - Full backdrop image URL or null
 */
export async function getBackdrop(title) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?query=${encodeURIComponent(title)}`,
      options
    );

    if (!response.ok) return null;

    const data = await response.json();
    const result = data.results?.[0];

    if (!result || !result.backdrop_path) return null;

    return `${IMG_BASE}${result.backdrop_path}`;
  } catch (error) {
    console.error('Failed to fetch backdrop:', error);
    return null;
  }
}
