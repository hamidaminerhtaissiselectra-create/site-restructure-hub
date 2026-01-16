import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Heart } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WalkersTab = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Search className="h-6 w-6 text-primary" />Promeneurs & Avis</h2>
        <Button onClick={() => navigate('/walkers')} className="gap-2"><Search className="h-4 w-4" />Rechercher</Button>
      </div>
      <Card className="text-center py-16">
        <CardContent>
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold mb-2">Trouvez votre promeneur idéal</h3>
          <p className="text-muted-foreground mb-6">Recherchez des promeneurs vérifiés près de chez vous</p>
          <Button onClick={() => navigate('/walkers')} size="lg">Explorer les promeneurs</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalkersTab;
