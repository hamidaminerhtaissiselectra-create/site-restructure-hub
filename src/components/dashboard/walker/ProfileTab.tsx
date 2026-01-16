import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, Shield, Bell, FileText, Upload, CheckCircle, Clock, 
  AlertCircle, LogOut, Euro, Camera, MapPin, Star, Award
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import PricingSettings from "@/components/dashboard/shared/PricingSettings";
import AdvancedSettings from "@/components/dashboard/shared/AdvancedSettings";

interface ProfileTabProps { 
  profile: any; 
  walkerProfile: any; 
}

const DOCUMENTS = [
  { type: 'id_card', label: "Carte d'identité", required: true, icon: FileText },
  { type: 'criminal_record', label: 'Casier judiciaire (B3)', required: true, icon: Shield },
  { type: 'insurance', label: 'Assurance RC Pro', required: true, icon: Award },
  { type: 'photo', label: 'Photo de profil professionnelle', required: false, icon: Camera },
];

const WalkerProfileTab = ({ profile, walkerProfile }: ProfileTabProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    bio: profile?.bio || ''
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({ title: "Déconnexion réussie" });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          city: profileData.city,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile?.id);

      if (error) throw error;
      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getDocumentStatus = (docType: string) => {
    // Placeholder - would fetch from walker_documents table
    return { status: 'pending', label: 'Non soumis' };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="h-20 w-20 ring-4 ring-background shadow-xl">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-2xl font-bold">
                {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile?.first_name} {profile?.last_name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{profile?.city || 'Ville non définie'}</span>
              {walkerProfile?.verified && (
                <Badge className="bg-green-500 gap-1">
                  <Shield className="h-3 w-3" />
                  Vérifié
                </Badge>
              )}
            </div>
            {walkerProfile?.rating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold">{walkerProfile.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">({walkerProfile.total_reviews} avis)</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="destructive" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="profile" className="gap-2 rounded-lg">
            <User className="h-4 w-4" />
            Profil public
          </TabsTrigger>
          <TabsTrigger value="pricing" className="gap-2 rounded-lg">
            <Euro className="h-4 w-4" />
            Tarifs
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2 rounded-lg">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 rounded-lg">
            <Bell className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input 
                      value={profileData.first_name} 
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input 
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input 
                    value={profileData.city}
                    onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    placeholder="Paris, Lyon, Marseille..."
                  />
                </div>
                <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </CardContent>
            </Card>

            {/* Bio & Presentation */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Présentation
                </CardTitle>
                <CardDescription>Cette description sera visible par les propriétaires</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea 
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={8}
                  placeholder="Présentez-vous aux propriétaires...

Par exemple:
- Votre expérience avec les chiens
- Pourquoi vous aimez ce métier
- Vos disponibilités
- Ce qui vous distingue"
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {profileData.bio.length}/500 caractères
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <PricingSettings walkerProfile={walkerProfile} />
        </TabsContent>

        <TabsContent value="documents">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documents de vérification
              </CardTitle>
              <CardDescription>
                Soumettez vos documents pour obtenir le badge vérifié et recevoir plus de demandes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {DOCUMENTS.map(doc => {
                const status = getDocumentStatus(doc.type);
                return (
                  <div 
                    key={doc.type} 
                    className="flex items-center justify-between p-5 rounded-2xl border-2 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <doc.icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{doc.label}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {doc.required && (
                            <Badge variant="outline" className="text-xs text-destructive border-destructive/50">
                              Requis
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {status.label}
                      </Badge>
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Téléverser
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">Processus de vérification</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Une fois vos documents soumis, notre équipe les vérifiera sous 24-48h. 
                      Vous recevrez une notification une fois la vérification terminée.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <AdvancedSettings userType="walker" />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default WalkerProfileTab;
