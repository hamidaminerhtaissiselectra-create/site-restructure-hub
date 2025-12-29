import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Dog, Shield, Sparkles, Zap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { SearchFilters } from "@/components/booking/SearchFilters";
import { WalkerCard } from "@/components/booking/WalkerCard";
import { useWalkerMatching, MatchingCriteria } from "@/hooks/useWalkerMatching";

// Hero image
import heroImage from "@/assets/pages/trouver-promeneurs-hero.jpg";

interface WalkerWithProfile {
  id: string;
  user_id: string;
  hourly_rate: number | null;
  rating: number | null;
  total_reviews: number | null;
  verified: boolean | null;
  services: string[] | null;
  experience_years: number | null;
  bio?: string;
  first_name?: string;
  avatar_url?: string;
  city?: string;
}

const FindWalkers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [walkers, setWalkers] = useState<WalkerWithProfile[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState(searchParams.get('location') || '');
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || 'all');
  const [sortBy, setSortBy] = useState('rating');
  const [useSmartMatching, setUseSmartMatching] = useState(false);
  
  // Smart matching criteria
  const matchingCriteria: MatchingCriteria = {
    serviceType: selectedService !== 'all' ? selectedService : undefined,
    maxBudget: 30,
    preferVerified: true,
    minRating: 4.0
  };
  
  const { matchedWalkers, isLoading: matchingLoading } = useWalkerMatching(matchingCriteria);

  useEffect(() => {
    fetchWalkers();
    fetchFavorites();
  }, [selectedService, sortBy]);

  const fetchFavorites = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data } = await supabase
      .from('favorites')
      .select('walker_id')
      .eq('user_id', session.user.id);
    
    if (data) {
      setFavorites(new Set(data.map(f => f.walker_id)));
    }
  };

  const fetchWalkers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('walker_profiles')
        .select('*');

      if (sortBy === 'rating') {
        query = query.order('rating', { ascending: false, nullsFirst: false });
      } else if (sortBy === 'price') {
        query = query.order('hourly_rate', { ascending: true, nullsFirst: false });
      } else if (sortBy === 'reviews') {
        query = query.order('total_reviews', { ascending: false, nullsFirst: false });
      }

      const { data: walkerProfiles, error } = await query;

      if (error) throw error;

      if (!walkerProfiles || walkerProfiles.length === 0) {
        setWalkers([]);
        return;
      }

      const userIds = walkerProfiles.map(w => w.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, avatar_url, city, bio')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      let merged: WalkerWithProfile[] = walkerProfiles.map(wp => ({
        ...wp,
        ...profileMap.get(wp.user_id)
      }));
      
      if (selectedService !== 'all') {
        merged = merged.filter(w => w.services?.includes(selectedService));
      }

      if (searchCity) {
        merged = merged.filter(w => 
          w.city?.toLowerCase().includes(searchCity.toLowerCase())
        );
      }

      setWalkers(merged);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchWalkers();
  };

  const handleBookWalker = async (walkerId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      sessionStorage.setItem('pendingBooking', JSON.stringify({ walkerId, returnUrl: `/book/${walkerId}` }));
      toast({
        title: "Créez votre compte",
        description: "Inscrivez-vous pour réserver ce promeneur.",
      });
      navigate('/auth?redirect=' + encodeURIComponent(`/book/${walkerId}`));
      return;
    }
    navigate(`/book/${walkerId}`);
  };

  const handleToggleFavorite = async (walkerId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter aux favoris.",
      });
      return;
    }

    const isFavorite = favorites.has(walkerId);
    
    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('walker_id', walkerId);
      
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(walkerId);
        return newSet;
      });
      toast({ title: "Retiré des favoris" });
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: session.user.id, walker_id: walkerId });
      
      setFavorites(prev => new Set(prev).add(walkerId));
      toast({ title: "Ajouté aux favoris ❤️" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Trouver un Promeneur de Chien Vérifié | DogWalking France"
        description="Recherchez parmi nos promeneurs de chiens vérifiés. Filtrez par ville, service et tarif. Réservation sécurisée avec paiement escrow."
        canonical="https://dogwalking.fr/walkers"
      />
      <Header />
      
      {/* Hero Section - Compact */}
      <section className="relative h-[35vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src={heroImage} 
            alt="Trouver un promeneur de chien" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </motion.div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Users className="h-3 w-3 mr-1" />
              +500 promeneurs vérifiés
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Trouvez un <span className="text-primary">pet sitter</span>
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto">
              Ajoutez des dates et des animaux pour voir les promeneurs disponibles
            </p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6 -mt-16 relative z-20">
        {/* Filters - Rover style */}
        <SearchFilters
          searchCity={searchCity}
          setSearchCity={setSearchCity}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          onSearch={handleSearch}
        />

        {/* Results header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between my-6 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <p className="text-muted-foreground">
              <span className="text-foreground text-2xl font-bold">{walkers.length}</span>{' '}
              promeneur{walkers.length !== 1 ? 's' : ''} trouvé{walkers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={useSmartMatching ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => setUseSmartMatching(!useSmartMatching)}
            >
              <Zap className="h-3.5 w-3.5" />
              Matching intelligent
            </Button>
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
              <Shield className="h-3.5 w-3.5 text-primary" />
              100% vérifiés
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Assurance incluse
            </Badge>
          </div>
        </motion.div>

        {/* Smart Matching Info */}
        {useSmartMatching && matchedWalkers.length > 0 && (
          <motion.div 
            className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-primary font-medium">
              <Zap className="h-4 w-4" />
              Matching intelligent activé
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Les promeneurs sont triés par score de compatibilité selon vos critères
            </p>
          </motion.div>
        )}

        {/* Results Grid */}
        {(loading || (useSmartMatching && matchingLoading)) ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-full bg-muted" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : walkers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Dog className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun promeneur trouvé</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Essayez d'élargir vos critères de recherche ou changez de ville
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchCity('');
                  setSelectedService('all');
                  fetchWalkers();
                }}>
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(useSmartMatching ? matchedWalkers : walkers).map((walker: any, index) => (
              <WalkerCard
                key={walker.id}
                walker={walker}
                index={index}
                onBook={handleBookWalker}
                onFavorite={handleToggleFavorite}
                isFavorite={favorites.has(walker.user_id)}
                isStarSitter={walker.verified && (walker.rating || 0) >= 4.8}
                matchScore={useSmartMatching ? walker.matchScore : undefined}
                matchReasons={useSmartMatching ? walker.matchReasons : undefined}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default FindWalkers;
