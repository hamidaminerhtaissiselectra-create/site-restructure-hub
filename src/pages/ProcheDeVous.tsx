import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/ui/seo-head";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, Dog, Shield, Camera, Star, Clock,
  CheckCircle, ArrowRight, Users, Navigation, Search, Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import localServicesImg from "@/assets/local-services.jpg";

const localFAQs = [
  {
    question: "Comment DogWalking trouve-t-il des promeneurs près de chez moi ?",
    answer: "Notre algorithme de géolocalisation identifie automatiquement les promeneurs et pet-sitters disponibles dans un rayon autour de votre adresse. Vous pouvez ajuster ce rayon selon vos préférences (1km, 3km, 5km, 10km). Plus le rayon est large, plus vous aurez de choix."
  },
  {
    question: "DogWalking est-il disponible dans ma ville ?",
    answer: "DogWalking est présent dans toute la France métropolitaine. Nous avons des promeneurs actifs dans les grandes villes (Paris, Lyon, Marseille, Bordeaux, Toulouse, Nantes, Lille...) mais aussi dans de nombreuses villes moyennes et zones rurales. Faites une recherche pour voir les promeneurs disponibles près de chez vous."
  },
  {
    question: "Puis-je choisir un promeneur qui connaît mon quartier ?",
    answer: "Absolument ! De nombreux promeneurs indiquent sur leur profil les quartiers qu'ils connaissent bien et les parcs où ils aiment promener. Vous pouvez filtrer par zone et lire les avis d'autres propriétaires du même secteur."
  },
  {
    question: "Y a-t-il des frais de déplacement pour le promeneur ?",
    answer: "Non, les tarifs affichés incluent le déplacement du promeneur jusqu'à votre domicile dans sa zone d'intervention habituelle. Si vous êtes en limite de zone, certains promeneurs peuvent demander un supplément, mais cela sera clairement indiqué avant la réservation."
  },
  {
    question: "Comment être sûr que le promeneur est bien de ma région ?",
    answer: "Chaque promeneur vérifié a fourni une preuve de domicile lors de son inscription. Leur zone d'intervention est validée par notre équipe. Vous pouvez également voir le nombre de promenades effectuées dans votre secteur sur leur profil."
  },
  {
    question: "DogWalking prévoit-il de s'étendre dans de nouvelles zones ?",
    answer: "Nous recrutons continuellement de nouveaux promeneurs dans toute la France. Si peu de promeneurs sont disponibles dans votre zone, inscrivez-vous à notre liste d'attente. Nous vous préviendrons dès qu'un professionnel sera actif près de chez vous."
  }
];

const majorCities = [
  { name: "Paris", promeneurs: 450, note: 4.9 },
  { name: "Lyon", promeneurs: 180, note: 4.8 },
  { name: "Marseille", promeneurs: 150, note: 4.7 },
  { name: "Bordeaux", promeneurs: 120, note: 4.9 },
  { name: "Toulouse", promeneurs: 110, note: 4.8 },
  { name: "Nantes", promeneurs: 95, note: 4.8 },
  { name: "Lille", promeneurs: 85, note: 4.7 },
  { name: "Nice", promeneurs: 75, note: 4.9 },
  { name: "Strasbourg", promeneurs: 70, note: 4.8 },
  { name: "Montpellier", promeneurs: 65, note: 4.8 },
  { name: "Rennes", promeneurs: 60, note: 4.7 },
  { name: "Grenoble", promeneurs: 55, note: 4.8 },
];

const ProcheDeVous = () => {
  const navigate = useNavigate();

  const localJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Services de Promenade et Garde de Chien Près de Chez Vous",
    "description": "Trouvez des promeneurs et pet-sitters professionnels vérifiés dans votre quartier. Service disponible partout en France avec preuves photo et assurance incluse.",
    "provider": {
      "@type": "Organization",
      "name": "DogWalking",
      "url": "https://dogwalking.fr"
    },
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "serviceType": ["Dog Walking", "Pet Sitting", "Dog Boarding"]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Promeneur de Chien Près de Chez Vous | Service Local | DogWalking"
        description="Trouvez un promeneur de chien ou pet-sitter vérifié dans votre quartier. Service disponible partout en France : Paris, Lyon, Marseille, Bordeaux et toutes les villes."
        keywords="promeneur chien près de moi, dog walker local, pet sitter quartier, promenade chien ville, garde chien proximité, dog walking france"
        canonicalUrl="https://dogwalking.fr/pres-de-vous"
        structuredData={localJsonLd}
        ogImage={localServicesImg}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <MapPin className="w-3 h-3 mr-1" />
                  Service de proximité
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Des Promeneurs de Chien <span className="text-primary">Près de Chez Vous</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  DogWalking met en relation propriétaires de chiens et promeneurs professionnels dans toute la France. 
                  Que vous habitiez en centre-ville ou en périphérie, trouvez un professionnel de confiance 
                  dans votre quartier en quelques clics.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={() => navigate("/walkers")}>
                    <Search className="mr-2 h-5 w-5" />
                    Trouver un promeneur
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/zones")}>
                    Voir toutes les zones
                  </Button>
                </div>
                <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>2 500+ promeneurs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Toute la France</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>4.8/5 moyenne</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={localServicesImg} 
                  alt="Carte de France avec des marqueurs de localisation représentant les promeneurs de chien disponibles" 
                  className="rounded-2xl shadow-2xl w-full object-cover aspect-square"
                />
                <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Navigation className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-2xl">500+</p>
                      <p className="text-sm text-muted-foreground">Villes couvertes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Villes principales */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                DogWalking dans les Grandes Villes Françaises
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Notre réseau de promeneurs professionnels couvre toutes les grandes métropoles 
                et continue de s'étendre chaque jour.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {majorCities.map((city) => (
                <Card 
                  key={city.name}
                  className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
                  onClick={() => navigate(`/walkers?city=${city.name.toLowerCase()}`)}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                    <p className="text-sm text-primary font-medium">{city.promeneurs} promeneurs</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{city.note}/5</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Votre ville n'est pas listée ? Nous avons probablement des promeneurs près de chez vous !
              </p>
              <Button variant="outline" onClick={() => navigate("/walkers")}>
                Rechercher dans ma zone
              </Button>
            </div>
          </div>
        </section>

        {/* Avantages du local */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Les Avantages d'un Promeneur de Votre Quartier
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choisir un promeneur local, c'est bénéficier d'un service de proximité 
                avec de nombreux avantages pratiques.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Disponibilité Rapide</h3>
                  <p className="text-muted-foreground">
                    Un promeneur proche peut intervenir rapidement, même en cas d'imprévu. 
                    Idéal pour les urgences ou les réservations de dernière minute.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Connaissance du Quartier</h3>
                  <p className="text-muted-foreground">
                    Le promeneur connaît les meilleurs parcs, les chemins sûrs et les coins 
                    préférés des chiens de votre secteur.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Relation de Confiance</h3>
                  <p className="text-muted-foreground">
                    Un promeneur régulier crée un lien avec votre chien. Il connaît ses habitudes, 
                    ses préférences et son caractère.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Dog className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Socialisation Locale</h3>
                  <p className="text-muted-foreground">
                    Votre chien peut rencontrer d'autres chiens du quartier, créant des amitiés 
                    durables et des habitudes de jeu régulières.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Flexibilité Horaire</h3>
                  <p className="text-muted-foreground">
                    Un promeneur proche peut s'adapter plus facilement à vos horaires 
                    et modifier les rendez-vous au besoin.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Avis de Voisins</h3>
                  <p className="text-muted-foreground">
                    Consultez les avis d'autres propriétaires de votre quartier. 
                    Ils ont les mêmes besoins et contraintes que vous.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comment Trouver un Promeneur Près de Chez Vous ?
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold mb-2">Entrez votre adresse</h3>
                <p className="text-sm text-muted-foreground">
                  Indiquez votre localisation pour voir les promeneurs disponibles autour de vous.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold mb-2">Comparez les profils</h3>
                <p className="text-sm text-muted-foreground">
                  Consultez les avis, tarifs et services de chaque promeneur de votre zone.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold mb-2">Réservez en ligne</h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez la date et l'heure, payez en toute sécurité via notre plateforme.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold mb-2">Suivez la promenade</h3>
                <p className="text-sm text-muted-foreground">
                  Recevez des photos et vidéos pendant et après chaque promenade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nos garanties */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Nos Garanties Partout en France
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Quel que soit votre lieu de résidence, vous bénéficiez des mêmes garanties 
                  de qualité et de sécurité sur toute la France.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Promeneurs Vérifiés Partout</h4>
                      <p className="text-muted-foreground">
                        Identité, casier judiciaire et assurance contrôlés pour chaque promeneur, 
                        quelle que soit sa localisation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Preuves Photo Obligatoires</h4>
                      <p className="text-muted-foreground">
                        Chaque promenade génère des preuves photo/vidéo obligatoires, 
                        garantie uniforme sur tout le territoire.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Paiement Sécurisé Escrow</h4>
                      <p className="text-muted-foreground">
                        Votre argent est protégé jusqu'à validation de la prestation. 
                        Même niveau de protection partout.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Assurance 2 Millions d'Euros</h4>
                      <p className="text-muted-foreground">
                        Couverture identique pour toutes les prestations, 
                        dans toutes les régions de France.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Support Client National</h4>
                      <p className="text-muted-foreground">
                        Notre équipe est disponible 7j/7 pour tous les utilisateurs, 
                        où qu'ils soient en France.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl border">
                <h3 className="text-2xl font-bold mb-6 text-center">Chiffres Clés DogWalking</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <p className="text-4xl font-bold text-primary">2 500+</p>
                    <p className="text-sm text-muted-foreground">Promeneurs actifs</p>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <p className="text-4xl font-bold text-primary">500+</p>
                    <p className="text-sm text-muted-foreground">Villes couvertes</p>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <p className="text-4xl font-bold text-primary">100 000+</p>
                    <p className="text-sm text-muted-foreground">Promenades réalisées</p>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <p className="text-4xl font-bold text-primary">4.8/5</p>
                    <p className="text-sm text-muted-foreground">Note moyenne</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button size="lg" onClick={() => navigate("/walkers")}>
                    Trouver mon promeneur
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <SEOFAQ 
          title="Questions sur le Service Local"
          subtitle="Tout savoir sur nos promeneurs de proximité"
          faqs={localFAQs}
          className="bg-muted/30"
        />

        {/* CTA Final */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trouvez Votre Promeneur de Quartier Dès Aujourd'hui
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Des milliers de promeneurs vérifiés vous attendent partout en France. 
              Faites le premier pas vers des promenades de qualité pour votre chien.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/walkers")}
              >
                <Search className="mr-2 h-5 w-5" />
                Rechercher près de moi
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => navigate("/walker/register")}
              >
                Devenir promeneur
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProcheDeVous;
