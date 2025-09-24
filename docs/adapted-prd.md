### Summary

A responsive React SPA for movie and TV show discovery and streaming that provides instant search, trending content, and seamless playback through VidSrc embeds. The application uses TMDB API for metadata and integrates directly with VidSrc for streaming, offering a clean, fast, and accessible user experience without any backend dependencies.

### Goals

- Provide instant search and discovery with rich metadata from TMDB API
- Offer one-click streaming via VidSrc embeds with fallback options
- Deliver a fast, accessible, mobile-first UI with smooth loading and navigation
- Enable offline-capable features through localStorage for watchlist and preferences

### Non-goals

- Backend API development or server-side processing
- Region-specific availability checking or provider management
- Account management, payments, or DRM handling
- Content hosting or media proxying

### Target users

- Movie and TV enthusiasts seeking quick discovery and streaming
- Users who want a simple, no-frills streaming interface
- Casual browsers who prefer trailers, ratings, and instant playback
- Mobile users who need a responsive, touch-friendly experience

### Success metrics

- Time-to-first-content < 1.5s on 3G networks
- Largest Contentful Paint < 2s, CLS < 0.1, Lighthouse Perf ≥ 85
- Search-to-click-through ≥ 40%
- "Watch now" click-through ≥ 25%
- Bounce rate on first page ≤ 35%

### Scope (MVP)

- Global search for movies and TV shows with TMDB integration
- Home: Trending, Popular, Top Rated content sections
- Detail pages: synopsis, cast, ratings, trailers, similar content
- Player page: VidSrc embed integration with fallback options
- Watchlist (localStorage persistence)
- Basic settings: theme, content ratings filter
- Responsive design for mobile, tablet, and desktop

### Information architecture

- Home (/)
- Search (/search?q=)
- Detail (/movie/:id, /tv/:id)
- Player (/play/:type/:id) [VidSrc embed]
- Watchlist (/watchlist)
- Settings (/settings)

### Core user stories

- As a visitor, search titles and see instant results with posters, ratings, and metadata
- As a viewer, open a detail page and see comprehensive information with a one-click "Watch now" button
- As a user, stream content via embedded VidSrc player with automatic quality adjustment
- As a user, add/remove items from a localStorage-based watchlist and resume quickly

### UI requirements

- Design system: 8px spacing grid, fluid container widths, dark mode default with light mode toggle, WCAG AA contrast, 14–18px base font scale, Inter or system font
- Components: AppShell, AppHeader with search, MediaCard, Carousel, Tabs, Badge (quality/rating), Button (primary/ghost), Chip (genre), Skeleton loaders, Toasts, Modal, Responsive Grid
- Interactions: hover elevation on cards, lazy-loaded images with blur-up, sticky header search, keyboard-accessible nav, focus rings, pull-to-refresh on mobile
- Animations: 150–200ms ease-out transitions; route transitions via skeletons
- Visual polish: thumbnail aspect ratios consistent (2:3 posters, 16:9 backdrops), line-clamp for overviews, quality badges (HD/4K), IMDb/ratings chips

### Accessibility

- Semantic landmarks, ARIA labels for carousels, 44px minimum touch targets, full keyboard navigation, captions toggle when available, reduced motion preference

### Data and integrations

- **Metadata provider**: TMDB API for comprehensive movie/TV metadata, images, cast, ratings, and trailers
- **Streaming provider**: VidSrc.xyz for direct embed integration with multiple fallback URLs
- **Storage**: localStorage for watchlist persistence and user preferences
- **Caching**: HTTP caching for TMDB API responses + client-side cache for improved performance

Note: TMDB API requires no API key for basic endpoints. VidSrc integration works with direct embed URLs using TMDB IDs.

### API integration (frontend-only)

- **TMDB API endpoints**:
  - GET /search/multi?q=&page= - Universal search for movies and TV
  - GET /movie/popular, /movie/top_rated, /movie/now_playing - Movie collections
  - GET /tv/popular, /tv/top_rated, /tv/airing_today - TV collections
  - GET /trending/all/week - Trending content
  - GET /movie/:id, /tv/:id - Detailed metadata
  - GET /movie/:id/credits, /tv/:id/credits - Cast and crew
  - GET /movie/:id/similar, /tv/:id/similar - Recommendations

- **VidSrc integration**:
  - Direct embed URLs: https://vidsrc.xyz/embed/movie/{tmdbId}
  - TV episodes: https://vidsrc.xyz/embed/tv/{tmdbId}/{season}/{episode}
  - Multiple fallback domains for reliability
  - No API key or authentication required

### Player behavior

- **Primary streaming**: Direct VidSrc embed in responsive iframe container
- **Fallback options**: Multiple VidSrc backup domains and alternative embed sources
- **Error handling**: Graceful fallback to alternative sources with user notification
- **Mobile optimization**: Touch-friendly controls and responsive sizing
- **Quality**: Automatic quality adjustment based on connection speed

### Screens and acceptance criteria

**Home**
- Hero carousel with trending content (6-8 items)
- Popular movies section with horizontal scrolling
- Top rated content section
- TV shows section with airing today highlights
- Skeletons visible < 300ms; content within 1.5s on 3G
- Infinite scroll or pagination for additional content

**Search**
- Debounced input (300ms), real-time results with infinite scroll
- Combined movie and TV results with type indicators
- Empty state with trending suggestions and genres
- Keyboard navigation and Enter to open top result
- Recent searches stored in localStorage

**Detail**
- Hero section with backdrop, title, year, runtime, rating chips
- Overview tab with synopsis and key details
- Cast tab with scrollable actor cards
- Trailers tab with embedded YouTube player
- Similar content recommendations
- "Watch now" button with immediate VidSrc embed loading

**Player**
- Full-screen capable iframe container
- Loading states and error handling
- Fallback options with user choice
- Mobile-responsive controls
- Back navigation to detail page

**Watchlist**
- Grid layout with poster, title, and quick actions
- Sort by date added, rating, or title
- Bulk remove functionality
- Empty state with discovery suggestions
- Persistent storage across sessions

**Settings**
- Theme toggle (dark/light mode)
- Content rating filter
- Clear watchlist option
- Clear cache option
- About section with app information

### Performance and quality

- **Image optimization**: TMDB image CDN with responsive srcsets and WebP support
- **Code splitting**: Route-level lazy loading with prefetch on hover
- **Caching strategy**: SWR pattern for API calls with stale-while-revalidate
- **Bundle optimization**: Tree shaking, compression, and minimal dependencies
- **Lighthouse targets**: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 85

### State and storage

- **Global state**: User preferences, current search, active filters
- **Local storage**: Watchlist items, user preferences, recent searches
- **Session storage**: Temporary UI state, form data
- **Memory cache**: API responses, processed metadata

### Security and compliance

- **Content Security Policy**: Restrictive iframe sandboxing for VidSrc embeds
- **HTTPS enforcement**: All external resources loaded over HTTPS
- **No data collection**: Pure frontend app with no analytics or tracking
- **Legal compliance**: Only embeds authorized content, no hosting or proxying

### Implementation plan

**Phase 1: Foundation (Week 1)**
- Set up React app structure with routing and state management
- Implement design system and theme configuration
- Create basic layout components (AppShell, Header, Navigation)
- Set up TMDB API integration with error handling
- Implement localStorage utilities for persistence

**Phase 2: Core Features (Week 2)**
- Build home page with trending and popular content sections
- Implement search functionality with debouncing and results
- Create detail pages for movies and TV shows
- Add watchlist functionality with localStorage persistence
- Implement responsive grid and carousel components

**Phase 3: Streaming Integration (Week 3)**
- Integrate VidSrc embed player with fallback options
- Build player page with error handling and mobile optimization
- Add trailer modal functionality
- Implement settings page with preferences
- Add loading states and skeleton screens

**Phase 4: Polish and Testing (Week 4)**
- Performance optimization and image lazy loading
- Accessibility improvements and keyboard navigation
- Cross-browser testing and mobile responsiveness
- Error boundary implementation
- Final UI/UX refinements and animations

### Testing strategy

- **Unit tests**: Components, utilities, and API integration functions
- **Integration tests**: Search → detail → player user flows
- **E2E tests**: Critical user paths with mobile viewport testing
- **Performance tests**: Lighthouse CI with performance budgets
- **Accessibility tests**: Automated axe checks and manual keyboard testing

### Deployment considerations

- **Static hosting**: Deploy to CDN-enabled platforms (Netlify, Vercel, GitHub Pages)
- **Environment configuration**: TMDB API base URL and image CDN settings
- **PWA features**: Service worker for offline capability, manifest for installability
- **Performance monitoring**: Core Web Vitals tracking and error reporting

### Risk mitigation

- **API rate limits**: Implement request caching and retry logic
- **Streaming availability**: Multiple fallback sources and graceful error handling
- **Network issues**: Offline-first approach with cached content
- **Browser compatibility**: Progressive enhancement and polyfill strategy

### Future enhancements

- **Enhanced search**: Genre-based filtering and advanced search options
- **Social features**: Share functionality and recommendations
- **Personalization**: Continue watching and viewing history
- **Performance**: Virtual scrolling for large lists and advanced caching

This adapted PRD maintains the core user experience while dramatically simplifying the technical architecture through frontend-only implementation with direct TMDB and VidSrc integration.

-------------------------------------------------------------