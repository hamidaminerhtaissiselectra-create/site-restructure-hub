import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Euro, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Info, CreditCard,
  Building2, Gift, Copy, Share2, Check, Users, Receipt, History, Clock, CheckCircle
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const WalkerFinancesTab = () => {
  const [earnings, setEarnings] = useState({ available: 0, pending: 0, total: 0, thisMonth: 0, lastMonth: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bankInfo, setBankInfo] = useState({ iban: '', bic: '', holder: '' });
  const [showBankForm, setShowBankForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState("WALKER" + Math.random().toString(36).substring(2, 8).toUpperCase());

  useEffect(() => { fetchEarnings(); }, []);

  const fetchEarnings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, dogs(name)')
      .eq('walker_id', session.user.id)
      .order('scheduled_date', { ascending: false });
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const completed = bookings?.filter(b => b.status === 'completed') || [];
    const pending = bookings?.filter(b => b.status === 'confirmed') || [];
    
    const commission = 0.87; // 13% commission
    const thisMonth = completed.filter(b => new Date(b.scheduled_date) >= startOfMonth).reduce((s, b) => s + Number(b.price || 0) * commission, 0);
    const lastMonth = completed.filter(b => new Date(b.scheduled_date) >= startOfLastMonth && new Date(b.scheduled_date) < startOfMonth).reduce((s, b) => s + Number(b.price || 0) * commission, 0);
    const total = completed.reduce((s, b) => s + Number(b.price || 0) * commission, 0);
    const pendingAmount = pending.reduce((s, b) => s + Number(b.price || 0) * commission, 0);

    setEarnings({ available: total * 0.8, pending: pendingAmount, total, thisMonth, lastMonth });
    
    setTransactions(completed.slice(0, 15).map(b => ({
      id: b.id,
      date: b.scheduled_date,
      amount: Number(b.price || 0) * commission,
      description: `Promenade - ${b.dogs?.name || 'Chien'}`,
      status: 'completed'
    })));
    
    setLoading(false);
  };

  const percentChange = earnings.lastMonth > 0 ? ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth * 100).toFixed(0) : 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copié !" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveBankInfo = () => {
    if (!bankInfo.iban || !bankInfo.holder) {
      toast({ title: "Erreur", description: "Remplissez tous les champs obligatoires", variant: "destructive" });
      return;
    }
    setShowBankForm(false);
    toast({ title: "Coordonnées bancaires enregistrées", description: "Vos virements seront effectués sur ce compte" });
  };

  const handleWithdraw = () => {
    if (earnings.available < 20) {
      toast({ title: "Montant minimum", description: "Le retrait minimum est de 20€", variant: "destructive" });
      return;
    }
    toast({ title: "Demande envoyée", description: `Virement de ${earnings.available.toFixed(0)}€ en cours de traitement` });
  };

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header with withdraw button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Euro className="h-6 w-6 text-green-600" />
          Mes Gains
        </h2>
        <Button onClick={handleWithdraw} className="gap-2" disabled={earnings.available < 20}>
          <Wallet className="h-4 w-4" />
          Retirer {earnings.available.toFixed(0)}€
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 border-green-200">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Disponible</p>
            <p className="text-3xl font-bold text-green-600">{earnings.available.toFixed(0)}€</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 border-amber-200">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">En attente</p>
            <p className="text-3xl font-bold text-amber-600">{earnings.pending.toFixed(0)}€</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total gagné</p>
            <p className="text-3xl font-bold">{earnings.total.toFixed(0)}€</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Ce mois-ci</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{earnings.thisMonth.toFixed(0)}€</p>
                <Badge className={Number(percentChange) >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {Number(percentChange) >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {percentChange}%
                </Badge>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              Objectif: 500€
            </div>
          </div>
          <Progress value={Math.min((earnings.thisMonth / 500) * 100, 100)} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">{Math.min((earnings.thisMonth / 500) * 100, 100).toFixed(0)}% de l'objectif</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-full grid grid-cols-3">
          <TabsTrigger value="history" className="gap-2 rounded-lg">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="gap-2 rounded-lg">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Compte</span>
          </TabsTrigger>
          <TabsTrigger value="referral" className="gap-2 rounded-lg">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Parrainage</span>
          </TabsTrigger>
        </TabsList>

        {/* Historique */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Historique des gains
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <Euro className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Aucune transaction</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((t, idx) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{t.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(t.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">+{t.amount.toFixed(2)}€</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compte bancaire */}
        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Coordonnées bancaires
                  </CardTitle>
                  <CardDescription>Pour recevoir vos paiements</CardDescription>
                </div>
                {!showBankForm && (
                  <Button onClick={() => setShowBankForm(true)} variant="outline" size="sm">
                    {bankInfo.iban ? 'Modifier' : 'Ajouter'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {showBankForm ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>Titulaire du compte *</Label>
                    <Input
                      placeholder="Jean Dupont"
                      value={bankInfo.holder}
                      onChange={(e) => setBankInfo({ ...bankInfo, holder: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IBAN *</Label>
                    <Input
                      placeholder="FR76 1234 5678 9012 3456 7890 123"
                      value={bankInfo.iban}
                      onChange={(e) => setBankInfo({ ...bankInfo, iban: e.target.value })}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>BIC</Label>
                    <Input
                      placeholder="BNPAFRPP"
                      value={bankInfo.bic}
                      onChange={(e) => setBankInfo({ ...bankInfo, bic: e.target.value })}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveBankInfo} className="flex-1">Enregistrer</Button>
                    <Button variant="outline" onClick={() => setShowBankForm(false)}>Annuler</Button>
                  </div>
                </motion.div>
              ) : bankInfo.iban ? (
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="font-medium">{bankInfo.holder}</p>
                  <p className="font-mono text-sm text-muted-foreground">{bankInfo.iban}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Ajoutez vos coordonnées bancaires pour recevoir vos paiements</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parrainage */}
        <TabsContent value="referral">
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="pt-6 text-center">
                <Gift className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Parrainez et gagnez 50€</h3>
                <p className="text-muted-foreground mb-4">Pour chaque promeneur qui s'inscrit avec votre code</p>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <Input value={referralCode} readOnly className="font-mono text-center font-bold" />
                  <Button onClick={() => handleCopy(referralCode)} size="icon">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-muted/30">
        <CardContent className="flex items-start gap-3 pt-6">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Comment ça fonctionne ?</p>
            <p className="text-sm text-muted-foreground">
              Les paiements sont libérés 48h après la fin de la mission. La commission DogWalking est de 13%. 
              Le retrait minimum est de 20€.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalkerFinancesTab;
