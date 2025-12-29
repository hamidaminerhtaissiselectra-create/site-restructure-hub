import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Euro, Search, Shield, Clock, Heart, CheckCircle, Users, Dog, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";

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
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState(searchParams.get('location') || '');
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || 'all');
  const [sortBy, setSortBy] = useState('rating');

  const services = [
    { value: 'all', label: 'Tous les services' },
    { value: 'promenade', label: 'Promenade' },
    { value: 'visite', label: 'Visite à domicile' },
    { value: 'garde', label: 'Garde' },
    { value: 'veterinaire', label: 'Accompagnement vétérinaire' },
  ];

  useEffect(() => {
    fetchWalkers();
  }, [selectedService, sortBy]);

  const fetchWalkers = async () => {
    try {
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
    // Vérifier si utilisateur connecté, sinon stocker la demande et rediriger après inscription
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Stocker l'intention de réservation
      sessionStorage.setItem('pendingBooking', JSON.stringify({ walkerId, returnUrl: `/book/${walkerId}` }));
      toast({
        title: "Créez votre compte",
        description: "Inscrivez-vous pour réserver ce promeneur. Votre sélection sera sauvegardée.",
      });
      navigate('/auth?redirect=' + encodeURIComponent(`/book/${walkerId}`));
      return;
    }
    navigate(`/book/${walkerId}`);
  };

  const getServiceLabel = (serviceId: string) => {
    const service = services.find(s => s.value === serviceId);
    return service?.label || serviceId;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Trouver un Promeneur de Chien Vérifié | DogWalking France"
        description="Recherchez parmi nos promeneurs de chiens vérifiés. Filtrez par ville, service et tarif. Réservation sécurisée avec paiement escrow."
        canonical="https://dogwalking.fr/walkers"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Trouvez votre <span className="text-primary">promeneur idéal</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Tous nos promeneurs sont vérifiés : CNI, casier judiciaire et assurance RC contrôlés
            </p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 -mt-20 relative z-20">
        {/* Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8 shadow-xl border-0 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">Ville ou code postal</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Paris, Lyon..."
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">Type de service</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les services" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">Trier par</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Meilleures notes</SelectItem>
                      <SelectItem value="price">Prix croissant</SelectItem>
                      <SelectItem value="reviews">Plus d'avis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full gap-2">
                    <Search className="h-4 w-4" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results count & trust badges */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-muted-foreground font-medium">
            <span className="text-foreground text-xl font-bold">{walkers.length}</span> promeneur{walkers.length > 1 ? 's' : ''} trouvé{walkers.length > 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3 text-primary" />
              100% vérifiés
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              Assurance incluse
            </Badge>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
                  <div className="h-5 bg-muted rounded mb-2 w-3/4 mx-auto" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
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
                }}>
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {walkers.map((walker, index) => (
              <motion.div
                key={walker.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card 
                  className="group overflow-hidden cursor-pointer h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300"
                  onClick={() => navigate(`/walker/${walker.user_id}`)}
                >
                  <CardContent className="p-0">
                    {/* Avatar section */}
                    <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-6 text-center">
                      <div className="relative inline-block">
                        {walker.avatar_url ? (
                          <img 
                            src={walker.avatar_url} 
                            alt={walker.first_name} 
                            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-background shadow-lg group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full mx-auto bg-primary/20 flex items-center justify-center text-4xl border-4 border-background shadow-lg">
                            👤
                          </div>
                        )}
                        {walker.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mt-4">{walker.first_name || 'Promeneur'}</h3>
                      {walker.city && (
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{walker.city}</span>
                        </div>
                      )}
                    </div>

                    {/* Info section */}
                    <div className="p-6">
                      {/* Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-lg">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <span className="font-bold text-amber-700 dark:text-amber-400">{walker.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                          {(walker.total_reviews || 0) > 0 && (
                            <span className="text-sm text-muted-foreground">({walker.total_reviews} avis)</span>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-rose-500 hover:bg-rose-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Experience */}
                      {walker.experience_years && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4" />
                          <span>{walker.experience_years} {walker.experience_years > 1 ? 'ans' : 'an'} d'expérience</span>
                        </div>
                      )}

                      {/* Bio */}
                      {walker.bio && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{walker.bio}</p>
                      )}

                      {/* Services badges */}
                      {walker.services && walker.services.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {walker.services.slice(0, 3).map((service: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs font-normal">
                              {getServiceLabel(service)}
                            </Badge>
                          ))}
                          {walker.services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{walker.services.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl font-bold text-primary">{walker.hourly_rate || 15}€</span>
                          <span className="text-sm text-muted-foreground">/30min</span>
                        </div>
                        <Button 
                          size="sm"
                          className="shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookWalker(walker.user_id);
                          }}
                        >
                          Réserver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default FindWalkers;
