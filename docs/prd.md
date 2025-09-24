### Summary

A responsive React SPA for movie discovery and playback that aggregates legitimate, globally available sources, shows accurate availability per region (including India), and provides a polished, premium UI experience. Playback occurs via deep links or authorized embeds from providers; the app does not host content.

### Goals

- Provide instant search, trending, and personalized discovery with region-aware availability.
- Offer one-click “Watch now” via deep links to legal providers or authorized embeds.
- Deliver a fast, accessible, mobile-first UI with smooth skeleton loading and snappy navigation.


### Non-goals

- Hosting or proxying copyrighted streams.
- Account management, payments, or DRM handling in v1.


### Target users

- Movie seekers who want “where to watch” with one click.
- Viewers in India who need region-specific availability.
- Casual browsers who prefer trailers, ratings, and quick decisions.


### Success metrics

- Time-to-first-poster < 1.2s on 4G.
- Largest Contentful Paint < 2.5s, CLS < 0.1, Lighthouse Perf ≥ 90.
- Search-to-click-through ≥ 35%.
- “Watch now” click-through ≥ 20%.
- Bounce rate on first page ≤ 30%.


### Scope (MVP)

- Global search for movies and TV.
- Home: Trending, Popular, Top Rated, and Continue Watching.
- Detail page: synopsis, cast, ratings, trailer, region availability, providers, seasons/episodes.
- Player page: authorized provider embed or deep link out.
- Watchlist (local storage).
- Region selector (auto-detect with override).
- Basic settings: theme, language, content ratings filter.


### Information architecture

- Home (/)
- Search (/search?q=)
- Detail (/movie/:id, /tv/:id)
- Player (/play/:type/:id) [embed or deep link]
- Watchlist (/watchlist)
- Settings (/settings)


### Core user stories

- As a visitor, search titles and see instant results with posters and ratings.
- As a viewer, open a detail page and see where to watch in my region, with a one-click button.
- As a user, play via embedded authorized player or jump to the provider app/site.
- As a user, add/remove items from a watchlist and resume quickly.


### UI requirements

- Design system: 8px spacing grid, fluid container widths, dark mode default with light mode toggle, WCAG AA contrast, 14–18px base font scale, Inter or system font.
- Components: AppShell, AppHeader with search, Sidebar (optional), MediaCard, Carousel, Tabs, Badge (quality/availability), Button (primary/ghost), Chip (genre), Skeleton loaders, Toasts, Modal, Responsive Grid.
- Interactions: hover elevation on cards, lazy-loaded images with blur-up, sticky header search, keyboard-accessible nav, focus rings, pull-to-refresh on mobile.
- Animations: 150–200ms ease-out transitions; route transitions via skeletons.
- Visual polish: thumbnail aspect ratios consistent (2:3 posters, 16:9 backdrops), line-clamp for overviews, iconography for provider types, quality badges (HD/4K), IMDb/ratings chips.


### Accessibility

- Semantic landmarks, ARIA labels for carousels, 44px minimum touch targets, full keyboard navigation, captions toggle when available, reduced motion preference.


### Data and integrations

- Metadata provider: movie/TV metadata (title, images, cast, ratings, trailers).
- Availability provider: region-aware “where to watch,” provider name, type (subscription, free with ads, rental), link, and optional embed permissions.
- Trailer provider: official trailer via authorized source.
- Region IP lookup: to auto-set region with a manual override.
- Caching: HTTP caching + client-side normalized cache (stale-while-revalidate).

Note: Use only licensed/authorized sources for embeds and direct playback; otherwise provide deep links (open in provider).

### API contracts (frontend expectations)

- GET /titles/search?q=\&type=\&year= returns minimal cards: id, type, title, year, poster, rating, popularity.
- GET /titles/:type/:id returns detail: title, synopsis, genres, duration, images, cast, crew, rating, trailerUrl, seasons/episodes (for TV).
- GET /availability/:type/:id?region=IN returns array of providers: { providerId, name, kind, quality, link, canEmbed, embedUrl? }.
- GET /trending?region=IN returns curated lists for Home.

The AI agent may implement these as a lightweight BFF (backend-for-frontend) that proxies whitelisted upstreams and normalizes responses.

### Player behavior

- If provider.canEmbed is true: open /play/:type/:id and render in an iframe with sandbox, allowfullscreen, and robust error fallback.
- Else: deep link to provider.link in new tab with provider badge and safety notice.
- Trailers: use authorized trailerUrl in the detail page modal.


### Screens and acceptance criteria

Home

- Carousels for Trending, Popular, Top Rated; 12 items per row desktop, 3–4 on mobile.
- Skeletons visible < 300ms; content within 1.2s on 4G.
- Region chip visible with manual override.

Search

- Debounced input (250ms), results grid with infinite scroll.
- Empty state with recent searches and genres to explore.
- Keyboard nav and Enter to open top result.

Detail

- Hero with backdrop, title, year, runtime, rating chips, watchlist toggle.
- Tabs: Overview, Cast, Trailers, Availability, Similar.
- Availability list shows providers for current region with “Watch now” buttons.

Player

- Title header, fallback poster, iframe (if allowed) or redirect chip.
- Error handling: if embed fails, show retry and deep link fallback.

Watchlist

- Local storage persistence, sort by added date, quick remove, bulk clear.

Settings

- Theme, language (English default), region override, content rating filter.


### Performance and quality

- Image CDNs with responsive srcsets and WebP/AVIF.
- Route-level code splitting; prefetch on hover.
- SWR/RTK Query for cache; optimistic UI for watchlist actions.
- Lighthouse targets: Perf ≥ 90, PWA ready, A11y ≥ 95.


### State and storage

- Global state: user prefs, region, watchlist, last-played.
- Local storage: watchlist and preferences.
- In-memory cache: query results, availability per region.


### Security and compliance

- Only render embeds with explicit permission; sandbox iframes with restrictive allow attributes.
- CSP headers to limit frame ancestors and media sources.
- No content hosting or proxying media; link/iframe only when authorized.


### AI agent implementation plan

Milestone 1: Project scaffold

- Create React app with routing, state library, design system, theming, and linting.
- Implement AppShell, Header, SearchBar, MediaCard, Skeletons.

Milestone 2: Data integration

- Wire metadata search, trends, and detail pages.
- Build availability adapter for region-aware providers.
- Region detection with override.

Milestone 3: Playback

- Player page with authorized embeds and deep-link fallback.
- Trailer modal.

Milestone 4: UX polish

- Skeletons, transitions, responsive grid, accessibility pass.
- Watchlist and recent searches.

Milestone 5: QA and deploy

- Unit tests for adapters and components.
- Lighthouse and Web Vitals gating in CI.
- Deploy with CDN and immutable asset caching.


### Testing

- Unit: components, hooks, adapters.
- Integration: search → detail → play happy paths.
- E2E: mobile viewport flows, offline fallback for pages and assets.
- Accessibility: Axe checks and keyboard-only runs.


### Telemetry

- Events: search_used, detail_viewed, provider_clicked, embed_started, embed_error, watchlist_add/remove, region_changed.
- Performance: route TTFB, LCP, CLS, FID; player start time.


### Risks and mitigations

- Provider changes: abstract via adapter layer; health checks and rotation.
- Regional availability gaps: show alternative providers and “notify me” stub.
- Slow networks: aggressive image optimization and skeleton-first rendering.


### Rollout

- Internal dogfood → limited beta (10% traffic) → 100% rollout with feature flags for embeds per provider and region.


### Open questions

- Monetization (ads, affiliate deep links) in later iterations.
- Multi-language metadata and subtitles prioritization in India.
- TV episode-level availability prioritization for binge UX.

This PRD keeps implementation straightforward, the UI crisp and performant, and ensures region-aware “watch now” with only authorized embeds or deep links.

-------------------------------------------------------------


