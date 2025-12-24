
import { Track, Playlist } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Starlight Symphony',
    artist: 'Cosmic Echo',
    album: 'Galactic Horizon',
    coverUrl: 'https://picsum.photos/seed/track1/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372
  },
  {
    id: '2',
    title: 'Neon Nights',
    artist: 'Cyber Runner',
    album: 'Digital City',
    coverUrl: 'https://picsum.photos/seed/track2/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425
  },
  {
    id: '3',
    title: 'Velvet Rain',
    artist: 'Midnight Jazz',
    album: 'Downtown Blues',
    coverUrl: 'https://picsum.photos/seed/track3/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 315
  },
  {
    id: '4',
    title: 'Mountain Breath',
    artist: 'Nature Whispers',
    album: 'Serenity Peaks',
    coverUrl: 'https://picsum.photos/seed/track4/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 280
  },
  {
    id: '5',
    title: 'Electric Dreams',
    artist: 'Synth Wave',
    album: 'Retro Future',
    coverUrl: 'https://picsum.photos/seed/track5/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 350
  }
];

export const FEATURED_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Today\'s Top Hits',
    description: 'The hottest tracks in the galaxy right now.',
    coverUrl: 'https://picsum.photos/seed/p1/300/300',
    tracks: MOCK_TRACKS
  },
  {
    id: 'p2',
    name: 'AI Recommendations',
    description: 'Songs curated just for you by Gemini.',
    coverUrl: 'https://picsum.photos/seed/p2/300/300',
    tracks: MOCK_TRACKS.slice().reverse()
  },
  {
    id: 'p3',
    name: 'Chill Vibes',
    description: 'Relax and unwind with these smooth melodies.',
    coverUrl: 'https://picsum.photos/seed/p3/300/300',
    tracks: [MOCK_TRACKS[2], MOCK_TRACKS[3]]
  }
];

export const COLORS = {
  spotifyGreen: '#1DB954',
  spotifyBlack: '#121212',
  spotifyDarkGray: '#282828',
  spotifyLightGray: '#B3B3B3',
};
