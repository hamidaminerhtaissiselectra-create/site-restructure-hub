import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Euro, Calendar, Star, TrendingUp, Clock, Dog as DogIcon,
  Camera, Upload, CheckCircle, AlertCircle, XCircle, 
  MessageCircle, ChevronRight, MapPin, Shield, Award,
  FileText, Sparkles, ArrowRight, Bell, Wallet, BarChart3,
  Download, CreditCard, ArrowUpRight, ArrowDownRight, Play, Square
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { EarningsChart } from "@/components/dashboard/EarningsChart";
import { PerformanceStats } from "@/components/dashboard/PerformanceStats";

import heroImage from "@/assets/pages/dashboard-walker-hero.jpg";

const EspacePromeneur = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'missions';
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [walkerProfile, setWalkerProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Stats
  const [stats, setStats] = useState({
    monthlyEarnings: 0,
    pendingEarnings: 0,
    totalWalks: 0,
    completedThisMonth: 0,
    averageRating: 0,
    totalReviews: 0,
    completionRate: 98,
    repeatClientRate: 35,
    previousMonthEarnings: 0,
    availableBalance: 0,
    totalEarnings: 0
  });
  
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [earningsData, setEarningsData] = useState<any[]>([]);

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

    if (profileData?.user_type !== 'walker') {
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
      // Fetch walker profile
      const { data: walkerData } = await supabase
        .from('walker_profiles')
        .select('*')
        .eq('user_id', walkerId)
        .maybeSingle();
      setWalkerProfile(walkerData);

      // Fetch documents
      const { data: docsData } = await supabase
        .from('walker_documents')
        .select('*')
        .eq('walker_id', walkerId);
      setDocuments(docsData || []);

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('walker_badges')
        .select('*')
        .eq('walker_id', walkerId);
      setBadges(badgesData || []);

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, dogs(name, breed, photo_url)')
        .eq('walker_id', walkerId)
        .order('scheduled_date', { ascending: true });

      if (bookingsData) {
        const ownerIds = [...new Set(bookingsData.map(b => b.owner_id))];
        const { data: ownersData } = await supabase
          .from('profiles')
          .select('id, first_name, avatar_url, city, phone')
          .in('id', ownerIds);

        const ownerMap = new Map(ownersData?.map(o => [o.id, o]) || []);
        const enrichedBookings = bookingsData.map(b => ({
          ...b,
          owner: ownerMap.get(b.owner_id)
        }));

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const upcoming = enrichedBookings.filter(
          b => new Date(b.scheduled_date) >= now && b.status === 'confirmed'
        );
        const pending = enrichedBookings.filter(b => b.status === 'pending');
        const completedThisMonth = enrichedBookings.filter(
          b => b.status === 'completed' && new Date(b.created_at) >= startOfMonth
        );
        const completedPrevMonth = enrichedBookings.filter(
          b => b.status === 'completed' && new Date(b.created_at) >= startOfPrevMonth && new Date(b.created_at) < startOfMonth
        );
        const allCompleted = enrichedBookings.filter(b => b.status === 'completed');

        const commission = 0.13;
        const monthlyEarnings = completedThisMonth.reduce((sum, b) => 
          sum + Number(b.price || 0) * (1 - commission), 0
        );
        const previousMonthEarnings = completedPrevMonth.reduce((sum, b) => 
          sum + Number(b.price || 0) * (1 - commission), 0
        );
        const pendingEarnings = pending.reduce((sum, b) => 
          sum + Number(b.price || 0) * (1 - commission), 0
        );
        const totalEarnings = allCompleted.reduce((sum, b) => 
          sum + Number(b.price || 0) * (1 - commission), 0
        );
        const availableBalance = allCompleted.filter(b => b.owner_confirmed)
          .reduce((sum, b) => sum + Number(b.price || 0) * (1 - commission), 0);

        // Transactions
        const transactionList = allCompleted.map(b => ({
          id: b.id,
          date: b.scheduled_date,
          amount: Number(b.price || 0) * (1 - commission),
          gross: Number(b.price || 0),
          commission: Number(b.price || 0) * commission,
          status: b.owner_confirmed ? 'released' : 'pending',
          type: 'earning'
        }));
        setTransactions(transactionList);

        // Earnings data for chart
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          
          const monthBookings = allCompleted.filter(b => {
            const bookingDate = new Date(b.scheduled_date);
            return bookingDate >= monthStart && bookingDate <= monthEnd;
          });
          
          const earnings = monthBookings.reduce((sum, b) => sum + Number(b.price || 0) * (1 - commission), 0);
          
          last6Months.push({
            month: monthNames[date.getMonth()],
            earnings,
            walks: monthBookings.length
          });
        }
        setEarningsData(last6Months);

        // Completion rate
        const cancelled = enrichedBookings.filter(b => b.status === 'cancelled' && b.walker_id === walkerId).length;
        const total = allCompleted.length + cancelled;
        const completionRate = total > 0 ? Math.round((allCompleted.length / total) * 100) : 100;

        // Repeat clients
        const clientWalks = new Map<string, number>();
        allCompleted.forEach(b => {
          clientWalks.set(b.owner_id, (clientWalks.get(b.owner_id) || 0) + 1);
        });
        const repeatClients = Array.from(clientWalks.values()).filter(count => count > 1).length;
        const repeatClientRate = clientWalks.size > 0 ? Math.round((repeatClients / clientWalks.size) * 100) : 0;

        setStats({
          monthlyEarnings,
          pendingEarnings,
          totalWalks: allCompleted.length,
          completedThisMonth: completedThisMonth.length,
          averageRating: walkerData?.rating || 0,
          totalReviews: walkerData?.total_reviews || 0,
          completionRate,
          repeatClientRate,
          previousMonthEarnings,
          availableBalance,
          totalEarnings
        });

        setUpcomingBookings(upcoming.slice(0, 5));
        setPendingRequests(pending.slice(0, 5));
      }
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'cancelled' | 'in_progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: action })
        .eq('id', bookingId);

      if (error) throw error;

      const messages: Record<string, string> = {
        confirmed: "Réservation acceptée",
        cancelled: "Réservation refusée",
        in_progress: "Promenade démarrée",
        completed: "Promenade terminée"
      };

      toast({ title: messages[action], description: "Statut mis à jour avec succès" });

      const { data: { session } } = await supabase.auth.getSession();
      if (session) fetchWalkerData(session.user.id);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const getServiceLabel = (serviceType: string) => {
    const services: Record<string, string> = {
      promenade: "Promenade",
      visite: "Visite",
      garde: "Garde",
      veterinaire: "Vétérinaire"
    };
    return services[serviceType] || serviceType;
  };

  const verificationProgress = () => {
    const requiredDocs = ['id_card', 'criminal_record', 'insurance'];
    const approvedDocs = documents.filter(d => 
      requiredDocs.includes(d.document_type) && d.verification_status === 'approved'
    );
    return Math.round((approvedDocs.length / requiredDocs.length) * 100);
  };

  const percentChange = stats.previousMonthEarnings > 0 
    ? Math.round(((stats.monthlyEarnings - stats.previousMonthEarnings) / stats.previousMonthEarnings) * 100)
    : stats.monthlyEarnings > 0 ? 100 : 0;

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
        title="Espace Promeneur | DogWalking"
        description="Gérez vos missions, vos gains et vos clients depuis votre espace promeneur professionnel DogWalking."
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
                {walkerProfile?.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center ring-2 ring-background">
                    <Shield className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile?.first_name}</h1>
                  {walkerProfile?.verified && (
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <Shield className="h-3 w-3" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">Espace promeneur</p>
                {profile?.city && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {profile.city}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate('/messages')} className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Messages
              </Button>
              <Button onClick={() => navigate('/profile')} className="gap-2 shadow-lg">
                Modifier mon profil
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Verification Alert */}
        {!walkerProfile?.verified && (
          <Card className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900">
            <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold">Compte en cours de vérification</p>
                  <p className="text-sm text-muted-foreground">Soumettez vos documents pour être vérifié</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Progress value={verificationProgress()} className="w-24 h-2" />
                  <span className="text-sm font-bold text-amber-600">{verificationProgress()}%</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('documents')} className="gap-2">
                  Compléter <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="missions" className="gap-2">
              <DogIcon className="h-4 w-4" />
              Missions
            </TabsTrigger>
            <TabsTrigger value="planning" className="gap-2">
              <Calendar className="h-4 w-4" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="revenus" className="gap-2">
              <Euro className="h-4 w-4" />
              Revenus
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Missions Tab */}
          <TabsContent value="missions" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Gains ce mois</CardTitle>
                  <Euro className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.monthlyEarnings.toFixed(0)}€</div>
                  {percentChange !== 0 && (
                    <Badge variant={percentChange > 0 ? "default" : "destructive"} className="mt-1">
                      {percentChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(percentChange)}%
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Promenades</CardTitle>
                  <DogIcon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalWalks}</div>
                  <p className="text-xs text-muted-foreground">{stats.completedThisMonth} ce mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Note moyenne</CardTitle>
                  <Star className="h-5 w-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">{stats.totalReviews} avis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Taux complétion</CardTitle>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">{stats.repeatClientRate}% fidélisation</p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    Demandes en attente ({pendingRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingRequests.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg bg-amber-50/50 dark:bg-amber-950/10">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={booking.owner?.avatar_url} />
                          <AvatarFallback>{booking.owner?.first_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{booking.dogs?.name} - {getServiceLabel(booking.service_type)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.scheduled_date).toLocaleDateString('fr-FR')} à {booking.scheduled_time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleBookingAction(booking.id, 'cancelled')}>
                          <XCircle className="h-4 w-4 mr-1" /> Refuser
                        </Button>
                        <Button size="sm" onClick={() => handleBookingAction(booking.id, 'confirmed')}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Accepter
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Prochaines missions ({upcomingBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="font-semibold text-lg mb-2">Aucune mission à venir</h3>
                    <p className="text-muted-foreground">Les nouvelles demandes apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
                            <p className="text-sm text-muted-foreground">{booking.owner?.first_name} - {booking.owner?.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-primary">{Number(booking.price || 0).toFixed(0)}€</p>
                            <Badge variant="outline">{getServiceLabel(booking.service_type)}</Badge>
                          </div>
                          {booking.status === 'confirmed' && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleBookingAction(booking.id, 'in_progress')}>
                                <Play className="h-4 w-4 mr-1" /> Démarrer
                              </Button>
                            </div>
                          )}
                          {booking.status === 'in_progress' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleBookingAction(booking.id, 'completed')}>
                                <Square className="h-4 w-4 mr-1" /> Terminer
                              </Button>
                              <Button size="sm" variant="outline">
                                <Camera className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mon Planning</CardTitle>
                <CardDescription>Visualisez vos missions à venir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-semibold text-lg mb-2">Calendrier en cours de développement</h3>
                  <p className="text-muted-foreground">Vos missions sont visibles dans l'onglet Missions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenus Tab */}
          <TabsContent value="revenus" className="space-y-6">
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Solde disponible</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{stats.availableBalance.toFixed(2)}€</div>
                  <p className="text-sm text-muted-foreground mt-1">Prêt à être retiré</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{stats.pendingEarnings.toFixed(2)}€</div>
                  <p className="text-sm text-muted-foreground mt-1">En attente de validation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total gagné</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalEarnings.toFixed(2)}€</div>
                  <p className="text-sm text-muted-foreground mt-1">Depuis le début</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Demander un retrait
              </Button>
            </div>

            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-40 gap-2">
                  {earningsData.map((stat, index) => {
                    const maxEarnings = Math.max(...earningsData.map(s => s.earnings));
                    const height = maxEarnings > 0 ? (stat.earnings / maxEarnings) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full bg-primary/20 rounded-t relative group cursor-pointer hover:bg-primary/30 transition-colors"
                          style={{ height: `${Math.max(height, 5)}%` }}
                        >
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-primary rounded-t transition-all"
                            style={{ height: `${height}%` }}
                          />
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {stat.earnings.toFixed(0)}€
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{stat.month}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Euro className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune transaction pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 10).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            tx.status === 'released' ? 'bg-green-100' : 'bg-amber-100'
                          }`}>
                            {tx.status === 'released' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">Mission complétée</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">+{tx.amount.toFixed(2)}€</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.gross.toFixed(2)}€ - {tx.commission.toFixed(2)}€ commission
                          </p>
                          <Badge variant={tx.status === 'released' ? 'outline' : 'secondary'} className="mt-1">
                            {tx.status === 'released' ? 'Débloqué' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes Documents</CardTitle>
                <CardDescription>Soumettez vos documents pour être vérifié</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { type: 'id_card', label: "Pièce d'identité", required: true },
                  { type: 'criminal_record', label: "Extrait de casier judiciaire", required: true },
                  { type: 'insurance', label: "Attestation d'assurance RC Pro", required: true },
                  { type: 'diploma', label: "Diplôme canin (optionnel)", required: false },
                ].map((doc) => {
                  const uploaded = documents.find(d => d.document_type === doc.type);
                  const status = uploaded?.verification_status || 'missing';
                  
                  return (
                    <div key={doc.type} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          status === 'approved' ? 'bg-green-100' :
                          status === 'pending' ? 'bg-amber-100' :
                          status === 'rejected' ? 'bg-red-100' : 'bg-muted'
                        }`}>
                          {status === 'approved' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : status === 'pending' ? (
                            <Clock className="h-5 w-5 text-amber-600" />
                          ) : status === 'rejected' ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <Upload className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{doc.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {status === 'approved' ? 'Vérifié' :
                             status === 'pending' ? 'En cours de vérification' :
                             status === 'rejected' ? 'Refusé - Veuillez renvoyer' :
                             doc.required ? 'Requis' : 'Optionnel'}
                          </p>
                        </div>
                      </div>
                      {status !== 'approved' && (
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          {status === 'missing' ? 'Soumettre' : 'Renvoyer'}
                        </Button>
                      )}
                    </div>
                  );
                })}
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

export default EspacePromeneur;
