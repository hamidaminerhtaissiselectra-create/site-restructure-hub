import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, Dog as DogIcon, Euro, Clock, Star, Heart, 
  MessageCircle, Plus, Search, ChevronRight, 
  CheckCircle, AlertCircle, MapPin, Gift,
  Shield, Bell, TrendingUp, Sparkles, ArrowRight
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";

// Hero image
import heroImage from "@/assets/pages/dashboard-owner-hero.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [dogs, setDogs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalDogs: 0,
    totalSpent: 0,
    pendingProofs: 0,
    totalFavorites: 0,
    unreadNotifications: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    fetchData(session.user.id);
  };

  const fetchData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(profileData);

      // Fetch dogs
      const { data: dogsData } = await supabase
        .from('dogs')
        .select('*')
        .eq('owner_id', userId);
      setDogs(dogsData || []);

      // Fetch bookings with dog info
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, dogs(name, breed, photo_url)')
        .eq('owner_id', userId)
        .order('scheduled_date', { ascending: false });

      if (bookingsData && bookingsData.length > 0) {
        const walkerIds = [...new Set(bookingsData.map(b => b.walker_id).filter(Boolean))];
        if (walkerIds.length > 0) {
          const { data: walkersData } = await supabase
            .from('profiles')
            .select('id, first_name, avatar_url, city')
            .in('id', walkerIds);

          const walkerMap = new Map(walkersData?.map(w => [w.id, w]) || []);
          const enrichedBookings = bookingsData.map(b => ({
            ...b,
            walker: walkerMap.get(b.walker_id)
          }));
          setBookings(enrichedBookings);
        } else {
          setBookings(bookingsData);
        }
      }

      // Fetch favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('*, walker_profiles(*)')
        .eq('user_id', userId);
      setFavorites(favoritesData || []);

      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      setNotifications(notificationsData || []);

      // Calculate stats
      const now = new Date();
      const upcoming = bookingsData?.filter(
        b => new Date(b.scheduled_date) >= now && b.status !== 'cancelled'
      ) || [];
      const completed = bookingsData?.filter(b => b.status === 'completed') || [];
      const totalSpent = completed.reduce((sum, b) => sum + Number(b.price || 0), 0);
      const unreadNotifs = notificationsData?.filter(n => !n.read) || [];

      setStats({
        totalBookings: bookingsData?.length || 0,
        upcomingBookings: upcoming.length,
        completedBookings: completed.length,
        totalDogs: dogsData?.length || 0,
        totalSpent,
        pendingProofs: 0,
        totalFavorites: favoritesData?.length || 0,
        unreadNotifications: unreadNotifs.length
      });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any; icon?: any; className?: string }> = {
      pending: { label: 'En attente', variant: 'secondary', icon: Clock, className: 'bg-amber-100 text-amber-700 border-amber-200' },
      confirmed: { label: 'Confirmée', variant: 'default', icon: CheckCircle, className: 'bg-primary/10 text-primary border-primary/20' },
      completed: { label: 'Terminée', variant: 'outline', icon: CheckCircle, className: 'bg-green-100 text-green-700 border-green-200' },
      cancelled: { label: 'Annulée', variant: 'destructive', icon: AlertCircle },
    };
    const { label, icon: Icon, className } = statusMap[status] || statusMap.pending;
    return (
      <Badge className={`flex items-center gap-1 ${className || ''}`}>
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </Badge>
    );
  };

  const getServiceLabel = (serviceType: string) => {
    const services: Record<string, string> = {
      promenade: "Promenade",
      visite: "Visite à domicile",
      garde: "Garde",
      veterinaire: "Accompagnement vétérinaire"
    };
    return services[serviceType] || serviceType;
  };

  const markNotificationRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
  };

  const profileCompletion = () => {
    let score = 0;
    if (profile?.first_name) score += 20;
    if (profile?.last_name) score += 20;
    if (profile?.phone) score += 20;
    if (profile?.city) score += 20;
    if (profile?.avatar_url) score += 20;
    return score;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Chargement de votre espace...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    b => new Date(b.scheduled_date) >= new Date() && b.status !== 'cancelled'
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SEOHead
        title="Mon Espace Propriétaire | DogWalking"
        description="Gérez vos réservations, vos chiens et trouvez des promeneurs vérifiés depuis votre tableau de bord DogWalking."
      />
      <Header />
      <main className="container mx-auto px-4 py-24">
        {/* Welcome Hero with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 overflow-hidden"
        >
          {/* Background image subtle */}
          <div className="absolute inset-0 opacity-5">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {stats.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center font-bold">
                    {stats.unreadNotifications}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Bonjour {profile?.first_name} 👋
                </h1>
                <p className="text-muted-foreground">Bienvenue sur votre espace propriétaire</p>
                {profile?.city && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {profile.city}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate('/referral')} className="gap-2">
                <Gift className="h-4 w-4" />
                Parrainage
              </Button>
              <Button onClick={() => navigate('/walkers')} className="gap-2 shadow-lg">
                <Search className="h-4 w-4" />
                Trouver un promeneur
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Profile Completion Alert */}
        {profileCompletion() < 100 && (
          <Card className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900">
            <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold">Complétez votre profil</p>
                  <p className="text-sm text-muted-foreground">Un profil complet inspire confiance aux promeneurs</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Progress value={profileCompletion()} className="w-24 h-2" />
                  <span className="text-sm font-medium">{profileCompletion()}%</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/profile')} className="gap-2">
                  Compléter <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Réservations</CardTitle>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary font-semibold">{stats.upcomingBookings}</span> à venir
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mes chiens</CardTitle>
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                <DogIcon className="h-5 w-5 text-secondary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalDogs}</div>
              <p className="text-xs text-muted-foreground mt-1">enregistrés</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total dépensé</CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Euro className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalSpent.toFixed(0)}€</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.completedBookings} promenades
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Favoris</CardTitle>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalFavorites}</div>
              <p className="text-xs text-muted-foreground mt-1">promeneurs</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { icon: Plus, label: 'Ajouter un chien', onClick: () => navigate('/dogs/add'), color: 'text-primary' },
            { icon: Search, label: 'Trouver promeneur', onClick: () => navigate('/walkers'), color: 'text-primary' },
            { icon: Calendar, label: 'Mes réservations', onClick: () => navigate('/bookings'), color: 'text-primary' },
            { icon: MessageCircle, label: 'Messages', onClick: () => navigate('/messages'), color: 'text-primary' },
            { icon: Gift, label: 'Parrainage', onClick: () => navigate('/referral'), color: 'text-primary' },
          ].map((action, i) => (
            <Button 
              key={i}
              onClick={action.onClick} 
              variant="outline" 
              className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
            >
              <action.icon className={`h-6 w-6 ${action.color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Bookings & Dogs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Bookings */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Prochaines réservations
                  </CardTitle>
                  <CardDescription>{stats.upcomingBookings} réservation(s) à venir</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')} className="gap-1">
                  Voir tout <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Aucune réservation à venir</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Trouvez un promeneur de confiance pour votre compagnon
                    </p>
                    <Button onClick={() => navigate('/walkers')} className="gap-2">
                      <Search className="h-4 w-4" />
                      Réserver une promenade
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {upcomingBookings.map(booking => (
                      <div 
                        key={booking.id} 
                        className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors" 
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                      >
                        <Avatar className="h-14 w-14 ring-2 ring-background shadow">
                          <AvatarImage src={booking.walker?.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {booking.walker?.first_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold truncate">{booking.dogs?.name}</span>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {getServiceLabel(booking.service_type)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(booking.scheduled_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {booking.scheduled_time}
                            </span>
                            <span>avec {booking.walker?.first_name || 'promeneur'}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {getStatusBadge(booking.status)}
                          <p className="font-bold text-lg mt-1">{Number(booking.price || 0).toFixed(2)}€</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Dogs */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DogIcon className="h-5 w-5 text-primary" />
                    Mes chiens
                  </CardTitle>
                  <CardDescription>{dogs.length} chien(s) enregistré(s)</CardDescription>
                </div>
                <Button onClick={() => navigate('/dogs/add')} size="sm" className="gap-1">
                  <Plus className="h-4 w-4" /> Ajouter
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {dogs.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-4xl">
                      🐕
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Aucun chien enregistré</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Ajoutez votre premier compagnon pour réserver des promenades
                    </p>
                    <Button onClick={() => navigate('/dogs/add')} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ajouter mon chien
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {dogs.map(dog => (
                      <div key={dog.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                        {dog.photo_url ? (
                          <img src={dog.photo_url} alt={dog.name} className="w-16 h-16 rounded-2xl object-cover shadow" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-3xl shadow">
                            🐕
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{dog.name}</p>
                          <p className="text-sm text-muted-foreground">{dog.breed || 'Race non spécifiée'}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            {dog.age && <span>{dog.age} an(s)</span>}
                            {dog.weight && <span>• {dog.weight}kg</span>}
                            {dog.size && <span>• {dog.size}</span>}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0">
                          Modifier
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </CardTitle>
                {stats.unreadNotifications > 0 && (
                  <Badge variant="destructive" className="rounded-full">{stats.unreadNotifications}</Badge>
                )}
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(0, 4).map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-3 rounded-xl text-sm cursor-pointer transition-all ${
                          !notif.read 
                            ? 'bg-primary/5 hover:bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted border border-transparent'
                        }`}
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <p className="font-medium line-clamp-1">{notif.title}</p>
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Promeneurs favoris
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground mb-2">Aucun favori</p>
                    <Button variant="link" size="sm" onClick={() => navigate('/walkers')} className="p-0">
                      Découvrir les promeneurs →
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites.slice(0, 3).map(fav => (
                      <div key={fav.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {fav.walker_profiles?.first_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{fav.walker_profiles?.first_name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            {fav.walker_profiles?.rating || '0'}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0" onClick={() => navigate(`/book/${fav.walker_id}`)}>
                          Réserver
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Referral CTA */}
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-6 text-center relative">
                <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Gift className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Parrainez vos amis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gagnez 10€ pour chaque ami qui s'inscrit
                </p>
                <Button onClick={() => navigate('/referral')} className="w-full">
                  Inviter des amis
                </Button>
              </CardContent>
            </Card>

            {/* Security Trust */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Paiements sécurisés</p>
                    <p className="text-xs text-muted-foreground">Vos transactions sont protégées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Dashboard;
