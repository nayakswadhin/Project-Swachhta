import React from 'react';
import { ChevronLeft, LineChart, Settings, Users, Leaf, ClipboardCheck, Recycle, BarChart3,ImageIcon, Book, BookImageIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard Overview', path: '/dashboard' },
    { icon: ClipboardCheck, label: 'Swachhta Compliance', path: '/swachhta-compliance' },
    { icon: Leaf, label: 'LiFE Practices', path: '/life-practices' },
    { icon: Recycle, label: 'Green Metrics', path: '/green-metrics' },
    { icon: LineChart, label: 'Analytics', path: '/analytics' },
    { icon: Users, label: 'Post Offices', path: '/post-offices' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: ImageIcon, label: 'Image Feed', path: '/gallery' }
  ];

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-green-700 to-green-800 text-white transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
        } z-20`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="flex items-center justify-center mb-8">
              <div className={`relative ${isOpen ? 'w-20 h-20' : 'w-12 h-12'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-pulse" />
                <Leaf className={`absolute inset-0 m-auto text-white ${isOpen ? 'h-10 w-10' : 'h-6 w-6'}`} />
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors group relative"
                >
                  <item.icon className="h-5 w-5 min-w-[20px]" />
                  <span className={`ml-3 font-medium whitespace-nowrap ${!isOpen && 'lg:hidden'}`}>
                    {item.label}
                  </span>
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <button
          onClick={toggleSidebar}
          className={`absolute -right-3 top-6 bg-white p-1.5 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-100 ${
            !isOpen && 'lg:rotate-180'
          }`}
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-10"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;