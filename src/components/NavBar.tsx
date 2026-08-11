import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleSubscribeClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      // On home page, scroll to newsletter section
      const el = document.getElementById('newsletter');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // On other pages, navigate to home and then the section
    window.location.href = '/#newsletter';
  };

  return (
    <nav className="bg-[#F9F7F1] border-b-2 border-on-surface sticky top-0 z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20 md:h-24">
        {/* Brand */}
        <Link to="/" className="text-headline-md font-headline-md text-on-surface flex items-center gap-3">
          <img alt="IEDC GECT News Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHKRxcE9Ed8x3wYOF1kyFDSaNRh6PgtM6ssY67o9-M63_JK_JOVRo-4IR3Kt5THkxRVo6AObLTRZew82ulEqoCHBn12qBV7F2ZOngRwx--1REAQZPew0XoubWcY1kXPEeDzELTjzmYWxca3gdGBCxJBUBj7KPfhYelmoyA0p0zAK3hZTaQItRjKFO2rrAE6VI_NeNXPiq05OfgDsleKXafbcamh3wYQBN_s0do_t_LnluPdbqvDjz-JXwuByBamv8en-0"/>
          <span className="tracking-tight uppercase">IEDC News</span>
        </Link>
        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-12 items-center text-label-bold font-label-bold uppercase">
          <Link to="/" className="text-on-surface hover:text-primary transition-colors duration-200">Top Stories</Link>
          <Link to="/" className="text-on-surface hover:text-primary transition-colors duration-200">Archive</Link>
          <Link to="/" className="text-on-surface hover:text-primary transition-colors duration-200">Projects</Link>
          <Link to="/" className="text-on-surface hover:text-primary transition-colors duration-200">About</Link>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button
            onClick={handleSubscribeClick}
            className="hidden sm:block bg-on-surface hover:bg-primary text-surface text-label-bold font-label-bold uppercase px-8 py-3 rounded-full transition-all duration-200"
          >
            Subscribe
          </button>
          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-on-surface hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-on-surface bg-[#F9F7F1] px-margin-mobile py-8 flex flex-col gap-6 animate-[slideDown_0.2s_ease-out]">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-headline-md font-headline-md text-on-surface uppercase hover:text-primary transition-colors">Top Stories</Link>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-headline-md font-headline-md text-on-surface uppercase hover:text-primary transition-colors">Archive</Link>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-headline-md font-headline-md text-on-surface uppercase hover:text-primary transition-colors">Projects</Link>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-headline-md font-headline-md text-on-surface uppercase hover:text-primary transition-colors">About</Link>
          <button
            onClick={handleSubscribeClick}
            className="mt-4 bg-on-surface hover:bg-primary text-surface text-label-bold font-label-bold uppercase px-8 py-4 rounded-full transition-all duration-200 w-full"
          >
            Subscribe
          </button>
        </div>
      )}
    </nav>
  );
}
