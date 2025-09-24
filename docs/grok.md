### 1. Quality Options and Parameters

Based on current data from 2025, none of the providers (VidSrc.cc, GoDrivePlayer, Embed.su) support direct URL parameters like 'quality=1080p' or 'hls=true' to force specific resolutions in embed URLs. Instead, quality is handled within the embedded player or by parsing the streaming manifest (typically HLS/M3U8 files). The streams are often adaptive, meaning the player auto-adjusts based on bandwidth, but manual selection is possible via player controls or programmatic parsing.

- **VidSrc.cc (and variants like vidsrc.me, vidsrc.to, vidsrc.icu)**:
  - No explicit quality parameters in embed URLs. Streams are mostly 1080p, with the player offering a range of options (e.g., 360p to 1080p) if available from sources.
  - Embed URL examples:
    - Movie: `https://vidsrc.to/embed/movie/tt17048514` (uses IMDb ID with 'tt' prefix or TMDB ID).
    - TV Show: `https://vidsrc.to/embed/tv/tt18382028/1/5` (includes season and episode).
  - To access higher quality, fetch the underlying M3U8 stream via unofficial scrapers (e.g., from GitHub repos like cool-dev-guy/vidsrc-api). The M3U8 contains variants for different resolutions/bitrates.

- **GoDrivePlayer**:
  - No quality parameters in URLs. The player supports multiple qualities, mostly up to 1080p, auto-updating to the best available.
  - Embed URL examples:
    - Movie: `https://godriveplayer.com/player.php?imdb=tt17048514`.
    - TV Show: `https://godriveplayer.com/player.php?type=series&tmdb=230424&season=1&episode=1` (uses TMDB ID for series).
  - Quality is selected in the player interface; no flags like 'quality=1080p'.

- **Embed.su**:
  - Limited data available; API uses TMDB or IMDb IDs for embeds, but no quality parameters documented. Streams are adaptive, with player-based selection.
  - Embed URL examples:
    - Movie: `https://embed.su/embed/movie/tt17048514` (assumed format based on similar providers; exact docs were inaccessible).
    - TV Show: `https://embed.su/embed/tv/tt18382028/1/5`.
  - No flags for 'quality=1080p' or similar.

In all cases, for higher quality, integrate an HLS player (e.g., hls.js) and parse M3U8 files to list/select variants programmatically.

### 2. API Integration for Quality

These providers do not have formal, documented APIs with authentication for quality querying. Instead, they rely on embed iframes or unofficial scrapers/APIs from community sources (e.g., GitHub). No endpoints require auth; they are public but unstable.

- **VidSrc.cc**:
  - Unofficial API endpoints (from vidsrc.to and scrapers):
    - List movies: `https://vidsrc.to/vapi/movie/new` (returns JSON with IDs; paginate with `/new/{page}`).
    - List TV: `https://vidsrc.to/vapi/tv/new`.
    - Streaming: Use scrapers like `https://api.vercel.app/vidsrc/{imdb_id}?s=1&e=2` (from RageshAntony/vidsrc-api-stermio).
  - Example request (GET): `https://api.vercel.app/vidsrc/tt17048514`.
  - Response (JSON):
    ```
    {
      "status": 200,
      "sources": [
        {"name": "Source1", "data": {"stream": "https://example.m3u8", "subtitle": [...]}}
      ]
    }
    ```
  - To query qualities: Fetch the M3U8 URL from "stream", parse it for variants (e.g., using hls.js). Auto-select highest: Scan for highest bandwidth/resolution (e.g., >1920x1080 for 4K).
  - No official docs; use GitHub repos for examples.

- **GoDrivePlayer**:
  - No formal API beyond embeds. Unofficial scrapers exist but lack quality-specific endpoints.
  - Programmatic selection: Embed the player and use postMessage to query qualities (if supported), or scrape the M3U8.

- **Embed.su**:
  - API endpoints mentioned but inaccessible; uses TMDB/IMDB IDs for embeds.
  - No quality querying; similar to above, parse M3U8 post-embed.

To auto-select best quality: In code, load M3U8, extract variants (e.g., via regex for RESOLUTION lines), and load the highest matching one.

### 3. Provider-Specific Quality Features

- **VidSrc.cc**:
  - Supports HLS via M3U8 streams. 4K not explicitly available (mostly 1080p). Player has built-in quality selector.
  - Workarounds for HD/4K: Use hls.js to parse M3U8 and force highest variant. If 4K absent, fallback to 1080p.

- **GoDrivePlayer**:
  - Quality options in player (up to 1080p). No 4K mentioned.
  - Mirrors/alternatives: FMHY wiki suggests sites like StreamEast or TvShows4Mobile, but none with direct quality params. Use as fallbacks if main fails.

- **Embed.su**:
  - Available levels: Adaptive up to 1080p (assumed). No 'vip' or 'premium' parameters documented; may require scraping.

### 4. Fallback and Rotation for Quality

- Implementation: Fetch M3U8, parse variants (e.g., using libraries like m3u8-parser). Sort by resolution/bitrate descending. Load highest; on error (e.g., 404), retry next.
- Best order: 4K (2160p) > 1080p > 720p > 540p > 360p.
- Issues in India: No specific quality degradation noted, but piracy sites may throttle international traffic. Use VPNs for stability; CAM prints common for new releases.

### 5. CSP and Technical Requirements

- Additional CSP directives: 
  - `frame-src 'self' *.vidsrc.* *.godriveplayer.com *.embed.su;`
  - `media-src blob: *.vidsrc.* *.godriveplayer.com *.embed.su;`
  - `connect-src *.vidsrc.* *.godriveplayer.com *.embed.su;` (for API fetches).
  - `img-src data: *.vidsrc.*;` (for posters).
- Headers/iframe attributes: Add `sandbox="allow-scripts allow-same-origin allow-popups"` to iframes. Set `referrerpolicy="no-referrer"` to avoid blocks. For quality selection, ensure `allowfullscreen` for full-screen HD.

### 6. Content Availability

- For titles like Superman (2025 release): Typically CAM/low-quality initially on these providers, upgrading to HD/1080p within weeks. 4K rare/ delayed. Patterns: New releases 80% CAM for 1-2 months, then 1080p. Stats: ~70% of catalog in 1080p, <10% in 4K across piracy sites.

### 7. Ads and Player Behavior Impact on Quality

- Ads (preroll/popups) delay loading, causing buffering/degradation. On illegal sites, they may inject malware or throttle streams.
- Minimize: Use adblockers (e.g., uBlock Origin), but this can break players. Buffering issues common in India due to geo-throttling; use VPN. Degradation: High ad load reduces effective bandwidth, dropping quality.

### 8. Legal/Compliance Notes

- Updates (2025): Piracy surging in India due to streaming fees; risks include fines (up to ₹2 lakh under Copyright Act), ISP blocks, or malware. Providers like these face shutdowns (e.g., Delhi HC injunctions on rogue sites). Disclaimers: "This app aggregates public links; users assume responsibility for content access. Not liable for copyright infringement."

### Human-Readable Summary and Prioritized Implementation Plan

Research shows these providers lack direct quality parameters, relying on adaptive HLS streams (mostly up to 1080p, rare 4K). Use scrapers to fetch M3U8, parse for qualities, and integrate an HLS player for selection. No formal APIs; rely on community tools. Legal risks high in India—use disclaimers.

**Prioritized Implementation Plan for React App (e.g., updating Player.js)**:
1. **Fetch Streams**: In Player.js, use axios to call scraper APIs (e.g., `https://api.vercel.app/vidsrc/{id}`) to get M3U8 URLs.
2. **Parse M3U8**: Use m3u8-parser library to extract variants; sort by resolution.
3. **Integrate HLS Player**: Replace embed iframe with react-hls-player or hls.js. Add dropdown for quality selection (e.g., use Headless UI).
4. **Fallback Logic**: On load error, switch to next variant. Rotate providers if one fails (VidSrc > GoDrivePlayer > Embed.su).
5. **CSP/Headers**: Update index.html/meta for CSP directives; add iframe attributes.
6. **Testing/Ads**: Test in India sim (VPN); implement ad-minimization via player config.
7. **Legal**: Add disclaimer modal on load. Deploy updates, monitor for site changes. If no options, fallback to alternatives like FMHY-listed mirrors.