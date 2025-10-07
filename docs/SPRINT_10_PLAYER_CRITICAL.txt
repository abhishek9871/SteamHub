# SPRINT 10: Video Player (CRITICAL IMPLEMENTATION)

## ⚠️ MOST IMPORTANT SPRINT - READ CAREFULLY

This is the core functionality of the application. The player MUST work flawlessly.

---

## Task 10.1: Movie Player Implementation

**File:** `src/components/pages/Player.jsx`

**Critical Requirements:**
1. Use exact vidsrc.cc format: `https://vidsrc.cc/v2/embed/movie/{TMDB_ID}?autoplay=1&autonext=1`
2. TMDB ID only (not IMDb)
3. Proper iframe sandbox attributes
4. Loading and error states

**Implementation:**
```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getMovieDetails, getTVDetails, getSeasonDetails } from '../../services/tmdb.service';

const Player = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [content, setContent] = useState(null);
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  
  // TV-specific
  const [season, setSeason] = useState(parseInt(searchParams.get('season')) || 1);
  const [episode, setEpisode] = useState(parseInt(searchParams.get('episode')) || 1);

  useEffect(() => {
    loadContent();
  }, [type, id, season, episode]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (type === 'movie') {
        const data = await getMovieDetails(id);
        setContent(data);
        setStreamUrl(`https://vidsrc.cc/v2/embed/movie/${id}?autoplay=1&autonext=1`);
      } else {
        const data = await getTVDetails(id);
        setContent(data);
        setStreamUrl(`https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoplay=1&autonext=1`);
      }
    } catch (error) {
      console.error('Player error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark-100">
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={streamUrl}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
        />
      </div>
    </div>
  );
};

export default Player;
```

---

## Task 10.2: Route Configuration

**File:** `src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Player from './components/pages/Player';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/play/:type/:id" element={<Player />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

---

## ✅ Testing Checklist

1. **Movie Test:**
   - Navigate to `/play/movie/550` (Fight Club)
   - Verify URL: `https://vidsrc.cc/v2/embed/movie/550?autoplay=1&autonext=1`
   - Video should load and play

2. **TV Test:**
   - Navigate to `/play/tv/1396?season=1&episode=1` (Breaking Bad S1E1)
   - Verify URL: `https://vidsrc.cc/v2/embed/tv/1396/1/1?autoplay=1&autonext=1`
   - Video should load and play

3. **Error Handling:**
   - Invalid ID should show error message
   - Network error should be handled gracefully

---

**CRITICAL: The player URL format must be EXACTLY as shown above. Do not deviate.**
