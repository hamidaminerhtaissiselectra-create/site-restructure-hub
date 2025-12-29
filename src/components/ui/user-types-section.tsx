import { Button } from "@/components/ui/button";
import { Dog, Briefcase, Check, ArrowRight } from "lucide-react";

export const UserTypesSection = () => {
  const ownerBenefits = [
    "Promeneurs avec CNI et casier vérifiés",
    "Preuves photo/vidéo obligatoires",
    "Paiement sécurisé en escrow",
    "Assurance RC incluse (2M€)",
    "Avis certifiés et badges de qualité",
    "Support réactif 7j/7"
  ];

  const walkerBenefits = [
    "Revenus complémentaires attractifs",
    "Emploi du temps 100% flexible",
    "Assurance professionnelle fournie",
    "Paiements rapides et sécurisés",
    "Badges et reconnaissance",
    "Formation aux premiers secours"
  ];

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-3">
            Rejoignez-nous
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Choisissez votre profil</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Propriétaire ou promeneur, DogWalking vous offre une expérience unique
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Propriétaires */}
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
            <div className="bg-gradient-primary p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20">
                  <Dog className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold">Propriétaires</h3>
                  <p className="text-white/80 text-sm">Trouvez le promeneur idéal</p>
                </div>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <ul className="space-y-3 mb-6">
                {ownerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full group" 
                size="lg"
                onClick={() => window.location.href = '/auth?type=owner'}
              >
                Trouver un promeneur
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Promeneurs */}
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-accent to-ocean p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold">Promeneurs</h3>
                  <p className="text-white/80 text-sm">Gagnez en faisant ce que vous aimez</p>
                </div>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <ul className="space-y-3 mb-6">
                {walkerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="secondary" 
                className="w-full group border-2 border-accent text-accent hover:bg-accent hover:text-white" 
                size="lg"
                onClick={() => window.location.href = '/walker/register'}
              >
                Devenir promeneur
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};