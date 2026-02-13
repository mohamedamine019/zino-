import React from 'react';
import { Listing } from '../types';
import { MapPin, ArrowLeft, Share2, Heart, Flag } from 'lucide-react';

interface ItemDetailProps {
  listing: Listing;
  onBack: () => void;
  onContact: () => void;
}

export const ItemDetail: React.FC<ItemDetailProps> = ({ listing, onBack, onContact }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-lbc-blue mb-4 font-semibold text-sm"
      >
        <ArrowLeft size={16} className="mr-1" />
        Retour à la recherche
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Image */}
          <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-sm">
            <img 
              src={listing.imageUrl} 
              alt={listing.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Price for Mobile (visible usually, but duplication for layout) */}
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-lbc-text">{listing.title}</h1>
            <div className="text-3xl font-bold text-lbc-orange">{listing.price.toLocaleString('fr-FR')} €</div>
            <div className="text-sm text-gray-500">
              {listing.date}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-lbc-text mb-4">Description</h2>
            <div className="prose text-gray-700 whitespace-pre-line">
              {listing.description}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between text-sm text-gray-500">
              <span>N° de l'annonce : {listing.id}</span>
              <button className="flex items-center gap-1 hover:underline">
                <Flag size={14} />
                Signaler l'annonce
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-lbc-text mb-4 flex items-center gap-2">
              <MapPin size={24} />
              {listing.location}
            </h2>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              Carte non disponible en démo
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
           {/* Seller Card */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center md:text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-lbc-orange/20 text-lbc-orange flex items-center justify-center font-bold text-xl">
                {listing.sellerName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-lbc-text">{listing.sellerName}</h3>
                <p className="text-xs text-gray-500">
                   {listing.isPro ? 'Compte PRO' : 'Particulier'} • 12 annonces
                </p>
              </div>
            </div>
            
            <button className="w-full bg-lbc-orange hover:bg-lbc-orangeHover text-white font-bold py-3 px-4 rounded-xl mb-3 transition-colors">
              Acheter
            </button>
            <button 
              onClick={onContact}
              className="w-full bg-lbc-blue hover:bg-[#2b4ba8] text-white font-bold py-3 px-4 rounded-xl transition-colors mb-4"
            >
              Envoyer un message
            </button>
            
            <div className="text-xs text-gray-500 text-center">
              Gérez votre achat en toute sécurité avec le paiement sécurisé Bi3oo.
            </div>
           </div>

           {/* Actions */}
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
             <button className="flex items-center justify-center gap-2 py-2 text-lbc-blue hover:bg-blue-50 rounded-lg transition-colors font-bold">
               <Heart size={20} />
               Sauvegarder l'annonce
             </button>
             <button className="flex items-center justify-center gap-2 py-2 text-lbc-blue hover:bg-blue-50 rounded-lg transition-colors font-bold">
               <Share2 size={20} />
               Partager
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};