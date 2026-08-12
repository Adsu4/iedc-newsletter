import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-background">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col p-4 gap-2 h-screen w-20 fixed left-0 top-0 bg-surface border-r border-surface-variant z-50 items-center">
        <div className="mb-8 mt-4">
          <Link to="/" className="block">
            <img alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-primary transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q"/>
          </Link>
        </div>
        <div className="flex flex-col gap-4 w-full items-center flex-1">
          <Link
            to="/admin/articles"
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-sm transition-all duration-200 ${
              isActive('/admin/articles')
                ? 'bg-primary text-on-primary'
                : 'text-secondary hover:bg-surface-container hover:text-on-surface'
            }`}
            title="All Articles"
          >
            <span className="material-symbols-outlined">library_books</span>
          </Link>
          <Link
            to="/admin/dashboard"
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-sm transition-all duration-200 ${
              isActive('/admin/dashboard')
                ? 'bg-tertiary text-on-tertiary'
                : 'text-secondary hover:bg-surface-container hover:text-on-surface'
            }`}
            title="New Article"
          >
            <span className="material-symbols-outlined">edit_note</span>
          </Link>
          <Link
            to="/"
            onClick={logout}
            className="flex items-center justify-center w-12 h-12 text-secondary hover:bg-surface-container rounded-full hover:text-on-surface transition-all duration-300 mt-auto mb-4"
            title="Logout & Exit"
          >
            <span className="material-symbols-outlined">logout</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-variant z-50 flex items-center justify-around py-3 px-4">
        <Link to="/admin/articles" className={`flex flex-col items-center gap-1 ${isActive('/admin/articles') ? 'text-primary' : 'text-secondary'}`}>
          <span className="material-symbols-outlined text-[22px]">library_books</span>
          <span className="text-[10px] font-label-bold uppercase">Articles</span>
        </Link>
        <Link to="/admin/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/admin/dashboard') ? 'text-tertiary' : 'text-secondary'}`}>
          <span className="material-symbols-outlined text-[22px]">edit_note</span>
          <span className="text-[10px] font-label-bold uppercase">New</span>
        </Link>
        <Link to="/" onClick={logout} className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span className="text-[10px] font-label-bold uppercase">Logout</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-20 bg-surface-container-lowest max-w-container-max mx-auto w-full relative pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
