
import React, { useState } from 'react';
import { Track } from '../types';

declare global {
  interface Window {
    jsmediatags: any;
  }
}


interface ImportModalProps {
  onClose: () => void;
  onImport: (track: Track) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (file && window.jsmediatags) {
      window.jsmediatags.read(file, {
        onSuccess: (tag: any) => {
          setTitle(tag.tags.title || '');
          setArtist(tag.tags.artist || '');
        },
        onError: (error: any) => {
          console.error('Error reading media tags:', error);
        },
      });
    }
  }, [file]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !artist) return;

    const audioUrl = URL.createObjectURL(file);
    const newTrack: Track = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      artist,
      album: 'Lokal Dosya',
      coverUrl: 'https://picsum.photos/seed/' + Math.random() + '/300/300',
      audioUrl,
      duration: 180, // Default duration, real apps would read this from metadata
    };

    onImport(newTrack);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-[#282828] w-full max-w-md rounded-xl p-8 flex flex-col gap-6 shadow-2xl animate-in zoom-in duration-200">
        <h2 className="text-2xl font-bold">Müzik İçe Aktar</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#b3b3b3] uppercase">Şarkı Adı</label>
            <input 
              type="text" 
              required
              className="bg-[#3e3e3e] border-none rounded p-3 focus:outline-none focus:ring-1 focus:ring-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#b3b3b3] uppercase">Sanatçı</label>
            <input 
              type="text" 
              required
              className="bg-[#3e3e3e] border-none rounded p-3 focus:outline-none focus:ring-1 focus:ring-white"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#b3b3b3] uppercase">Ses Dosyası (MP3)</label>
            <input 
              type="file" 
              accept="audio/*"
              required
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-[#1DB954] cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 text-white font-bold py-3 rounded-full hover:underline transition-all"
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-white text-black font-bold py-3 rounded-full hover:scale-105 transition-transform"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportModal;
