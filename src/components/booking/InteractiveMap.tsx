import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Star, Shield, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Walker {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  hourly_rate: number;
  city?: string;
  latitude?: number;
  longitude?: number;
}

interface InteractiveMapProps {
  walkers: Walker[];
  onWalkerSelect: (walkerId: string) => void;
  centerCity?: string;
}

export const InteractiveMap = ({ walkers, onWalkerSelect, centerCity = "Paris" }: InteractiveMapProps) => {
  const [selectedWalker, setSelectedWalker] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Paris if geolocation fails
          setUserLocation({ lat: 48.8566, lng: 2.3522 });
        }
      );
    }
  }, []);

  const handleWalkerClick = (walkerId: string) => {
    setSelectedWalker(walkerId);
  };

  // Generate mock positions for walkers around the center
  const getWalkerPosition = (index: number, total: number) => {
    const radius = 35;
    const angle = (index / total) * 2 * Math.PI;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Carte des prestataires
          </span>
          <Badge variant="secondary" className="gap-1">
            <Navigation className="h-3 w-3" />
            {centerCity}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map Container */}
        <div className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Center marker (user location) */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Navigation className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-primary/20 rounded-full blur-sm" />
              {/* Pulse effect */}
              <div className="absolute inset-0 w-8 h-8 bg-primary/30 rounded-full animate-ping" />
            </div>
          </motion.div>

          {/* Walker markers */}
          {walkers.slice(0, 8).map((walker, index) => {
            const position = getWalkerPosition(index, Math.min(walkers.length, 8));
            const isSelected = selectedWalker === walker.id;
            
            return (
              <motion.div
                key={walker.id}
                className="absolute z-10 cursor-pointer"
                style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)" }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.2 }}
                onClick={() => handleWalkerClick(walker.id)}
              >
                <div className={`relative transition-all ${isSelected ? "scale-125" : ""}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-colors ${
                    isSelected 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "bg-white border-primary/30 text-primary hover:border-primary"
                  }`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  {walker.verified && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Selected walker popup */}
          {selectedWalker && (
            <motion.div
              className="absolute bottom-4 left-4 right-4 z-30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {walkers.filter(w => w.id === selectedWalker).map(walker => (
                <Card key={walker.id} className="shadow-xl border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{walker.name}</h4>
                          {walker.verified && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Shield className="h-3 w-3" />
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            {walker.rating?.toFixed(1) || "5.0"}
                          </span>
                          <span className="font-semibold text-primary">
                            {walker.hourly_rate}€/30min
                          </span>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => onWalkerSelect(walker.id)} className="gap-1">
                        Voir profil
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Map placeholder message */}
          <div className="absolute bottom-4 right-4 z-10">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {walkers.length} prestataires dans la zone
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
