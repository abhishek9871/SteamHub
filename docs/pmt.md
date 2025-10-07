# 🎯 First Prompt for Vibe Coding Tool

Copy and paste this prompt into your vibe coding tool after attaching the PRD files as context:

---

```
I need you to build a modern streaming web application from scratch following the attached PRD documents. Read IMPLEMENTATION_GUIDE.md, PRD_OVERVIEW.md, and SPRINT_10_PLAYER_CRITICAL.md carefully before starting.

**PROJECT OVERVIEW:**
Build a React-based streaming app using TMDB API for metadata and vidsrc.cc for video streaming. 100% frontend, no backend.

**PHASE 1 - FOUNDATION (START HERE):**

1. **Create React app with these dependencies:**
   - react-router-dom@6
   - axios
   - react-toastify
   - react-icons
   - tailwindcss (with postcss and autoprefixer)

2. **Set up the exact folder structure from PRD_OVERVIEW.md:**
   ```
   src/
   ├── components/
   │   ├── common/
   │   ├── layout/
   │   └── pages/
   ├── services/
   ├── context/
   ├── hooks/
   ├── utils/
   └── styles/
   ```

3. **Implement these critical files FIRST:**
   - `src/services/tmdb.service.js` - Complete TMDB API integration
   - `src/services/vidsrc.service.js` - vidsrc.cc URL generator (EXACT format from SPRINT_10_PLAYER_CRITICAL.md)
   - `src/services/storage.service.js` - localStorage wrapper
   - `src/utils/constants.js` - All constants
   - `src/utils/helpers.js` - Helper functions
   - `src/styles/globals.css` - Complete design system with TailwindCSS

4. **Configure Tailwind with the design system:**
   - Dark theme colors from PRD
   - Custom spacing, shadows, border radius
   - Responsive breakpoints

5. **Create .env.example file:**
   ```
   REACT_APP_TMDB_API_KEY=61d95006877f80fb61358dbb78f153c3
   ```

**CRITICAL REQUIREMENTS:**
- vidsrc.cc format MUST be: `https://vidsrc.cc/v2/embed/movie/{TMDB_ID}?autoplay=1&autonext=1`
- TV format: `https://vidsrc.cc/v2/embed/tv/{TMDB_ID}/{SEASON}/{EPISODE}?autoplay=1&autonext=1`
- Use TMDB IDs (not IMDb IDs)
- Follow the exact design system colors and spacing from PRD_OVERVIEW.md

**DELIVERABLES FOR THIS PHASE:**
- Complete project setup with all dependencies installed
- All service files implemented and tested
- Design system fully configured in globals.css
- Utility functions ready to use
- No errors when running `npm start`

Please implement Phase 1 now. Show me the code for each file and confirm when complete before we move to Phase 2.
```

---

## 📋 Follow-up Prompts (Use After Phase 1 Complete)

### **Phase 2 Prompt:**
```
Great! Now implement Phase 2 - Core Components. Create these reusable components following the design system:

1. src/components/common/Button.jsx - Multiple variants (primary, secondary, ghost)
2. src/components/common/ContentCard.jsx - Movie/TV card with hover effects
3. src/components/common/Loader.jsx - Loading spinner and skeletons
4. src/components/layout/Header.jsx - Navigation header with search
5. src/components/layout/AppLayout.jsx - Main layout wrapper

Reference SPRINT_01_TO_05.md for component specifications. Make them fully responsive and accessible.
```

### **Phase 3 Prompt (CRITICAL - Player):**
```
Now implement the VIDEO PLAYER - the most critical component. Follow SPRINT_10_PLAYER_CRITICAL.md EXACTLY.

Create src/components/pages/Player.jsx that:
- Supports both movies (/play/movie/:id) and TV shows (/play/tv/:id?season=X&episode=Y)
- Uses EXACT vidsrc.cc format from the PRD
- Has proper loading and error states
- Works flawlessly on all devices

This is the heart of the app - it must be perfect. Test with movie ID 550 (Fight Club) and TV ID 1396 (Breaking Bad).
```

---

## 💡 Tips for Using Vibe Coding Tool

1. **Attach these files in order:**
   - IMPLEMENTATION_GUIDE.md (primary)
   - SPRINT_10_PLAYER_CRITICAL.md (for player reference)
   - PRD_OVERVIEW.md (for complete specs)

2. **After each phase:**
   - Ask it to verify the code works
   - Request testing instructions
   - Confirm before moving to next phase

3. **If it deviates:**
   - Remind it to "Follow the PRD exactly"
   - Reference specific file: "Check SPRINT_10_PLAYER_CRITICAL.md for the correct format"

4. **For the player specifically:**
   - Emphasize: "Use EXACT URL format from SPRINT_10_PLAYER_CRITICAL.md"
   - Test immediately with real TMDB IDs

---

**Copy the first prompt above and start with Phase 1. Good luck! 🚀**