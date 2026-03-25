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
        className="absolute inset-0 z-10 rounded-2xl shadow-2xl overflow-hidden border border-white/20 transition-transform duration-500 ease-out transform group-hover:-translate-z-4 group-hover:-rotate-y-6 ring-1 ring-white/10"
      >
        <img 
          src={coverUrl} 
          alt={`Cover of ${name}`} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay Stats Panel - Liquid Glass */}
        <div 
          className={`absolute inset-0 bg-white/10 backdrop-blur-xl p-5 flex flex-col justify-end 
                      transition-opacity duration-300 border-t border-white/20
                      ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-lg border border-white/20">
            <Hash size={12} className="mr-0.5" /> {rank}
          </div>
          
          <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 drop-shadow-md">
            {name}
          </h3>
          <p className="text-white/80 text-sm mt-1 truncate drop-shadow-md">{artist}</p>
          
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center text-white/90 text-xs bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
              <Disc3 size={14} className="mr-1.5 opacity-80" />
              <span className="font-medium">{playcount} plays</span>
            </div>
            
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-all bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-lg hover:scale-105"
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
