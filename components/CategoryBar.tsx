import React from 'react';
import { Home, Car, Shirt, Gamepad2, Smartphone, Briefcase, Dog, MoreHorizontal } from 'lucide-react';

interface CategoryBarProps {
  onSelectCategory: (cat: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ onSelectCategory }) => {
  const categories = [
    { id: 'immobilier', label: 'Immobilier', icon: Home },
    { id: 'vehicules', label: 'Véhicules', icon: Car },
    { id: 'mode', label: 'Mode', icon: Shirt },
    { id: 'maison', label: 'Maison', icon: Gamepad2 }, // Reusing icon for generic home goods
    { id: 'electronique', label: 'Multimédia', icon: Smartphone },
    { id: 'loisirs', label: 'Loisirs', icon: Gamepad2 },
    { id: 'emploi', label: 'Emploi', icon: Briefcase },
    { id: 'animaux', label: 'Animaux', icon: Dog },
    { id: 'autres', label: 'Autres', icon: MoreHorizontal },
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-4 hidden md:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-start gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-2 min-w-[80px] group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-lbc-grey group-hover:bg-red-50 flex items-center justify-center transition-colors text-gray-700 group-hover:text-lbc-orange">
                <cat.icon size={24} />
              </div>
              <span className="text-sm text-gray-700 font-medium group-hover:text-lbc-orange whitespace-nowrap">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};