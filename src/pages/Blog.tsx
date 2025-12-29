import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, ArrowRight, Search, Clock, Sparkles, BookOpen, Heart, TrendingUp } from 'lucide-react';
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";
import { AnimatedCard, AnimatedGrid, AnimatedGridItem } from "@/components/ui/animated-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { SectionHeader } from "@/components/ui/section-header";
import blogHero from "@/assets/pages/blog-hero.jpg";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const Blog = () => {
  const featuredArticle = {
    title: "Guide complet : Bien préparer son chien pour sa première promenade avec un professionnel",
    excerpt: "Découvrez toutes nos astuces et conseils pour que la première expérience de votre chien avec un promeneur professionnel soit une réussite totale. De la préparation psychologique à la communication avec le promeneur, nous vous guidons pas à pas pour une transition en douceur.",
    date: "28 Nov 2024",
    author: "Dr. Sophie Martin",
    category: "Guides",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=400&fit=crop"
  };

  const articles = [
    {
      title: "Comment choisir le bon promeneur pour votre chien",
      excerpt: "Découvrez nos conseils pour trouver le promeneur idéal qui correspondra parfaitement aux besoins spécifiques de votre compagnon...",
      date: "25 Nov 2024",
      author: "Marie L.",
      category: "Conseils",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop",
      color: "primary" as const
    },
    {
      title: "Les bienfaits des promenades quotidiennes sur la santé",
      excerpt: "Pourquoi les promenades régulières sont essentielles pour la santé physique et mentale de votre chien et comment optimiser chaque sortie...",
      date: "20 Nov 2024",
      author: "Thomas B.",
      category: "Santé",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=250&fit=crop",
      color: "accent" as const
    },
    {
      title: "Socialisation canine : les clés du succès",
      excerpt: "La socialisation est essentielle pour le développement harmonieux de votre chien. Voici comment la réussir à tout âge...",
      date: "15 Nov 2024",
      author: "Dr. Julie R.",
      category: "Éducation",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=250&fit=crop",
      color: "success" as const
    },
    {
      title: "Les signaux d'alerte à surveiller chez votre chien",
      excerpt: "Apprenez à reconnaître les signes qui indiquent que votre chien pourrait avoir un problème de santé nécessitant une attention...",
      date: "10 Nov 2024",
      author: "Dr. Pierre M.",
      category: "Santé",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=250&fit=crop",
      color: "warning" as const
    },
    {
      title: "Activités ludiques pour chiens énergiques",
      excerpt: "Des idées d'activités stimulantes pour les chiens qui ont besoin de dépenser beaucoup d'énergie au quotidien...",
      date: "5 Nov 2024",
      author: "Emma D.",
      category: "Activités",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop",
      color: "primary" as const
    },
    {
      title: "Nutrition canine : les bases à connaître",
      excerpt: "Tout ce que vous devez savoir sur l'alimentation équilibrée de votre chien pour le garder en bonne santé...",
      date: "1 Nov 2024",
      author: "Dr. Marc V.",
      category: "Nutrition",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=250&fit=crop",
      color: "accent" as const
    }
  ];

  const categories = [
    { name: "Tous", active: true },
    { name: "Conseils", active: false },
    { name: "Santé", active: false },
    { name: "Éducation", active: false },
    { name: "Activités", active: false },
    { name: "Nutrition", active: false },
    { name: "Guides", active: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog DogWalking | Conseils Chien, Santé Canine, Éducation et Bien-être"
        description="Découvrez nos articles d'experts sur la santé canine, l'éducation, la nutrition et le bien-être de votre chien. Astuces pratiques et conseils de professionnels vétérinaires."
        canonical="https://dogwalking.fr/blog"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section animée */}
          <motion.div 
            className="relative rounded-3xl overflow-hidden mb-12"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={blogHero} 
              alt="Blog DogWalking - Conseils et articles sur les chiens" 
              className="w-full h-56 md:h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <AnimatedIcon icon={BookOpen} size="lg" variant="primary" className="mx-auto mb-4" float />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Blog DogWalking
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Conseils d'experts vétérinaires, astuces pratiques et actualités pour le bien-être de votre chien
              </motion.p>
            </div>
          </motion.div>

          {/* Contenu SEO enrichi */}
          <motion.div 
            className="max-w-4xl mx-auto mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Bienvenue sur le blog DogWalking, votre source d'information fiable pour tout ce qui concerne 
              le bien-être canin. Nos articles sont rédigés par des vétérinaires, éducateurs canins et 
              professionnels du comportement animal. Que vous cherchiez des conseils sur la nutrition, 
              l'éducation, la santé ou simplement des idées d'activités, vous trouverez ici des ressources 
              de qualité pour prendre soin de votre compagnon à quatre pattes.
            </p>
          </motion.div>

          {/* Search and filters animés */}
          <motion.div 
            className="flex flex-col md:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Rechercher un article..." className="pl-12 h-12 rounded-xl" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.div key={category.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant={category.active ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                  >
                    {category.name}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Article à la une animé */}
          <AnimatedCard className="mb-12 overflow-hidden" glow>
            <div className="grid md:grid-cols-2">
              <motion.div 
                className="h-64 md:h-auto overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary/10 text-primary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    À la une
                  </Badge>
                  <Badge variant="outline">{featuredArticle.category}</Badge>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground mb-6">{featuredArticle.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    {featuredArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4 text-accent" />
                    {featuredArticle.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {featuredArticle.readTime}
                  </span>
                </div>
                <Button className="w-fit">
                  Lire l'article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </AnimatedCard>

          {/* Section titre articles */}
          <SectionHeader
            title="Nos derniers articles"
            subtitle="Conseils, guides et actualités pour le bien-être de votre compagnon"
            icon={TrendingUp}
            iconVariant="accent"
          />

          {/* Articles grid avec animations */}
          <AnimatedGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
            {articles.map((article, index) => (
              <AnimatedGridItem key={index}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer h-full border-2 hover:border-primary/30">
                    <div className="relative h-48 overflow-hidden">
                      <motion.img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <Badge className="absolute top-4 left-4 bg-card/90 backdrop-blur">{article.category}</Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedGridItem>
            ))}
          </AnimatedGrid>

          {/* Load more */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Charger plus d'articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Newsletter améliorée */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mt-16 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <AnimatedIcon icon={Heart} size="xl" variant="primary" float />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Restez informé</h3>
                    <p className="text-muted-foreground mb-6">
                      Recevez nos meilleurs conseils, guides exclusifs et actualités directement dans votre boîte mail. 
                      Rejoignez +10 000 propriétaires de chiens passionnés !
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
                      <Input placeholder="Votre email" type="email" className="flex-1 h-12 rounded-xl" />
                      <Button size="lg" className="rounded-xl">
                        S'abonner
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Blog;
