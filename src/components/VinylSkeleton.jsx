import React from 'react';

export default function VinylSkeleton() {
  return (
    <div className="w-64 h-64 relative rounded-sm shadow-xl bg-white/5 border border-white/10 overflow-hidden flex flex-col justify-end p-4">
      {/* Shimmer effect base */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full"></div>
      
      <div className="animate-pulse space-y-4 w-full z-10">
        <div className="h-6 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
    </div>
  );
}
