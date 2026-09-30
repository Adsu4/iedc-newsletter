import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t-2 border-on-surface w-full mt-auto bg-[#F9F7F1]">
      <div className="flex flex-col md:flex-row items-center justify-between py-10 md:py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2 group" title="IEDC News">
            <img
              alt="IEDC News"
              className="h-8 md:h-10 w-auto object-contain mix-blend-multiply transition-transform group-hover:scale-[1.02]"
              src="/iedc-logo.png"
            />
          </Link>
          <span className="text-xs text-secondary font-medium">Govt. Engineering College Thrissur</span>
        </div>
        <div className="flex flex-wrap justify-center gap-5 md:gap-7 text-label-bold font-label-bold uppercase text-xs">
          <Link to="/" className="text-on-surface hover:text-primary transition-colors">Home</Link>
          <Link to="/top-stories" className="text-on-surface hover:text-primary transition-colors">Top Stories</Link>
          <Link to="/coming-up" className="text-on-surface hover:text-primary transition-colors">Coming Up</Link>
          <Link to="/opportunities" className="text-on-surface hover:text-primary transition-colors">Opportunities</Link>
          <Link to="/projects" className="text-on-surface hover:text-primary transition-colors">Projects & Startups</Link>
          <Link to="/archive" className="text-on-surface hover:text-primary transition-colors">Archive</Link>
          <Link to="/about" className="text-on-surface hover:text-primary transition-colors">About IEDC</Link>
          <a href="mailto:iedc@gectcr.ac.in?subject=Write%20for%20IEDC%20Newsletter" className="text-on-surface hover:text-primary transition-colors">Write for Us</a>
          <Link to="/unsubscribe" className="text-on-surface hover:text-error transition-colors">Unsubscribe</Link>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2 text-right">
          <p className="text-xs text-on-surface-variant font-medium">
            © {new Date().getFullYear()} IEDC GECT. All rights reserved.
          </p>
          <Link to="/admin" className="text-[11px] font-medium tracking-wider text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">lock</span> Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
