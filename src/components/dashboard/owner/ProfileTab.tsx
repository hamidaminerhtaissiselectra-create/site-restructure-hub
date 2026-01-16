import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, LogOut } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ProfileTabProps { profile: any; }

const ProfileTab = ({ profile }: ProfileTabProps) => {
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
        <TabsList className="mb-6"><TabsTrigger value="profile">Profil</TabsTrigger><TabsTrigger value="security">Sécurité</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger></TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Prénom</Label><Input defaultValue={profile?.first_name || ''} className="mt-1" /></div>
                <div><Label>Nom</Label><Input defaultValue={profile?.last_name || ''} className="mt-1" /></div>
              </div>
              <div><Label>Email</Label><Input defaultValue={profile?.email || ''} disabled className="mt-1" /></div>
              <div><Label>Téléphone</Label><Input defaultValue={profile?.phone || ''} className="mt-1" /></div>
              <div><Label>Ville</Label><Input defaultValue={profile?.city || ''} className="mt-1" /></div>
              <Button>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card><CardContent className="py-8 space-y-4">
            <div className="flex items-center justify-between"><div><p className="font-medium">Mot de passe</p><p className="text-sm text-muted-foreground">Dernière modification il y a 30 jours</p></div><Button variant="outline">Modifier</Button></div>
            <div className="flex items-center justify-between"><div><p className="font-medium">Authentification 2FA</p><p className="text-sm text-muted-foreground">Sécurisez votre compte</p></div><Switch /></div>
          </CardContent></Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card><CardContent className="py-8 space-y-4">
            <div className="flex items-center justify-between"><p>Notifications push</p><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><p>Emails marketing</p><Switch /></div>
            <div className="flex items-center justify-between"><p>Rappels de réservation</p><Switch defaultChecked /></div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileTab;
