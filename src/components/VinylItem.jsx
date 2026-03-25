import React, { useState } from 'react';
import { ExternalLink, Disc3, Hash } from 'lucide-react';
import placeholderCover from '../assets/placeholder-cover.svg';
import vinylSVG from '../assets/vinyl-disc.svg';

export default function VinylItem({ album }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  // Safe fallback if the data is missing
  if (!album) return null;

  const { name, artist, playcount, imageUrl, url, rank } = album;
  const coverUrl = imageUrl || placeholderCover;

  return (
    <article
      className={`relative w-64 h-64 group cursor-pointer perspective-1000 ${isExpanded ? 'is-expanded' : ''}`}
      onClick={toggleExpand}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') toggleExpand();
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Listen to ${name} by ${artist}`}
    >
      {/* Vinyl Disc Layer */}
      <div 
        className={`absolute inset-0 z-0 flex items-center justify-center 
                    transition-all duration-500 ease-out origin-center
                    group-hover:translate-x-16 group-hover:rotate-90
                    ${isExpanded ? 'translate-x-16 rotate-90' : 'translate-x-0 rotate-0'}`}
      >
        <img 
          src={vinylSVG} 
          alt="Vinyl Disc" 
          className="w-60 h-60 drop-shadow-2xl opacity-90"
        />
        {/* Vinyl inner label - We have it baked into the SVG or we can overlay a custom color/text here if we wanted */}
      </div>

      {/* Album Cover Layer */}
      <div 
        className="absolute inset-0 z-10 rounded-sm shadow-2xl overflow-hidden transition-transform duration-500 ease-out transform group-hover:-translate-z-4 group-hover:-rotate-y-6"
      >
        <img 
          src={coverUrl} 
          alt={`Cover of ${name}`} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay Stats Panel - Revealed on hover/expand */}
        <div 
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm p-4 flex flex-col justify-end 
                      transition-opacity duration-300
                      ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-lg">
            <Hash size={12} className="mr-0.5" /> {rank}
          </div>
          
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">
            {name}
          </h3>
          <p className="text-white/80 text-sm mt-1 truncate drop-shadow-md">{artist}</p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-white/90 text-xs bg-white/10 px-2 py-1 rounded">
              <Disc3 size={14} className="mr-1.5 opacity-70" />
              <span>{playcount} plays</span>
            </div>
            
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-pink-400 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${name} on Last.fm`}
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
