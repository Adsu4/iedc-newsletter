import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t-4 border-on-surface w-full mt-auto bg-[#F9F7F1]">
      <div className="flex flex-col md:flex-row items-center justify-between py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-12">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="text-headline-md font-headline-md text-on-surface uppercase hover:text-primary transition-colors">
            IEDC GECT News
          </Link>
          <span className="text-xs text-secondary font-label-bold uppercase">Govt. Engineering College Thrissur</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-label-bold font-label-bold uppercase text-xs">
          <Link to="/coming-up" className="text-on-surface hover:text-primary transition-colors">Coming Up</Link>
          <Link to="/opportunities" className="text-on-surface hover:text-primary transition-colors">Opportunities</Link>
          <Link to="/projects" className="text-on-surface hover:text-primary transition-colors">Projects & Startups</Link>
          <Link to="/about" className="text-on-surface hover:text-primary transition-colors">About IEDC</Link>
          <a href="mailto:iedc@gectcr.ac.in?subject=Write%20for%20IEDC%20Newsletter" className="text-on-surface hover:text-primary transition-colors">Write for Us</a>
          <Link to="/unsubscribe" className="text-on-surface hover:text-error transition-colors">Unsubscribe</Link>
        </div>
        <div className="flex flex-col items-center md:items-end gap-3 text-right">
          <p className="text-xs font-body-md text-on-surface">
            © {new Date().getFullYear()} IEDC GECT. All rights reserved.
          </p>
          <Link to="/admin" className="text-xs font-label-bold uppercase tracking-widest text-on-surface/60 hover:text-on-surface transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">lock</span> Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
