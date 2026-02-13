import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, X } from 'lucide-react';
import { loginUser, registerUser } from '../services/authService';

interface LoginPageProps {
  onLoginSuccess: (userName: string) => void;
  onGoHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoHome }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!name) throw new Error("Le nom est requis");
        const user = await registerUser(email, password, name);
        onLoginSuccess(user.name);
      } else {
        const user = await loginUser(email, password);
        onLoginSuccess(user.name);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* Left Column: Image/Branding (Desktop only) */}
      <div className="hidden md:flex md:w-1/2 bg-red-50 flex-col justify-between p-12 relative overflow-hidden">
        <div 
          onClick={onGoHome}
          className="cursor-pointer z-10"
        >
          <span className="text-lbc-orange font-extrabold text-3xl tracking-tighter">Bi3oo</span>
        </div>
        
        <div className="z-10 relative max-w-lg">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {isRegistering ? "Rejoignez la communauté" : "Connectez-vous pour profiter de toutes nos fonctionnalités"}
          </h2>
          <ul className="space-y-4 text-lg text-gray-700">
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-200 text-lbc-orange flex items-center justify-center font-bold">1</div>
              Gérez vos annonces et vos transactions
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-200 text-lbc-orange flex items-center justify-center font-bold">2</div>
              Discutez avec les vendeurs et les acheteurs
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-200 text-lbc-orange flex items-center justify-center font-bold">3</div>
              Sauvegardez vos recherches et vos favoris
            </li>
          </ul>
        </div>

        {/* Abstract decorative circles */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-lbc-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -left-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile Header with close button */}
        <div className="md:hidden flex justify-between items-center p-4">
          <button onClick={onGoHome} className="p-2 -ml-2 text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <span className="text-lbc-orange font-extrabold text-xl tracking-tighter">Bi3oo</span>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Desktop Close Button */}
        <button 
          onClick={onGoHome}
          className="hidden md:block absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={28} />
        </button>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isRegistering ? "Créer un compte" : "Bonjour !"}
              </h1>
              <p className="text-gray-600">
                {isRegistering ? "Complétez le formulaire ci-dessous." : "Connectez-vous pour continuer."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                {isRegistering && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Votre nom
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-400 rounded-xl focus:ring-2 focus:ring-lbc-orange/20 focus:border-lbc-orange outline-none transition-all"
                      placeholder="Ex: Thomas D."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-4 bg-white border ${error ? 'border-red-500' : 'border-gray-400'} rounded-xl focus:ring-2 focus:ring-lbc-orange/20 focus:border-lbc-orange outline-none transition-all`}
                    placeholder="Ex: nom@exemple.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-bold text-gray-700">
                      Mot de passe
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full p-4 bg-white border ${error ? 'border-red-500' : 'border-gray-400'} rounded-xl focus:ring-2 focus:ring-lbc-orange/20 focus:border-lbc-orange outline-none transition-all pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {error && (
                     <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                       {error}
                     </p>
                  )}
                </div>
              </div>

              {!isRegistering && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-semibold text-lbc-blue hover:underline">
                      Mot de passe oublié ?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-lbc-orange hover:bg-lbc-orangeHover text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Chargement...' : (isRegistering ? "S'inscrire" : 'Se connecter')}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                {isRegistering ? "Vous avez déjà un compte ? " : "Pas encore de compte ? "}
                <button onClick={toggleMode} className="text-lbc-blue font-bold hover:underline">
                  {isRegistering ? "Se connecter" : "Créer un compte"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};