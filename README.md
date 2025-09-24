# VidSrc Streaming App

A modern, responsive React streaming application that integrates TMDB for metadata and VidSrc for video streaming. Built with a clean, modular architecture and no backend dependencies.

## 🚀 Features

- **Movie & TV Show Discovery**: Search, browse trending, popular, and top-rated content
- **VidSrc Integration**: Seamless streaming with multiple fallback options
- **Watchlist Management**: Save favorites with localStorage persistence
- **Responsive Design**: Mobile-first approach with modern UI
- **Settings & Preferences**: Theme, region, and content rating controls
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Performance Optimized**: Lazy loading, code splitting, and efficient caching

## 📁 Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── SearchBar/    # Global search functionality
│   │   ├── LoadingSpinner/ # Loading indicators
│   │   ├── ErrorBoundary/ # Error handling wrapper
│   │   └── index.js     # Common components exports
│   ├── pages/            # Page-level components
│   │   ├── Home/         # Landing page with carousels
│   │   ├── Search/       # Search results page
│   │   ├── Details/      # Movie/TV detail pages
│   │   ├── Player/       # Video player page
│   │   ├── Watchlist/    # User watchlist page
│   │   └── Settings/     # App settings page
│   └── layout/           # Layout components
│       └── AppLayout/    # Main app layout wrapper
├── services/             # API and utility services
│   ├── tmdbApi.js       # TMDB API integration
│   ├── vidsrcApi.js     # VidSrc streaming integration
│   └── storage.js       # localStorage utilities
├── hooks/               # Custom React hooks
│   ├── useMovies.js     # Movie data management
│   ├── useWatchlist.js  # Watchlist state management
│   ├── useSearch.js     # Search functionality
│   └── index.js         # Hooks exports
├── utils/               # Utility functions
│   ├── constants.js     # App constants and configuration
│   ├── helpers.js       # Helper functions
│   └── index.js         # Utils exports
├── context/             # React context providers
│   ├── SettingsContext.js
│   └── WatchlistContext.js
├── styles/              # Global styles and themes
└── App.js              # Main app component
```

## 🛠 Technologies Used

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **TMDB API** - Movie metadata and images
- **VidSrc API** - Video streaming integration
- **localStorage** - Client-side data persistence
- **CSS3** - Modern styling with responsive design
- **React Toastify** - Notification system

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

## 📱 Key Components

### Common Components
- **SearchBar**: Global search with debounced input
- **LoadingSpinner**: Configurable loading indicators
- **ErrorBoundary**: Comprehensive error handling

### Page Components
- **Home**: Featured carousels and trending content
- **Search**: Results grid with infinite scroll
- **Details**: Comprehensive movie/TV information
- **Player**: VidSrc video player with fallbacks
- **Watchlist**: User favorites management
- **Settings**: App preferences and configuration

### Custom Hooks
- **useMovies**: Movie data fetching and pagination
- **useWatchlist**: Watchlist state management
- **useSearch**: Search functionality with caching

## 🎨 Design System

- **Dark Theme**: Default dark mode with light mode toggle
- **Responsive Grid**: Mobile-first responsive design
- **Modern UI**: Glassmorphism effects and smooth animations
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **Performance**: Optimized images and lazy loading

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

### Settings

The app supports the following user preferences:
- **Theme**: Dark/Light mode
- **Region**: Content region filtering
- **Content Rating**: Age-appropriate filtering
- **Autoplay**: Video autoplay preferences

## 📊 API Integration

### TMDB API
- Movie metadata, images, and trailers
- Search functionality
- Trending and popular content
- No API key required for basic endpoints

### VidSrc API
- Video streaming integration
- Multiple fallback domains
- Support for movies and TV shows
- No API key required

## 🔒 Security

- Content Security Policy (CSP) headers
- Sandboxed iframes for video players
- Input validation and sanitization
- Secure localStorage usage

## 📈 Performance

- Code splitting and lazy loading
- Image optimization with responsive sizes
- Efficient caching strategies
- Optimized bundle size

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 🚀 Deployment

The app is ready for deployment to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the adapted PRD for technical details

---

Built with ❤️ using React, TMDB API, and VidSrc streaming technology.