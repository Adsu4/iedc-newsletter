import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
