import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchModal from './SearchModal';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();

  const handleSubscribeClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('newsletter');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.location.href = '/#newsletter';
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Top Stories', path: '/top-stories' },
    { label: 'Coming Up', path: '/coming-up' },
    { label: 'Opportunity Radar', path: '/opportunities' },
    { label: 'Projects', path: '/projects' },
    { label: 'Archive', path: '/archive' },
    { label: 'About', path: '/about' },
  ];

  return (
    <>
      <nav className="bg-[#F9F7F1] border-b-2 border-on-surface sticky top-0 z-50 transition-all duration-300">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16 md:h-20">
          {/* Brand */}
          <Link to="/" className="text-xl md:text-2xl font-bold font-headline-md text-on-surface flex items-center gap-2.5 shrink-0">
            <img alt="IEDC GECT News Logo" className="h-7 md:h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHKRxcE9Ed8x3wYOF1kyFDSaNRh6PgtM6ssY67o9-M63_JK_JOVRo-4IR3Kt5THkxRVo6AObLTRZew82ulEqoCHBn12qBV7F2ZOngRwx--1REAQZPew0XoubWcY1kXPEeDzELTjzmYWxca3gdGBCxJBUBj7KPfhYelmoyA0p0zAK3hZTaQItRjKFO2rrAE6VI_NeNXPiq05OfgDsleKXafbcamh3wYQBN_s0do_t_LnluPdbqvDjz-JXwuByBamv8en-0"/>
            <span className="tracking-tight uppercase">IEDC News</span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex space-x-5 xl:space-x-7 items-center text-label-bold font-label-bold uppercase text-xs">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-primary border-b-2 border-primary pb-0.5'
                    : 'text-on-surface hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 md:gap-4">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="text-on-surface hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container flex items-center justify-center"
              title="Search articles & opportunities"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
            <button
              onClick={handleSubscribeClick}
              className="hidden sm:block bg-on-surface hover:bg-primary text-surface text-label-bold font-label-bold uppercase px-5 py-2 rounded-full transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] text-xs"
            >
              Subscribe
            </button>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden text-on-surface hover:text-primary transition-colors p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-on-surface bg-[#F9F7F1] px-margin-mobile py-5 flex flex-col gap-3 animate-[slideDown_0.2s_ease-out]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-bold font-headline-md uppercase hover:text-primary transition-colors ${
                  location.pathname === link.path ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleSubscribeClick}
              className="mt-2 bg-on-surface hover:bg-primary text-surface text-label-bold font-label-bold uppercase px-6 py-3 rounded-full transition-all duration-200 w-full text-xs"
            >
              Subscribe to Newsletter
            </button>
          </div>
        )}
      </nav>

      {/* Instant Search Overlay Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
