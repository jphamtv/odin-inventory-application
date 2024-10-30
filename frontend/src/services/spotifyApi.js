// src/services/spotifyApi.js

// Create a Spotify API client with closure to manage token state
const createSpotifyApi = () => {
  // Private variables in closure
  let token = null;
  let tokenExpirationTime = null;

  // Private function to get token
  const getToken = async () => {
    if (token && tokenExpirationTime && Date.now() < tokenExpirationTime) {
      return token;
    }

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error('Failed to get Spotify token');
      }

      const data = await response.json();

      // Update token and expiration in closure
      token = data.access_token;
      tokenExpirationTime = Date.now() + (data.expires_in - 60)* 1000;

      return token;
    } catch (error) {
      console.error('Error getting Spotify token:', error);
      throw error;
    }
  };

  // Public functions that use the private token management
  const searchArtists = async (query) => {
    try {
      const accessToken = await getToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search artist');
      }

      const data = await response.json();
      return data.artists.items[0] || null;
    } catch (error) {
      console.error('Error searching for artist:', error);
      throw error;
    }
  };

  const searchArtistAlbums = async (artistId) => {
    try {
      const accessToken = await getToken();
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get artist albums');
      }

      const data = await response.json();

      // Transform the albums data
      return data.items.map((album) => ({
        id: album.id,
        title: album.name,
        artist: album.artists[0].name,
        year: album.release_date.slice(0, 4),
        imageUrl: album.images[0]?.url,
        type: album.album_type,
        totalTracks: album.total_tracks
      }));
    } catch (error) {
      console.error('Error getting artist albums:', error);
      throw error;
    }
  };

  const getAlbumDetails = async (albumId) => {
    try {
      const accessToken = await getToken();
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get album details');
      }

      const data = await response.json();

      return {
        artist: data.artists[0].name,
        title: data.name,
        label: data.label,
        year: parseInt(data.release_date.slice(0, 4)),
        imgUrl: data.images[0]?.url,
        totalTracks: data.total_tracks
      };
    } catch (error) {
      console.error('Error getting album details:', error);
      throw error;
    }
  };

  // Return the public functions
  return {
    searchArtists,
    searchArtistAlbums,
    getAlbumDetails
  };
};

// Create and export a single instance
export const spotifyApi = createSpotifyApi();
