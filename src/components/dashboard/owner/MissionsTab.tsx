import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Calendar, Clock, CheckCircle, XCircle, MapPin, 
  MessageCircle, Eye, ChevronRight, Dog, AlertCircle,
  Download
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarExport } from "@/hooks/useCalendarExport";

const MissionsTab = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const { exportBookings } = useCalendarExport();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*, dogs(name, breed, photo_url)')
      .eq('owner_id', session.user.id)
      .order('scheduled_date', { ascending: true });

    // Enrich with walker info
    if (bookingsData && bookingsData.length > 0) {
      const walkerIds = [...new Set(bookingsData.map(b => b.walker_id).filter(Boolean))];
      if (walkerIds.length > 0) {
        const { data: walkersData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', walkerIds);
        
        const walkerMap = new Map(walkersData?.map(w => [w.id, w]) || []);
        setBookings(bookingsData.map(b => ({
          ...b,
          walker: walkerMap.get(b.walker_id)
        })));
      } else {
        setBookings(bookingsData);
      }
    } else {
      setBookings([]);
    }
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

  const upcomingCount = bookings.filter(b => 
    new Date(b.scheduled_date) >= new Date() && b.status !== 'cancelled'
  ).length;

  const getStatusConfig = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: any }> = {
      pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
      confirmed: { label: 'Confirmée', className: 'bg-primary/10 text-primary border-primary/20', icon: CheckCircle },
      in_progress: { label: 'En cours', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: MapPin },
      completed: { label: 'Terminée', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
    };
    return config[status] || config.pending;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === now.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === tomorrow.toDateString()) return "Demain";
    
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
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

  const handleExportAll = () => {
    const upcomingBookings = bookings
      .filter(b => new Date(b.scheduled_date) >= new Date() && b.status !== 'cancelled')
      .map(b => ({
        id: b.id,
        scheduled_date: b.scheduled_date,
        scheduled_time: b.scheduled_time,
        duration_minutes: b.duration_minutes || 60,
        service_type: b.service_type,
        dog_name: b.dogs?.name,
        address: b.address,
        city: b.city
      }));
    exportBookings(upcomingBookings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div 
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            Mes Missions
          </h1>
          <p className="text-muted-foreground mt-1">
            {upcomingCount} mission{upcomingCount > 1 ? 's' : ''} à venir
          </p>
        </div>
        
        {upcomingCount > 0 && (
          <Button variant="outline" onClick={handleExportAll} className="gap-2 h-12">
            <Download className="h-5 w-5" />
            Exporter calendrier
          </Button>
        )}
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-3 h-14 p-1 bg-muted/50">
          <TabsTrigger value="upcoming" className="text-base h-full data-[state=active]:shadow-md">
            À venir
            {upcomingCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
                {upcomingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="text-base h-full data-[state=active]:shadow-md">
            Passées
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-base h-full data-[state=active]:shadow-md">
            Annulées
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucune mission</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
              {filter === 'upcoming' && "Vous n'avez pas encore de mission programmée"}
              {filter === 'past' && "Aucune mission terminée"}
              {filter === 'cancelled' && "Aucune mission annulée"}
            </p>
            {filter === 'upcoming' && (
              <Button onClick={() => navigate('/walkers')} size="lg" className="gap-2 h-12">
                Réserver une promenade
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((booking, index) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      {/* Date Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{formatDate(booking.scheduled_date)}</span>
                          <span className="text-muted-foreground">à {booking.scheduled_time}</span>
                        </div>
                        <Badge className={`${statusConfig.className} gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Dog or Walker photo */}
                          <div className="relative flex-shrink-0">
                            {booking.dogs?.photo_url ? (
                              <img 
                                src={booking.dogs.photo_url} 
                                alt={booking.dogs?.name}
                                className="w-16 h-16 rounded-2xl object-cover shadow"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                                🐕
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-lg">{booking.dogs?.name || "Chien"}</h3>
                              <Badge variant="outline">{getServiceLabel(booking.service_type)}</Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                              <Clock className="h-4 w-4" />
                              <span>{booking.duration_minutes || 60} min</span>
                              {booking.walker && (
                                <>
                                  <span>•</span>
                                  <span>avec {booking.walker.first_name}</span>
                                </>
                              )}
                            </div>
                            
                            {booking.city && (
                              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {booking.city}
                              </div>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-bold text-primary">
                              {Number(booking.price || 0).toFixed(0)}€
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t flex-wrap">
                          {booking.walker_id && booking.status !== 'cancelled' && (
                            <Button 
                              variant="outline"
                              size="lg"
                              className="flex-1 h-12 text-base gap-2"
                              onClick={() => navigate('/messages', { state: { selectedWalkerId: booking.walker_id }})}
                            >
                              <MessageCircle className="h-5 w-5" />
                              Envoyer message
                            </Button>
                          )}
                          <Button 
                            variant="secondary"
                            size="lg"
                            className="flex-1 h-12 text-base gap-2"
                            onClick={() => navigate(`/bookings/${booking.id}`)}
                          >
                            <Eye className="h-5 w-5" />
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default MissionsTab;
