import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Euro, Calendar, Star, TrendingUp, Clock, Dog as DogIcon, Bell, CheckCircle, XCircle, MapPin, Phone } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface OverviewTabProps {
  stats: { monthlyEarnings: number; pendingEarnings: number; totalWalks: number; completedThisMonth: number; averageRating: number; totalReviews: number; pendingRequests: number; upcomingMissions: number; };
  walkerProfile: any;
  onNavigate: (tab: string) => void;
}

const WalkerOverviewTab = ({ stats, walkerProfile, onNavigate }: OverviewTabProps) => {
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data } = await supabase.from('bookings').select('*, dogs(name, breed, photo_url)').eq('walker_id', session.user.id).order('scheduled_date', { ascending: true });
    if (data) {
      const ownerIds = [...new Set(data.map(b => b.owner_id))];
      const { data: owners } = await supabase.from('profiles').select('id, first_name, avatar_url, city, phone').in('id', ownerIds);
      const ownerMap = new Map(owners?.map(o => [o.id, o]) || []);
      const enriched = data.map(b => ({ ...b, owner: ownerMap.get(b.owner_id) }));
      
      const now = new Date();
      setPendingBookings(enriched.filter(b => b.status === 'pending').slice(0, 5));
      setUpcomingBookings(enriched.filter(b => new Date(b.scheduled_date) >= now && b.status === 'confirmed').slice(0, 5));
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'cancelled') => {
    const { error } = await supabase.from('bookings').update({ status: action }).eq('id', bookingId);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: action === 'confirmed' ? "Réservation acceptée" : "Réservation refusée" });
    fetchBookings();
  };

  const getServiceLabel = (type: string) => ({ promenade: "Promenade", visite: "Visite", garde: "Garde", veterinaire: "Vétérinaire" }[type] || type);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="group hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Gains ce mois</CardTitle><div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center"><Euro className="h-5 w-5 text-green-600" /></div></CardHeader>
          <CardContent><div className="text-4xl font-bold text-green-600">{stats.monthlyEarnings.toFixed(0)}€</div><p className="text-sm text-muted-foreground">+{stats.pendingEarnings.toFixed(0)}€ en attente</p></CardContent>
        </Card>
        <Card className="group hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Promenades</CardTitle><div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center"><DogIcon className="h-5 w-5 text-primary" /></div></CardHeader>
          <CardContent><div className="text-4xl font-bold">{stats.totalWalks}</div><p className="text-sm text-muted-foreground">{stats.completedThisMonth} ce mois</p></CardContent>
        </Card>
        <Card className="group hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Note moyenne</CardTitle><div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center"><Star className="h-5 w-5 text-amber-500" /></div></CardHeader>
          <CardContent><div className="text-4xl font-bold flex items-center gap-1">{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}<Star className="h-5 w-5 text-amber-500 fill-amber-500" /></div><p className="text-sm text-muted-foreground">{stats.totalReviews} avis</p></CardContent>
        </Card>
        <Card className="group hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Taux acceptation</CardTitle><div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-blue-600" /></div></CardHeader>
          <CardContent><div className="text-4xl font-bold">95%</div><p className="text-sm text-muted-foreground">Réponse {"< 1h"}</p></CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader className="bg-primary/5"><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary animate-pulse" />Nouvelles demandes</CardTitle><CardDescription>{pendingBookings.length} en attente</CardDescription></CardHeader>
          <CardContent className="p-0 divide-y">
            {pendingBookings.length === 0 ? (
              <div className="text-center py-12"><Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" /><p className="text-muted-foreground">Aucune demande en attente</p></div>
            ) : pendingBookings.map(b => (
              <div key={b.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar><AvatarImage src={b.owner?.avatar_url} /><AvatarFallback>{b.owner?.first_name?.charAt(0)}</AvatarFallback></Avatar>
                  <div className="flex-1"><p className="font-semibold">{b.owner?.first_name}</p><p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{b.owner?.city || 'Non spécifié'}</p></div>
                  <Badge variant="outline">{getServiceLabel(b.service_type)}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-muted/50 rounded-lg text-sm">
                  <span className="flex items-center gap-1"><DogIcon className="h-3 w-3" />{b.dogs?.name}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(b.scheduled_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  <span className="flex items-center gap-1 font-semibold text-green-600"><Euro className="h-3 w-3" />{b.price}€</span>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 gap-1" onClick={() => handleBookingAction(b.id, 'confirmed')}><CheckCircle className="h-4 w-4" />Accepter</Button>
                  <Button variant="outline" className="flex-1 gap-1" onClick={() => handleBookingAction(b.id, 'cancelled')}><XCircle className="h-4 w-4" />Refuser</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Missions */}
        <Card className="shadow-lg">
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Prochaines missions</CardTitle><CardDescription>{upcomingBookings.length} confirmée(s)</CardDescription></CardHeader>
          <CardContent className="p-0 divide-y">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12"><Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" /><p className="text-muted-foreground">Aucune mission à venir</p></div>
            ) : upcomingBookings.map(b => (
              <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                <Avatar><AvatarImage src={b.dogs?.photo_url} /><AvatarFallback>🐕</AvatarFallback></Avatar>
                <div className="flex-1"><p className="font-semibold">{b.dogs?.name}</p><p className="text-sm text-muted-foreground">{new Date(b.scheduled_date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} à {b.scheduled_time}</p></div>
                <div className="text-right"><p className="font-bold text-green-600">{b.price}€</p><Button size="sm" variant="outline" className="mt-1">Preuve</Button></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default WalkerOverviewTab;
