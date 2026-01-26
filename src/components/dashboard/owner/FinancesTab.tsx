import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, Plus, Trash2, Gift, Copy, Share2, Check, Users, 
  Euro, ArrowRight, Receipt, Clock, CheckCircle, History
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const FinancesTab = () => {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("DOGWALK123");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [cards, setCards] = useState([
    { id: '1', last4: '4242', brand: 'Visa', expiry: '12/26', isDefault: true }
  ]);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch payment history from bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, dogs(name)')
      .eq('owner_id', session.user.id)
      .in('status', ['completed', 'confirmed'])
      .order('scheduled_date', { ascending: false })
      .limit(10);

    if (bookings) {
      setPaymentHistory(bookings.map(b => ({
        id: b.id,
        date: b.scheduled_date,
        amount: b.price || 0,
        description: `Promenade - ${b.dogs?.name || 'Chien'}`,
        status: b.status === 'completed' ? 'payé' : 'en attente'
      })));
    }

    // Fetch referrals
    const { data: refs } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', session.user.id);

    if (refs) {
      setReferrals(refs);
      if (refs.length > 0) setReferralCode(refs[0].referral_code);
    }
  };

  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copié !", description: "Partagez-le avec vos amis" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCard = () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvc) {
      toast({ title: "Erreur", description: "Remplissez tous les champs", variant: "destructive" });
      return;
    }
    const last4 = newCard.number.slice(-4);
    setCards([...cards, { id: Date.now().toString(), last4, brand: 'Visa', expiry: newCard.expiry, isDefault: false }]);
    setNewCard({ number: '', expiry: '', cvc: '' });
    setShowAddCard(false);
    toast({ title: "Carte ajoutée", description: `Carte •••• ${last4} ajoutée avec succès` });
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    toast({ title: "Carte supprimée" });
  };

  const handleSetDefault = (id: string) => {
    setCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
    toast({ title: "Carte par défaut mise à jour" });
  };

  const completedReferrals = referrals.filter(r => r.status === 'completed').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const totalEarned = completedReferrals * 15;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-full grid grid-cols-3">
          <TabsTrigger value="payments" className="gap-2 rounded-lg">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Paiements</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="gap-2 rounded-lg">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Cartes</span>
          </TabsTrigger>
          <TabsTrigger value="referral" className="gap-2 rounded-lg">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Parrainage</span>
          </TabsTrigger>
        </TabsList>

        {/* Historique des paiements */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Historique des paiements
              </CardTitle>
              <CardDescription>Retrouvez tous vos paiements</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-lg font-medium">Aucun paiement</p>
                  <p className="text-muted-foreground">Vos paiements apparaîtront ici</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentHistory.map((payment, idx) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.status === 'payé' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {payment.status === 'payé' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{payment.amount}€</p>
                        <Badge variant={payment.status === 'payé' ? 'default' : 'secondary'} className="text-xs">
                          {payment.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des cartes */}
        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Mes cartes bancaires
                  </CardTitle>
                  <CardDescription>Gérez vos moyens de paiement</CardDescription>
                </div>
                <Button onClick={() => setShowAddCard(!showAddCard)} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddCard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label>Numéro de carte</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={newCard.number}
                        onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                        className="text-lg tracking-wider"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date d'expiration</Label>
                      <Input
                        placeholder="MM/AA"
                        value={newCard.expiry}
                        onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CVC</Label>
                      <Input
                        placeholder="123"
                        value={newCard.cvc}
                        onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        type="password"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddCard} className="flex-1">Enregistrer la carte</Button>
                    <Button variant="outline" onClick={() => setShowAddCard(false)}>Annuler</Button>
                  </div>
                </motion.div>
              )}

              {cards.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-lg font-medium">Aucune carte enregistrée</p>
                  <p className="text-muted-foreground">Ajoutez une carte pour payer vos réservations</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                        card.isDefault ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{card.brand}</span>
                        </div>
                        <div>
                          <p className="font-mono font-medium">•••• •••• •••• {card.last4}</p>
                          <p className="text-sm text-muted-foreground">Expire {card.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {card.isDefault ? (
                          <Badge className="bg-primary/10 text-primary">Par défaut</Badge>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleSetDefault(card.id)}>
                            Définir par défaut
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveCard(card.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programme de parrainage */}
        <TabsContent value="referral">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                <Gift className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Programme de Parrainage</h2>
              <p className="text-muted-foreground">Gagnez 15€ pour vous, 10€ pour vos amis</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary">{totalEarned}€</div>
                  <p className="text-sm text-muted-foreground">Total gagné</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-green-600">{completedReferrals}</div>
                  <p className="text-sm text-muted-foreground">Parrainages réussis</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-amber-600">{pendingReferrals}</div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </CardContent>
              </Card>
            </div>

            {/* Code */}
            <Card>
              <CardHeader>
                <CardTitle>Votre code de parrainage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={referralCode} 
                    readOnly 
                    className="font-mono text-xl text-center font-bold tracking-widest" 
                  />
                  <Button onClick={() => handleCopy(referralCode)} size="icon" className="shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button onClick={() => handleCopy(referralLink)} variant="outline" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager le lien d'invitation
                </Button>
              </CardContent>
            </Card>

            {/* How it works */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Comment ça marche ?</h3>
                <div className="grid gap-4">
                  {[
                    { step: 1, text: "Partagez votre code avec vos amis" },
                    { step: 2, text: "Ils s'inscrivent avec votre code" },
                    { step: 3, text: "Après leur 1ère réservation, vous recevez 15€" }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default FinancesTab;
