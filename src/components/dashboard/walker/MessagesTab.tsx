import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WalkerMessagesTab = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><MessageCircle className="h-6 w-6 text-primary" />Messages</h2>
        <Button onClick={() => navigate('/messages')} variant="outline">Ouvrir la messagerie</Button>
      </div>
      <Card className="text-center py-16">
        <CardContent>
          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold mb-2">Messagerie intégrée</h3>
          <p className="text-muted-foreground mb-6">Communiquez avec les propriétaires de chiens</p>
          <Button onClick={() => navigate('/messages')} size="lg">Accéder aux messages</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalkerMessagesTab;
