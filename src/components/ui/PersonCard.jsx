import { useNavigate } from 'react-router-dom';

function PersonCard({ person }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-200 flex flex-col"
      onClick={() => navigate(`/person/${person.tmdbID}`)}
    >
      {/* Photo */}
      {person.photo ? (
        <img
          src={person.photo}
          alt={person.name}
          className="w-full aspect-2/3 object-cover object-top"
        />
      ) : (
        // Placeholder when no photo available
        <div className="w-full aspect-2/3 bg-zinc-700 flex flex-col items-center justify-center text-zinc-400 gap-2">
          <span className="text-4xl">👤</span>
          <span className="text-xs">No Photo</span>
        </div>
      )}

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <h2 className="text-white text-sm font-semibold line-clamp-1">{person.name}</h2>
        <span className="text-zinc-400 text-xs">{person.knownFor}</span>
        {person.knownForTitles && (
          <p className="text-zinc-500 text-xs line-clamp-2 mt-1">
            {person.knownForTitles}
          </p>
        )}
      </div>
    </div>
  );
}

export default PersonCard;