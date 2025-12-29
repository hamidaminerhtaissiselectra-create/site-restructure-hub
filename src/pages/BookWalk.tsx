import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Star, MapPin, Shield, Clock, Calendar, Dog, CheckCircle, Lock, ArrowLeft, Camera, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";
import { SEOHead } from "@/components/seo/SEOHead";

type ServiceType = Database['public']['Enums']['service_type'];

interface ServiceOption {
  id: ServiceType;
  label: string;
  description: string;
  minPrice: number;
  icon: string;
}

const serviceOptions: ServiceOption[] = [
  { id: 'promenade', label: 'Promenade', description: 'Balade en extérieur adaptée', minPrice: 8, icon: '🚶' },
  { id: 'visite', label: 'Visite à domicile', description: 'Passage chez vous pour soins', minPrice: 8, icon: '🏠' },
  { id: 'garde', label: 'Garde', description: 'Garde de votre chien', minPrice: 10, icon: '🛏️' },
  { id: 'veterinaire', label: 'Accompagnement vétérinaire', description: 'Transport et RDV véto', minPrice: 13, icon: '🏥' },
];

const BookWalk = () => {
  const { walkerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [dogs, setDogs] = useState<any[]>([]);
  const [walker, setWalker] = useState<any>(null);
  const [selectedDog, setSelectedDog] = useState<string>('');
  const [selectedService, setSelectedService] = useState<ServiceType>('promenade');
  const [duration, setDuration] = useState('30');
  const [step, setStep] = useState(1);

  // Form data for deferred auth
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    if (walkerId) {
      fetchWalker();
    }
  }, [walkerId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (session) {
      setUserId(session.user.id);
      fetchDogs(session.user.id);
    }
  };

  const fetchDogs = async (ownerId: string) => {
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setDogs(data || []);
    }
  };

  const fetchWalker = async () => {
    const { data: walkerData, error: walkerError } = await supabase
      .from('walker_profiles')
      .select('*')
      .eq('user_id', walkerId)
      .single();

    if (walkerError) {
      const { data: walkerById } = await supabase
        .from('walker_profiles')
        .select('*')
        .eq('id', walkerId)
        .single();
      
      if (walkerById) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, avatar_url, city')
          .eq('id', walkerById.user_id)
          .single();
        
        setWalker({ ...walkerById, ...profileData });
      }
      return;
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('first_name, avatar_url, city')
      .eq('id', walkerData.user_id)
      .single();

    setWalker({ ...walkerData, ...profileData });
  };

  const calculatePrice = () => {
    if (!walker) return 15;
    const serviceOption = serviceOptions.find(s => s.id === selectedService);
    const basePrice = serviceOption?.minPrice || 8;
    if (selectedService === 'promenade') {
      return (walker.hourly_rate || basePrice) * parseInt(duration) / 30;
    }
    return walker.hourly_rate || basePrice;
  };

  const handleContinueToAuth = () => {
    // Store booking intent and redirect to auth
    const formElement = document.querySelector('form');
    if (formElement) {
      const formData = new FormData(formElement);
      const bookingIntent = {
        walkerId,
        service: selectedService,
        duration,
        date: formData.get('date'),
        time: formData.get('time'),
        notes: formData.get('notes'),
        returnUrl: `/book/${walkerId}`
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingIntent));
    }
    
    toast({
      title: "Dernière étape !",
      description: "Créez votre compte pour finaliser votre réservation.",
    });
    navigate('/auth?redirect=' + encodeURIComponent(`/book/${walkerId}`));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If not authenticated at step 3, redirect to auth
    if (!isAuthenticated && step === 3) {
      handleContinueToAuth();
      return;
    }

    if (!userId || !walkerId) return;

    if (dogs.length === 0) {
      toast({
        title: "Aucun chien",
        description: "Vous devez d'abord ajouter un chien",
        variant: "destructive",
      });
      navigate('/dogs/add');
      return;
    }

    if (!selectedDog) {
      toast({
        title: "Sélectionnez un chien",
        description: "Veuillez sélectionner le chien pour cette prestation",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const { error } = await supabase.from('bookings').insert({
        owner_id: userId,
        walker_id: walkerId,
        dog_id: selectedDog,
        scheduled_date: formData.get('date') as string,
        scheduled_time: formData.get('time') as string,
        duration_minutes: parseInt(duration),
        price: calculatePrice(),
        notes: formData.get('notes') as string || null,
        service_type: selectedService,
      });

      if (error) throw error;

      toast({
        title: "Réservation effectuée !",
        description: "Votre demande a été envoyée. Le promeneur va confirmer.",
      });
      navigate('/bookings');
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = selectedService !== null;
  const canProceedToStep3 = isAuthenticated ? selectedDog !== '' : true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <SEOHead
        title="Réserver une Promenade | DogWalking"
        description="Réservez une promenade ou un service pour votre chien avec un promeneur vérifié. Paiement sécurisé escrow."
      />
      <Header />
      <main className="container mx-auto px-4 py-24 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main form */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-2">Réserver une prestation</h1>
              <p className="text-muted-foreground mb-8">Choisissez votre service et finalisez en quelques clics</p>

              {/* Progress steps */}
              <div className="flex items-center gap-2 mb-8">
                {[
                  { num: 1, label: "Service" },
                  { num: 2, label: "Détails" },
                  { num: 3, label: "Confirmer" }
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step > s.num ? <CheckCircle className="h-5 w-5" /> : s.num}
                    </div>
                    <span className={`ml-2 text-sm hidden sm:inline ${step >= s.num ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {s.label}
                    </span>
                    {i < 2 && <div className={`flex-1 h-1 mx-2 rounded ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Service Selection */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Choisir le service
                        </CardTitle>
                        <CardDescription>Sélectionnez le type de prestation souhaitée</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <RadioGroup value={selectedService} onValueChange={(v) => setSelectedService(v as ServiceType)}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {serviceOptions.map((service) => (
                              <Label
                                key={service.id}
                                htmlFor={service.id}
                                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  selectedService === service.id 
                                    ? 'border-primary bg-primary/5 shadow-md' 
                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                }`}
                              >
                                <RadioGroupItem value={service.id} id={service.id} className="mt-1" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{service.icon}</span>
                                    <p className="font-semibold">{service.label}</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{service.description}</p>
                                  <Badge variant="secondary" className="mt-2">dès {service.minPrice}€</Badge>
                                </div>
                              </Label>
                            ))}
                          </div>
                        </RadioGroup>
                        <Button 
                          type="button" 
                          className="w-full mt-6 h-12" 
                          onClick={() => setStep(2)}
                          disabled={!canProceedToStep2}
                        >
                          Continuer
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          Détails de la réservation
                        </CardTitle>
                        <CardDescription>
                          {isAuthenticated ? "Sélectionnez votre chien et la date" : "Choisissez la date de votre prestation"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Dog selection - only if authenticated */}
                        {isAuthenticated && (
                          <div>
                            <Label className="text-base font-medium">Votre chien *</Label>
                            <Select value={selectedDog} onValueChange={setSelectedDog} required>
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Sélectionnez un chien" />
                              </SelectTrigger>
                              <SelectContent>
                                {dogs.map((dog) => (
                                  <SelectItem key={dog.id} value={dog.id}>
                                    <div className="flex items-center gap-2">
                                      <Dog className="h-4 w-4" />
                                      {dog.name} ({dog.breed})
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {dogs.length === 0 && (
                              <Button variant="link" className="p-0 mt-2 h-auto" onClick={() => navigate('/dogs/add')}>
                                + Ajouter un chien d'abord
                              </Button>
                            )}
                          </div>
                        )}

                        {!isAuthenticated && (
                          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                            <p className="text-sm text-muted-foreground">
                              <Dog className="h-4 w-4 inline mr-2" />
                              Vous pourrez ajouter votre chien après inscription
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date" className="text-base font-medium">Date *</Label>
                            <Input 
                              id="date" 
                              name="date" 
                              type="date" 
                              required 
                              min={new Date().toISOString().split('T')[0]}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="time" className="text-base font-medium">Heure *</Label>
                            <Input id="time" name="time" type="time" required className="mt-2" />
                          </div>
                        </div>

                        {selectedService === 'promenade' && (
                          <div>
                            <Label className="text-base font-medium">Durée de la promenade</Label>
                            <Select value={duration} onValueChange={setDuration}>
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 heure</SelectItem>
                                <SelectItem value="90">1h30</SelectItem>
                                <SelectItem value="120">2 heures</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="notes" className="text-base font-medium">Instructions spéciales</Label>
                          <Textarea 
                            id="notes" 
                            name="notes"
                            placeholder="Informations importantes pour le promeneur (allergies, comportement, etc.)"
                            rows={3}
                            className="mt-2"
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                            Retour
                          </Button>
                          <Button 
                            type="button" 
                            className="flex-1" 
                            onClick={() => setStep(3)} 
                            disabled={isAuthenticated && !selectedDog}
                          >
                            Continuer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          Confirmation
                        </CardTitle>
                        <CardDescription>Vérifiez les détails de votre réservation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-muted/50 p-5 rounded-xl space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Service</span>
                            <span className="font-medium flex items-center gap-2">
                              <span>{serviceOptions.find(s => s.id === selectedService)?.icon}</span>
                              {serviceOptions.find(s => s.id === selectedService)?.label}
                            </span>
                          </div>
                          {isAuthenticated && selectedDog && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Chien</span>
                              <span className="font-medium">
                                {dogs.find(d => d.id === selectedDog)?.name}
                              </span>
                            </div>
                          )}
                          {selectedService === 'promenade' && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Durée</span>
                              <span className="font-medium">{duration} minutes</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-3 border-t">
                            <span className="font-semibold">Total estimé</span>
                            <span className="text-2xl font-bold text-primary">{calculatePrice().toFixed(2)}€</span>
                          </div>
                        </div>

                        {/* Security notice */}
                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                          <div className="flex items-start gap-3">
                            <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-amber-800 dark:text-amber-200">Paiement sécurisé Escrow</p>
                              <p className="text-sm text-amber-700 dark:text-amber-300">
                                Votre paiement est bloqué et débloqué uniquement après réception de la preuve photo/vidéo.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Proof notice */}
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                          <div className="flex items-start gap-3">
                            <Camera className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-medium">Preuves obligatoires</p>
                              <p className="text-sm text-muted-foreground">
                                Le promeneur enverra photo/vidéo pendant la mission.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                            Retour
                          </Button>
                          {isAuthenticated ? (
                            <Button type="submit" className="flex-1 h-12" disabled={loading}>
                              {loading ? 'Réservation...' : 'Confirmer et payer'}
                            </Button>
                          ) : (
                            <Button 
                              type="button" 
                              className="flex-1 h-12"
                              onClick={handleContinueToAuth}
                            >
                              Créer mon compte pour réserver
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Walker sidebar */}
            <div className="md:col-span-1">
              {walker && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="sticky top-24 shadow-lg border-0 overflow-hidden">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center">
                      {walker.avatar_url ? (
                        <img 
                          src={walker.avatar_url} 
                          alt={walker.first_name} 
                          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-background shadow-lg" 
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full mx-auto bg-muted flex items-center justify-center text-3xl border-4 border-background shadow-lg">
                          👤
                        </div>
                      )}
                      <h3 className="text-xl font-bold mt-4">{walker.first_name}</h3>
                      {walker.city && (
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {walker.city}
                        </p>
                      )}

                      <div className="flex items-center justify-center gap-2 mt-3">
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                        <span className="font-bold text-lg">{walker.rating?.toFixed(1) || '0.0'}</span>
                        {walker.total_reviews > 0 && (
                          <span className="text-sm text-muted-foreground">({walker.total_reviews} avis)</span>
                        )}
                      </div>

                      {walker.verified && (
                        <Badge className="mt-3 gap-1">
                          <Shield className="h-3 w-3" />
                          Promeneur vérifié
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <p className="text-sm font-medium mb-3">Garanties DogWalking :</p>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          Assurance RC incluse
                        </li>
                        <li className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-primary" />
                          Preuves photo obligatoires
                        </li>
                        <li className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          Paiement escrow sécurisé
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Réponse rapide garantie
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default BookWalk;
