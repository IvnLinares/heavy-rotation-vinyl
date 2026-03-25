import { useState, useCallback, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const USER = import.meta.env.VITE_LASTFM_USER;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export function useLastFm(type = 'albums') {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!API_KEY || !USER || API_KEY === 'placeholder_api_key' || USER === 'placeholder_user') {
        throw new Error('Please configure VITE_LASTFM_USER and VITE_LASTFM_API_KEY in .env');
      }

      let method = 'user.gettopalbums';
      if (type === 'artists') method = 'user.gettopartists';
      if (type === 'tracks') method = 'user.gettoptracks';

      const params = new URLSearchParams({
        method,
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

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.message || 'Error fetching from Last.fm API');
      }

      // Determine which array to use based on type
      let items = [];
      if (type === 'albums' && responseData.topalbums) {
        items = responseData.topalbums.album || [];
      } else if (type === 'artists' && responseData.topartists) {
        items = responseData.topartists.artist || [];
      } else if (type === 'tracks' && responseData.toptracks) {
        items = responseData.toptracks.track || [];
      }

      // Normalization
      const normalizedDataPromises = items.map(async (item, index) => {
        // Last.fm provides an array of images of different sizes.
        const imgObj = item.image && item.image.length > 0
          ? (item.image.find(img => img.size === 'extralarge') || 
             item.image.find(img => img.size === 'large') || 
             item.image[item.image.length - 1])
          : null;
        
        let finalImageUrl = imgObj && imgObj['#text'] ? imgObj['#text'] : '';
        const isPlaceholder = !finalImageUrl || finalImageUrl.includes('2a96cbd8b46e442fc41c2b86b821562f');
        
        // Fetch fallback image from the artist's top album if missing or placeholder
        if (isPlaceholder && (type === 'artists' || type === 'tracks')) {
          const artistName = type === 'artists' ? item.name : (item.artist?.name || item.artist);
          if (artistName) {
            try {
              const albumParams = new URLSearchParams({
                method: 'artist.gettopalbums',
                artist: artistName,
                api_key: API_KEY,
                limit: '1',
                format: 'json',
              });
              const albumRes = await fetch(`${BASE_URL}?${albumParams.toString()}`);
              if (albumRes.ok) {
                const albumData = await albumRes.json();
                const topAlbum = albumData.topalbums?.album?.[0];
                if (topAlbum && topAlbum.image && topAlbum.image.length > 0) {
                  const betterImgObj = topAlbum.image.find(img => img.size === 'extralarge') || 
                                     topAlbum.image.find(img => img.size === 'large') || 
                                     topAlbum.image[topAlbum.image.length - 1];
                  if (betterImgObj && betterImgObj['#text']) {
                    finalImageUrl = betterImgObj['#text'];
                  }
                }
              }
            } catch (e) {
              console.error('Failed to fetch fallback image for', artistName);
            }
          }
        }
        
        return {
          id: item.mbid || `${item.name}-${index}`,
          name: item.name,
          artist: type === 'artists' ? 'Artist' : (item.artist?.name || item.artist || 'Unknown Artist'),
          playcount: item.playcount,
          url: item.url,
          imageUrl: finalImageUrl || null,
          rank: item['@attr']?.rank || index + 1
        };
      });

      const normalizedData = await Promise.all(normalizedDataPromises);
      setData(normalizedData);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
