import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      {/* SideNavBar (Simplified) */}
      <nav className="hidden md:flex flex-col p-4 gap-2 h-screen w-20 fixed left-0 top-0 bg-surface border-r border-surface-variant z-50 items-center">
        <div className="mb-8 mt-4">
          <img alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q"/>
        </div>
        <div className="flex flex-col gap-4 w-full items-center flex-1">
          <Link to="/admin/dashboard" className="flex items-center justify-center w-12 h-12 bg-tertiary text-on-tertiary rounded-full shadow-sm transition-transform duration-200" title="Editor">
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
      {/* Main Content Area */}
      <main className="flex-1 md:ml-20 bg-surface-container-lowest max-w-container-max mx-auto w-full relative">
        <Outlet />
      </main>
    </div>
  );
}
