import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dog, Plus, Edit2, Trash2, Heart, Scale, Calendar, Syringe, Info, ChevronRight
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Dog {
  id: string;
  name: string;
  breed: string | null;
  age: number | null;
  weight: number | null;
  size: string | null;
  photo_url: string | null;
  temperament: string | null;
  vaccinations_up_to_date: boolean | null;
  is_neutered: boolean | null;
  special_needs: string | null;
}

const DogsSection = () => {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  useEffect(() => { fetchDogs(); }, []);

  const fetchDogs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setDogs(data || []);
    }
    setLoading(false);
  };

  const handleDeleteDog = async (dogId: string) => {
    const { error } = await supabase.from('dogs').delete().eq('id', dogId);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setDogs(dogs.filter(d => d.id !== dogId));
      setSelectedDog(null);
      toast({ title: "Chien supprimé" });
    }
  };

  const getSizeLabel = (size: string | null) => {
    const sizes: Record<string, string> = {
      small: 'Petit (< 10kg)',
      medium: 'Moyen (10-25kg)',
      large: 'Grand (25-45kg)',
      giant: 'Très grand (> 45kg)'
    };
    return sizes[size || 'medium'] || 'Moyen';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Dog className="h-5 w-5 text-primary" />
              Mes chiens
            </CardTitle>
            <CardDescription>{dogs.length} chien(s) enregistré(s)</CardDescription>
          </div>
          <Button onClick={() => navigate('/add-dog')} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {dogs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Dog className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun chien enregistré</h3>
            <p className="text-muted-foreground mb-4">Ajoutez votre premier compagnon</p>
            <Button onClick={() => navigate('/add-dog')} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un chien
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {dogs.map((dog, idx) => (
              <motion.div
                key={dog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedDog?.id === dog.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedDog(selectedDog?.id === dog.id ? null : dog)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src={dog.photo_url || ''} />
                    <AvatarFallback className="text-2xl bg-primary/10">
                      🐕
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{dog.name}</h3>
                      {dog.vaccinations_up_to_date && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Syringe className="h-3 w-3 mr-1" />
                          Vacciné
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {dog.breed || 'Race inconnue'} • {dog.age ? `${dog.age} an(s)` : 'Âge inconnu'}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Scale className="h-3 w-3" />
                        {dog.weight ? `${dog.weight}kg` : 'Poids inconnu'}
                      </span>
                      <span>{getSizeLabel(dog.size)}</span>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                    selectedDog?.id === dog.id ? 'rotate-90' : ''
                  }`} />
                </div>

                <AnimatePresence>
                  {selectedDog?.id === dog.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t space-y-4"
                    >
                      {/* Tempérament */}
                      {dog.temperament && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Tempérament</p>
                          <p>{dog.temperament}</p>
                        </div>
                      )}

                      {/* Besoins spéciaux */}
                      {dog.special_needs && (
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Besoins spéciaux
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{dog.special_needs}</p>
                        </div>
                      )}

                      {/* Infos */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Syringe className={`h-4 w-4 ${dog.vaccinations_up_to_date ? 'text-green-600' : 'text-muted-foreground'}`} />
                          <span>{dog.vaccinations_up_to_date ? 'Vaccins à jour' : 'Vaccins non renseignés'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className={`h-4 w-4 ${dog.is_neutered ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span>{dog.is_neutered ? 'Stérilisé(e)' : 'Non stérilisé(e)'}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/add-dog?edit=${dog.id}`);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-destructive hover:text-destructive gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDog(dog.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DogsSection;
