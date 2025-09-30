import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Search from './components/Search/Search';
import MovieDetail from './components/MovieDetail/MovieDetail';
import TVDetail from './components/TVDetail/TVDetail';
import Player from './components/Player/Player';
import Watchlist from './components/Watchlist/Watchlist';
import Settings from './components/Settings/Settings';
import SeriesComplete from './components/SeriesComplete/SeriesComplete';

// Context
import { WatchlistProvider } from './context/WatchlistContext';
import { SettingsProvider } from './context/SettingsContext';
import './styles/App.css';

function App() {
  return (
    <SettingsProvider>
      <WatchlistProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/tv/:id" element={<TVDetail />} />
                <Route path="/play/:type/:id" element={<Player />} />
                <Route path="/series-complete/:id" element={<SeriesComplete />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/settings" element={<Settings />} />
                {/* Catch-all route for unmatched paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </Router>
      </WatchlistProvider>
    </SettingsProvider>
  );
}

export default App;