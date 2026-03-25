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
      const normalizedData = items.map((item, index) => {
        // Last.fm provides an array of images of different sizes. (Note: artists often don't have good images in recent API versions)
        const imgObj = item.image && item.image.length > 0
          ? (item.image.find(img => img.size === 'extralarge') || 
             item.image.find(img => img.size === 'large') || 
             item.image[item.image.length - 1])
          : null;
        
        return {
          id: item.mbid || `${item.name}-${index}`,
          name: item.name,
          artist: type === 'artists' ? 'Artist' : (item.artist?.name || item.artist || 'Unknown Artist'),
          playcount: item.playcount,
          url: item.url,
          imageUrl: imgObj && imgObj['#text'] ? imgObj['#text'] : null,
          rank: item['@attr']?.rank || index + 1
        };
      });

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
