
import React from 'react';
import { HomeIcon, SearchIcon, LibraryIcon } from './Icons';
import { ViewType, Playlist } from '../types';
import { FEATURED_PLAYLISTS } from '../constants';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onPlaylistClick: (playlist: Playlist) => void;
  onImportClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onPlaylistClick, onImportClick }) => {
  return (
    <div className="w-64 bg-black flex flex-col h-full p-2 gap-2">
      <div className="bg-[#121212] rounded-lg p-3 flex flex-col gap-4">
        <button 
          onClick={() => onViewChange('home')}
          className={`flex items-center gap-4 px-4 py-2 transition-colors ${currentView === 'home' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}
        >
          <HomeIcon />
          <span className="font-bold">Ana Sayfa</span>
        </button>
        <button 
          onClick={() => onViewChange('search')}
          className={`flex items-center gap-4 px-4 py-2 transition-colors ${currentView === 'search' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}
        >
          <SearchIcon />
          <span className="font-bold">Ara</span>
        </button>
      </div>

      <div className="bg-[#121212] rounded-lg flex-1 overflow-hidden flex flex-col">
        <div className="p-3 flex items-center justify-between">
          <button 
            onClick={() => onViewChange('library')}
            className={`flex items-center gap-4 px-4 py-2 transition-colors ${currentView === 'library' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}
          >
            <LibraryIcon />
            <span className="font-bold">Kitaplığın</span>
          </button>
          <button 
            onClick={onImportClick}
            className="p-1 text-[#b3b3b3] hover:text-white hover:bg-white/10 rounded-full transition-all"
            title="Müzik İçe Aktar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="px-3 pb-3">
          <button 
            onClick={() => onViewChange('gemini-ai')}
            className={`flex items-center gap-4 px-4 py-2 w-full text-left transition-colors ${currentView === 'gemini-ai' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'} group`}
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-purple-500/20">AI</div>
            <span className="font-bold">Gemini AI DJ</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="text-[11px] font-bold text-[#b3b3b3] px-2 mb-2 uppercase tracking-wider">Çalma Listelerin</div>
          {FEATURED_PLAYLISTS.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => onPlaylistClick(playlist)}
              className="w-full text-left p-2 rounded hover:bg-[#2a2a2a] flex items-center gap-3 transition-colors group"
            >
              <img src={playlist.coverUrl} alt={playlist.name} className="w-12 h-12 rounded object-cover shadow-lg" />
              <div className="flex flex-col min-w-0">
                <span className="text-white font-medium truncate">{playlist.name}</span>
                <span className="text-[#b3b3b3] text-sm truncate">Playlist • {playlist.tracks.length} şarkı</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
