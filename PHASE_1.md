# Phase 1 — Build the Foundation

> The goal of this phase is to lay down a rock-solid base for MyWatch. No flashy features yet — just clean architecture, a working data layer, and the core screens that everything else will eventually plug into.

---

## What We're Building

MyWatch is a personal movie and TV show tracker. You find something you want to watch, you save it. You watch it, you mark it. You forget why you added it, you wrote a note — boom, context. Simple idea, but it deserves a proper foundation so it doesn't fall apart when we start stacking features on top.

---

## Goals for This Phase

- Get the project scaffolded and running locally without friction
- Connect to a real movie data source so we're not faking anything
- Let users search for movies and shows
- Let users save titles to a personal watchlist
- Mark titles as watched or unwatched
- Store everything locally (no accounts, no backend — yet)
- Ship a UI that's clean enough to actually use, not just demo

---

## Tech Decisions

These are the calls we're making upfront so we don't revisit them every other day:

- **Frontend**: React (JavaScript) — no TypeScript, just plain JS
- **Styling**: Plain CSS with custom properties (CSS variables) for theming — no utility frameworks
- **State Management**: React Context + useReducer — built-in, no extra dependencies needed
- **Local Storage**: localStorage with a thin wrapper so we can swap it for a DB later without touching everything
- **Movie Data API**: TMDB (The Movie Database) — free tier, solid docs, massive catalog
- **Routing**: React Router v6

### Why plain CSS and not a framework?

Full control. No class-name soup in the JSX, no fighting a framework's opinion on spacing. We write the styles we mean, organized in module-level CSS files, and we own every pixel.

---

## Screens in Scope

### 1. Home / Discovery
- A landing page that shows trending movies and shows pulled from TMDB
- Not personalized yet — just a good starting point so the app doesn't open to a blank slate

### 2. Search
- Full-text search across movies and TV shows
- Results show poster, title, year, and a quick-add button
- Debounced input so we're not hammering the API on every keystroke

### 3. Watchlist
- The main screen — everything the user has saved lives here
- Filter by: all, movies only, shows only, watched, unwatched
- Sort by: date added, title, release year
- Each card shows: poster, title, genre tags, watched status, and a remove button

### 4. Title Detail
- A dedicated page for each movie or show
- Shows: full poster, backdrop image, synopsis, cast, ratings, runtime/episodes
- Has the add-to-watchlist and mark-as-watched actions right there

---

## Data Model

What we're storing per watchlist item (plain JS object shape):

```js
// WatchlistItem shape
{
  id: 0,                  // TMDB ID (number)
  mediaType: 'movie',     // 'movie' or 'tv'
  title: '',              // string
  posterPath: '',         // string — TMDB image path
  backdropPath: '',       // string — TMDB image path
  overview: '',           // string
  releaseDate: '',        // string — 'YYYY-MM-DD'
  genres: [],             // string[]
  rating: 0,              // number — TMDB average score
  watched: false,         // boolean
  watchedAt: null,        // string | null — ISO date, set when marked watched
  addedAt: '',            // string — ISO date
  personalNote: '',       // string — why they added it, reminder, etc.
}
```

---

## API Integration Plan

All TMDB calls live in a single `api/tmdb.js` file. No raw fetch calls scattered around components — everything goes through one place so it's easy to update or swap out.

Endpoints we need for this phase:

| Purpose | Endpoint |
|---|---|
| Trending movies | `GET /trending/movie/week` |
| Trending TV | `GET /trending/tv/week` |
| Search | `GET /search/multi` |
| Movie details | `GET /movie/{id}` |
| TV details | `GET /tv/{id}` |
| Movie credits | `GET /movie/{id}/credits` |
| TV credits | `GET /tv/{id}/credits` |

All calls go through a base fetch wrapper that attaches the API key and handles errors uniformly.

---

## Folder Structure

```
src/
├── api/
│   └── tmdb.js              # all TMDB calls live here
├── components/
│   ├── ui/                  # buttons, cards, badges, inputs — reusable pieces
│   │   ├── MovieCard.jsx
│   │   ├── MovieCard.css
│   │   ├── SearchBar.jsx
│   │   └── SearchBar.css
│   └── layout/              # header, nav, page wrapper
│       ├── Header.jsx
│       ├── Header.css
│       └── PageWrapper.jsx
├── pages/
│   ├── Home.jsx
│   ├── Home.css
│   ├── Search.jsx
│   ├── Search.css
│   ├── Watchlist.jsx
│   ├── Watchlist.css
│   ├── TitleDetail.jsx
│   └── TitleDetail.css
├── context/
│   └── WatchlistContext.jsx  # React Context + useReducer for watchlist state
├── hooks/
│   └── useDebounce.js
└── utils/
    └── storage.js            # localStorage read/write helpers
```

Each component owns its CSS file — no global stylesheet doing heavy lifting except for resets and CSS variables.

---

## CSS Architecture

We'll use a single `index.css` at the root for:
- CSS reset
- CSS custom properties (colors, font sizes, spacing scale, border radii)
- Base typography

Everything else is scoped to its component's CSS file. This keeps styles predictable and easy to debug.

```css
/* Example variables in index.css */
:root {
  --color-bg: #0f0f0f;
  --color-surface: #1a1a1a;
  --color-accent: #e50914;      /* classic watchlist red */
  --color-text: #f0f0f0;
  --color-text-muted: #888;
  --radius-card: 8px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 32px;
}
```

Dark theme by default — this is a movie app, it should feel like a theater.

---

## What "Done" Looks Like

This phase is complete when:

- [ ] App runs locally with `npm run dev`, no setup pain
- [ ] TMDB API key is loaded via `.env`, not hardcoded
- [ ] Trending titles load on the home screen
- [ ] Search returns real results and updates as you type
- [ ] Any result can be added to the watchlist in one click
- [ ] Watchlist persists across page refreshes
- [ ] Items can be marked watched/unwatched
- [ ] Items can be removed from the watchlist
- [ ] Title detail page loads and shows full info
- [ ] UI looks intentional on both desktop and mobile
- [ ] No console errors in normal usage

---

## What's Intentionally Out of Scope

Keeping this focused matters. The following are real features but they belong in a later phase:

- User accounts or authentication
- Backend / database
- Ratings or reviews written by the user
- Social features (sharing, following)
- Recommendations engine
- Notifications or reminders
- Offline mode
- Multiple lists (beyond the single watchlist)

---

## Phase 2 Preview

Once this foundation is solid, the next phase will introduce user accounts, a proper backend, and the ability to write reviews and rate what you've watched. But none of that works well without Phase 1 being tight.

---

*Start clean. Ship something real. Then build on it.*
