import React from 'react';
import { Heart } from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  return (
    <div 
      className="group flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-gray-200 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={listing.imageUrl} 
          alt={listing.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <button className="absolute bottom-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full text-lbc-text hover:text-red-500 transition-colors shadow-sm">
          <Heart size={18} />
        </button>
        {listing.isPro && (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
            PRO
          </span>
        )}
      </div>
      
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-bold text-lg text-lbc-text truncate group-hover:text-lbc-blue transition-colors">
          {listing.title}
        </h3>
        <span className="font-bold text-lbc-orange text-lg">
          {listing.price.toLocaleString('fr-FR')} €
        </span>
        
        <div className="mt-2 text-xs text-gray-500 flex flex-col gap-0.5">
          <span className="truncate">{listing.location}</span>
          <span>{listing.date}</span>
        </div>
      </div>
    </div>
  );
};
