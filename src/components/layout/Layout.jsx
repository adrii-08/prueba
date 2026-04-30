import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toaster from '../ui/Toaster';

export default function Layout() {
  return (
    <div className="min-h-screen bg-cream-50 bg-grain">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="px-6 lg:px-10 py-8 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
