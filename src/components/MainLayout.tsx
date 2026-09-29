import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 bg-on-surface text-surface w-12 h-12 rounded-full border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:bg-primary hover:text-on-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center justify-center animate-fade-in-scale"
      title="Back to top"
      aria-label="Scroll to top"
    >
      <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
    </button>
  );
}

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
}
