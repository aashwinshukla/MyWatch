import { Link } from 'react-router-dom';
import logo from '../../assets/MyWatch-logo.png';

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800">
      <div className="relative max-w-7xl mx-auto px-2 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src={logo} alt="MyWatch" className="h-22 w-55 object-contain" />
        </Link>

        {/* Nav links - centered */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            Home
          </Link>
          <Link to="/search" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            Search
          </Link>
          <Link to="/watchlist" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            Watchlist
          </Link>
        </nav>

        {/* Account buttons - hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            Account
          </button>
          <button className="bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-medium px-4 py-1.5 rounded-md">
            Sign In
          </button>
        </div>

        {/* Mobile menu button - only visible on mobile */}
        <button className="md:hidden text-zinc-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div>
    </header>
  );
}

export default Header;
