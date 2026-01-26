import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Euro, Calendar, Star, Clock, Dog as DogIcon, Bell, 
  CheckCircle, XCircle, MapPin, Phone, Zap, Power, Navigation,
  AlertTriangle, PlayCircle, PauseCircle, MessageCircle
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import SOSButton from "@/components/dashboard/shared/SOSButton";

interface WalkerHomeTabProps {
  stats: { 
    monthlyEarnings: number; 
    pendingEarnings: number; 
    totalWalks: number; 
    completedThisMonth: number; 
    averageRating: number; 
    totalReviews: number; 
    pendingRequests: number; 
    upcomingMissions: number; 
  };
  walkerProfile: any;
  onNavigate: (tab: string) => void;
}

const WalkerHomeTab = ({ stats, walkerProfile, onNavigate }: WalkerHomeTabProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentMission, setCurrentMission] = useState<any>(null);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => { 
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    // Fetch bookings
    const { data } = await supabase
      .from('bookings')
      .select('*, dogs(name, breed, photo_url)')
      .eq('walker_id', session.user.id)
      .order('scheduled_date', { ascending: true });
    
    if (data) {
      const ownerIds = [...new Set(data.map(b => b.owner_id))];
      const { data: owners } = await supabase
        .from('profiles')
        .select('id, first_name, avatar_url, city, phone')
        .in('id', ownerIds);
      
      const ownerMap = new Map(owners?.map(o => [o.id, o]) || []);
      const enriched = data.map(b => ({ ...b, owner: ownerMap.get(b.owner_id) }));
      
      // Mission en cours
      const inProgress = enriched.find(b => b.status === 'in_progress');
      setCurrentMission(inProgress || null);
      
      // Demandes en attente
      setPendingBookings(enriched.filter(b => b.status === 'pending').slice(0, 3));
    }
  };

  const handleToggleAvailability = async (available: boolean) => {
    setLoadingAvailability(true);
    // In a real app, this would update the walker_profiles table
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAvailable(available);
    setLoadingAvailability(false);
    toast({ 
      title: available ? "🟢 Vous êtes disponible" : "🔴 Vous êtes hors ligne",
      description: available ? "Les propriétaires peuvent vous contacter" : "Vous ne recevrez plus de demandes"
    });
  };

  const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'cancelled') => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: action })
      .eq('id', bookingId);
    
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    
    toast({ title: action === 'confirmed' ? "✅ Réservation acceptée" : "❌ Réservation refusée" });
    fetchData();
  };

  const handleStartMission = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'in_progress' })
      .eq('id', bookingId);
    
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    
    toast({ title: "🚀 Mission démarrée !", description: "N'oubliez pas d'envoyer des photos-preuves" });
    fetchData();
  };

  const getServiceLabel = (type: string) => ({ 
    promenade: "Promenade", 
    visite: "Visite", 
    garde: "Garde", 
    veterinaire: "Vétérinaire" 
  }[type] || type);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
    >
      {/* Toggle Disponibilité + SOS - toujours visible */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isAvailable ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'
          }`}>
            <Power className={`h-6 w-6 ${isAvailable ? 'text-green-600' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className="font-semibold text-lg">
              {isAvailable ? '🟢 Disponible' : '🔴 Hors ligne'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isAvailable ? 'Vous recevez des demandes' : 'Aucune demande ne sera reçue'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Switch
            checked={isAvailable}
            onCheckedChange={handleToggleAvailability}
            disabled={loadingAvailability}
            className="data-[state=checked]:bg-green-600"
          />
          <SOSButton />
        </div>
      </div>

      {/* Mission en cours */}
      {currentMission && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary gap-1">
                  <Navigation className="h-3 w-3 animate-pulse" />
                  Mission en cours
                </Badge>
                <span className="text-2xl font-bold text-primary">{currentMission.price}€</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary">
                  <AvatarImage src={currentMission.dogs?.photo_url} />
                  <AvatarFallback className="text-2xl">🐕</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{currentMission.dogs?.name}</h3>
                  <p className="text-muted-foreground">{currentMission.dogs?.breed}</p>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {currentMission.city || 'Lieu non spécifié'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" onClick={() => onNavigate('planning')}>
                  <PlayCircle className="h-4 w-4" />
                  Envoyer photo-preuve
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Contacter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Euro className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{stats.monthlyEarnings}€</p>
            <p className="text-sm text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <DogIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.totalWalks}</p>
            <p className="text-sm text-muted-foreground">Promenades</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Star className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{stats.averageRating || '5.0'}</p>
            <p className="text-sm text-muted-foreground">{stats.totalReviews} avis</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{stats.upcomingMissions}</p>
            <p className="text-sm text-muted-foreground">À venir</p>
          </CardContent>
        </Card>
      </div>

      {/* Demandes en attente */}
      <Card className={pendingBookings.length > 0 ? 'border-2 border-amber-500/50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <Bell className={`h-5 w-5 ${pendingBookings.length > 0 ? 'text-amber-500 animate-pulse' : 'text-muted-foreground'}`} />
                Nouvelles demandes
              </CardTitle>
              {pendingBookings.length > 0 && (
                <Badge variant="destructive">{pendingBookings.length}</Badge>
              )}
            </div>
            {stats.pendingRequests > 3 && (
              <Button variant="link" onClick={() => onNavigate('planning')}>
                Voir tout ({stats.pendingRequests})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {pendingBookings.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="font-medium">Aucune demande en attente</p>
              <p className="text-sm text-muted-foreground">Vous êtes à jour ! 🎉</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((b, idx) => (
                <motion.div 
                  key={b.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-muted/30 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={b.owner?.avatar_url} />
                      <AvatarFallback>{b.owner?.first_name?.charAt(0) || 'P'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{b.owner?.first_name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <DogIcon className="h-3 w-3" />
                        {b.dogs?.name} • {getServiceLabel(b.service_type)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{b.price}€</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(b.scheduled_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                      onClick={() => handleBookingAction(b.id, 'confirmed')}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accepter
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => handleBookingAction(b.id, 'cancelled')}
                    >
                      <XCircle className="h-4 w-4" />
                      Refuser
                    </Button>
                    {b.owner?.phone && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`tel:${b.owner.phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-6 flex-col gap-2"
          onClick={() => onNavigate('planning')}
        >
          <Calendar className="h-8 w-8 text-primary" />
          <span>Mon planning</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-6 flex-col gap-2"
          onClick={() => onNavigate('gains')}
        >
          <Euro className="h-8 w-8 text-green-600" />
          <span>Mes gains</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default WalkerHomeTab;
