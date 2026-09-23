import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';

function NotFound() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-white text-6xl font-bold mb-4">404</h1>
        <p className="text-zinc-400 text-xl mb-8">
          The page you are looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-red-600 hover:bg-red-700 transition-colors text-white font-medium px-6 py-3 rounded-lg"
        >
          Go Back Home
        </Link>
      </div>
    </PageWrapper>
  );
}

export default NotFound;