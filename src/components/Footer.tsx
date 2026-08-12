import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t-4 border-on-surface w-full mt-auto bg-[#F9F7F1]">
      <div className="flex flex-col md:flex-row items-center justify-between py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-12">
        <div className="flex items-center gap-3">
          <h2 className="text-headline-md font-headline-md text-on-surface uppercase">IEDC GECT News</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-10 text-label-bold font-label-bold uppercase">
          <Link to="/" className="text-on-surface hover:text-primary transition-colors duration-200">Submit News</Link>
          <Link to="/" className="text-on-surface hover:text-primary transition-colors duration-200">Contact</Link>
          <Link to="/" className="text-on-surface hover:text-primary transition-colors duration-200">Privacy</Link>
          <Link to="/unsubscribe" className="text-on-surface hover:text-error transition-colors duration-200">Unsubscribe</Link>
        </div>
        <div className="flex flex-col items-center md:items-end gap-4 text-right">
          <p className="text-body-md font-body-md text-on-surface">
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
