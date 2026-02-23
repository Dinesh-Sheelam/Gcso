
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const MOCK_USERS = [
  { username: 'admin', password: 'admin', role: UserRole.ADMIN, name: 'System User' },
  { username: 'planner', password: 'plan', role: UserRole.PLANNER, name: 'Strategic Planner' },
  { username: 'launcher', password: 'launch', role: UserRole.LAUNCHER, name: 'Launch Lead' },
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize inputs: trim spaces and make username case-insensitive
    const normalizedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const user = MOCK_USERS.find(
      u => u.username.toLowerCase() === normalizedUsername && u.password === trimmedPassword
    );

    if (user) {
      onLogin({ username: user.username, role: user.role, name: user.name });
    } else {
      setError('Invalid credentials. Please check the reference accounts below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-slate-100 max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-10">
          <div className="inline-block bg-red-600 text-white font-black px-4 py-1.5 rounded mb-6 shadow-md shadow-red-100">J&J</div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight px-4">Global Commercial Strategy Platform</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Username</label>
            <input 
              type="text" 
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all text-slate-700 font-medium placeholder:text-slate-300"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all text-slate-700 placeholder:text-slate-300"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-lg animate-in slide-in-from-top-2">
              <p className="text-red-600 text-[11px] font-bold leading-tight">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-xl shadow-red-200 hover:bg-red-700 hover:shadow-red-300 transition-all active:scale-[0.98] mt-2"
          >
            Sign in
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-5">Reference Credentials</p>
          <div className="grid grid-cols-1 gap-2.5">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500">ADMIN</span>
              <span className="text-[10px] font-mono text-red-600 font-bold bg-white px-2 py-0.5 rounded shadow-sm">admin / admin</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500">PLANNER</span>
              <span className="text-[10px] font-mono text-red-600 font-bold bg-white px-2 py-0.5 rounded shadow-sm">planner / plan</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500">LAUNCHER</span>
              <span className="text-[10px] font-mono text-red-600 font-bold bg-white px-2 py-0.5 rounded shadow-sm">launcher / launch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
