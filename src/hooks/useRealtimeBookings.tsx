import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type BookingStatus = Database['public']['Enums']['booking_status'];

interface Booking {
  id: string;
  owner_id: string;
  walker_id: string | null;
  dog_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number | null;
  price: number | null;
  status: BookingStatus | null;
  service_type: string;
  notes: string | null;
  created_at: string | null;
  dogs?: {
    name: string;
    breed: string | null;
    photo_url: string | null;
  } | null;
  owner?: {
    first_name: string | null;
    avatar_url: string | null;
    city: string | null;
    phone: string | null;
  } | null;
  walker?: {
    first_name: string | null;
    avatar_url: string | null;
    city: string | null;
  } | null;
}

interface UseRealtimeBookingsProps {
  userId?: string;
  role?: 'owner' | 'walker';
  status?: BookingStatus[];
}

export const useRealtimeBookings = ({ userId, role = 'owner', status }: UseRealtimeBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!userId) return;

    let query = supabase
      .from('bookings')
      .select('*, dogs(name, breed, photo_url)')
      .order('scheduled_date', { ascending: true });

    if (role === 'owner') {
      query = query.eq('owner_id', userId);
    } else {
      query = query.eq('walker_id', userId);
    }

    if (status && status.length > 0) {
      query = query.in('status', status);
    }

    const { data, error } = await query;

    if (!error && data) {
      const walkerIds = [...new Set(data.map(b => b.walker_id).filter(Boolean))] as string[];
      const ownerIds = [...new Set(data.map(b => b.owner_id))];

      const [walkersResult, ownersResult] = await Promise.all([
        walkerIds.length > 0 
          ? supabase.from('profiles').select('id, first_name, avatar_url, city').in('id', walkerIds)
          : { data: [] },
        ownerIds.length > 0
          ? supabase.from('profiles').select('id, first_name, avatar_url, city, phone').in('id', ownerIds)
          : { data: [] }
      ]);

      const walkerMap = new Map(walkersResult.data?.map(w => [w.id, w]) || []);
      const ownerMap = new Map(ownersResult.data?.map(o => [o.id, o]) || []);

      const enrichedBookings: Booking[] = data.map(b => ({
        ...b,
        walker: b.walker_id ? walkerMap.get(b.walker_id) || null : null,
        owner: ownerMap.get(b.owner_id) || null
      }));

      setBookings(enrichedBookings);
    }
    setLoading(false);
  }, [userId, role, status]);

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('realtime-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          const { eventType, new: newRecord } = payload;

          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            fetchBookings(); // Refresh to get enriched data
          } else if (eventType === 'DELETE') {
            const deletedId = (payload.old as any).id;
            setBookings(prev => prev.filter(b => b.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return false;
    }
    return true;
  };

  const getUpcoming = () => bookings.filter(
    b => new Date(b.scheduled_date) >= new Date() && !['cancelled', 'completed'].includes(b.status || '')
  );

  const getPending = () => bookings.filter(b => b.status === 'pending');
  const getCompleted = () => bookings.filter(b => b.status === 'completed');

  return { bookings, loading, updateBookingStatus, getUpcoming, getPending, getCompleted, refresh: fetchBookings };
};
