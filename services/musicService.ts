
import { Track } from '../types';

const ITUNES_BASE_URL = 'https://itunes.apple.com/search';

export const searchMusic = async (term: string): Promise<Track[]> => {
  if (!term) return [];
  try {
    const response = await fetch(`${ITUNES_BASE_URL}?term=${encodeURIComponent(term)}&entity=song&limit=25`);
    const data = await response.json();
    return data.results.map((item: any) => ({
      id: item.trackId.toString(),
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      coverUrl: item.artworkUrl100.replace('100x100', '600x600'),
      audioUrl: item.previewUrl,
      duration: Math.floor(item.trackTimeMillis / 1000) || 30,
    }));
  } catch (error) {
    console.error('iTunes API Error:', error);
    return [];
  }
};

export const getTrendingMusic = async (): Promise<Track[]> => {
  // Popüler bir terimle varsayılan liste oluştur
  return searchMusic('Top Hits 2024');
};
