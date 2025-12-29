import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Euro, Calendar, Star, TrendingUp, Clock, Dog as DogIcon,
  Camera, Upload, CheckCircle, AlertCircle, XCircle, 
  MessageCircle, ChevronRight, MapPin, Shield, Award,
  FileText, Sparkles, ArrowRight, Bell, Phone, Wallet
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";

// Hero image
import heroImage from "@/assets/pages/dashboard-walker-hero.jpg";

const WalkerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [walkerProfile, setWalkerProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [stats, setStats] = useState({
    monthlyEarnings: 0,
    pendingEarnings: 0,
    totalWalks: 0,
    completedThisMonth: 0,
    averageRating: 0,
    totalReviews: 0,
    acceptanceRate: 100,
    responseTime: "< 1h"
  });
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

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
        // Get owner info
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

        const upcoming = enrichedBookings.filter(
          b => new Date(b.scheduled_date) >= now && b.status === 'confirmed'
        );
        const pending = enrichedBookings.filter(b => b.status === 'pending');
        const completedThisMonth = enrichedBookings.filter(
          b => b.status === 'completed' && new Date(b.created_at) >= startOfMonth
        );
        const allCompleted = enrichedBookings.filter(b => b.status === 'completed');

        const monthlyEarnings = completedThisMonth.reduce((sum, b) => 
          sum + Number(b.price || 0) * 0.87, 0
        );
        const pendingEarnings = pending.reduce((sum, b) => 
          sum + Number(b.price || 0) * 0.87, 0
        );

        setStats({
          monthlyEarnings,
          pendingEarnings,
          totalWalks: allCompleted.length,
          completedThisMonth: completedThisMonth.length,
          averageRating: walkerData?.rating || 0,
          totalReviews: walkerData?.total_reviews || 0,
          acceptanceRate: 95,
          responseTime: "< 1h"
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

  const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: action })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: action === 'confirmed' ? "Réservation acceptée" : "Réservation refusée",
        description: action === 'confirmed' 
          ? "Le propriétaire sera notifié" 
          : "La réservation a été annulée"
      });

      // Refresh data
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

  const getDocumentStatus = (docType: string) => {
    const doc = documents.find(d => d.document_type === docType);
    if (!doc) return { status: 'missing', label: 'Non soumis', variant: 'outline' };
    if (doc.verification_status === 'approved') return { status: 'approved', label: 'Vérifié', variant: 'default' };
    if (doc.verification_status === 'rejected') return { status: 'rejected', label: 'Refusé', variant: 'destructive' };
    return { status: 'pending', label: 'En attente', variant: 'secondary' };
  };

  const verificationProgress = () => {
    const requiredDocs = ['id_card', 'criminal_record', 'insurance'];
    const approvedDocs = documents.filter(d => 
      requiredDocs.includes(d.document_type) && d.verification_status === 'approved'
    );
    return Math.round((approvedDocs.length / requiredDocs.length) * 100);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SEOHead
        title="Tableau de Bord Promeneur | DogWalking"
        description="Gérez vos missions, vos gains et vos clients depuis votre espace promeneur professionnel DogWalking."
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
                <p className="text-muted-foreground">Tableau de bord promeneur</p>
                {profile?.city && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {profile.city}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate('/walker/earnings')} className="gap-2">
                <Wallet className="h-4 w-4" />
                Mes gains
              </Button>
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
                  <p className="text-sm text-muted-foreground">Soumettez vos documents pour être vérifié et recevoir plus de demandes</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Progress value={verificationProgress()} className="w-24 h-2" />
                  <span className="text-sm font-bold text-amber-600">{verificationProgress()}%</span>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  Compléter <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gains ce mois</CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Euro className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.monthlyEarnings.toFixed(2)}€</div>
              <p className="text-xs text-muted-foreground mt-1">
                +<span className="font-semibold">{stats.pendingEarnings.toFixed(2)}€</span> en attente
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Promenades</CardTitle>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DogIcon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalWalks}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.completedThisMonth} ce mois</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Note moyenne</CardTitle>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-1">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stats.totalReviews} avis</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux d'acceptation</CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.acceptanceRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Réponse {stats.responseTime}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
                <CardHeader className="bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Bell className="h-5 w-5 animate-pulse" />
                        Nouvelles demandes
                      </CardTitle>
                      <CardDescription>{pendingRequests.length} demande(s) en attente de réponse</CardDescription>
                    </div>
                    <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                      {pendingRequests.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                  {pendingRequests.map(booking => (
                    <div key={booking.id} className="p-4 md:p-6 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-background shadow">
                            <AvatarImage src={booking.owner?.avatar_url} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {booking.owner?.first_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">{booking.owner?.first_name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.owner?.city || 'Non spécifié'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-background">{getServiceLabel(booking.service_type)}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-2 text-sm">
                          <DogIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{booking.dogs?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{new Date(booking.scheduled_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{booking.scheduled_time} - {booking.duration_minutes}min</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Euro className="h-4 w-4 text-green-600 shrink-0" />
                          <span className="text-green-600">{Number(booking.price || 0).toFixed(2)}€</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <p className="text-sm text-muted-foreground mb-4 p-3 bg-background rounded-lg border italic">
                          "{booking.notes}"
                        </p>
                      )}

                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 gap-2" 
                          onClick={() => handleBookingAction(booking.id, 'confirmed')}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accepter
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 gap-2"
                          onClick={() => handleBookingAction(booking.id, 'cancelled')}
                        >
                          <XCircle className="h-4 w-4" />
                          Refuser
                        </Button>
                        {booking.owner?.phone && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={`tel:${booking.owner.phone}`}>
                              <Phone className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Bookings */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Prochaines missions
                  </CardTitle>
                  <CardDescription>{upcomingBookings.length} mission(s) confirmée(s)</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  Voir tout <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Aucune mission à venir</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Vos prochaines réservations confirmées apparaîtront ici
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {upcomingBookings.map(booking => (
                      <div key={booking.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.dogs?.photo_url} />
                          <AvatarFallback className="bg-primary/10 text-2xl">🐕</AvatarFallback>
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
                              {new Date(booking.scheduled_date).toLocaleDateString('fr-FR', { 
                                weekday: 'short', day: 'numeric', month: 'short' 
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {booking.scheduled_time}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-lg text-green-600">{Number(booking.price || 0).toFixed(2)}€</p>
                          <Button variant="outline" size="sm" className="mt-2 gap-1">
                            <Camera className="h-3 w-3" />
                            Preuve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Documents Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
                <CardDescription>Statut de vérification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { type: 'id_card', label: "Carte d'identité", required: true },
                  { type: 'criminal_record', label: 'Casier judiciaire', required: true },
                  { type: 'insurance', label: 'Assurance RC', required: true },
                  { type: 'photo', label: 'Photo de profil', required: false }
                ].map(doc => {
                  const status = getDocumentStatus(doc.type);
                  return (
                    <div key={doc.type} className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        {status.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {status.status === 'pending' && <Clock className="h-4 w-4 text-amber-500" />}
                        {status.status === 'rejected' && <XCircle className="h-4 w-4 text-destructive" />}
                        {status.status === 'missing' && <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                        <span className="text-sm">{doc.label}</span>
                        {doc.required && <span className="text-xs text-destructive">*</span>}
                      </div>
                      <Badge 
                        variant={status.variant as any}
                        className={status.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                      >
                        {status.label}
                      </Badge>
                    </div>
                  );
                })}
                <Button variant="outline" className="w-full mt-3 gap-2">
                  <Upload className="h-4 w-4" />
                  Soumettre un document
                </Button>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-amber-500" />
                  Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Aucun badge pour le moment</p>
                    <p className="text-xs text-muted-foreground mt-1">Complétez des missions pour en obtenir</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {badges.map(badge => (
                      <div key={badge.id} className="text-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-2 shadow">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-xs font-medium">{badge.badge_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tarif horaire</span>
                  <span className="font-bold">{walkerProfile?.hourly_rate || 15}€/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rayon d'action</span>
                  <span className="font-bold">{walkerProfile?.service_radius_km || 5} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Chiens max</span>
                  <span className="font-bold">{walkerProfile?.max_dogs || 3}</span>
                </div>
                <Button variant="link" className="w-full p-0 h-auto" onClick={() => navigate('/profile')}>
                  Modifier mes paramètres →
                </Button>
              </CardContent>
            </Card>

            {/* Trust Badge */}
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-semibold">Plateforme sécurisée</p>
                    <p className="text-xs text-muted-foreground">Paiements garantis sous 48h</p>
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

export default WalkerDashboard;
