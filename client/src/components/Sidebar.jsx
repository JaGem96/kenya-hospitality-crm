import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Building2, Calendar, Users, Settings, LogOut, 
  BarChart3, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Properties', path: '/dashboard/properties', icon: <Building2 size={20} /> },
    { name: 'Bookings', path: '/dashboard/bookings', icon: <Calendar size={20} /> },
    { name: 'Guests', path: '/dashboard/guests', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/dashboard/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Reports', path: '/dashboard/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <aside 
      className={`fixed md:static inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col border-r border-slate-800 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo & Toggle Button */}
      <div className="flex items-center justify-between h-16 px-4 bg-slate-950 border-b border-slate-800">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-blue-400 flex items-center gap-2 whitespace-nowrap">
            🇪 KenyaCRM
          </h1>
        )}
        {isCollapsed && (
          <h1 className="text-xl font-bold text-blue-400 mx-auto">🇰</h1>
        )}
        
        {/* Toggle Button (Hidden on mobile) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="hidden md:flex p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-2 mt-4 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {!isCollapsed && <span className="whitespace-nowrap font-medium text-sm">{link.name}</span>}
              
              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-slate-800">
        <div className={`flex items-center gap-3 mb-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {userInfo?.name?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userInfo?.name || 'User'}</p>
              <p className="text-xs text-slate-400 truncate uppercase">{userInfo?.role || 'Guest'}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-red-600/10 text-slate-400 hover:text-red-500 transition ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;