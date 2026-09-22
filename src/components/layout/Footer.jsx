function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-10 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left - App credit */}
        <p className="text-zinc-500 text-xs">
          © {new Date().getFullYear()} MyWatch. Built for learning purposes only.
        </p>

        {/* Right - API credits */}
        <div className="flex flex-col items-center md:items-end gap-3">

          {/* OMDb row */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 text-xs">Data provided by</span>
            <a
              href="https://www.omdbapi.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition-colors text-xs font-medium"
            >
              OMDb API
            </a>
          </div>

          {/* TMDB row */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 text-xs">Backdrop images by</span>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              className="flex items-center"
            >
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDB"
                className="h-3"
              />
            </a>
          </div>

          {/* Required TMDB disclaimer */}
          <p className="text-zinc-700 text-xs">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
