import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { HeroSearch } from './components/HeroSearch';
import { ListingCard } from './components/ListingCard';
import { Footer } from './components/Footer';
import { ItemDetail } from './components/ItemDetail';
import { PostAdForm } from './components/PostAdForm';
import { LoginPage } from './components/LoginPage';
import { fetchListings } from './services/geminiService';
import { Listing, ViewState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchContext, setSearchContext] = useState<{ query: string; category: string }>({
    query: '',
    category: 'all'
  });

  // Initial load
  useEffect(() => {
    loadListings('', 'all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadListings = async (query: string, category: string) => {
    setIsLoading(true);
    try {
      const data = await fetchListings(query, category);
      setListings(data);
    } catch (error) {
      console.error("Failed to load listings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, location: string) => {
    setSearchContext({ query, category: 'all' });
    setView(ViewState.RESULTS);
    loadListings(`${query} ${location}`, 'all');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSearchContext({ query: '', category: categoryId });
    setView(ViewState.RESULTS);
    loadListings('', categoryId);
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setView(ViewState.DETAIL);
    window.scrollTo(0, 0);
  };

  const handleLogoClick = () => {
    setView(ViewState.HOME);
    setSearchContext({ query: '', category: 'all' });
    if (listings.length === 0 || searchContext.query !== '') {
        loadListings('', 'all');
    }
    window.scrollTo(0, 0);
  };

  const handlePostAdClick = () => {
    if (!isLoggedIn) {
      setView(ViewState.LOGIN);
    } else {
      setView(ViewState.POST_AD);
    }
    window.scrollTo(0, 0);
  };

  const handleLoginClick = () => {
    setView(ViewState.LOGIN);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setView(ViewState.HOME); // Or redirect to where they wanted to go
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (view === ViewState.DETAIL) {
      setView(ViewState.RESULTS); 
    } else {
      setView(ViewState.HOME);
    }
  };

  const handleAdSubmit = (partialListing: Partial<Listing>) => {
    const newListing: Listing = {
      id: `local-${Date.now()}`,
      title: partialListing.title || 'Sans titre',
      price: partialListing.price || 0,
      location: partialListing.location || 'France',
      date: "À l'instant",
      imageUrl: partialListing.imageUrl || '',
      category: partialListing.category || 'autres',
      description: partialListing.description || '',
      sellerName: partialListing.sellerName || 'Anonyme',
      isPro: false,
    };

    setListings(prev => [newListing, ...prev]);
    setSelectedListing(newListing);
    setView(ViewState.DETAIL);
    window.scrollTo(0, 0);
  };

  // Full Page Login View
  if (view === ViewState.LOGIN) {
    return (
      <div className="font-sans text-[#1a1a1a]">
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onGoHome={handleLogoClick}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1a1a1a]">
      <Header 
        onLogoClick={handleLogoClick} 
        onPostAdClick={handlePostAdClick} 
        onLoginClick={handleLoginClick}
      />
      
      {view !== ViewState.POST_AD && (
        <CategoryBar onSelectCategory={handleCategorySelect} />
      )}

      <main className="flex-grow">
        {view === ViewState.POST_AD ? (
          <PostAdForm 
            onSubmit={handleAdSubmit} 
            onCancel={() => setView(ViewState.HOME)} 
          />
        ) : view === ViewState.DETAIL && selectedListing ? (
          <ItemDetail listing={selectedListing} onBack={handleBack} />
        ) : (
          <>
            <HeroSearch onSearch={handleSearch} />

            <div className="max-w-7xl mx-auto px-4 pb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">
                  {isLoading 
                    ? 'Chargement des annonces...' 
                    : view === ViewState.HOME 
                      ? 'Des annonces à la une' 
                      : `Résultats pour "${searchContext.query || searchContext.category}"`}
                </h2>
                {!isLoading && (
                  <span className="text-sm text-gray-500 font-semibold">
                    {listings.length} annonces
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="animate-spin text-lbc-orange mb-4" size={48} />
                  <p className="text-gray-500">Recherche intelligente en cours...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {listings.map((listing) => (
                    <ListingCard 
                      key={listing.id} 
                      listing={listing} 
                      onClick={() => handleListingClick(listing)} 
                    />
                  ))}
                </div>
              )}
              
              {!isLoading && listings.length === 0 && (
                 <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                   <p className="text-lg text-gray-600">Aucune annonce trouvée pour cette recherche.</p>
                   <button 
                     onClick={handleLogoClick}
                     className="mt-4 text-lbc-blue font-bold hover:underline"
                   >
                     Retourner à l'accueil
                   </button>
                 </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
