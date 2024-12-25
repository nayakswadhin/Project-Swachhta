import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';


interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="h-16 flex items-center justify-between px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-30" />
        
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="relative max-w-md ml-10">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2  rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4 relative ">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Divisional Office</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <button className="p-2 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 hover:shadow-md transition-all">
              <User className="h-5 w-5 text-green-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;