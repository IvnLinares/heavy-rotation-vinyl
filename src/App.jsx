import React, { useState } from 'react';
import { useLastFm } from './hooks/useLastFm';
import VinylItem from './components/VinylItem';
import VinylSkeleton from './components/VinylSkeleton';
import { RefreshCcw, AlertCircle } from 'lucide-react';

function App() {
  const [viewType, setViewType] = useState('albums');
  const { data, isLoading, error, refetch } = useLastFm(viewType);
  
  // Check if we are in widget mode
  const searchParams = new URLSearchParams(window.location.search);
  const isWidget = searchParams.get('widget') === 'true';

  return (
    <div className={`container mx-auto max-w-6xl ${isWidget ? 'p-0 sm:p-4' : 'px-4 py-16'}`}>
      <header className={`${isWidget ? 'mb-8 mt-4' : 'mb-16'} text-center`}>
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-white/60 drop-shadow-sm mb-3">
          IvnLinares Music Rotation
        </h1>
        {!isWidget && (
          <p className="text-white/60 text-lg md:text-xl font-medium tracking-wide">
            My Top Vinyl Shelf
          </p>
        )}
      </header>

      <main className={`${isWidget ? 'min-h-min' : 'min-h-150'} flex flex-col items-center justify-center w-full pb-8`}>
        {/* View Toggle */}
        <div className="flex bg-white/5 p-1 mb-12 mt-4 rounded-full border border-white/10 backdrop-blur-xl shadow-inner mx-auto w-max">
          {['albums', 'artists', 'tracks'].map(type => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-6 py-2 rounded-full text-sm outline-none font-semibold capitalize transition-all duration-300 ${
                viewType === type 
                  ? 'bg-white/20 text-white shadow-md border border-white/20 scale-105' 
                  : 'text-white/50 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {error ? (
          <div className="bg-white/10 border border-white/20 rounded-3xl max-w-md w-full p-8 text-center backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4 drop-shadow-md" />
            <h2 className="text-xl font-bold text-white mb-2">Failed to load shelf</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <button 
              onClick={refetch}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/10 text-white font-medium py-2.5 px-6 rounded-full transition-all active:scale-95 shadow-lg backdrop-blur-md"
            >
              <RefreshCcw size={18} /> Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 justify-items-center w-full">
            {isLoading 
              ? Array.from({ length: 8 }).map((_, i) => <VinylSkeleton key={`skel-${i}`} />)
              : data.map(item => <VinylItem key={item.id} album={item} />)
            }
          </div>
        )}
      </main>

      {!isWidget && (
        <footer className="mt-24 text-center text-white/40 text-sm pb-8 space-y-2">
          <p>
            Developed with ❤️ by <a href="https://ivnlinares.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-white/20">IvnLinares</a>
          </p>
          <p>Data provided by <a href="https://www.last.fm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-white/20">Last.fm</a></p>
        </footer>
      )}
    </div>
  )
}

export default App;
