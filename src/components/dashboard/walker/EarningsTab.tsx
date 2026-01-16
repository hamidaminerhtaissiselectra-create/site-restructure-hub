import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Euro, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { EarningsChart } from "@/components/dashboard/EarningsChart";

const WalkerEarningsTab = () => {
  const [earnings, setEarnings] = useState({ available: 0, pending: 0, total: 0, thisMonth: 0, lastMonth: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEarnings(); }, []);

  const fetchEarnings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: bookings } = await supabase.from('bookings').select('*').eq('walker_id', session.user.id);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const completed = bookings?.filter(b => b.status === 'completed') || [];
    const pending = bookings?.filter(b => b.status === 'confirmed') || [];
    
    const thisMonth = completed.filter(b => new Date(b.scheduled_date) >= startOfMonth).reduce((s, b) => s + Number(b.price || 0) * 0.87, 0);
    const lastMonth = completed.filter(b => new Date(b.scheduled_date) >= startOfLastMonth && new Date(b.scheduled_date) < startOfMonth).reduce((s, b) => s + Number(b.price || 0) * 0.87, 0);
    const total = completed.reduce((s, b) => s + Number(b.price || 0) * 0.87, 0);
    const pendingAmount = pending.reduce((s, b) => s + Number(b.price || 0) * 0.87, 0);

    setEarnings({ available: total * 0.8, pending: pendingAmount, total, thisMonth, lastMonth });
    setTransactions(completed.slice(0, 10).map(b => ({ id: b.id, date: b.scheduled_date, amount: Number(b.price || 0) * 0.87, status: 'completed' })));

    // Chart data
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    setChartData(months.map((m, i) => ({ month: m, earnings: Math.random() * 500 + 100, walks: Math.floor(Math.random() * 20) + 5 })));
    setLoading(false);
  };

  const percentChange = earnings.lastMonth > 0 ? ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth * 100).toFixed(0) : 0;

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Euro className="h-6 w-6 text-green-600" />Mes Gains</h2>
        <Button className="gap-2"><Wallet className="h-4 w-4" />Demander un retrait</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 border-green-200">
          <CardContent className="pt-6"><p className="text-sm text-muted-foreground mb-1">Disponible</p><p className="text-4xl font-bold text-green-600">{earnings.available.toFixed(0)}€</p></CardContent>
        </Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground mb-1">En attente</p><p className="text-4xl font-bold text-amber-600">{earnings.pending.toFixed(0)}€</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground mb-1">Total gagné</p><p className="text-4xl font-bold">{earnings.total.toFixed(0)}€</p></CardContent></Card>
      </div>

      {/* Monthly Comparison */}
      <Card className="mb-8">
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Évolution mensuelle</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div><p className="text-sm text-muted-foreground">Ce mois</p><p className="text-3xl font-bold">{earnings.thisMonth.toFixed(0)}€</p></div>
            <Badge className={Number(percentChange) >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
              {Number(percentChange) >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {percentChange}%
            </Badge>
          </div>
          <EarningsChart data={chartData} serviceBreakdown={[]} totalEarnings={earnings.thisMonth} previousPeriodEarnings={earnings.lastMonth} period="month" />
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader><CardTitle>Historique des transactions</CardTitle></CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8"><Euro className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" /><p className="text-muted-foreground">Aucune transaction</p></div>
          ) : (
            <div className="space-y-2">{transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div><p className="font-medium">Promenade</p><p className="text-sm text-muted-foreground">{new Date(t.date).toLocaleDateString('fr-FR')}</p></div>
                <p className="font-bold text-green-600">+{t.amount.toFixed(2)}€</p>
              </div>
            ))}</div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 bg-muted/30">
        <CardContent className="flex items-start gap-3 pt-6">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div><p className="font-medium">Comment ça fonctionne ?</p><p className="text-sm text-muted-foreground">Les paiements sont libérés 48h après la fin de la mission. La commission DogWalking est de 13%.</p></div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalkerEarningsTab;
