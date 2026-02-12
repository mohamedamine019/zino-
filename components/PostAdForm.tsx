import React, { useState, useRef } from 'react';
import { Camera, MapPin, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Listing } from '../types';

interface PostAdFormProps {
  onSubmit: (listing: Partial<Listing>) => void;
  onCancel: () => void;
}

export const PostAdForm: React.FC<PostAdFormProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    location: '',
    sellerName: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      return formData.title.length >= 3 && formData.category !== '';
    }
    if (currentStep === 2) {
      return formData.description.length >= 10;
    }
    if (currentStep === 3) {
      return formData.price !== '' && formData.location !== '' && formData.sellerName !== '';
    }
    return false;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      onCancel();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newListing: Partial<Listing> = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      location: formData.location,
      sellerName: formData.sellerName || 'Moi',
      imageUrl: imagePreview || 'https://picsum.photos/600/400?grayscale',
      isPro: false,
    };

    onSubmit(newListing);
    setLoading(false);
  };

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Commençons par l'essentiel !</h2>
        
        <div className="space-y-2">
          <label className="block text-base font-bold text-gray-900">
            Quel est le titre de l'annonce ?
          </label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Vélo de course vintage"
            className="w-full p-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-lbc-orange/50 focus:bg-white transition-all text-lg placeholder-gray-500"
          />
          <p className="text-xs text-gray-500">
            Soyez précis, un bon titre attire plus de monde.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-base font-bold text-gray-900">
            Choisissez la catégorie
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {['Maison', 'Mode', 'Véhicules', 'Immobilier', 'Multimédia', 'Loisirs'].map((cat) => (
               <button
                 key={cat}
                 type="button"
                 onClick={() => setFormData(prev => ({ ...prev, category: cat.toLowerCase() }))}
                 className={`p-4 rounded-xl border-2 text-left transition-all font-bold ${
                   formData.category === cat.toLowerCase()
                     ? 'border-lbc-orange bg-orange-50 text-lbc-orange'
                     : 'border-gray-100 bg-white hover:border-gray-200 text-gray-700'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Dites-nous en plus</h2>
        
        <div className="space-y-2">
          <label className="block text-base font-bold text-gray-900">
            Description détaillée
          </label>
          <textarea 
            name="description"
            rows={8}
            value={formData.description}
            onChange={handleChange}
            placeholder="Indiquez l'état de l'objet, ses caractéristiques, ses dimensions..."
            className="w-full p-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-lbc-orange/50 focus:bg-white transition-all text-base placeholder-gray-500 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-base font-bold text-gray-900">
            Ajoutez des photos
          </label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative bg-white"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-sm">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md text-red-500 hover:bg-white"
                >
                  <div className="w-4 h-4 flex items-center justify-center font-bold">✕</div>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-16 h-16 bg-lbc-blue/10 rounded-full flex items-center justify-center text-lbc-blue">
                  <Camera size={32} />
                </div>
                <div>
                  <span className="block font-bold text-lbc-blue text-lg">Ajouter des photos</span>
                  <span className="text-sm text-gray-500">Format JPG, PNG, jusqu'à 5 Mo</span>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Vos coordonnées et le prix</h2>
        
        <div className="space-y-2">
          <label className="block text-base font-bold text-gray-900">
            Quel est votre prix ?
          </label>
          <div className="relative max-w-xs">
            <input 
              type="number" 
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              className="w-full p-4 pr-12 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-lbc-orange/50 focus:bg-white transition-all text-xl font-bold placeholder-gray-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl">€</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-base font-bold text-gray-900">
              Où se situe votre bien ?
            </label>
            <div className="relative">
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ville ou code postal"
                className="w-full p-4 pl-12 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-lbc-orange/50 focus:bg-white transition-all text-base placeholder-gray-500"
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-base font-bold text-gray-900">
              Votre pseudo
            </label>
            <input 
              type="text" 
              name="sellerName"
              value={formData.sellerName}
              onChange={handleChange}
              placeholder="Comment doit-on vous appeler ?"
              className="w-full p-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-lbc-orange/50 focus:bg-white transition-all text-base placeholder-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Mini Header for Wizard */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-6">
          <span className={step >= 1 ? "text-lbc-orange" : ""}>Annonce</span>
          <ChevronRight size={16} />
          <span className={step >= 2 ? "text-lbc-orange" : ""}>Description</span>
          <ChevronRight size={16} />
          <span className={step >= 3 ? "text-lbc-orange" : ""}>Prix & Contact</span>
        </div>
        
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-lbc-orange transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Footer Actions */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:static md:bg-transparent md:border-0 md:mt-12 md:p-0">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="text-lbc-text font-bold hover:underline px-4 py-2"
              >
                {step === 1 ? 'Annuler' : 'Retour'}
              </button>

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(step)}
                  className="bg-lbc-orange hover:bg-lbc-orangeHover text-white font-bold py-3 px-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continuer
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!validateStep(3) || loading}
                  className="bg-lbc-orange hover:bg-lbc-orangeHover text-white font-bold py-3 px-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-orange-200"
                >
                  {loading ? (
                    <>Publication...</>
                  ) : (
                    <>
                      <Check size={20} />
                      Déposer l'annonce
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
