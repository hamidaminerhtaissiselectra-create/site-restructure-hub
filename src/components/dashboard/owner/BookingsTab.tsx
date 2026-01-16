import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const BookingsTab = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('bookings').select('*, dogs(name)').eq('owner_id', session.user.id).order('scheduled_date', { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  const filtered = bookings.filter(b => {
    const now = new Date();
    const date = new Date(b.scheduled_date);
    if (filter === "upcoming") return date >= now && b.status !== 'cancelled';
    if (filter === "past") return date < now || b.status === 'completed';
    if (filter === "cancelled") return b.status === 'cancelled';
    return true;
  });

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Calendar className="h-6 w-6 text-primary" />Réservations</h2>
      </div>
      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList><TabsTrigger value="upcoming">À venir</TabsTrigger><TabsTrigger value="past">Passées</TabsTrigger><TabsTrigger value="cancelled">Annulées</TabsTrigger></TabsList>
      </Tabs>
      {filtered.length === 0 ? (
        <Card className="text-center py-12"><CardContent><Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" /><p className="text-muted-foreground">Aucune réservation</p></CardContent></Card>
      ) : (
        <div className="space-y-3">{filtered.map(b => (
          <Card key={b.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-4">
              <div><p className="font-semibold">{b.dogs?.name}</p><p className="text-sm text-muted-foreground">{new Date(b.scheduled_date).toLocaleDateString('fr-FR')} à {b.scheduled_time}</p></div>
              <div className="text-right"><Badge variant={b.status === 'completed' ? 'default' : 'secondary'}>{b.status}</Badge><p className="font-bold mt-1">{b.price}€</p></div>
            </CardContent>
          </Card>
        ))}</div>
      )}
    </motion.div>
  );
};

export default BookingsTab;
