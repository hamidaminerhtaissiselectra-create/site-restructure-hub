import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileCheck, Lock, Users, Camera, Phone, CheckCircle, BadgeCheck, CreditCard, Clock, Sparkles, ArrowRight, Award, Heart } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { AnimatedCard, AnimatedGrid, AnimatedGridItem } from "@/components/ui/animated-card";
import { SectionHeader } from "@/components/ui/section-header";
import securiteHero from "@/assets/pages/securite-hero.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Securite = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "Comment vérifiez-vous l'identité des promeneurs ?",
      answer: "Chaque promeneur doit fournir une pièce d'identité officielle (CNI ou passeport) qui est vérifiée manuellement par notre équipe de conformité. Nous vérifions la validité du document, la cohérence des informations avec le profil créé, et nous croisons les données avec les bases officielles. Ce processus prend généralement 24 à 48 heures."
    },
    {
      question: "Qu'est-ce que le paiement escrow et comment fonctionne-t-il ?",
      answer: "Le paiement escrow est un système de séquestre sécurisé. Lorsque vous réservez, votre paiement est bloqué sur un compte sécurisé pendant 24-48h. Il n'est libéré au promeneur qu'après réception et validation de la preuve de prestation (photo/vidéo obligatoire). Si aucune preuve n'est fournie, vous êtes automatiquement remboursé intégralement."
    },
    {
      question: "Quelle assurance couvre les prestations DogWalking ?",
      answer: "Tous nos promeneurs disposent d'une assurance responsabilité civile couvrant les prestations jusqu'à 2 millions d'euros. Cette assurance protège votre chien, le promeneur et les tiers en cas d'incident. Elle couvre les dommages corporels, matériels et immatériels qui pourraient survenir pendant une prestation."
    },
    {
      question: "Que se passe-t-il si le promeneur n'envoie pas de preuve ?",
      answer: "Sans preuve photo/vidéo obligatoire, le paiement reste bloqué en escrow et vous êtes automatiquement remboursé après 48 heures. C'est notre garantie de tranquillité d'esprit. Le promeneur ne peut pas recevoir son paiement sans avoir prouvé l'exécution de la mission."
    },
    {
      question: "Comment signaler un problème pendant ou après une prestation ?",
      answer: "Vous pouvez nous contacter via la messagerie intégrée à l'application, par email à support@dogwalking.fr ou par téléphone au 01 23 45 67 89. Notre équipe support est disponible 7j/7 pour traiter tout litige et assurer une médiation si nécessaire. Le temps de réponse moyen est inférieur à 2 heures."
    },
    {
      question: "Les promeneurs ont-ils un casier judiciaire vérifié ?",
      answer: "Oui, nous demandons une attestation de non-antécédent ou un extrait de casier judiciaire (bulletin n°3) à tous nos promeneurs avant leur validation sur la plateforme. Ce document doit dater de moins de 3 mois et est vérifié manuellement par notre équipe de conformité."
    }
  ];

  const features = [
    {
      icon: BadgeCheck,
      title: "Vérification d'identité",
      description: "Chaque promeneur fournit une pièce d'identité vérifiée manuellement par notre équipe avant d'être accepté sur la plateforme. Processus rigoureux en 24-48h.",
      variant: "primary" as const
    },
    {
      icon: FileCheck,
      title: "Casier judiciaire vérifié",
      description: "Attestation de non-antécédent ou extrait de casier judiciaire demandé pour garantir la fiabilité de nos promeneurs. Document de moins de 3 mois exigé.",
      variant: "accent" as const
    },
    {
      icon: Shield,
      title: "Assurance responsabilité civile 2M€",
      description: "Tous nos promeneurs disposent d'une assurance RC habitation ou professionnelle couvrant les prestations jusqu'à 2 millions d'euros.",
      variant: "success" as const
    },
    {
      icon: Camera,
      title: "Preuves photo/vidéo obligatoires",
      description: "Le promeneur doit envoyer une preuve photo ou vidéo avec un message à chaque prestation. Sans preuve, le paiement reste bloqué.",
      variant: "warning" as const
    },
    {
      icon: Lock,
      title: "Paiement Escrow sécurisé",
      description: "Votre paiement est bloqué 24-48h et n'est débloqué qu'après réception et validation de la preuve de prestation. Protection totale.",
      variant: "primary" as const
    },
    {
      icon: Users,
      title: "Avis et notes transparents",
      description: "Système d'évaluation après chaque prestation pour maintenir un haut niveau de qualité et de confiance. Seuls les clients ayant réservé peuvent noter.",
      variant: "accent" as const
    },
    {
      icon: CreditCard,
      title: "Transactions cryptées SSL",
      description: "Paiements sécurisés via Stripe, conformes PCI-DSS. Vos données bancaires ne sont jamais stockées sur nos serveurs. Cryptage 256 bits.",
      variant: "success" as const
    },
    {
      icon: Phone,
      title: "Support disponible 7j/7",
      description: "Notre équipe est disponible pour répondre à vos questions et vous assister en cas de problème. Temps de réponse moyen < 2h.",
      variant: "warning" as const
    }
  ];

  const verificationSteps = [
    { step: "1", title: "Inscription", description: "Le promeneur remplit son profil complet avec photo réelle et informations vérifiables" },
    { step: "2", title: "Documents", description: "Envoi de la CNI, attestation casier judiciaire et preuve d'assurance RC" },
    { step: "3", title: "Vérification", description: "Notre équipe vérifie manuellement tous les documents sous 24-48h" },
    { step: "4", title: "Validation", description: "Le promeneur est validé et peut recevoir des réservations" }
  ];

  const stats = [
    { value: "100%", label: "Promeneurs vérifiés", icon: BadgeCheck },
    { value: "2M€", label: "Assurance incluse", icon: Shield },
    { value: "24-48h", label: "Paiement sécurisé", icon: Clock },
    { value: "13%", label: "Commission transparente", icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Sécurité DogWalking | Promeneurs Vérifiés, Paiement Escrow, Assurance 2M€"
        description="Découvrez comment DogWalking garantit votre sécurité : vérification d'identité, casier judiciaire, assurance RC 2M€, paiement escrow et preuves photo obligatoires."
        canonical="https://dogwalking.fr/securite"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section animée */}
          <motion.div 
            className="relative rounded-3xl overflow-hidden mb-16"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={securiteHero} 
              alt="Promeneur vérifié DogWalking avec badge de confiance" 
              className="w-full h-72 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <AnimatedIcon icon={Shield} size="xl" variant="primary" className="mx-auto mb-4" float />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Votre sécurité, notre priorité
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Nous mettons tout en œuvre pour garantir la sécurité de votre chien et votre tranquillité d'esprit 
                à chaque prestation. Vérifications rigoureuses, paiement sécurisé, assurance premium.
              </motion.p>
            </div>
          </motion.div>

          {/* Contenu SEO enrichi */}
          <motion.div 
            className="max-w-4xl mx-auto mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Chez DogWalking, la sécurité n'est pas une option, c'est notre fondation. Nous avons construit 
              une plateforme où chaque détail est pensé pour protéger votre animal et vous offrir une 
              tranquillité d'esprit totale. De la vérification minutieuse des promeneurs au système de 
              paiement escrow, en passant par l'assurance responsabilité civile jusqu'à 2 millions d'euros, 
              nous ne laissons rien au hasard.
            </p>
          </motion.div>

          {/* Processus de vérification */}
          <section className="mb-16">
            <SectionHeader
              title="Processus de vérification des promeneurs"
              subtitle="Un parcours rigoureux pour garantir votre confiance"
              icon={BadgeCheck}
              iconVariant="primary"
              badge="4 étapes"
            />
            
            <AnimatedGrid className="grid-cols-1 md:grid-cols-4 gap-6" staggerDelay={0.1}>
              {verificationSteps.map((item, index) => (
                <AnimatedGridItem key={index}>
                  <div className="text-center">
                    <motion.div 
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </AnimatedGridItem>
              ))}
            </AnimatedGrid>
          </section>

          {/* Features grid avec icônes colorées */}
          <section className="mb-16">
            <SectionHeader
              title="Nos 8 piliers de sécurité"
              subtitle="Une protection complète à chaque étape de votre expérience"
              icon={Shield}
              iconVariant="accent"
            />
            
            <AnimatedGrid className="grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.08}>
              {features.map((feature, index) => (
                <AnimatedGridItem key={index}>
                  <AnimatedCard className="p-6 h-full" hover glow>
                    <div className="flex gap-5">
                      <AnimatedIcon icon={feature.icon} size="lg" variant={feature.variant} />
                      <div>
                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </AnimatedCard>
                </AnimatedGridItem>
              ))}
            </AnimatedGrid>
          </section>

          {/* Section Escrow enrichie */}
          <section className="mb-16">
            <AnimatedCard className="overflow-hidden" glow>
              <div className="grid md:grid-cols-2">
                <div className="p-8 bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Lock className="h-6 w-6" />
                    Comment fonctionne le paiement Escrow ?
                  </h2>
                  <div className="space-y-4">
                    {[
                      "Vous réservez et payez en ligne de manière sécurisée",
                      "Le paiement est bloqué sur un compte sécurisé (24-48h)",
                      "Le promeneur effectue la prestation et envoie une preuve",
                      "Vous validez la preuve et le paiement est débloqué"
                    ].map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p>{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Protection garantie
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Remboursement si prestation non effectuée",
                      "Médiation gratuite en cas de litige",
                      "Historique des preuves conservé 90 jours",
                      "Commission DogWalking : 13% tout inclus"
                    ].map((item, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedCard>
          </section>

          {/* Stats DogWalking Protect */}
          <section className="mb-16">
            <motion.div
              className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 md:p-12 text-primary-foreground"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                <Award className="h-8 w-8" />
                DogWalking Protect
              </h2>
              <AnimatedGrid className="grid-cols-2 md:grid-cols-4 gap-8" staggerDelay={0.1}>
                {stats.map((stat, index) => (
                  <AnimatedGridItem key={index}>
                    <div className="text-center">
                      <motion.div
                        className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <stat.icon className="h-7 w-7" />
                      </motion.div>
                      <div className="text-4xl font-bold mb-1">{stat.value}</div>
                      <div className="opacity-90 text-sm">{stat.label}</div>
                    </div>
                  </AnimatedGridItem>
                ))}
              </AnimatedGrid>
            </motion.div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <SectionHeader
              title="Questions fréquentes sur la sécurité"
              subtitle="Tout ce que vous devez savoir sur nos mesures de protection"
              icon={Users}
              iconVariant="primary"
            />
            <SEOFAQ faqs={faqItems} title="" />
          </section>

          {/* CTA */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button size="lg" className="px-8" onClick={() => navigate('/walkers')}>
              Trouver un promeneur vérifié
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Securite;
