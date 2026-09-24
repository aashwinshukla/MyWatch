// TMDB — used only for HD backdrop images
import toast from "react-hot-toast";
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

    if (!response.ok){
      if (response.status === 401) {
        toast.error('Invalid TMDB token. Check configuration.');
      } else if (response.status === 429) {
        toast.error('TMDB rate limit reached. Try again later.');
      }
      return null;
    }

    const data = await response.json();
    const result = data.results?.[0];

    if (!result || !result.backdrop_path) return null;

    return `${IMG_BASE}${result.backdrop_path}`;
  } catch (error) {
    console.error('Failed to fetch backdrop:', error);
    return null;
  }
}

/**
 * Search TMDB for movies, TV shows, and people
 * Returns { movies: [], people: [] } separately
 * @param {string} query
 * @returns {Promise<{ movies: Array, people: Array }>}
 */
export async function searchTMDB(query) {
  try{
    const response = await fetch(
      `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false`,
      options
    );

    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Invalid TMDB token. Check configuration.');
      } else if (response.status === 429) {
        toast.error('Too many requests. Please wait a moment.');
      } else {
        toast.error('Search failed. Try again.');
      }
      return { movies: [], people: [] };
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return { movies: [], people: [] };
    }

    const movies = [];
    const people = [];

    for(const item of data.results ){
      if (item.media_type === 'movie' || item.media_type === 'tv') {
        movies.push(convertTMDBToOMDb(item));
    }

    if(item.media_type === 'person'){
      people.push({
          tmdbID: item.id,
          name: item.name,
          photo: item.profile_path
            ? `https://image.tmdb.org/t/p/w300${item.profile_path}`
            : null,
          knownFor: item.known_for_department || 'Acting',
          knownForTitles: (item.known_for || [])
            .map(m => m.title || m.name)
            .filter(Boolean)
            .slice(0, 3)
            .join(', '),
        });
      }
    }

    const uniqueMovies = Array.from(
      new Map(movies.filter(r => r.imdbID).map(r => [r.imdbID, r])).values()
    );

    return { movies: uniqueMovies, people};
  }


  catch (error){
    console.error('TMDB search error:', error);
    toast.error('Connection failed. Check your internet.');
    return { movies: [], people: [] };
  }
}

/**
 * Get full details for a person by TMDB ID
 * @param {number|string} tmdbID
 * @returns {Promise<Object|null>}
 */

export async function getPersonDetails(tmdbID) {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${tmdbID}`,
      options
    );

    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Invalid TMDB token. Check configuration.');
      } else if (response.status === 404) {
        toast.error('Person not found.');
      } else {
        toast.error('Failed to load person details.');
      }
      return null;
    }

    const data = await response.json();

    return {
      tmdbID: data.id,
      name: data.name,
      photo: data.profile_path
        ? `https://image.tmdb.org/t/p/w500${data.profile_path}`
        : null,
      birthday: data.birthday || null,
      placeOfBirth: data.place_of_birth || null,
      biography: data.biography || null,
      knownFor: data.known_for_department || 'Acting',
      imdbID: data.imdb_id || null,
    };
  } catch (error) {
    console.error('Person details error:', error);
    toast.error('Connection failed. Check your internet.');
    return null;
  }
}


/**
 * Get all movie and TV credits for a person
 * Returns in OMDb-compatible shape so MovieCard works without changes
 * @param {number|string} tmdbID
 * @returns {Promise<Array>}
 */
export async function getPersonCredits(tmdbID) {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${tmdbID}/combined_credits`,
      options
    );

    if (!response.ok) {
      toast.error('Failed to load credits.');
      return [];
    }

    const data = await response.json();

    // Combine cast + crew, remove duplicates, sort by popularity
    const allCredits = [
      ...(data.cast || []),
      ...(data.crew || []),
    ];

    const unique = Array.from(
      new Map(allCredits.map(item => [item.id, item])).values()
    );

    const sorted = unique
      .filter(item => item.poster_path) // only show items with poster
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 20); // top 20 most popular

    return sorted.map(item => convertTMDBToOMDb(item));
  } catch (error) {
    console.error('Person credits error:', error);
    toast.error('Connection failed. Check your internet.');
    return [];
  }
}

/**
 * Convert TMDB movie/show result to OMDb-compatible shape
 * so MovieCard and other components work without any changes
 */
function convertTMDBToOMDb(item) {
  const isTV = item.media_type === 'tv' || item.first_air_date;

  return {
    imdbID: item.imdb_id || `tmdb_${item.id}`,
    Title: item.title || item.name || 'Unknown',
    Year: (item.release_date || item.first_air_date || '').slice(0, 4),
    Type: isTV ? 'series' : 'movie',
    Poster: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'N/A',
  };
}