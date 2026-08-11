import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(userId, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Please enter both User ID and Password.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-fixed-dim rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-on-surface hover:text-primary transition-colors font-label-bold uppercase tracking-widest z-10">
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Site
      </Link>
      
      <div className="w-full max-w-md bg-surface-container-highest p-10 md:p-12 rounded-[2rem] border-4 border-on-surface shadow-[16px_16px_0px_0px_rgba(28,27,27,1)] relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]">
             <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>
          <h1 className="text-display-lg-mobile md:text-headline-xl font-headline-xl text-on-surface uppercase mb-3 leading-none">Admin Access</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Enter your credentials to continue.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-label-bold font-label-bold text-center border-2 border-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-label-bold font-label-bold uppercase text-on-surface tracking-wider" htmlFor="userid">User ID</label>
            <input 
              id="userid"
              type="text" 
              className="w-full px-6 py-4 rounded-xl border-2 border-on-surface bg-surface text-body-md font-body-md focus:border-primary focus:outline-none transition-colors placeholder-on-surface/50 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]" 
              placeholder="admin@iedc.ac.in"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="text-label-bold font-label-bold uppercase text-on-surface tracking-wider" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="w-full px-6 py-4 rounded-xl border-2 border-on-surface bg-surface text-body-md font-body-md focus:border-primary focus:outline-none transition-colors placeholder-on-surface/50 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-6 bg-primary text-on-primary px-8 py-4 rounded-xl text-label-bold font-label-bold uppercase hover:bg-on-primary-fixed-variant transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 border-2 border-on-surface"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
