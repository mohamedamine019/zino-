import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { HeroSearch } from './components/HeroSearch';
import { ListingCard } from './components/ListingCard';
import { Footer } from './components/Footer';
import { ItemDetail } from './components/ItemDetail';
import { PostAdForm } from './components/PostAdForm';
import { LoginPage } from './components/LoginPage';
import { MessageInterface } from './components/MessageInterface';
import { fetchListings } from './services/geminiService';
import { initDB, getListingsFromDB, saveListingToDB } from './services/db';
import { Listing, ViewState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{name: string} | null>(null);
  const [searchContext, setSearchContext] = useState<{ query: string; category: string }>({
    query: '',
    category: 'all'
  });

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        await loadListings('', 'all');
      } catch (e) {
        console.error("DB Initialization failed", e);
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadListings = async (query: string, category: string) => {
    setIsLoading(true);
    try {
      // 1. Fetch local listings from IndexedDB
      const localListings = await getListingsFromDB();
      
      // 2. Filter local listings based on query/category (simple client-side filter)
      const filteredLocal = localListings.filter(l => {
        const matchesCategory = category === 'all' || l.category === category;
        const matchesQuery = !query || l.title.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      });

      // 3. If it's a specific search or we have very few local items, fetch AI items
      // For this demo, we always fetch AI items on HOME to populate the feed initially
      let aiListings: Listing[] = [];
      if (category === 'all' && query === '' && localListings.length < 4) {
          // Initial population
          aiListings = await fetchListings(query, category);
      } else if (query !== '') {
          // Search mode: Get AI suggestions too
          aiListings = await fetchListings(query, category);
      }

      // 4. Merge: Local items first (they are "real" user items)
      // Remove duplicates if any ID collision (unlikely with timestamp IDs)
      const merged = [...filteredLocal, ...aiListings];
      
      setListings(merged);
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
    loadListings('', 'all');
    window.scrollTo(0, 0);
  };

  const handlePostAdClick = () => {
    if (!user) {
      setView(ViewState.LOGIN);
    } else {
      setView(ViewState.POST_AD);
    }
    window.scrollTo(0, 0);
  };

  const handleContactSeller = () => {
    if (!user) {
      setView(ViewState.LOGIN);
    } else {
      setView(ViewState.MESSAGES);
    }
    window.scrollTo(0, 0);
  };

  const handleLoginClick = () => {
    if (user) {
        // Already logged in - maybe logout? For now just go home
        // In a real app we'd have a menu
    } else {
        setView(ViewState.LOGIN);
    }
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (userName: string) => {
    setUser({ name: userName });
    // If we were on detail page, go back there, otherwise home
    if (selectedListing && view !== ViewState.HOME) {
        setView(ViewState.DETAIL);
    } else {
        setView(ViewState.HOME); 
    }
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (view === ViewState.DETAIL) {
      setView(ViewState.RESULTS); 
    } else if (view === ViewState.MESSAGES) {
      setView(ViewState.DETAIL);
    } else {
      setView(ViewState.HOME);
    }
  };

  const handleAdSubmit = async (partialListing: Partial<Listing>) => {
    const newListing: Listing = {
      id: `local-${Date.now()}`,
      title: partialListing.title || 'Sans titre',
      price: partialListing.price || 0,
      location: partialListing.location || 'France',
      date: "À l'instant",
      imageUrl: partialListing.imageUrl || '',
      category: partialListing.category || 'autres',
      description: partialListing.description || '',
      sellerName: user?.name || partialListing.sellerName || 'Anonyme',
      isPro: false,
    };

    // Save to DB
    await saveListingToDB(newListing);

    // Update state
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

  // Full Page Message View
  if (view === ViewState.MESSAGES && selectedListing) {
    return (
      <div className="font-sans text-[#1a1a1a]">
         <Header 
          onLogoClick={handleLogoClick} 
          onPostAdClick={handlePostAdClick} 
          onLoginClick={handleLoginClick}
        />
        <MessageInterface listing={selectedListing} onBack={handleBack} />
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
          <ItemDetail 
             listing={selectedListing} 
             onBack={handleBack} 
             onContact={handleContactSeller}
          />
        ) : (
          <>
            <HeroSearch onSearch={handleSearch} />

            <div className="max-w-7xl mx-auto px-4 pb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">
                  {isLoading 
                    ? 'Chargement des annonces...' 
                    : view === ViewState.HOME 
                      ? `Bienvenue ${user ? user.name : ''}` 
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