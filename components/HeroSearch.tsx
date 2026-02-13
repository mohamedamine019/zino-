import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface HeroSearchProps {
  onSearch: (query: string, location: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-white py-8 px-4 md:py-12 mb-8 rounded-b-[2.5rem] shadow-sm">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-2xl md:text-4xl font-extrabold text-lbc-text">
          Des millions de petites annonces et autant d’occasions de se faire plaisir
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-2 rounded-2xl shadow-lg flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors">
            <Search className="text-gray-500 mr-3" size={20} />
            <input 
              type="text" 
              placeholder="Que recherchez-vous ?" 
              className="bg-transparent w-full focus:outline-none text-lbc-text placeholder-gray-500 font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 md:max-w-[300px] flex items-center bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors border-l-0 md:border-l border-gray-100">
            <MapPin className="text-gray-500 mr-3" size={20} />
            <input 
              type="text" 
              placeholder="Saisissez une ville" 
              className="bg-transparent w-full focus:outline-none text-lbc-text placeholder-gray-500 font-medium"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="bg-lbc-blue hover:bg-[#2b4ba8] text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md"
          >
            Rechercher
          </button>
        </form>
        
        <div className="flex justify-center gap-4 text-sm font-medium text-lbc-text">
          <span>Où : <span className="underline decoration-dotted cursor-pointer">Toute la France</span></span>
          <span>Autour de moi</span>
        </div>
      </div>
    </div>
  );
};