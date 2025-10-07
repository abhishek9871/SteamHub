# Implementation Guide for AI Wipe Coding Tool

## 🎯 Quick Start Instructions

**Goal:** Build a modern, bug-free streaming application using React, TMDB API, and vidsrc.cc

---

## 📋 Implementation Order (Sequential)

### Phase 1: Foundation (Days 1-2)
1. Create React app with required dependencies
2. Set up TailwindCSS and design system
3. Create folder structure as specified
4. Implement API services (TMDB + vidsrc)
5. Set up React Context for state management

**Files to Create:**
- `src/services/tmdb.service.js` - TMDB API calls
- `src/services/vidsrc.service.js` - vidsrc URL generation
- `src/services/storage.service.js` - localStorage wrapper
- `src/utils/constants.js`, `helpers.js`, `validators.js`
- `src/styles/globals.css` - Complete design system

---

### Phase 2: Core Components (Days 3-4)
1. Build common components (Button, Card, Modal, Loader)
2. Create layout components (Header, Footer, AppLayout)
3. Implement Content Card with hover effects
4. Build search bar with debouncing

**Files to Create:**
- `src/components/common/Button.jsx`
- `src/components/common/ContentCard.jsx`
- `src/components/layout/Header.jsx`
- `src/components/layout/AppLayout.jsx`

---

### Phase 3: Main Pages (Days 5-7)
1. **Home Page** - Hero section + carousels
2. **Search Page** - Search results grid
3. **Movie Detail Page** - Comprehensive movie info
4. **TV Detail Page** - Seasons/episodes browser
5. **Watchlist Page** - User's saved content
6. **Settings Page** - App preferences

**Critical Files:**
- `src/components/pages/Home.jsx`
- `src/components/pages/MovieDetail.jsx`
- `src/components/pages/TVDetail.jsx`
- `src/components/pages/Player.jsx` ⚠️ **MOST CRITICAL**

---

### Phase 4: Video Player (Day 8) ⚠️ CRITICAL
**This is the MOST IMPORTANT part. Must be perfect.**

**Player Requirements:**
```javascript
// For Movies:
const movieUrl = `https://vidsrc.cc/v2/embed/movie/${tmdbId}?autoplay=1&autonext=1`;

// For TV Shows:
const tvUrl = `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}?autoplay=1&autonext=1`;

// Iframe Implementation:
<iframe
  src={streamUrl}
  className="w-full h-full"
  frameBorder="0"
  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
  allowFullScreen
  sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
/>
```

**Routes:**
- `/play/movie/:id` - Movie player
- `/play/tv/:id?season=X&episode=Y` - TV player

---

### Phase 5: Polish & Testing (Days 9-10)
1. Add loading skeletons
2. Implement smooth transitions
3. Optimize images (lazy loading)
4. Test on mobile, tablet, desktop
5. Fix any bugs
6. Add error boundaries
7. Accessibility improvements

---

## 🔑 Critical Technical Requirements

### TMDB Integration
```javascript
// Base URL
const TMDB_BASE = 'https://api.themoviedb.org/3';

// API Key from env
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Image URLs
const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
```

### VidSrc Integration (DO NOT CHANGE THIS)
```javascript
// EXACT format required
const movieStream = `https://vidsrc.cc/v2/embed/movie/${tmdbId}?autoplay=1&autonext=1`;
const tvStream = `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}?autoplay=1&autonext=1`;
```

### State Management
```javascript
// Use React Context for:
- Watchlist (add/remove/check)
- Settings (theme, preferences)

// Use localStorage for:
- Watchlist persistence
- Settings persistence  
- Watch history (TV shows)
```

---

## 🎨 UI/UX Requirements

### Design Principles
1. **Dark theme by default** - Netflix-inspired colors
2. **Card hover effects** - Scale 1.05, show play button
3. **Smooth transitions** - 200-300ms duration
4. **Loading states** - Skeleton loaders everywhere
5. **Error handling** - User-friendly error messages

### Responsive Breakpoints
- Mobile: < 768px (2-3 cards per row)
- Tablet: 768-1024px (4-5 cards per row)
- Desktop: > 1024px (6-8 cards per row)

### Key UI Components
```jsx
// Hero Section - Full viewport height with backdrop
// Content Carousels - Horizontal scrolling
// Content Cards - Poster with hover overlay
// Player - Full-screen 16:9 aspect ratio
```

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "react-toastify": "^9.1.0",
    "react-icons": "^4.7.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.2.0",
    "autoprefixer": "^10.4.13",
    "postcss": "^8.4.21"
  }
}
```

---

## ✅ Testing Checklist

### Functional Tests
- [ ] Home page loads with hero and carousels
- [ ] Search returns accurate results
- [ ] Movie detail page shows all info
- [ ] TV detail page shows seasons/episodes
- [ ] Movie player loads and plays video
- [ ] TV player loads correct episode
- [ ] Episode navigation works (next/prev)
- [ ] Watchlist add/remove works
- [ ] Settings persist on refresh

### UI Tests
- [ ] Mobile layout perfect (< 768px)
- [ ] Tablet layout perfect (768-1024px)
- [ ] Desktop layout perfect (> 1024px)
- [ ] All images lazy load
- [ ] Loading states everywhere
- [ ] Hover effects smooth
- [ ] No horizontal scroll

### Player Tests (CRITICAL)
- [ ] Movie player URL format correct
- [ ] TV player URL format correct
- [ ] Iframe loads without errors
- [ ] Full-screen works
- [ ] No console errors
- [ ] Test with multiple movies/shows

**Test URLs:**
- Movie: `/play/movie/550` (Fight Club)
- TV: `/play/tv/1396?season=1&episode=1` (Breaking Bad)

---

## 🚨 Common Pitfalls to Avoid

1. **❌ Wrong vidsrc format** - Must use v2/embed with exact params
2. **❌ Using IMDb ID instead of TMDB ID** - Always use TMDB ID
3. **❌ Missing iframe sandbox** - Required for security
4. **❌ No loading states** - Every async operation needs loading UI
5. **❌ No error handling** - Wrap API calls in try-catch
6. **❌ Not responsive** - Must work on mobile
7. **❌ Hard-coded values** - Use constants file
8. **❌ Missing API key check** - Validate on app start

---

## 🎯 Success Criteria

### Must Have
- ✅ All pages load without errors
- ✅ Player works for movies and TV shows
- ✅ Search functionality works
- ✅ Watchlist persists across sessions
- ✅ Responsive on all devices
- ✅ No console errors
- ✅ TMDB data displays correctly
- ✅ vidsrc.cc streams load

### Should Have
- ✅ Smooth animations and transitions
- ✅ Loading skeletons for content
- ✅ Error boundaries for crashes
- ✅ Keyboard navigation
- ✅ Alt text on images

### Nice to Have
- ✅ Watch history tracking
- ✅ Recent searches
- ✅ Trending indicators
- ✅ Cast information
- ✅ Similar content recommendations

---

## 📞 Support References

**Documentation:**
- TMDB API: https://developers.themoviedb.org/3
- React Router: https://reactrouter.com/en/main
- TailwindCSS: https://tailwindcss.com/docs

**PRD Files:**
- `PRD_OVERVIEW.md` - Complete project overview
- `SPRINT_01_TO_05.md` - Foundation and services
- `SPRINT_10_PLAYER_CRITICAL.md` - Player implementation (CRITICAL)

---

## 🚀 Quick Implementation Command

```bash
# 1. Create React app
npx create-react-app steamhub
cd steamhub

# 2. Install dependencies
npm install react-router-dom axios react-toastify react-icons
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Create .env file
echo "REACT_APP_TMDB_API_KEY=your_key_here" > .env

# 4. Start implementing from Phase 1
npm start
```

---

**REMEMBER: The player (Sprint 10) is the most critical component. Everything else supports it.**

**If you only have time for one thing, make the player perfect!**
