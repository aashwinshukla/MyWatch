import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchlistContext';
import logo from '../../assets/MyWatch-logo.png';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();

  const isDetailPage = location.pathname.startsWith('/title/');
  
  // Calculate counts
  const totalCount = watchlist.length;
  const watchedCount = watchlist.filter(item => item.watched).length;

  return (
    <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800">
      <div className="relative max-w-7xl mx-auto px-2 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {isDetailPage && (
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
            >
              ← Back
            </button>
          )}
          <NavLink to="/" className="flex items-center">
            <img src={logo} alt="MyWatch" className="h-22 w-55 object-contain" />
          </NavLink>
        </div>

        {/* Nav links - centered */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive 
                ? 'text-white bg-blue-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium' 
                : 'text-zinc-400 hover:text-white px-3 py-1.5 transition-colors text-sm font-medium'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive 
                ? 'text-white bg-blue-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium' 
                : 'text-zinc-400 hover:text-white px-3 py-1.5 transition-colors text-sm font-medium'
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              isActive 
                ? 'text-white bg-blue-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center gap-2' 
                : 'text-zinc-400 hover:text-white px-3 py-1.5 transition-colors text-sm font-medium flex items-center gap-2'
            }
          >
            <span>Watchlist</span>
            {totalCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-5 text-center">
                {totalCount}
              </span>
            )}
          </NavLink>
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
        <button
          className="md:hidden text-zinc-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      {/* Mobile dropdown - only visible when menuOpen is true */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-4 flex flex-col gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive 
                ? 'text-white bg-blue-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium' 
                : 'text-zinc-400 hover:text-white transition-colors text-sm font-medium'
            }
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive 
                ? 'text-white bg-blue-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium' 
                : 'text-zinc-400 hover:text-white transition-colors text-sm font-medium'
            }
            onClick={() => setMenuOpen(false)}
          >
            Search
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              isActive 
                ? 'text-white bg-blue-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center gap-2' 
                : 'text-zinc-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2'
            }
            onClick={() => setMenuOpen(false)}
          >
            <span>Watchlist</span>
            {totalCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-5 text-center">
                {totalCount}
              </span>
            )}
          </NavLink>
          <hr className="border-zinc-800" />
          <button className="text-zinc-400 hover:text-white transition-colors text-sm font-medium text-left">
            Account
          </button>
          <button className="bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-medium px-4 py-1.5 rounded-md w-fit">
            Sign In
          </button>
        </div>
      )}

    </header>
  );
}

export default Header;
