import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPersonDetails, getPersonCredits } from '../api/tmdb';
import MovieCard from '../components/ui/MovieCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageWrapper from '../components/layout/PageWrapper';

function PersonDetail() {
  const { tmdbID } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Person — MyWatch';
  }, []);

  useEffect(() => {
    const load = async () => {
      // Fetch person details and credits at the same time
      const [personData, creditsData] = await Promise.all([
        getPersonDetails(tmdbID),
        getPersonCredits(tmdbID),
      ]);

      if (personData) {
        setPerson(personData);
        document.title = `${personData.name} — MyWatch`;
      }

      setCredits(creditsData);
      setLoading(false);
    };

    load();
  }, [tmdbID]);

  if (loading) return <LoadingSpinner />;
  if (!person) return (
    <PageWrapper>
      <div className="text-zinc-400 text-center mt-20">Person not found.</div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      {/* Top section — photo + info */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">

        {/* Photo */}
        <div className="flex-shrink-0">
          {person.photo ? (
            <img
              src={person.photo}
              alt={person.name}
              className="w-48 h-72 object-cover object-top rounded-xl shadow-2xl border-2 border-zinc-700 mx-auto md:mx-0"
            />
          ) : (
            <div className="w-48 h-72 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto md:mx-0">
              <span className="text-6xl">👤</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center gap-3">
          <h1 className="text-white text-4xl font-bold">{person.name}</h1>
          <span className="text-zinc-400 text-sm">Known for: {person.knownFor}</span>

          {/* Birthday and place */}
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            {person.birthday && (
              <span>🎂 {person.birthday}</span>
            )}
            {person.placeOfBirth && (
              <span>📍 {person.placeOfBirth}</span>
            )}
          </div>

          {/* Biography */}
          {person.biography && (
            <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl line-clamp-5">
              {person.biography}
            </p>
          )}
        </div>
      </div>

      {/* Known Works */}
      {credits.length > 0 && (
        <>
          <h2 className="text-white text-xl font-bold mb-4 border-t border-zinc-800 pt-6">
            Known Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {credits.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </>
      )}
    </PageWrapper>
  );
}

export default PersonDetail;