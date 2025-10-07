# PRD Documentation - Complete Package

## 📋 Overview

I've created a comprehensive Product Requirements Document (PRD) package for rebuilding your streaming application from scratch using an AI wipe coding tool. This package is designed to produce a **flawless, modern, bug-free application** that maintains your current technical integrations (TMDB API + vidsrc.cc) while delivering a stunning, ultra-modern UI/UX.

---

## 📁 Files Created

### 1. **PRD_OVERVIEW.md** - Main Overview Document
**What it contains:**
- Executive summary and core objectives
- Complete technical stack specifications
- Design system (colors, typography, spacing)
- Application architecture and folder structure
- Routing structure
- All 15 sprints overview
- Success criteria and implementation guidelines

**Use this for:** Understanding the complete project scope and technical requirements

---

### 2. **SPRINT_01_TO_05.md** - Foundation Sprints
**What it contains:**
- **Sprint 1:** Project setup, TailwindCSS configuration, design system
- **Sprint 2:** TMDB API service, vidsrc service, localStorage service
- **Sprint 3:** Common components (Button, Card, Modal, Loader)
- **Sprint 4:** Layout components (Header, Footer)
- **Sprint 5:** React Context for state management

**Use this for:** Setting up the project foundation and core infrastructure

---

### 3. **SPRINT_10_PLAYER_CRITICAL.md** - Player Implementation
**What it contains:**
- Complete video player implementation
- EXACT vidsrc.cc embed format (CRITICAL)
- Movie and TV show player code
- Testing checklist
- Route configuration

**⚠️ THIS IS THE MOST CRITICAL FILE**

The player is the heart of your application. This file contains the exact implementation with the correct vidsrc.cc URL format:
- Movies: `https://vidsrc.cc/v2/embed/movie/{TMDB_ID}?autoplay=1&autonext=1`
- TV: `https://vidsrc.cc/v2/embed/tv/{TMDB_ID}/{SEASON}/{EPISODE}?autoplay=1&autonext=1`

---

### 4. **IMPLEMENTATION_GUIDE.md** - AI Agent Instructions
**What it contains:**
- Step-by-step implementation order (Phase 1-5)
- Critical technical requirements
- UI/UX requirements with exact specifications
- Testing checklist (functional, UI, player)
- Common pitfalls to avoid
- Success criteria
- Quick start commands

**Use this for:** Giving to the AI wipe coding tool as primary instructions

---

## 🎯 How to Use This PRD Package

### For AI Wipe Coding Tools (Claude, Cursor, v0, Bolt.new, etc.)

**Step 1: Start with IMPLEMENTATION_GUIDE.md**
This is your primary instruction file. Give this to the AI tool first as it contains:
- Clear phase-by-phase implementation order
- Critical technical requirements
- Exact code specifications

**Step 2: Reference PRD_OVERVIEW.md for details**
When the AI needs more context about:
- Design system specifics
- Complete architecture
- Success criteria
- Overall project scope

**Step 3: Use SPRINT_10_PLAYER_CRITICAL.md for player**
When implementing the video player (MOST CRITICAL):
- Show this file to ensure correct vidsrc.cc format
- Verify the exact URL structure
- Use the provided testing checklist

**Step 4: Use SPRINT_01_TO_05.md for foundation**
When setting up the project foundation:
- Complete service implementations
- Component library creation
- State management setup

---

## 🚀 Recommended Workflow

### Option A: Full Implementation (10 days)
```
Day 1-2:  Foundation (Sprint 1-2) - Setup + Services
Day 3-4:  Components (Sprint 3-5) - UI Library + State
Day 5-6:  Home Page (Sprint 6) - Hero + Carousels
Day 7:    Detail Pages (Sprint 8-9) - Movie/TV Details
Day 8:    Player (Sprint 10) ⚠️ CRITICAL
Day 9:    Watchlist + Settings (Sprint 11-12)
Day 10:   Polish + Testing (Sprint 13-15)
```

### Option B: MVP Implementation (5 days)
```
Day 1:  Setup + Services (Sprint 1-2)
Day 2:  Core Components (Sprint 3)
Day 3:  Home Page (Sprint 6)
Day 4:  Player (Sprint 10) ⚠️ CRITICAL
Day 5:  Testing + Polish
```

### Option C: Player-First Approach (3 days)
```
Day 1:  Minimal setup + Player (Sprint 10) ⚠️ CRITICAL
Day 2:  Home page with basic cards
Day 3:  Detail pages + Polish
```

---

## 🎨 Key Differentiators from Current App

### What Makes This Better:

1. **Modern UI/UX**
   - Netflix-inspired dark theme
   - Smooth animations and transitions
   - Beautiful hover effects
   - Perfect responsive design

2. **Better Architecture**
   - Clean folder structure
   - Reusable component library
   - Proper separation of concerns
   - TailwindCSS for consistent styling

3. **Enhanced UX**
   - Loading skeletons everywhere
   - Better error handling
   - Smooth page transitions
   - Intuitive navigation

4. **Performance**
   - Lazy loading images
   - Code splitting
   - Optimized re-renders
   - Fast page loads

5. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Focus indicators
   - Screen reader support

---

## ⚠️ Critical Technical Points

### MUST MAINTAIN (DO NOT CHANGE):

1. **vidsrc.cc URL Format:**
   ```
   Movies: https://vidsrc.cc/v2/embed/movie/{TMDB_ID}?autoplay=1&autonext=1
   TV: https://vidsrc.cc/v2/embed/tv/{TMDB_ID}/{SEASON}/{EPISODE}?autoplay=1&autonext=1
   ```
   **Use TMDB ID, not IMDb ID**

2. **TMDB API Integration:**
   ```
   Base: https://api.themoviedb.org/3
   API Key: From .env file (REACT_APP_TMDB_API_KEY)
   Images: https://image.tmdb.org/t/p/{size}/{path}
   ```

3. **No Backend:**
   - 100% frontend application
   - localStorage for persistence
   - No server-side code

---

## ✅ Success Criteria

### The final application MUST:
- [ ] Load home page with hero and carousels
- [ ] Play movies via vidsrc.cc embed
- [ ] Play TV shows with correct season/episode
- [ ] Navigate between episodes smoothly
- [ ] Show movie/TV details with TMDB data
- [ ] Save and load watchlist from localStorage
- [ ] Work perfectly on mobile, tablet, and desktop
- [ ] Have zero console errors
- [ ] Display beautiful, modern UI
- [ ] Load quickly (< 2 seconds)

---

## 🐛 Known Issues from Current App (To Fix)

Based on your current codebase, ensure these are fixed:

1. **UI Issues:**
   - Inconsistent spacing and alignment
   - Poor mobile responsiveness
   - Missing loading states
   - Weak hover effects

2. **Functional Issues:**
   - Error handling incomplete
   - No proper loading indicators
   - Watch history not robust
   - Search debouncing missing

3. **Technical Debt:**
   - Scattered component structure
   - Inline styles mixed with CSS
   - No consistent design system
   - Manual CSS instead of utility classes

---

## 📞 Support for AI Agent

### If AI Agent Gets Stuck:

1. **On Player Implementation:**
   - Refer to SPRINT_10_PLAYER_CRITICAL.md
   - Verify exact URL format
   - Check iframe sandbox attributes

2. **On Design System:**
   - Refer to PRD_OVERVIEW.md Design System section
   - Use TailwindCSS utility classes
   - Follow color palette exactly

3. **On Architecture:**
   - Refer to PRD_OVERVIEW.md folder structure
   - Keep components organized
   - Separate concerns properly

4. **On TMDB Integration:**
   - Refer to SPRINT_01_TO_05.md Task 2.1
   - Use axios with interceptors
   - Handle errors properly

---

## 🎯 Priority Order for AI Agent

**If you can only implement some features, prioritize in this order:**

1. **🔥 CRITICAL - Video Player (Sprint 10)**
   - Without this, the app is useless
   - Must work perfectly for movies and TV shows

2. **🔥 HIGH - Home Page (Sprint 6)**
   - First impression matters
   - Hero + basic carousels minimum

3. **🔥 HIGH - Content Cards (Sprint 3)**
   - Reusable across app
   - Need hover effects and links

4. **MEDIUM - Detail Pages (Sprint 8-9)**
   - Important for UX
   - Can be simplified if needed

5. **MEDIUM - Search (Sprint 7)**
   - Nice to have
   - Can start with basic version

6. **LOW - Watchlist (Sprint 11)**
   - Good feature
   - Not critical for v1

7. **LOW - Settings (Sprint 12)**
   - Can be minimal
   - Add later

---

## 📊 Estimated Implementation Time

**With AI Wipe Coding Tool:**
- Minimum MVP: 6-8 hours (Player + Home + Basic Nav)
- Full Featured: 2-3 days (All features + Polish)
- Production Ready: 4-5 days (Everything + Testing)

**Manual Coding:**
- MVP: 3-4 days
- Full Featured: 7-10 days
- Production Ready: 12-15 days

---

## 🏆 Final Notes

This PRD package is designed to give an AI coding agent **everything it needs** to build your application from scratch with:

✅ **Better UI** - Modern, beautiful, responsive  
✅ **Better UX** - Smooth, intuitive, delightful  
✅ **Better Code** - Clean, organized, maintainable  
✅ **Same Tech** - TMDB + vidsrc.cc exactly as you use now  
✅ **Zero Bugs** - Comprehensive error handling  
✅ **Perfect Player** - Flawless streaming experience  

**The result will be a production-ready streaming app that's 100x better than your current one.**

---

**Need to give to AI tool?** → Start with `IMPLEMENTATION_GUIDE.md`  
**Need technical details?** → Check `PRD_OVERVIEW.md`  
**Need player specifics?** → Read `SPRINT_10_PLAYER_CRITICAL.md`  

Good luck with your rebuild! 🚀
