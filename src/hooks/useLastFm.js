import { useState, useCallback, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const USER = import.meta.env.VITE_LASTFM_USER;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export function useLastFm() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbums = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!API_KEY || !USER || API_KEY === 'placeholder_api_key' || USER === 'placeholder_user') {
        throw new Error('Please configure VITE_LASTFM_USER and VITE_LASTFM_API_KEY in .env');
      }

      const params = new URLSearchParams({
        method: 'user.gettopalbums',
        user: USER,
        api_key: API_KEY,
        period: '1month',
        limit: '8',
        format: 'json',
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${BASE_URL}?${params.toString()}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || 'Error fetching from Last.fm API');
      }

      // Normalization
      const normalizedAlbums = data.topalbums.album.map((album, index) => {
        // Last.fm provides an array of images of different sizes.
        const imgObj = album.image.find(img => img.size === 'extralarge') || 
                       album.image.find(img => img.size === 'large') || 
                       album.image[album.image.length - 1];
        
        return {
          id: album.mbid || `${album.name}-${album.artist.name}-${index}`,
          name: album.name,
          artist: album.artist.name,
          playcount: album.playcount,
          url: album.url,
          imageUrl: imgObj && imgObj['#text'] ? imgObj['#text'] : null,
          rank: album['@attr']?.rank || index + 1
        };
      });

      setAlbums(normalizedAlbums);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return { albums, isLoading, error, refetch: fetchAlbums };
}
