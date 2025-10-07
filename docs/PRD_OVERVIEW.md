# Product Requirements Document (PRD)
## SteamHub - Modern Streaming Application

---

## 📋 Executive Summary

**Project Name:** SteamHub - Next Generation Streaming Platform  
**Version:** 2.0  
**Document Type:** Complete Product Requirements Document  
**Target:** AI Wipe Coding Tool Implementation  

**Overview:**  
Build a modern, flawless, ultra-responsive streaming web application that aggregates movie and TV show content using TMDB API for metadata and vidsrc.cc for streaming. The application will be 100% frontend-based with no backend requirements, featuring stunning UI/UX, zero bugs, and perfect responsiveness across all devices.

---

## 🎯 Core Objectives

1. **Flawless Functionality** - Zero bugs, perfect error handling, seamless user experience
2. **Modern UI/UX** - Ultra-modern design inspired by Netflix, Disney+, and Apple TV+
3. **Technical Excellence** - Maintain exact TMDB and vidsrc.cc integrations
4. **Performance** - Lightning-fast load times, optimized images, efficient caching
5. **Responsive Design** - Perfect experience on mobile, tablet, and desktop
6. **Accessibility** - WCAG 2.1 AA compliance, keyboard navigation, screen reader support

---

## 🔧 Technical Stack (MANDATORY)

```json
{
  "framework": "React 18",
  "router": "react-router-dom v6",
  "styling": "TailwindCSS + Modern CSS3",
  "icons": "react-icons or lucide-react",
  "api_metadata": "TMDB API v3",
  "api_streaming": "vidsrc.cc embed URLs",
  "state_management": "React Context API",
  "storage": "localStorage only",
  "animations": "CSS transitions + Framer Motion (optional)",
  "notifications": "react-toastify",
  "image_optimization": "native lazy loading + placeholder"
}
```

**Critical Integration Requirements:**

### TMDB API Integration
- Base URL: `https://api.themoviedb.org/3/`
- API Key: From environment variable `REACT_APP_TMDB_API_KEY`
- Image Base: `https://image.tmdb.org/t/p/{size}/{path}`
- Required Endpoints:
  - `/movie/popular`, `/movie/top_rated`, `/trending/movie/week`
  - `/tv/popular`, `/tv/top_rated`, `/trending/tv/week`
  - `/movie/{id}`, `/tv/{id}`, `/tv/{id}/season/{season}`
  - `/search/multi?query={query}`

### VidSrc.cc Integration (CRITICAL)
**Movie Embed Format:**
```
https://vidsrc.cc/v2/embed/movie/{TMDB_ID}?autoplay=1&autonext=1
```

**TV Show Embed Format:**
```
https://vidsrc.cc/v2/embed/tv/{TMDB_ID}/{SEASON}/{EPISODE}?autoplay=1&autonext=1
```

**Important Notes:**
- Use TMDB ID (not IMDb ID) as primary identifier
- Always include `autoplay=1` and `autonext=1` parameters
- Embed in iframe with proper sandbox and allow attributes
- No authentication required

---

## 📐 Design System

### Color Palette (Dark Theme - Default)
```css
--bg-primary: #0A0E14;      /* Main background */
--bg-secondary: #141821;    /* Secondary surfaces */
--surface: #1A1F2E;         /* Cards, modals */
--surface-hover: #242938;   /* Hover state */
--accent-primary: #E50914;  /* Primary CTA (Netflix red) */
--accent-secondary: #00A8E8; /* Secondary accent */
--text-primary: #FFFFFF;    /* Main text */
--text-secondary: #A0AEC0;  /* Secondary text */
--text-muted: #718096;      /* Muted text */
--success: #10B981;         /* Success states */
--error: #EF4444;           /* Error states */
--warning: #F59E0B;         /* Warning states */
```

### Typography
- **Primary Font:** Inter (Google Fonts) for body text
- **Heading Font:** Poppins (Google Fonts) for headings
- **Base Size:** 16px
- **Font Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing System (Tailwind)
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

---

## 🏗️ Application Architecture

### Folder Structure
```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Loader.jsx
│   │   ├── SearchBar.jsx
│   │   └── ErrorBoundary.jsx
│   ├── layout/              # Layout components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── AppLayout.jsx
│   └── pages/               # Page components
│       ├── Home.jsx
│       ├── Search.jsx
│       ├── MovieDetail.jsx
│       ├── TVDetail.jsx
│       ├── Player.jsx
│       ├── Watchlist.jsx
│       └── Settings.jsx
├── services/                # API services
│   ├── tmdb.service.js      # TMDB API calls
│   ├── vidsrc.service.js    # VidSrc URL generation
│   └── storage.service.js   # localStorage wrapper
├── context/                 # React Context
│   ├── WatchlistContext.jsx
│   └── SettingsContext.jsx
├── hooks/                   # Custom hooks
│   ├── useMedia.js
│   ├── useSearch.js
│   └── useLocalStorage.js
├── utils/                   # Utilities
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
├── styles/                  # Global styles
│   └── globals.css
├── App.jsx                  # Root component
└── index.js                 # Entry point
```

### Routing Structure
```javascript
/ - Home page
/search?q={query} - Search results
/movie/:id - Movie detail page
/tv/:id - TV show detail page
/play/movie/:id - Movie player
/play/tv/:id?season={s}&episode={e} - TV player
/watchlist - User watchlist
/settings - App settings
* - 404 Not found (redirect to home)
```

---

## 🚀 Development Sprints Overview

The project is divided into 15 logical sprints for systematic implementation:

1. **Sprint 1:** Foundation & Core Setup
2. **Sprint 2:** API Services & Data Layer
3. **Sprint 3:** Common Components Library
4. **Sprint 4:** Layout Components
5. **Sprint 5:** Context & State Management
6. **Sprint 6:** Home Page
7. **Sprint 7:** Search Functionality
8. **Sprint 8:** Movie Detail Page
9. **Sprint 9:** TV Show Detail Page
10. **Sprint 10:** Video Player (CRITICAL)
11. **Sprint 11:** Watchlist Page
12. **Sprint 12:** Settings Page
13. **Sprint 13:** Polish & Animations
14. **Sprint 14:** Performance Optimization
15. **Sprint 15:** Testing & Bug Fixes

**Each sprint is detailed in separate sprint files (SPRINT_01.md through SPRINT_15.md)**

---

## 📝 Implementation Guidelines for AI Agent

### General Instructions

1. **Code Quality:**
   - Write clean, readable, well-commented code
   - Follow React best practices and hooks guidelines
   - Use functional components only (no class components)
   - Implement proper error boundaries
   - Add PropTypes or TypeScript for type safety

2. **Styling:**
   - Use TailwindCSS utility classes primarily
   - Custom CSS only when absolutely necessary
   - Mobile-first approach (design for mobile, scale up)
   - Ensure dark theme consistency across all components

3. **Performance:**
   - Lazy load images with loading="lazy"
   - Code split routes with React.lazy()
   - Memoize expensive computations with useMemo
   - Debounce search inputs and scroll events
   - Minimize re-renders with React.memo where appropriate

4. **Accessibility:**
   - Semantic HTML (header, nav, main, footer, article, section)
   - ARIA labels for interactive elements
   - Keyboard navigation support
   - Focus indicators visible
   - Alt text for all images

5. **Error Handling:**
   - Try-catch blocks for all API calls
   - Fallback UI for errors
   - Meaningful error messages to users
   - Console logging for debugging

6. **Responsive Design:**
   - Test on mobile (375px), tablet (768px), desktop (1280px+)
   - Touch-friendly targets (min 44x44px)
   - No horizontal scroll
   - Readable text sizes (min 14px mobile)

---

## ✅ Success Criteria

### Functional Requirements
- ✅ All TMDB data displays correctly
- ✅ vidsrc.cc streams load and play without issues
- ✅ Search returns accurate results
- ✅ Watchlist adds/removes items correctly
- ✅ Settings persist across sessions
- ✅ TV show episode navigation works flawlessly
- ✅ Watch history tracks correctly

### Non-Functional Requirements
- ✅ Page load time < 2 seconds (on 4G)
- ✅ Lighthouse Performance score > 90
- ✅ Lighthouse Accessibility score > 95
- ✅ Zero console errors in production
- ✅ Works on Chrome, Firefox, Safari, Edge (latest versions)
- ✅ Mobile experience smooth and bug-free
- ✅ No layout shifts (CLS < 0.1)

### UI/UX Requirements
- ✅ Design modern and visually stunning
- ✅ Animations smooth (60fps)
- ✅ Hover states on all interactive elements
- ✅ Loading states for all async operations
- ✅ Error states handled gracefully
- ✅ Empty states have clear CTAs

---

## 🔐 Environment Variables

Create `.env` file in root:
```env
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

Create `.env.example` for reference:
```env
REACT_APP_TMDB_API_KEY=get_from_https://www.themoviedb.org/settings/api
```

---

## 📦 Dependencies

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

## 🎨 Design References

**Visual Inspiration:**
- Netflix (hero section, carousels)
- Disney+ (card hover effects)
- Apple TV+ (minimalist UI, typography)
- Plex (organization, metadata display)

**Key Design Principles:**
- **Minimalism:** Clean, uncluttered interfaces
- **Consistency:** Unified design language throughout
- **Hierarchy:** Clear visual hierarchy guides user attention
- **Feedback:** Immediate feedback for all user actions
- **Efficiency:** Minimize clicks to reach content

---

## 📞 Support & Notes

**For the AI Coding Agent:**
- Read each sprint file carefully before implementing
- Test each sprint thoroughly before moving to next
- Prioritize Sprint 10 (Video Player) as it's the most critical
- When in doubt, refer back to this overview document
- Maintain technical integrations EXACTLY as specified

**File Structure:**
- `PRD_OVERVIEW.md` - This file (main overview)
- `SPRINT_01.md` through `SPRINT_15.md` - Detailed sprint implementations
- Implement sprints sequentially for best results

---

**END OF OVERVIEW DOCUMENT**
