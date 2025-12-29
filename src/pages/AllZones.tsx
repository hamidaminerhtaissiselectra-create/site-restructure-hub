import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { zones } from '@/data/localSeoData';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AllZones() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const priority1 = filteredZones.filter(z => z.priority === 1);
  const priority2 = filteredZones.filter(z => z.priority === 2);
  const priority3 = filteredZones.filter(z => z.priority === 3);
  const priority4 = filteredZones.filter(z => z.priority === 4);

  return (
    <>
      <Helmet>
        <title>Zones d'intervention | Promenade de Chien dans toute la France</title>
        <meta name="description" content="Trouvez un promeneur de chien près de chez vous. DogWalking Connect est présent à Paris, Lyon, Marseille, Bordeaux et dans toute la France." />
        <link rel="canonical" href="https://dogwalking-connect.fr/zones" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          {/* Hero */}
          <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
                <Link to="/" className="hover:text-foreground">Accueil</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Zones d'intervention</span>
              </nav>
              
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <MapPin className="w-4 h-4" />
                  {zones.length} zones couvertes
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Promenade de chien près de chez vous
                </h1>
                <p className="text-muted-foreground text-lg">
                  Trouvez un promeneur de chien vérifié dans votre ville ou votre quartier. 
                  DogWalking Connect couvre Paris, les grandes métropoles et leurs quartiers clés.
                </p>
              </div>

              {/* Search */}
              <div className="mt-8 max-w-md">
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

          {/* Zones Lists */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {/* Paris & Île-de-France */}
              {priority1.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    Paris & Île-de-France
                  </h2>
                  <p className="text-muted-foreground mb-6">Zone prioritaire - Couverture maximale avec tous les arrondissements</p>
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

              {/* Villes moyennes et quartiers clés */}
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

              {/* Autres villes et DOM-TOM */}
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

              {filteredZones.length === 0 && (
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

          {/* SEO Content */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto prose">
                <h2>Pourquoi choisir DogWalking Connect ?</h2>
                <p>
                  DogWalking Connect est la plateforme de référence pour trouver un promeneur 
                  ou gardien de chien de confiance près de chez vous. Présents dans toute la France, 
                  nous mettons en relation les propriétaires de chiens avec des professionnels vérifiés.
                </p>
                
                <h3>Notre couverture nationale</h3>
                <p>
                  De Paris aux grandes métropoles comme Lyon, Marseille, Bordeaux ou Toulouse, 
                  nos promeneurs sont disponibles 7j/7 pour s'occuper de votre compagnon. 
                  Nous couvrons également le Val-de-Marne (94) avec une attention particulière 
                  pour Vincennes, Saint-Mandé, Charenton et Nogent-sur-Marne.
                </p>
                
                <h3>Des services adaptés à vos besoins</h3>
                <ul>
                  <li><strong>Promenade quotidienne</strong> : de 30 minutes à 2 heures</li>
                  <li><strong>Garde à domicile</strong> : chez vous ou chez le pet-sitter</li>
                  <li><strong>Visite à domicile</strong> : pour nourrir et câliner votre chien</li>
                  <li><strong>Accompagnement vétérinaire</strong> : transport et présence</li>
                </ul>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
