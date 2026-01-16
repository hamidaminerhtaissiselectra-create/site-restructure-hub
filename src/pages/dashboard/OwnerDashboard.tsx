import { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dog, Calendar, Search, Heart, MessageCircle, Gift, User, 
  MapPin, Bell, Sparkles, ArrowRight, Settings, Star, Plus
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import DashboardSearch from "@/components/dashboard/shared/DashboardSearch";

// Lazy load tab contents for performance
const OverviewTab = lazy(() => import("@/components/dashboard/owner/OverviewTab"));
const DogsTab = lazy(() => import("@/components/dashboard/owner/DogsTab"));
const BookingsTab = lazy(() => import("@/components/dashboard/owner/BookingsTab"));
const WalkersTab = lazy(() => import("@/components/dashboard/owner/WalkersTab"));
const MessagesTab = lazy(() => import("@/components/dashboard/owner/MessagesTab"));
const ReferralTab = lazy(() => import("@/components/dashboard/owner/ReferralTab"));
const ProfileTab = lazy(() => import("@/components/dashboard/owner/ProfileTab"));

import heroImage from "@/assets/pages/dashboard-owner-hero.jpg";

const TABS = [
  { id: "apercu", label: "Vue d'ensemble", icon: Dog, description: "Statistiques et alertes" },
  { id: "chiens", label: "Mes Chiens", icon: Dog, description: "Gérer vos compagnons" },
  { id: "reservations", label: "Réservations", icon: Calendar, description: "Historique et à venir" },
  { id: "promeneurs", label: "Promeneurs & Avis", icon: Search, description: "Favoris et évaluations" },
  { id: "messages", label: "Messages", icon: MessageCircle, description: "Communications" },
  { id: "parrainage", label: "Parrainage", icon: Gift, description: "Inviter des amis" },
  { id: "profil", label: "Profil & Paramètres", icon: User, description: "Compte et sécurité" },
] as const;

type TabId = typeof TABS[number]["id"];

const TabLoader = () => (
  <div className="flex items-center justify-center h-64">
    <motion.div 
      className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalDogs: 0,
    totalSpent: 0,
    totalFavorites: 0,
    unreadNotifications: 0,
    unreadMessages: 0
  });

  const currentTab = (searchParams.get("tab") as TabId) || "apercu";

  const setCurrentTab = (tab: TabId) => {
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      const [profileRes, dogsRes, bookingsRes, favoritesRes, notificationsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('dogs').select('id').eq('owner_id', userId),
        supabase.from('bookings').select('id, status, scheduled_date, price').eq('owner_id', userId),
        supabase.from('favorites').select('id').eq('user_id', userId),
        supabase.from('notifications').select('id, read').eq('user_id', userId)
      ]);

      setProfile(profileRes.data);

      const now = new Date();
      const upcoming = bookingsRes.data?.filter(
        b => new Date(b.scheduled_date) >= now && b.status !== 'cancelled'
      ) || [];
      const completed = bookingsRes.data?.filter(b => b.status === 'completed') || [];
      const totalSpent = completed.reduce((sum, b) => sum + Number(b.price || 0), 0);
      const unreadNotifs = notificationsRes.data?.filter(n => !n.read) || [];

      setStats({
        totalBookings: bookingsRes.data?.length || 0,
        upcomingBookings: upcoming.length,
        completedBookings: completed.length,
        totalDogs: dogsRes.data?.length || 0,
        totalSpent,
        totalFavorites: favoritesRes.data?.length || 0,
        unreadNotifications: unreadNotifs.length,
        unreadMessages: 0
      });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
            <motion.div 
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
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
        title="Mon Espace Propriétaire | DogWalking"
        description="Gérez vos réservations, vos chiens et trouvez des promeneurs vérifiés depuis votre tableau de bord DogWalking."
        noindex
      />
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-24">
        {/* Welcome Hero with Parallax Effect */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 p-6 md:p-10 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 border border-primary/20 overflow-hidden"
        >
          {/* Parallax Background */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <img src={heroImage} alt="" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 z-10">
            <motion.div 
              className="flex items-center gap-5"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-background shadow-2xl">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-2xl font-bold">
                    {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {stats.unreadNotifications > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-7 h-7 bg-destructive text-destructive-foreground rounded-full text-sm flex items-center justify-center font-bold shadow-lg"
                  >
                    {stats.unreadNotifications}
                  </motion.span>
                )}
              </div>
              <div>
                <motion.h1 
                  className="text-2xl md:text-4xl font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Bonjour {profile?.first_name} 👋
                </motion.h1>
                <p className="text-muted-foreground text-lg">Bienvenue sur votre espace propriétaire</p>
                {profile?.city && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <MapPin className="h-4 w-4" />
                    {profile.city}
                  </p>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button variant="outline" onClick={() => setCurrentTab('chiens')} className="gap-2 bg-background/80 backdrop-blur-sm hover:bg-background">
                <Plus className="h-4 w-4" />
                Ajouter un chien
              </Button>
              <Button onClick={() => setCurrentTab('promeneurs')} className="gap-2 shadow-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                <Search className="h-4 w-4" />
                Trouver un promeneur
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Profile Completion Alert */}
        <AnimatePresence>
          {profileCompletion() < 100 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-900/50">
                <div className="flex items-center gap-4">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                  >
                    <Sparkles className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-lg">Complétez votre profil</p>
                    <p className="text-sm text-muted-foreground">Un profil complet inspire confiance aux promeneurs</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Progress value={profileCompletion()} className="w-28 h-3" />
                    <span className="text-sm font-bold text-amber-600">{profileCompletion()}%</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentTab('profil')} className="gap-2 bg-white/80 dark:bg-background/80">
                    Compléter <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <DashboardSearch
            placeholder="Rechercher une action, un chien, un promeneur..."
            items={[
              { id: "add-dog", type: "action", label: "Ajouter un chien", description: "Enregistrer un nouveau compagnon", icon: Dog, action: () => setCurrentTab("chiens"), keywords: ["nouveau", "créer"] },
              { id: "find-walker", type: "action", label: "Trouver un promeneur", description: "Rechercher près de chez vous", icon: Search, action: () => setCurrentTab("promeneurs"), keywords: ["chercher", "réserver"] },
              { id: "book", type: "action", label: "Réserver une promenade", description: "Nouvelle réservation", icon: Calendar, action: () => setCurrentTab("promeneurs"), keywords: ["réservation"] },
              { id: "messages", type: "action", label: "Voir les messages", description: "Conversations avec les promeneurs", icon: MessageCircle, action: () => setCurrentTab("messages"), keywords: ["chat"] },
              { id: "referral", type: "action", label: "Programme de parrainage", description: "Gagnez 15€ par ami", icon: Gift, action: () => setCurrentTab("parrainage"), keywords: ["code", "invitation"] },
              { id: "profile", type: "page", label: "Mon profil", icon: User, action: () => setCurrentTab("profil") },
              { id: "settings", type: "page", label: "Paramètres", icon: Settings, action: () => setCurrentTab("profil") },
              { id: "bookings", type: "page", label: "Mes réservations", icon: Calendar, action: () => setCurrentTab("reservations") },
            ]}
          />
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as TabId)} className="space-y-8">
          <div className="relative">
            <TabsList className="w-full h-auto flex-wrap gap-2 bg-muted/50 p-2 rounded-2xl backdrop-blur-sm border border-border/50">
              {TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 min-w-[120px] gap-2 py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:border-primary/20 rounded-xl transition-all duration-300"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<TabLoader />}>
                <TabsContent value="apercu" className="mt-0">
                  <OverviewTab stats={stats} profile={profile} onNavigate={setCurrentTab} />
                </TabsContent>
                
                <TabsContent value="chiens" className="mt-0">
                  <DogsTab />
                </TabsContent>
                
                <TabsContent value="reservations" className="mt-0">
                  <BookingsTab />
                </TabsContent>
                
                <TabsContent value="promeneurs" className="mt-0">
                  <WalkersTab />
                </TabsContent>
                
                <TabsContent value="messages" className="mt-0">
                  <MessagesTab />
                </TabsContent>
                
                <TabsContent value="parrainage" className="mt-0">
                  <ReferralTab />
                </TabsContent>
                
                <TabsContent value="profil" className="mt-0">
                  <ProfileTab profile={profile} />
                </TabsContent>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default OwnerDashboard;
