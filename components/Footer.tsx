import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-lbc-text mb-4">À propos de Bi3oo</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">Qui sommes-nous ?</a></li>
            <li><a href="#" className="hover:underline">Nous rejoindre</a></li>
            <li><a href="#" className="hover:underline">Impact environnemental</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lbc-text mb-4">Nos solutions pro</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">Publicité</a></li>
            <li><a href="#" className="hover:underline">Vos recrutements</a></li>
            <li><a href="#" className="hover:underline">Vos annonces pro</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lbc-text mb-4">Informations légales</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">CGU</a></li>
            <li><a href="#" className="hover:underline">CGV</a></li>
            <li><a href="#" className="hover:underline">Vie privée / cookies</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lbc-text mb-4">Aide</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:underline">Centre d'aide</a></li>
            <li><a href="#" className="hover:underline">Sécurité</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
        <p>Bi3oo 2025</p>
      </div>
    </footer>
  );
};