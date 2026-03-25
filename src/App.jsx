import React from 'react';
import { useLastFm } from './hooks/useLastFm';
import VinylItem from './components/VinylItem';
import VinylSkeleton from './components/VinylSkeleton';
import { RefreshCcw, AlertCircle } from 'lucide-react';

function App() {
  const { albums, isLoading, error, refetch } = useLastFm();

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-white/60 drop-shadow-sm mb-3">
          Heavy Rotation
        </h1>
        <p className="text-white/60 text-lg md:text-xl font-medium tracking-wide">
          My Top Vinyl Shelf
        </p>
      </header>

      <main className="min-h-150 flex flex-col items-center justify-center">
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
              : albums.map(album => <VinylItem key={album.id} album={album} />)
            }
          </div>
        )}
      </main>

      <footer className="mt-24 text-center text-white/40 text-sm pb-8">
        <p>Data provided by <a href="https://www.last.fm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-white/20">Last.fm</a></p>
      </footer>
    </div>
  )
}

export default App;
