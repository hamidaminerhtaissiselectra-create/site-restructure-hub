import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, FileText, Upload, CheckCircle, Clock, AlertCircle, LogOut } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ProfileTabProps { profile: any; walkerProfile: any; }

const DOCUMENTS = [
  { type: 'id_card', label: "Carte d'identité", required: true },
  { type: 'criminal_record', label: 'Casier judiciaire', required: true },
  { type: 'insurance', label: 'Assurance RC Pro', required: true },
  { type: 'photo', label: 'Photo de profil', required: false },
];

const WalkerProfileTab = ({ profile, walkerProfile }: ProfileTabProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({ title: "Déconnexion réussie" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><User className="h-6 w-6 text-primary" />Profil & Paramètres</h2>
        <Button variant="destructive" onClick={handleLogout} className="gap-2"><LogOut className="h-4 w-4" />Déconnexion</Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6"><TabsTrigger value="profile">Profil public</TabsTrigger><TabsTrigger value="documents">Documents</TabsTrigger><TabsTrigger value="settings">Paramètres</TabsTrigger></TabsList>

        <TabsContent value="profile">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Prénom</Label><Input defaultValue={profile?.first_name || ''} className="mt-1" /></div>
                  <div><Label>Nom</Label><Input defaultValue={profile?.last_name || ''} className="mt-1" /></div>
                </div>
                <div><Label>Téléphone</Label><Input defaultValue={profile?.phone || ''} className="mt-1" /></div>
                <div><Label>Ville</Label><Input defaultValue={profile?.city || ''} className="mt-1" /></div>
                <div><Label>Bio</Label><Textarea defaultValue={profile?.bio || ''} className="mt-1" rows={4} placeholder="Présentez-vous aux propriétaires..." /></div>
                <Button>Enregistrer</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Paramètres professionnels</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Tarif horaire (€)</Label><Input type="number" defaultValue={walkerProfile?.hourly_rate || 15} className="mt-1" /></div>
                <div><Label>Rayon d'action (km)</Label><Input type="number" defaultValue={walkerProfile?.service_radius_km || 5} className="mt-1" /></div>
                <div><Label>Nombre max de chiens</Label><Input type="number" defaultValue={walkerProfile?.max_dogs || 3} className="mt-1" /></div>
                <div><Label>Années d'expérience</Label><Input type="number" defaultValue={walkerProfile?.experience_years || 0} className="mt-1" /></div>
                <Button>Enregistrer</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Documents de vérification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {DOCUMENTS.map(doc => (
                <div key={doc.type} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <div><p className="font-medium">{doc.label}</p>{doc.required && <span className="text-xs text-destructive">Requis</span>}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Non soumis</Badge>
                    <Button size="sm" variant="outline" className="gap-1"><Upload className="h-3 w-3" />Téléverser</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Sécurité</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between"><div><p className="font-medium">Mot de passe</p><p className="text-sm text-muted-foreground">Dernière modification il y a 30 jours</p></div><Button variant="outline">Modifier</Button></div>
                <div className="flex items-center justify-between"><div><p className="font-medium">Authentification 2FA</p></div><Switch /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between"><p>Nouvelles demandes</p><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><p>Rappels de missions</p><Switch defaultChecked /></div>
                <div className="flex items-center justify-between"><p>Nouveaux avis</p><Switch defaultChecked /></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default WalkerProfileTab;
