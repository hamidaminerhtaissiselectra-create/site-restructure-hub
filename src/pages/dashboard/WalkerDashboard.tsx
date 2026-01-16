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
  LayoutDashboard, Calendar, Euro, Clock, MessageCircle, 
  BarChart3, User, MapPin, Shield, Sparkles, ArrowRight, Wallet
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";

// Lazy load tab contents
const WalkerOverviewTab = lazy(() => import("@/components/dashboard/walker/OverviewTab"));
const WalkerBookingsTab = lazy(() => import("@/components/dashboard/walker/BookingsTab"));
const WalkerEarningsTab = lazy(() => import("@/components/dashboard/walker/EarningsTab"));
const WalkerAvailabilityTab = lazy(() => import("@/components/dashboard/walker/AvailabilityTab"));
const WalkerMessagesTab = lazy(() => import("@/components/dashboard/walker/MessagesTab"));
const WalkerPerformanceTab = lazy(() => import("@/components/dashboard/walker/PerformanceTab"));
const WalkerProfileTab = lazy(() => import("@/components/dashboard/walker/ProfileTab"));

import heroImage from "@/assets/pages/dashboard-walker-hero.jpg";

const TABS = [
  { id: "apercu", label: "Tableau de bord", icon: LayoutDashboard, description: "Vue d'ensemble" },
  { id: "missions", label: "Réservations", icon: Calendar, description: "Missions à venir" },
  { id: "gains", label: "Gains", icon: Euro, description: "Revenus et retraits" },
  { id: "disponibilites", label: "Disponibilités", icon: Clock, description: "Planning" },
  { id: "messages", label: "Messages", icon: MessageCircle, description: "Communications" },
  { id: "performance", label: "Performance", icon: BarChart3, description: "Statistiques" },
  { id: "profil", label: "Profil", icon: User, description: "Paramètres" },
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

const WalkerDashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [walkerProfile, setWalkerProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    monthlyEarnings: 0,
    pendingEarnings: 0,
    totalWalks: 0,
    completedThisMonth: 0,
    averageRating: 0,
    totalReviews: 0,
    pendingRequests: 0,
    upcomingMissions: 0
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

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileData?.user_type !== 'walker' && profileData?.user_type !== 'both') {
      toast({
        title: "Accès refusé",
        description: "Cette page est réservée aux promeneurs",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    setProfile(profileData);
    fetchWalkerData(session.user.id);
  };

  const fetchWalkerData = async (walkerId: string) => {
    try {
      const [walkerRes, bookingsRes] = await Promise.all([
        supabase.from('walker_profiles').select('*').eq('user_id', walkerId).maybeSingle(),
        supabase.from('bookings').select('id, status, scheduled_date, price').eq('walker_id', walkerId)
      ]);

      setWalkerProfile(walkerRes.data);

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const bookings = bookingsRes.data || [];

      const pending = bookings.filter(b => b.status === 'pending');
      const upcoming = bookings.filter(b => new Date(b.scheduled_date) >= now && b.status === 'confirmed');
      const completedThisMonth = bookings.filter(b => 
        b.status === 'completed' && new Date(b.scheduled_date) >= startOfMonth
      );
      const allCompleted = bookings.filter(b => b.status === 'completed');

      const monthlyEarnings = completedThisMonth.reduce((sum, b) => sum + Number(b.price || 0) * 0.87, 0);
      const pendingEarnings = pending.reduce((sum, b) => sum + Number(b.price || 0) * 0.87, 0);

      setStats({
        monthlyEarnings,
        pendingEarnings,
        totalWalks: allCompleted.length,
        completedThisMonth: completedThisMonth.length,
        averageRating: walkerRes.data?.rating || 0,
        totalReviews: walkerRes.data?.total_reviews || 0,
        pendingRequests: pending.length,
        upcomingMissions: upcoming.length
      });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const verificationProgress = () => {
    if (walkerProfile?.verified) return 100;
    return 33; // Placeholder
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
        title="Espace Promeneur | DogWalking"
        description="Gérez vos missions, vos gains et votre planning depuis votre espace promeneur professionnel DogWalking."
        noindex
      />
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-24">
        {/* Welcome Hero */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 p-6 md:p-10 rounded-3xl bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-primary/10 border border-green-500/20 overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 opacity-10"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <img src={heroImage} alt="" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 z-10">
            <motion.div 
              className="flex items-center gap-5"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-background shadow-2xl">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-2xl font-bold">
                    {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {walkerProfile?.verified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-background">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <motion.h1 className="text-2xl md:text-4xl font-bold">
                    {profile?.first_name}
                  </motion.h1>
                  {walkerProfile?.verified && (
                    <Badge className="bg-green-500 text-white gap-1">
                      <Shield className="h-3 w-3" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-lg">Espace promeneur professionnel</p>
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
              transition={{ delay: 0.4 }}
            >
              <Button variant="outline" onClick={() => setCurrentTab('gains')} className="gap-2 bg-background/80 backdrop-blur-sm">
                <Wallet className="h-4 w-4" />
                Mes gains
              </Button>
              <Button onClick={() => setCurrentTab('missions')} className="gap-2 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Calendar className="h-4 w-4" />
                {stats.pendingRequests > 0 ? `${stats.pendingRequests} demande(s)` : 'Mes missions'}
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Verification Alert */}
        <AnimatePresence>
          {!walkerProfile?.verified && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                <div className="flex items-center gap-4">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                  >
                    <Sparkles className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-lg">Compte en cours de vérification</p>
                    <p className="text-sm text-muted-foreground">Soumettez vos documents pour recevoir plus de demandes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Progress value={verificationProgress()} className="w-28 h-3" />
                    <span className="text-sm font-bold text-amber-600">{verificationProgress()}%</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentTab('profil')} className="gap-2">
                    Compléter <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs Navigation */}
        <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as TabId)} className="space-y-8">
          <div className="relative overflow-x-auto">
            <TabsList className="w-full h-auto flex-nowrap md:flex-wrap gap-2 bg-muted/50 p-2 rounded-2xl backdrop-blur-sm border border-border/50">
              {TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  className="flex-shrink-0 gap-2 py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
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
                  <WalkerOverviewTab stats={stats} walkerProfile={walkerProfile} onNavigate={setCurrentTab} />
                </TabsContent>
                
                <TabsContent value="missions" className="mt-0">
                  <WalkerBookingsTab />
                </TabsContent>
                
                <TabsContent value="gains" className="mt-0">
                  <WalkerEarningsTab />
                </TabsContent>
                
                <TabsContent value="disponibilites" className="mt-0">
                  <WalkerAvailabilityTab walkerProfile={walkerProfile} />
                </TabsContent>
                
                <TabsContent value="messages" className="mt-0">
                  <WalkerMessagesTab />
                </TabsContent>
                
                <TabsContent value="performance" className="mt-0">
                  <WalkerPerformanceTab stats={stats} />
                </TabsContent>
                
                <TabsContent value="profil" className="mt-0">
                  <WalkerProfileTab profile={profile} walkerProfile={walkerProfile} />
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

export default WalkerDashboardPage;
