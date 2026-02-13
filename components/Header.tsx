import React from 'react';
import { PlusSquare, Search, Bell, Heart, MessageSquare, User } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
  onPostAdClick: () => void;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, onPostAdClick, onLoginClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          onClick={onLogoClick}
          className="cursor-pointer flex-shrink-0"
        >
          <span className="text-lbc-orange font-extrabold text-2xl tracking-tighter">Bi3oo</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 flex-1 ml-6">
          <button 
            onClick={onPostAdClick}
            className="bg-lbc-orange hover:bg-lbc-orangeHover text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors"
          >
            <PlusSquare size={20} />
            <span>Déposer une annonce</span>
          </button>
          
          <div className="flex-1 max-w-md relative hidden lg:block">
            <input 
              type="text" 
              placeholder="Rechercher sur Bi3oo" 
              className="w-full bg-gray-100 text-gray-800 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-lbc-orange/50 transition-all"
            />
            <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
          </div>
        </div>

        {/* User Actions */}
        <nav className="flex items-center gap-2 md:gap-6 text-lbc-text text-xs md:text-sm font-semibold">
          <button onClick={onLoginClick} className="flex flex-col items-center gap-1 hover:text-lbc-blue transition-colors">
            <Bell size={22} className="text-gray-600" />
            <span className="hidden md:inline">Mes recherches</span>
          </button>
          <button onClick={onLoginClick} className="flex flex-col items-center gap-1 hover:text-lbc-blue transition-colors">
            <Heart size={22} className="text-gray-600" />
            <span className="hidden md:inline">Favoris</span>
          </button>
          <button onClick={onLoginClick} className="flex flex-col items-center gap-1 hover:text-lbc-blue transition-colors">
            <MessageSquare size={22} className="text-gray-600" />
            <span className="hidden md:inline">Messages</span>
          </button>
          <button onClick={onLoginClick} className="flex flex-col items-center gap-1 hover:text-lbc-blue transition-colors">
            <User size={22} className="text-gray-600" />
            <span className="hidden md:inline">Se connecter</span>
          </button>
        </nav>
      </div>
    </header>
  );
};