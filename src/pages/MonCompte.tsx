import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Dog as DogIcon, Euro, Clock, Star, Heart, 
  MessageCircle, Plus, Search, ChevronRight, 
  CheckCircle, AlertCircle, MapPin, Gift,
  Shield, Bell, User, LogOut, Camera, Sparkles, ArrowRight
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";

import heroImage from "@/assets/pages/dashboard-owner-hero.jpg";

const MonCompte = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
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
    totalFavorites: 0,
    unreadNotifications: 0
  });

  // Dog form state
  const [addingDog, setAddingDog] = useState(false);
  const [savingDog, setSavingDog] = useState(false);

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
        .limit(10);
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
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700' },
      confirmed: { label: 'Confirmée', className: 'bg-primary/10 text-primary' },
      completed: { label: 'Terminée', className: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
    };
    const { label, className } = statusMap[status] || statusMap.pending;
    return <Badge className={className}>{label}</Badge>;
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

  const profileCompletion = () => {
    let score = 0;
    if (profile?.first_name) score += 20;
    if (profile?.last_name) score += 20;
    if (profile?.phone) score += 20;
    if (profile?.city) score += 20;
    if (profile?.avatar_url) score += 20;
    return score;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.get('firstName') as string,
          last_name: formData.get('lastName') as string,
          phone: formData.get('phone') as string || null,
          address: formData.get('address') as string || null,
          city: formData.get('city') as string || null,
          postal_code: formData.get('zipCode') as string || null,
          bio: formData.get('bio') as string || null,
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({ title: "Profil mis à jour", description: "Vos modifications ont été enregistrées" });
      fetchData(session.user.id);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddDog = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setSavingDog(true);
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const { error } = await supabase.from('dogs').insert({
        owner_id: session.user.id,
        name: formData.get('name') as string,
        breed: formData.get('breed') as string,
        age: formData.get('age') ? parseInt(formData.get('age') as string) : null,
        weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
        temperament: formData.get('temperament') as string || null,
        special_needs: formData.get('medical') as string || null,
      });

      if (error) throw error;

      toast({ title: "Chien ajouté !", description: "Votre chien a été ajouté avec succès." });
      setAddingDog(false);
      fetchData(session.user.id);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSavingDog(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const upcomingBookings = bookings.filter(
    b => new Date(b.scheduled_date) >= new Date() && b.status !== 'cancelled'
  ).slice(0, 5);

  const pastBookings = bookings.filter(b => b.status === 'completed').slice(0, 10);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SEOHead
        title="Mon Compte | DogWalking"
        description="Gérez votre compte DogWalking : réservations, chiens, profil et paramètres."
      />
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        {/* Welcome Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 overflow-hidden"
        >
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
                <p className="text-muted-foreground">Bienvenue sur votre espace</p>
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
                  <p className="text-sm text-muted-foreground">Un profil complet inspire confiance</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Progress value={profileCompletion()} className="w-24 h-2" />
                  <span className="text-sm font-medium">{profileCompletion()}%</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('profil')} className="gap-2">
                  Compléter <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="gap-2">
              <Calendar className="h-4 w-4" />
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger value="reservations" className="gap-2">
              <Clock className="h-4 w-4" />
              Réservations
            </TabsTrigger>
            <TabsTrigger value="chiens" className="gap-2">
              <DogIcon className="h-4 w-4" />
              Mes chiens
            </TabsTrigger>
            <TabsTrigger value="profil" className="gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Réservations</CardTitle>
                  <Calendar className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-primary font-semibold">{stats.upcomingBookings}</span> à venir
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Mes chiens</CardTitle>
                  <DogIcon className="h-5 w-5 text-secondary-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalDogs}</div>
                  <p className="text-xs text-muted-foreground mt-1">enregistrés</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total dépensé</CardTitle>
                  <Euro className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalSpent.toFixed(0)}€</div>
                  <p className="text-xs text-muted-foreground mt-1">{stats.completedBookings} promenades</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Favoris</CardTitle>
                  <Heart className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalFavorites}</div>
                  <p className="text-xs text-muted-foreground mt-1">promeneurs</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Prochaines réservations
                  </CardTitle>
                  <CardDescription>{stats.upcomingBookings} réservation(s) à venir</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('reservations')} className="gap-1">
                  Voir tout <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="font-semibold text-lg mb-2">Aucune réservation à venir</h3>
                    <p className="text-muted-foreground mb-6">Trouvez un promeneur de confiance</p>
                    <Button onClick={() => navigate('/walkers')} className="gap-2">
                      <Search className="h-4 w-4" />
                      Réserver une promenade
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={booking.dogs?.photo_url} />
                            <AvatarFallback><DogIcon className="h-4 w-4" /></AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{booking.dogs?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.scheduled_date).toLocaleDateString('fr-FR')} à {booking.scheduled_time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(booking.status)}
                          <p className="font-bold text-primary">{Number(booking.price || 0).toFixed(0)}€</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Plus, label: 'Ajouter un chien', onClick: () => setActiveTab('chiens') },
                { icon: Search, label: 'Trouver promeneur', onClick: () => navigate('/walkers') },
                { icon: MessageCircle, label: 'Messages', onClick: () => navigate('/messages') },
                { icon: Gift, label: 'Parrainage', onClick: () => navigate('/referral') },
              ].map((action, i) => (
                <Button 
                  key={i}
                  onClick={action.onClick} 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <action.icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <Tabs defaultValue="upcoming">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">À venir ({upcomingBookings.length})</TabsTrigger>
                <TabsTrigger value="past">Terminées ({pastBookings.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Annulées</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-6 space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="font-semibold text-lg mb-2">Aucune réservation à venir</h3>
                  </div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <Card 
                      key={booking.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{booking.dogs?.name}</h3>
                            <p className="text-sm text-muted-foreground">{booking.dogs?.breed}</p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(booking.scheduled_date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.scheduled_time}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{getServiceLabel(booking.service_type)}</span>
                          <span className="text-lg font-bold text-primary">{Number(booking.price || 0).toFixed(0)}€</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-6 space-y-4">
                {pastBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="font-semibold text-lg mb-2">Aucune promenade terminée</h3>
                  </div>
                ) : (
                  pastBookings.map((booking) => (
                    <Card 
                      key={booking.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{booking.dogs?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.scheduled_date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <span className="font-bold text-primary">{Number(booking.price || 0).toFixed(0)}€</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="mt-6">
                <div className="text-center py-12">
                  <h3 className="font-semibold text-lg mb-2">Aucune réservation annulée</h3>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Dogs Tab */}
          <TabsContent value="chiens" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Mes chiens</h2>
                <p className="text-muted-foreground">{dogs.length} chien(s) enregistré(s)</p>
              </div>
              <Button onClick={() => setAddingDog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un chien
              </Button>
            </div>

            {addingDog && (
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un nouveau chien</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddDog} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom *</Label>
                        <Input id="name" name="name" required placeholder="Rex, Bella..." />
                      </div>
                      <div>
                        <Label htmlFor="breed">Race *</Label>
                        <Input id="breed" name="breed" required placeholder="Labrador..." />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Âge (années)</Label>
                        <Input id="age" name="age" type="number" min="0" placeholder="3" />
                      </div>
                      <div>
                        <Label htmlFor="weight">Poids (kg)</Label>
                        <Input id="weight" name="weight" type="number" step="0.1" min="0" placeholder="25" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="temperament">Tempérament</Label>
                      <Textarea id="temperament" name="temperament" placeholder="Calme, joueur..." rows={2} />
                    </div>
                    <div>
                      <Label htmlFor="medical">Notes médicales</Label>
                      <Textarea id="medical" name="medical" placeholder="Allergies, traitements..." rows={2} />
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setAddingDog(false)} className="flex-1">
                        Annuler
                      </Button>
                      <Button type="submit" className="flex-1" disabled={savingDog}>
                        {savingDog ? 'Ajout...' : 'Ajouter'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dogs.map((dog) => (
                <Card key={dog.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={dog.photo_url} />
                        <AvatarFallback className="bg-primary/10">
                          <DogIcon className="h-8 w-8 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{dog.name}</h3>
                        <p className="text-muted-foreground">{dog.breed}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {dog.age && <p><span className="text-muted-foreground">Âge :</span> {dog.age} ans</p>}
                      {dog.weight && <p><span className="text-muted-foreground">Poids :</span> {dog.weight} kg</p>}
                      {dog.temperament && <p><span className="text-muted-foreground">Tempérament :</span> {dog.temperament}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {dogs.length === 0 && !addingDog && (
              <div className="text-center py-12">
                <DogIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold text-lg mb-2">Aucun chien enregistré</h3>
                <p className="text-muted-foreground mb-6">Ajoutez votre premier compagnon</p>
                <Button onClick={() => setAddingDog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un chien
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profil" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-8 h-8">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                      <Badge variant="secondary">
                        {profile.user_type === 'walker' ? 'Promeneur' : 'Propriétaire'}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" name="firstName" defaultValue={profile.first_name} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" name="lastName" defaultValue={profile.last_name} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={profile.phone || ''} placeholder="06 12 34 56 78" />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" defaultValue={profile.bio || ''} placeholder="Parlez-nous de vous..." rows={3} />
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" name="address" defaultValue={profile.address || ''} placeholder="123 Rue de la Paix" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" name="city" defaultValue={profile.city || ''} placeholder="Paris" />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Code postal</Label>
                      <Input id="zipCode" name="zipCode" defaultValue={profile.postal_code || ''} placeholder="75001" />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={savingProfile}>
                    {savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center py-12">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold text-lg mb-2">Accéder à la messagerie</h3>
                <p className="text-muted-foreground mb-6">Consultez vos conversations avec les promeneurs</p>
                <Button onClick={() => navigate('/messages')} className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Ouvrir la messagerie
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <FloatingContact />
    </div>
  );
};

export default MonCompte;
