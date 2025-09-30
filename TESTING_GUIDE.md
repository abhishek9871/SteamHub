# Testing Guide - TV Series Binge-Watching Features

## Quick Start

**Run the development server:**
```powershell
npm start
```

The app will open at `http://localhost:3000`

## 🎬 Test Scenarios

### 1. Movie Playback (Already Working)
**Steps:**
1. Go to homepage
2. Click any movie thumbnail
3. Click "Watch Now" button
4. **Expected**: Movie plays in vidsrc.cc player without obstructions

**Verify:**
- ✅ Clean full-screen player
- ✅ No blocking overlays
- ✅ Movie details shown below
- ✅ Back button works

---

### 2. TV Series - Basic Playback
**Steps:**
1. Go to homepage
2. Click any TV show (e.g., Game of Thrones, Breaking Bad)
3. Click "Watch Now"
4. **Expected**: First episode (S01E01) starts playing

**Verify:**
- ✅ Header shows "Show Title S1:E1"
- ✅ Episode title shown below show name
- ✅ "Episodes" button visible in header
- ✅ Player loads correctly

---

### 3. Episode Selector
**Steps:**
1. While watching a TV show
2. Click "Episodes" button in header
3. **Expected**: Episode selector dropdown opens

**Verify:**
- ✅ Season buttons displayed at top
- ✅ Episode grid shown below
- ✅ Each episode card shows:
  - Episode thumbnail (or placeholder)
  - Episode number badge
  - Episode title
  - Episode overview
- ✅ Current episode highlighted with "NOW PLAYING"
- ✅ Hover effects work on cards

**Test Season Switching:**
1. Click "Season 2" button
2. **Expected**: Episodes update to Season 2

**Test Episode Selection:**
1. Click any episode card
2. **Expected**: 
   - Dropdown closes
   - Selected episode starts playing
   - URL updates to `?season=X&episode=Y`

---

### 4. Episode Navigation Buttons
**Steps:**
1. Scroll down below player to details section
2. Look for "Previous Episode" and "Next Episode" buttons

**Verify:**
- ✅ "Previous Episode" disabled on S01E01
- ✅ "Next Episode" enabled (unless last episode)
- ✅ Clicking "Next Episode" loads next episode
- ✅ At end of season, goes to S02E01

---

### 5. Watch Progress Tracking
**Steps:**
1. Watch S01E01 (or let it load)
2. Switch to S01E02
3. Open episode selector
4. **Expected**: S01E01 has green checkmark badge

**Verify:**
- ✅ Watched episodes show checkmark ✓
- ✅ Watched episodes slightly dimmed (opacity 0.7)
- ✅ Progress persists after page refresh

**Check LocalStorage:**
1. Open DevTools (F12)
2. Go to Application > Local Storage
3. Look for key: `watched_{showId}`
4. **Expected**: Array like `["1-1", "1-2"]`

---

### 6. Auto-Play Next Episode (Demo)
**Note:** In the current implementation, auto-play is triggered by iframe load event. To properly test auto-play, you would need to:

**Simulated Test:**
1. Watch an episode to completion
2. **Expected** (when video ends):
   - Popup appears in bottom-right corner
   - Shows "Next Episode: S1:E2 [Episode Name]"
   - Countdown starts from 10 seconds
   - Two buttons: "Cancel" and "Play Now"

**What to verify:**
- ✅ Popup slides in from right
- ✅ Countdown decrements every second
- ✅ "Cancel" button stops auto-play
- ✅ "Play Now" immediately loads next episode
- ✅ At 0 seconds, next episode loads automatically

**Manual Testing:**
1. Open Player.js
2. Find line ~108 (commented out timeout)
3. Uncomment to enable 30-second simulation:
```javascript
autoPlayTimeoutRef.current = setTimeout(() => {
  handleEpisodeEnd();
}, 30000); // Triggers after 30 seconds
```

---

### 7. Series Completion
**Steps:**
1. Navigate to last episode of a short series
2. Click "Next Episode" (or wait for auto-play)
3. **Expected**: 
   - Series complete popup appears
   - After 3 seconds, redirects to `/series-complete/{id}`

**On Completion Page, verify:**
- ✅ Animated checkmark icon
- ✅ Show title and rating displayed
- ✅ "You've Completed [Show Name]"
- ✅ "Watch Again" button → restarts S01E01
- ✅ "Browse More" button → goes to homepage
- ✅ Similar shows grid (6 shows)
- ✅ Each show card has "Watch Now" overlay
- ✅ "Keep the Momentum Going" section
- ✅ "Explore More Content" button

---

### 8. Deep Linking
**Test direct episode URLs:**

**Breaking Bad S01E01:**
```
http://localhost:3000/play/tv/1396?season=1&episode=1
```

**Game of Thrones S03E09:**
```
http://localhost:3000/play/tv/1399?season=3&episode=9
```

**Verify:**
- ✅ Specified episode loads directly
- ✅ Season and episode selector show correct values
- ✅ URL can be shared/bookmarked

---

### 9. Responsive Design
**Desktop (> 1024px):**
- Open app on full screen
- **Verify**: 
  - Episode grid: 3-4 columns
  - Details section: side-by-side poster and info
  - Large player (80vh)

**Tablet (768px - 1024px):**
- Open DevTools (F12) → Toggle device toolbar
- Select iPad or similar
- **Verify**:
  - Episode grid: 2-3 columns
  - Readable fonts
  - Touch-friendly buttons

**Mobile (< 768px):**
- Select iPhone or similar device
- **Verify**:
  - Episode grid: 1 column
  - Stacked layout (poster above details)
  - Player height: 60vh
  - Episode selector: full-width overlay
  - Large, touch-friendly buttons
  - Episode info fits in header (or wraps)

---

### 10. Error Handling
**Test error states:**

**Invalid Show ID:**
```
http://localhost:3000/play/tv/999999999
```
**Expected**: Error page with "Try Again" button

**No Internet:**
1. Disconnect internet
2. Try loading a show
3. **Expected**: Error message about network

---

## 🎨 Visual Testing Checklist

### Player Header
- [ ] Back button (left arrow)
- [ ] Show title
- [ ] Episode info badge (S1:E1)
- [ ] Episode title below
- [ ] "Episodes" button
- [ ] External link button

### Episode Selector
- [ ] Smooth dropdown animation
- [ ] Season selector with buttons
- [ ] Active season highlighted (red)
- [ ] Episode cards in grid
- [ ] Thumbnails load correctly
- [ ] Episode numbers visible
- [ ] Watched badges appear
- [ ] "NOW PLAYING" badge on current
- [ ] Hover effects on cards
- [ ] Click to play works

### Next Episode Popup
- [ ] Appears in bottom-right
- [ ] Slides in animation
- [ ] Dark background with blur
- [ ] Next episode info clear
- [ ] Countdown updates
- [ ] Cancel button (left)
- [ ] Play Now button (right, red)

### Series Complete Page
- [ ] Hero section with backdrop
- [ ] Animated checkmark icon
- [ ] Show title large and bold
- [ ] Rating displayed
- [ ] Action buttons work
- [ ] Similar shows grid
- [ ] Hover effects on show cards
- [ ] "Continue" section at bottom

---

## 🐛 Common Issues & Fixes

### Issue: Episodes don't load
**Fix:** Check TMDB API key in `.env` file

### Issue: No thumbnails for episodes
**Cause:** Some shows don't have episode thumbnails in TMDB
**Expected:** Placeholder with play icon appears

### Issue: Auto-play doesn't trigger
**Cause:** Currently simulated, not tied to video end event
**Fix:** Uncomment the timeout in handleIframeLoad (line ~108)

### Issue: Watched episodes not saving
**Fix:** Check browser localStorage permissions

### Issue: Player not loading
**Cause:** vidsrc.cc might be temporarily down
**Try:** Refresh page or wait a moment

---

## 📊 Performance Testing

### Load Times
**Acceptable:**
- Initial player load: < 2 seconds
- Episode switch: < 1 second
- Season data fetch: < 500ms

**Test:**
1. Open DevTools Network tab
2. Load a TV show
3. Check request timings

### Memory Usage
**Test long session:**
1. Open DevTools Performance/Memory tab
2. Watch 5+ episodes in sequence
3. **Expected**: Memory stays stable (no major leaks)

---

## ✅ Final Acceptance Criteria

### Movies
- ✅ Movies play without obstructions
- ✅ Clean, professional UI
- ✅ Movie details display correctly

### TV Series
- ✅ Episodes play correctly
- ✅ Season/episode selector works
- ✅ Navigation between episodes smooth
- ✅ Watch progress tracked
- ✅ Auto-play popup functional
- ✅ Series completion page shows

### Overall
- ✅ Responsive on all devices
- ✅ Fast performance
- ✅ No console errors
- ✅ Professional appearance
- ✅ Intuitive user experience

---

## 🚀 Ready to Test!

Run this command to start testing:

```powershell
npm start
```

Then follow the test scenarios above. Enjoy your Netflix-like streaming experience! 🎉
