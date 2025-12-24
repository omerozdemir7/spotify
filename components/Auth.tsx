
import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuest = async () => {
    try {
      await signInAnonymously(auth);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-md bg-[#121212] rounded-xl p-10 flex flex-col items-center gap-8 shadow-2xl">
        <div className="flex items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.508 17.302c-.218.358-.68.473-1.037.255-2.887-1.763-6.521-2.162-10.796-1.185-.408.093-.815-.163-.909-.571-.093-.408.163-.815.571-.909 4.678-1.07 8.694-.616 11.916 1.352.358.218.473.68.255 1.037zm1.468-3.264c-.274.444-.853.585-1.297.311-3.303-2.03-8.339-2.618-12.246-1.432-.501.152-1.025-.133-1.177-.633-.152-.501.133-1.025.633-1.177 4.464-1.354 10.021-.697 13.829 1.643.444.274.585.854.311 1.298h.448zm.126-3.41c-3.961-2.352-10.514-2.571-14.316-1.417-.607.184-1.246-.161-1.43-.768-.184-.607.161-1.246.768-1.43 4.363-1.325 11.59-1.066 16.155 1.643.546.323.725 1.034.402 1.58-.323.546-1.034.726-1.58.402h.001z"/></svg>
          <span className="text-2xl font-bold">Spotify Clone</span>
        </div>
        
        <form onSubmit={handleAuth} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white">E-posta</label>
            <input 
              type="email" 
              required
              className="bg-[#2a2a2a] border-none rounded p-3 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Şifre</label>
            <input 
              type="password" 
              required
              className="bg-[#2a2a2a] border-none rounded p-3 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          
          <button type="submit" className="bg-[#1DB954] text-black font-bold py-3 rounded-full hover:scale-105 transition-transform mt-2">
            {isLogin ? 'Oturum Aç' : 'Kaydol'}
          </button>
        </form>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-2 w-full">
            <div className="h-[1px] bg-white/10 flex-1"></div>
            <span className="text-xs text-[#b3b3b3]">veya</span>
            <div className="h-[1px] bg-white/10 flex-1"></div>
          </div>
          
          <button onClick={handleGuest} className="w-full border border-[#b3b3b3] text-white py-2 rounded-full font-bold hover:bg-white/10 transition-colors">
            Misafir Olarak Devam Et
          </button>
          
          <p className="text-sm text-[#b3b3b3]">
            {isLogin ? 'Hesabın yok mu?' : 'Zaten bir hesabın var mı?'}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="ml-2 text-white font-bold hover:underline"
            >
              {isLogin ? 'Kaydol' : 'Oturum Aç'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
