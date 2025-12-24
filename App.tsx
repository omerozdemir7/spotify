
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Auth from './components/Auth';
import ImportModal from './components/ImportModal';
import { HomeIcon, SearchIcon, LibraryIcon } from './components/Icons';
import { Track, Playlist, ViewType } from './types';
import { FEATURED_PLAYLISTS } from './constants';
import { PlayIcon, SearchIcon as SearchIconSmall } from './components/Icons';
import { getSongAnalysis, getAIPlaylistName } from './services/geminiService';
import { searchMusic, getTrendingMusic } from './services/musicService';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getTrendingMusic().then(data => {
      setTracks(data);
      if (data.length > 0 && !currentTrack) setCurrentTrack(data[0]);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        const results = await searchMusic(searchQuery);
        setTracks(results);
        setIsSearching(false);
      } else if (searchQuery.length === 0) {
        getTrendingMusic().then(setTracks);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleMoodSelect = async (mood: string) => {
    setIsLoadingAnalysis(true);
    const aiName = await getAIPlaylistName(mood);
    const moodTracks = await searchMusic(mood);
    const aiPlaylist: Playlist = {
      id: 'ai-' + Date.now(),
      name: aiName,
      description: `Gemini, ${mood} modu için senin için seçti.`,
      coverUrl: `https://picsum.photos/seed/${mood}/600/600`,
      tracks: moodTracks.length > 0 ? moodTracks : tracks.sort(() => Math.random() - 0.5).slice(0, 10)
    };
    setSelectedPlaylist(aiPlaylist);
    setCurrentView('playlist');
    setIsLoadingAnalysis(false);
  };

  useEffect(() => {
    if (currentTrack) {
      setIsLoadingAnalysis(true);
      getSongAnalysis(currentTrack.title, currentTrack.artist).then(analysis => {
        setAiAnalysis(analysis);
        setIsLoadingAnalysis(false);
      });
    }
  }, [currentTrack]);

  if (isAuthLoading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Auth onAuthSuccess={() => {}} />;

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden relative">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar 
            currentView={currentView} 
            onViewChange={(v) => { setCurrentView(v); setSelectedPlaylist(null); }}
            onPlaylistClick={(p) => { setSelectedPlaylist(p); setCurrentView('playlist'); }}
            onImportClick={() => setIsImportModalOpen(true)}
          />
        </div>
        
        <main className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] md:m-2 md:ml-0 md:rounded-lg overflow-y-auto relative scroll-smooth pb-32 md:pb-0">
          <header className="sticky top-0 z-40 p-4 bg-[#121212]/90 backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              {currentView === 'search' && (
                <div className="flex-1 max-w-md relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b3b3]"><SearchIconSmall /></span>
                  <input 
                    type="text" 
                    placeholder="Ara..."
                    className="w-full bg-[#242424] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
              {currentView !== 'search' && <h1 className="text-xl font-bold md:text-2xl">
                {currentView === 'home' ? 'İyi Günler' : 
                 currentView === 'library' ? 'Kitaplığın' : 
                 currentView === 'gemini-ai' ? 'AI DJ' : ''}
              </h1>}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex bg-black/40 rounded-full py-1 px-3 items-center gap-2 border border-white/5">
                <div className="w-6 h-6 rounded-full bg-[#1DB954] flex items-center justify-center text-[10px] font-bold text-black">{user.email?.charAt(0).toUpperCase()}</div>
                <span className="text-xs font-bold truncate max-w-[80px]">{user.email?.split('@')[0]}</span>
              </div>
              <button onClick={() => signOut(auth)} className="bg-white text-black text-xs font-bold py-2 px-4 rounded-full hover:scale-105 transition-all">Çıkış</button>
            </div>
          </header>

          <div className="p-4 md:p-6">
            {currentView === 'home' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-bold mb-4">Senin İçin Seçilenler</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {FEATURED_PLAYLISTS.map(p => (
                      <button key={p.id} onClick={() => { setSelectedPlaylist(p); setCurrentView('playlist'); }} className="bg-[#181818] hover:bg-[#282828] p-3 rounded-lg transition-all group text-left shadow-lg">
                        <img src={p.coverUrl} className="w-full aspect-square object-cover rounded shadow-lg mb-3" alt="" />
                        <h3 className="font-bold truncate text-sm">{p.name}</h3>
                        <p className="text-xs text-[#b3b3b3] truncate mt-1">{p.description}</p>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-4">Günün Popüler Şarkıları</h2>
                  <div className="bg-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
                    {tracks.slice(0, 10).map((t, i) => (
                      <div key={t.id} onClick={() => handleTrackSelect(t)} className="flex items-center justify-between p-3 hover:bg-white/10 cursor-pointer group transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="w-4 text-xs text-[#b3b3b3]">{i + 1}</span>
                          <img src={t.coverUrl} className="w-10 h-10 rounded" alt="" />
                          <div className="min-w-0">
                            <p className={`font-bold truncate text-sm ${currentTrack?.id === t.id ? 'text-[#1DB954]' : 'text-white'}`}>{t.title}</p>
                            <p className="text-xs text-[#b3b3b3] truncate">{t.artist}</p>
                          </div>
                        </div>
                        <PlayIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {currentView === 'search' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tracks.map(t => (
                  <div key={t.id} onClick={() => handleTrackSelect(t)} className="bg-[#181818] hover:bg-[#282828] p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all border border-transparent hover:border-white/10">
                    <img src={t.coverUrl} className="w-14 h-14 rounded shadow-md object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate text-sm ${currentTrack?.id === t.id ? 'text-[#1DB954]' : 'text-white'}`}>{t.title}</p>
                      <p className="text-xs text-[#b3b3b3] truncate">{t.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentView === 'playlist' && selectedPlaylist && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                  <img src={selectedPlaylist.coverUrl} className="w-48 h-48 md:w-60 md:h-60 shadow-2xl rounded-lg" alt="" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Çalma Listesi</span>
                    <h1 className="text-3xl md:text-7xl font-black mt-2 mb-4">{selectedPlaylist.name}</h1>
                    <p className="text-sm text-[#b3b3b3]">{selectedPlaylist.description}</p>
                  </div>
                </div>
                <div className="bg-black/20 rounded-xl overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead className="text-[#b3b3b3] text-[10px] uppercase tracking-wider border-b border-white/10">
                      <tr><th className="p-4 w-12">#</th><th className="p-4">Şarkı</th><th className="p-4 text-right pr-8">Süre</th></tr>
                    </thead>
                    <tbody>
                      {selectedPlaylist.tracks.map((t, i) => (
                        <tr key={t.id} onClick={() => handleTrackSelect(t)} className="hover:bg-white/10 cursor-pointer group">
                          <td className="p-4 text-xs text-[#b3b3b3]">{i + 1}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={t.coverUrl} className="w-10 h-10 rounded" alt="" />
                              <div className="min-w-0">
                                <p className={`font-bold truncate text-sm ${currentTrack?.id === t.id ? 'text-[#1DB954]' : 'text-white'}`}>{t.title}</p>
                                <p className="text-xs text-[#b3b3b3] truncate">{t.artist}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right pr-8 text-xs text-[#b3b3b3]">0:30</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentView === 'gemini-ai' && (
              <div className="max-w-4xl mx-auto space-y-12 py-6">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1DB954] to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-3xl font-black shadow-2xl">AI</div>
                  <h1 className="text-3xl md:text-5xl font-black">Gemini AI DJ</h1>
                  <p className="text-[#b3b3b3]">Ruh halini seç, müziği Gemini belirlesin.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Enerjik', 'Gece Yarısı', 'Odaklanma', 'Yolculuk', 'Retro', 'Hüzünlü', 'Parti', 'Klasik'].map(mood => (
                    <button key={mood} onClick={() => handleMoodSelect(mood)} className="bg-[#181818] hover:bg-[#282828] py-8 rounded-xl font-bold transition-all border border-white/5 hover:border-[#1DB954] active:scale-95 shadow-xl">{mood}</button>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'library' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <button onClick={() => setIsImportModalOpen(true)} className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-[#1DB954] flex flex-col items-center justify-center gap-2 group transition-all">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#1DB954] transition-colors"><PlayIcon className="text-white group-hover:text-black w-6 h-6 rotate-90" /></div>
                  <span className="text-xs font-bold">Müzik Ekle</span>
                </button>
                {FEATURED_PLAYLISTS.map(p => (
                  <div key={p.id} onClick={() => { setSelectedPlaylist(p); setCurrentView('playlist'); }} className="bg-[#181818] p-3 rounded-lg cursor-pointer">
                    <img src={p.coverUrl} className="w-full aspect-square rounded mb-2" alt="" />
                    <p className="font-bold text-sm truncate">{p.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-around z-[60] px-2">
        <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-white' : 'text-[#b3b3b3]'}`}>
          <HomeIcon /><span className="text-[10px] font-medium">Giriş</span>
        </button>
        <button onClick={() => setCurrentView('search')} className={`flex flex-col items-center gap-1 ${currentView === 'search' ? 'text-white' : 'text-[#b3b3b3]'}`}>
          <SearchIcon /><span className="text-[10px] font-medium">Ara</span>
        </button>
        <button onClick={() => setCurrentView('library')} className={`flex flex-col items-center gap-1 ${currentView === 'library' ? 'text-white' : 'text-[#b3b3b3]'}`}>
          <LibraryIcon /><span className="text-[10px] font-medium">Kitaplığın</span>
        </button>
        <button onClick={() => setCurrentView('gemini-ai')} className={`flex flex-col items-center gap-1 ${currentView === 'gemini-ai' ? 'text-white' : 'text-[#b3b3b3]'}`}>
          <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[8px] font-bold">AI</div>
          <span className="text-[10px] font-medium">AI DJ</span>
        </button>
      </nav>

      {/* Player Section */}
      <Player 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
        onNext={() => {}}
        onPrevious={() => {}}
        isExpanded={isPlayerExpanded}
        setIsExpanded={setIsPlayerExpanded}
        aiAnalysis={aiAnalysis}
        isLoadingAnalysis={isLoadingAnalysis}
      />

      {isImportModalOpen && <ImportModal onClose={() => setIsImportModalOpen(false)} onImport={(t) => { setTracks([t, ...tracks]); setCurrentTrack(t); setIsPlaying(true); }} />}
    </div>
  );
};

export default App;
