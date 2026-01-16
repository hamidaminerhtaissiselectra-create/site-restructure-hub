import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, Save } from 'lucide-react';
import { motion } from "framer-motion";

interface AvailabilityTabProps { walkerProfile: any; }

const DAYS = [
  { id: 'Monday', label: 'Lundi' },
  { id: 'Tuesday', label: 'Mardi' },
  { id: 'Wednesday', label: 'Mercredi' },
  { id: 'Thursday', label: 'Jeudi' },
  { id: 'Friday', label: 'Vendredi' },
  { id: 'Saturday', label: 'Samedi' },
  { id: 'Sunday', label: 'Dimanche' },
];

const WalkerAvailabilityTab = ({ walkerProfile }: AvailabilityTabProps) => {
  const availableDays = walkerProfile?.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startTime = walkerProfile?.available_hours_start || '08:00';
  const endTime = walkerProfile?.available_hours_end || '20:00';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Clock className="h-6 w-6 text-primary" />Disponibilités</h2>
        <Button className="gap-2"><Save className="h-4 w-4" />Enregistrer</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Days */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Jours de travail</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {DAYS.map(day => (
              <div key={day.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                <Label htmlFor={day.id} className="font-medium cursor-pointer">{day.label}</Label>
                <Switch id={day.id} defaultChecked={availableDays.includes(day.id)} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hours */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Horaires</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Début de journée</Label>
              <input type="time" defaultValue={startTime} className="w-full mt-2 p-3 rounded-lg border bg-background" />
            </div>
            <div>
              <Label>Fin de journée</Label>
              <input type="time" defaultValue={endTime} className="w-full mt-2 p-3 rounded-lg border bg-background" />
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-medium mb-2">Résumé</p>
              <p className="text-sm text-muted-foreground">
                Vous êtes disponible <strong>{availableDays.length} jours</strong> par semaine, 
                de <strong>{startTime}</strong> à <strong>{endTime}</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default WalkerAvailabilityTab;
