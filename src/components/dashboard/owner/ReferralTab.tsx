import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Copy, Share2, Check, Users, ArrowRight } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ReferralTab = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "DOGWALK123";
  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copié !", description: "Partagez-le avec vos amis" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center"><Gift className="h-10 w-10 text-white" /></div>
        <h2 className="text-3xl font-bold mb-2">Programme de Parrainage</h2>
        <p className="text-muted-foreground">Gagnez 15€ pour vous, 10€ pour vos amis</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"><CardContent className="pt-6 text-center"><div className="text-4xl font-bold text-primary mb-2">15€</div><p className="text-muted-foreground">Pour vous</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20"><CardContent className="pt-6 text-center"><div className="text-4xl font-bold text-accent mb-2">10€</div><p className="text-muted-foreground">Pour votre ami</p></CardContent></Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader><CardTitle>Votre code</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={referralCode} readOnly className="font-mono text-xl text-center" />
            <Button onClick={() => handleCopy(referralCode)}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
          </div>
          <Button onClick={() => handleCopy(referralLink)} variant="outline" className="w-full gap-2"><Share2 className="h-4 w-4" />Partager le lien</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Vos parrainages</CardTitle></CardHeader>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">Aucun parrainage pour le moment</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReferralTab;
