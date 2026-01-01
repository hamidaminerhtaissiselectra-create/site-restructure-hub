import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/ui/seo-head";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Dog, Shield, Star, Clock,
  CheckCircle, Users, Navigation, Search, ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { zones } from '@/data/localSeoData';
import localServicesImg from "@/assets/local-services.jpg";

const localFAQs = [
  {
    question: "Comment DogWalking trouve-t-il des promeneurs près de chez moi ?",
    answer: "Notre algorithme de géolocalisation identifie automatiquement les promeneurs et pet-sitters disponibles dans un rayon autour de votre adresse. Vous pouvez ajuster ce rayon selon vos préférences (1km, 3km, 5km, 10km)."
  },
  {
    question: "DogWalking est-il disponible dans ma ville ?",
    answer: "DogWalking est présent dans toute la France métropolitaine. Nous avons des promeneurs actifs dans les grandes villes mais aussi dans de nombreuses villes moyennes et zones rurales."
  },
  {
    question: "Puis-je choisir un promeneur qui connaît mon quartier ?",
    answer: "Absolument ! De nombreux promeneurs indiquent sur leur profil les quartiers qu'ils connaissent bien et les parcs où ils aiment promener."
  },
  {
    question: "Y a-t-il des frais de déplacement pour le promeneur ?",
    answer: "Non, les tarifs affichés incluent le déplacement du promeneur jusqu'à votre domicile dans sa zone d'intervention habituelle."
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

const regions = [
  { 
    name: "Île-de-France", 
    description: "Paris et sa région : couverture maximale avec tous les arrondissements parisiens et villes limitrophes",
    zones: zones.filter(z => z.priority === 1).length,
    highlight: true
  },
  { 
    name: "Auvergne-Rhône-Alpes", 
    description: "Lyon, Grenoble, Saint-Étienne et les Alpes",
    zones: 12
  },
  { 
    name: "Provence-Alpes-Côte d'Azur", 
    description: "Marseille, Nice, Toulon et la Côte d'Azur",
    zones: 10
  },
  { 
    name: "Nouvelle-Aquitaine", 
    description: "Bordeaux, Toulouse et le Sud-Ouest",
    zones: 15
  },
  { 
    name: "Occitanie", 
    description: "Montpellier, Toulouse et le littoral méditerranéen",
    zones: 11
  },
  { 
    name: "Pays de la Loire & Bretagne", 
    description: "Nantes, Rennes et la côte Atlantique",
    zones: 13
  },
  { 
    name: "Hauts-de-France & Grand Est", 
    description: "Lille, Strasbourg et le Nord-Est",
    zones: 14
  },
];

const ServicesLocaux = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const priority1 = filteredZones.filter(z => z.priority === 1);
  const priority2 = filteredZones.filter(z => z.priority === 2);
  const priority3 = filteredZones.filter(z => z.priority === 3);
  const priority4 = filteredZones.filter(z => z.priority === 4);

  const localJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Services de Promenade et Garde de Chien Près de Chez Vous",
    "description": "Trouvez des promeneurs et pet-sitters professionnels vérifiés dans votre quartier. Service disponible partout en France.",
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
        title="Nos Services Près de Chez Vous | Promenade & Garde de Chien | DogWalking"
        description="Trouvez un promeneur de chien ou pet-sitter vérifié dans votre quartier. Service disponible partout en France : Paris, Lyon, Marseille, Bordeaux et toutes les villes."
        keywords="promeneur chien près de moi, dog walker local, pet sitter quartier, promenade chien ville, garde chien proximité"
        canonicalUrl="https://dogwalking.fr/services-locaux"
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
                <nav className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
                  <Link to="/" className="hover:text-foreground">Accueil</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-foreground">Nos services près de chez vous</span>
                </nav>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <MapPin className="w-3 h-3 mr-1" />
                  {zones.length} zones couvertes en France
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Nos Services <span className="text-primary">Près de Chez Vous</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  DogWalking met en relation propriétaires de chiens et promeneurs professionnels dans toute la France. 
                  Que vous habitiez en centre-ville ou en périphérie, trouvez un professionnel de confiance 
                  dans votre quartier.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={() => navigate("/walkers")}>
                    <Search className="mr-2 h-5 w-5" />
                    Trouver un promeneur
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

        {/* Search Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher une ville ou un quartier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Régions Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nos Régions d'Intervention
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cliquez sur une région pour découvrir les promeneurs disponibles près de chez vous
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {regions.map((region) => (
                <Card 
                  key={region.name}
                  className={`hover:shadow-lg transition-all cursor-pointer hover:border-primary/50 ${
                    region.highlight ? 'border-primary/30 bg-primary/5' : ''
                  }`}
                  onClick={() => setSearchQuery(region.name.split(' ')[0])}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg">{region.name}</h3>
                      {region.highlight && (
                        <Badge className="bg-primary text-primary-foreground">Top</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{region.description}</p>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      <MapPin className="h-4 w-4" />
                      <span>{region.zones} zones actives</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                Notre réseau de promeneurs professionnels couvre toutes les grandes métropoles.
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
          </div>
        </section>

        {/* Zones détaillées */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Paris & Île-de-France */}
            {priority1.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                  Paris & Île-de-France
                </h2>
                <p className="text-muted-foreground mb-6">Zone prioritaire - Couverture maximale</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {priority1.map((zone) => (
                    <Link key={zone.id} to={`/zone/${zone.slug}`}>
                      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                        <div className="relative h-28 md:h-32 overflow-hidden">
                          <img
                            src={zone.image}
                            alt={zone.altText}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white font-semibold text-sm">{zone.name}</p>
                            <p className="text-white/70 text-xs capitalize">{zone.type}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Grandes villes */}
            {priority2.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <span className="w-3 h-3 bg-secondary rounded-full"></span>
                  Grandes métropoles
                </h2>
                <p className="text-muted-foreground mb-6">Les principales villes françaises</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {priority2.map((zone) => (
                    <Link key={zone.id} to={`/zone/${zone.slug}`}>
                      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                        <div className="relative h-28 overflow-hidden">
                          <img
                            src={zone.image}
                            alt={zone.altText}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white font-semibold text-sm">{zone.name}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Villes moyennes */}
            {priority3.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <span className="w-3 h-3 bg-accent rounded-full"></span>
                  Villes moyennes & Quartiers parisiens
                </h2>
                <p className="text-muted-foreground mb-6">Couverture étendue dans toute la France</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {priority3.map((zone) => (
                    <Link key={zone.id} to={`/zone/${zone.slug}`}>
                      <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 h-full">
                        <div className="relative h-24 overflow-hidden">
                          <img
                            src={zone.image}
                            alt={zone.altText}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white font-medium text-sm truncate">{zone.name}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Autres villes */}
            {priority4.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <span className="w-3 h-3 bg-muted-foreground rounded-full"></span>
                  Préfectures, villes secondaires & DOM-TOM
                </h2>
                <p className="text-muted-foreground mb-6">Couverture nationale complète - {priority4.length} villes</p>
                <div className="flex flex-wrap gap-2">
                  {priority4.map((zone) => (
                    <Link 
                      key={zone.id} 
                      to={`/zone/${zone.slug}`}
                      className="px-3 py-1.5 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                    >
                      {zone.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredZones.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune zone trouvée pour "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:underline mt-2"
                >
                  Réinitialiser la recherche
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Avantages du local */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Les Avantages d'un Promeneur de Votre Quartier
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Clock, title: "Disponibilité Rapide", desc: "Un promeneur proche peut intervenir rapidement, même en cas d'imprévu." },
                { icon: MapPin, title: "Connaissance du Quartier", desc: "Le promeneur connaît les meilleurs parcs et les chemins sûrs de votre secteur." },
                { icon: Users, title: "Relation de Confiance", desc: "Un promeneur régulier crée un lien avec votre chien, connaît ses habitudes." },
                { icon: Dog, title: "Socialisation Locale", desc: "Votre chien peut rencontrer d'autres chiens du quartier." },
                { icon: Shield, title: "Avis de Voisins", desc: "Consultez les avis d'autres propriétaires de votre quartier." },
                { icon: CheckCircle, title: "Flexibilité Horaire", desc: "Un promeneur proche s'adapte plus facilement à vos horaires." },
              ].map((item, i) => (
                <Card key={i} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <SEOFAQ 
              faqs={localFAQs} 
              title="Questions fréquentes sur nos services locaux"
            />
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à trouver un promeneur près de chez vous ?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de propriétaires satisfaits dans toute la France
            </p>
            <Button size="lg" onClick={() => navigate("/walkers")}>
              <Search className="mr-2 h-5 w-5" />
              Trouver un promeneur maintenant
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesLocaux;
