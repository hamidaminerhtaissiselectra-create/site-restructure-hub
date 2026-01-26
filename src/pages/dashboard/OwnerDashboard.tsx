import { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Calendar, MessageCircle, CreditCard, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import MobileTabBar from "@/components/dashboard/shared/MobileTabBar";

// Lazy load tab contents
const HomeTab = lazy(() => import("@/components/dashboard/owner/HomeTab"));
const MissionsTab = lazy(() => import("@/components/dashboard/owner/MissionsTab"));
const MessagesTab = lazy(() => import("@/components/dashboard/owner/MessagesTab"));
const FinancesTab = lazy(() => import("@/components/dashboard/owner/FinancesTab"));
const ProfileTab = lazy(() => import("@/components/dashboard/owner/ProfileTab"));

// 5 onglets selon le PDF Master Plan
const TABS = [
  { id: "accueil", label: "Accueil", icon: Home },
  { id: "missions", label: "Missions", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "finances", label: "Finances", icon: CreditCard },
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

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState({ messages: 0, missions: 0 });

  const currentTab = (searchParams.get("tab") as TabId) || "accueil";

  const setCurrentTab = (tab: string) => {
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
      const [profileRes, bookingsRes, messagesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('bookings').select('id, status, scheduled_date').eq('owner_id', userId),
        supabase.from('messages').select('id, read').eq('receiver_id', userId).eq('read', false)
      ]);

      setProfile(profileRes.data);

      const now = new Date();
      const upcomingMissions = bookingsRes.data?.filter(
        b => new Date(b.scheduled_date) >= now && b.status !== 'cancelled'
      ) || [];

      setBadges({
        messages: messagesRes.data?.length || 0,
        missions: upcomingMissions.length
      });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const tabsWithBadges = TABS.map(tab => ({
    ...tab,
    badge: tab.id === 'messages' ? badges.messages : tab.id === 'missions' ? badges.missions : undefined
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <TabLoader />
        </main>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case "accueil":
        return <HomeTab profile={profile} onNavigate={setCurrentTab} />;
      case "missions":
        return <MissionsTab />;
      case "messages":
        return <MessagesTab />;
      case "finances":
        return <FinancesTab />;
      case "profil":
        return <ProfileTab profile={profile} />;
      default:
        return <HomeTab profile={profile} onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Mon Espace | DogWalking"
        description="Gérez vos réservations et trouvez des promeneurs vérifiés."
        noindex
      />
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-24 pb-4">
        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex items-center gap-2 mb-8 bg-muted/50 p-2 rounded-2xl">
          {tabsWithBadges.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl transition-all text-base font-medium ${
                currentTab === tab.id 
                  ? 'bg-background shadow-lg text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="ml-1 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-1.5">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <Suspense fallback={<TabLoader />}>
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </Suspense>
      </main>

      {/* Mobile Tab Bar - Fixed at bottom */}
      <MobileTabBar 
        tabs={tabsWithBadges}
        activeTab={currentTab}
        onTabChange={setCurrentTab}
      />
      
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default OwnerDashboard;
