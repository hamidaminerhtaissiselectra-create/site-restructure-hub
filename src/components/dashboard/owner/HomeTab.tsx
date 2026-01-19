import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, Star, MapPin, Calendar, Clock, Dog, 
  Filter, ChevronRight, Shield, Heart
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface HomeTabProps {
  profile: any;
  onNavigate: (tab: string) => void;
}

const HomeTab = ({ profile, onNavigate }: HomeTabProps) => {
  const navigate = useNavigate();
  const [walkers, setWalkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    service: "",
    date: "",
    dogSize: ""
  });

  useEffect(() => {
    fetchWalkers();
  }, []);

  const fetchWalkers = async () => {
    setLoading(true);
    try {
      const { data: walkerProfiles } = await supabase
        .from('walker_profiles')
        .select('*, profiles:user_id(first_name, last_name, avatar_url, city)')
        .eq('verified', true)
        .order('rating', { ascending: false })
        .limit(8);

      setWalkers(walkerProfiles || []);
    } catch (error) {
      console.error('Error fetching walkers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Navigate to walkers page with filters
    const params = new URLSearchParams();
    if (filters.service) params.set('service', filters.service);
    if (filters.dogSize) params.set('size', filters.dogSize);
    navigate(`/walkers?${params.toString()}`);
  };

  const serviceOptions = [
    { value: "promenade", label: "Promenade" },
    { value: "garde", label: "Garde" },
    { value: "visite", label: "Visite à domicile" },
    { value: "veterinaire", label: "Accompagnement vétérinaire" },
  ];

  const sizeOptions = [
    { value: "small", label: "Petit (< 10kg)" },
    { value: "medium", label: "Moyen (10-25kg)" },
    { value: "large", label: "Grand (25-45kg)" },
    { value: "giant", label: "Géant (> 45kg)" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Welcome Message */}
      <div className="text-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Bonjour, {profile?.first_name || 'Bienvenue'} 👋
        </h1>
        <p className="text-muted-foreground text-lg mt-1">
          Trouvez le promeneur idéal pour votre compagnon
        </p>
      </div>

      {/* Search Form Card */}
      <Card className="shadow-xl border-2 border-primary/10 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-6 w-6 text-primary" />
            Rechercher un promeneur
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          {/* Service Type */}
          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Dog className="h-5 w-5 text-primary" />
              Type de service
            </Label>
            <Select 
              value={filters.service} 
              onValueChange={(v) => setFilters({...filters, service: v})}
            >
              <SelectTrigger className="h-14 text-base">
                <SelectValue placeholder="Choisir un service..." />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-base py-3">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Date souhaitée
            </Label>
            <Input 
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
              className="h-14 text-base"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Dog Size */}
          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Taille du chien
            </Label>
            <Select 
              value={filters.dogSize} 
              onValueChange={(v) => setFilters({...filters, dogSize: v})}
            >
              <SelectTrigger className="h-14 text-base">
                <SelectValue placeholder="Choisir la taille..." />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-base py-3">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch} 
            size="lg" 
            className="w-full h-14 text-lg font-semibold gap-2 mt-2"
          >
            <Search className="h-5 w-5" />
            Rechercher
          </Button>
        </CardContent>
      </Card>

      {/* Available Walkers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Promeneurs disponibles
          </h2>
          <Button variant="ghost" onClick={() => navigate('/walkers')} className="gap-1">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div 
              className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : walkers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-lg font-medium mb-2">Aucun promeneur trouvé</p>
              <p className="text-muted-foreground">Modifiez vos critères de recherche</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {walkers.map((walker, index) => (
              <motion.div
                key={walker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-[0.98]"
                  onClick={() => navigate(`/walker/${walker.user_id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="h-16 w-16 ring-2 ring-background shadow-lg">
                          <AvatarImage src={walker.profiles?.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                            {walker.profiles?.first_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {walker.verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-background">
                            <Shield className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">
                            {walker.profiles?.first_name} {walker.profiles?.last_name?.charAt(0)}.
                          </h3>
                          {walker.verified && (
                            <Badge variant="secondary" className="text-xs">Vérifié</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-muted-foreground text-sm mt-1">
                          {walker.profiles?.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {walker.profiles.city}
                            </span>
                          )}
                          {walker.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                              {walker.rating.toFixed(1)}
                              <span className="text-xs">({walker.total_reviews || 0})</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {walker.hourly_rate || 15}€
                        </p>
                        <p className="text-xs text-muted-foreground">/ promenade</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HomeTab;
