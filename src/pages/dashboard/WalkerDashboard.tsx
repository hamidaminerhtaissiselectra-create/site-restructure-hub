import { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Home, Calendar, MessageCircle, Euro, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import MobileTabBar from "@/components/dashboard/shared/MobileTabBar";

// Lazy load tab contents
const WalkerOverviewTab = lazy(() => import("@/components/dashboard/walker/OverviewTab"));
const WalkerBookingsTab = lazy(() => import("@/components/dashboard/walker/BookingsTab"));
const WalkerMessagesTab = lazy(() => import("@/components/dashboard/walker/MessagesTab"));
const WalkerEarningsTab = lazy(() => import("@/components/dashboard/walker/EarningsTab"));
const WalkerProfileTab = lazy(() => import("@/components/dashboard/walker/ProfileTab"));

// 5 onglets selon le PDF Master Plan
const TABS = [
  { id: "accueil", label: "Accueil", icon: Home },
  { id: "planning", label: "Planning", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "gains", label: "Gains", icon: Euro },
  { id: "profil", label: "Profil", icon: User },
];

type TabId = typeof TABS[number]["id"];

const TabLoader = () => (
  <div className="flex items-center justify-center h-64">
    <motion.div 
      className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
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
  const [badges, setBadges] = useState({ messages: 0, pending: 0 });
  const [stats, setStats] = useState({
    monthlyEarnings: 0, pendingEarnings: 0, totalWalks: 0,
    completedThisMonth: 0, averageRating: 0, totalReviews: 0,
    pendingRequests: 0, upcomingMissions: 0
  });

  const currentTab = (searchParams.get("tab") as TabId) || "accueil";

  const setCurrentTab = (tab: string) => {
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/auth'); return; }

    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (profileData?.user_type !== 'walker' && profileData?.user_type !== 'both') {
      toast({ title: "Accès refusé", description: "Réservé aux promeneurs", variant: "destructive" });
      navigate('/dashboard');
      return;
    }
    setProfile(profileData);
    fetchWalkerData(session.user.id);
  };

  const fetchWalkerData = async (walkerId: string) => {
    try {
      const [walkerRes, bookingsRes, messagesRes] = await Promise.all([
        supabase.from('walker_profiles').select('*').eq('user_id', walkerId).maybeSingle(),
        supabase.from('bookings').select('id, status, scheduled_date, price').eq('walker_id', walkerId),
        supabase.from('messages').select('id, read').eq('receiver_id', walkerId).eq('read', false)
      ]);

      setWalkerProfile(walkerRes.data);
      const bookings = bookingsRes.data || [];
      const pending = bookings.filter(b => b.status === 'pending');
      
      setBadges({ messages: messagesRes.data?.length || 0, pending: pending.length });
      setStats({
        monthlyEarnings: 0, pendingEarnings: 0, totalWalks: bookings.filter(b => b.status === 'completed').length,
        completedThisMonth: 0, averageRating: walkerRes.data?.rating || 0, totalReviews: walkerRes.data?.total_reviews || 0,
        pendingRequests: pending.length, upcomingMissions: bookings.filter(b => b.status === 'confirmed').length
      });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const tabsWithBadges = TABS.map(tab => ({
    ...tab,
    badge: tab.id === 'messages' ? badges.messages : tab.id === 'planning' ? badges.pending : undefined
  }));

  if (loading) {
    return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-24"><TabLoader /></main></div>;
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case "accueil": return <WalkerOverviewTab stats={stats} walkerProfile={walkerProfile} onNavigate={setCurrentTab} />;
      case "planning": return <WalkerBookingsTab />;
      case "messages": return <WalkerMessagesTab />;
      case "gains": return <WalkerEarningsTab />;
      case "profil": return <WalkerProfileTab profile={profile} walkerProfile={walkerProfile} />;
      default: return <WalkerOverviewTab stats={stats} walkerProfile={walkerProfile} onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Espace Promeneur | DogWalking" description="Gérez vos missions et vos gains." noindex />
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-24 pb-4">
        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex items-center gap-2 mb-8 bg-muted/50 p-2 rounded-2xl">
          {tabsWithBadges.map((tab) => (
            <button key={tab.id} onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl transition-all text-base font-medium ${
                currentTab === tab.id ? 'bg-background shadow-lg text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <tab.icon className="h-5 w-5" />{tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="ml-1 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-1.5">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        <Suspense fallback={<TabLoader />}>
          <motion.div key={currentTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {renderTabContent()}
          </motion.div>
        </Suspense>
      </main>

      <MobileTabBar tabs={tabsWithBadges} activeTab={currentTab} onTabChange={setCurrentTab} />
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
};

export default WalkerDashboardPage;
