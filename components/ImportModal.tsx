
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
  const [duration, setDuration] = useState<number | null>(null);

  React.useEffect(() => {
    if (!file) return;

    // Dosya adından basit bir çıkarım yap (Örn: "Sanatçı - Şarkı Adı.mp3")
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    let inferredTitle = baseName;
    let inferredArtist = '';

    if (baseName.includes(' - ')) {
      const parts = baseName.split(' - ');
      inferredArtist = parts[0].trim();
      inferredTitle = parts.slice(1).join(' - ').trim() || inferredTitle;
    }

    // Önce dosya adından otomatik doldur
    setTitle((prev) => prev || inferredTitle);
    setArtist((prev) => prev || inferredArtist);

    // Eğer jsmediatags yüklüyse, ID3 taglerinden daha doğru bilgiyi çek
    if (window.jsmediatags) {
      window.jsmediatags.read(file, {
        onSuccess: (tag: any) => {
          const tagTitle = tag.tags.title;
          const tagArtist = tag.tags.artist;

          setTitle((prev) => tagTitle || prev || inferredTitle);
          setArtist((prev) => tagArtist || prev || inferredArtist || 'Bilinmeyen Sanatçı');
        },
        onError: (error: any) => {
          console.error('Error reading media tags:', error);
          // Tag okunamazsa, en azından bir sanatçı adı olsun
          setArtist((prev) => prev || inferredArtist || 'Bilinmeyen Sanatçı');
        },
      });
    } else {
      // jsmediatags henüz yüklenmemişse bile en azından dosya adından doldur
      if (!inferredArtist) {
        setArtist((prev) => prev || 'Bilinmeyen Sanatçı');
      }
    }
  }, [file]);

  React.useEffect(() => {
    if (!file) return;

    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;
    audio.addEventListener('loadedmetadata', () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(Math.floor(audio.duration));
      }
      URL.revokeObjectURL(objectUrl);
    });

    return () => {
      audio.removeAttribute('src');
    };
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
      duration: duration ?? 180,
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
