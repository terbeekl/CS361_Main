import axios from 'axios';

export const fetchMoodData = async () => {
  const token = localStorage.getItem("spotify_access_token");
  
  try {
    const artistsResponse = await axios.get(
      'https://api.spotify.com/v1/me/top/artists?limit=1&time_range=short_term',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const genreCounts = {};
    artistsResponse.data.items.flatMap(a => a.genres).forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

    const tracksResponse = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const tracks = tracksResponse.data.items.map(track => ({
      id: track.id,
      name: track.name,
      popularity: track.popularity,
      explicit: track.explicit,
      duration_ms: track.duration_ms,
      release_date: track.album.release_date,
      available_markets: track.available_markets?.length || 0,
      album_type: track.album.album_type
    }));

    const moodResponse = await axios.post('https://3744-2601-1c0-8081-9de0-6128-a1de-895b-90d4.ngrok-free.app/mood', {
      topGenre,
      tracks
    });

    return {
      topGenre,
      tracks,
      mood: moodResponse.data.mood,
      imageUrl: moodResponse.data.imageUrl || null
    };
  } catch (error) {
    console.error("Error fetching mood data:", error);
    throw error; // Re-throw for components to handle
  }
};