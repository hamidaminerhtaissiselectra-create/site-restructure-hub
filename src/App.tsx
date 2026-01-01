import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import Index from "./pages/Index";
import ServicePage from "./pages/ServicePage";
import Auth from "./pages/Auth";
import FindWalkers from "./pages/FindWalkers";
import BookingDetails from "./pages/BookingDetails";
import BookWalk from "./pages/BookWalk";
import WalkerRegister from "./pages/WalkerRegister";
import Tarifs from "./pages/Tarifs";
import Securite from "./pages/Securite";
import Messages from "./pages/Messages";
import Blog from "./pages/Blog";
import AdminDashboard from "./pages/AdminDashboard";
import Referral from "./pages/Referral";
import NotFound from "./pages/NotFound";
import LocalZone from "./pages/LocalZone";
import MentionsLegales from "./pages/MentionsLegales";
import CGU from "./pages/CGU";
import Confidentialite from "./pages/Confidentialite";
import WalkerProfile from "./pages/WalkerProfile";
import QuiSommesNous from "./pages/QuiSommesNous";
import DepartmentZone from "./pages/DepartmentZone";
import Contact from "./pages/Contact";
import ServicePromenade from "./pages/services/ServicePromenade";
import ServiceGarde from "./pages/services/ServiceGarde";
import ServiceVisite from "./pages/services/ServiceVisite";
import ServiceDogSitting from "./pages/services/ServiceDogSitting";
import ServicePetSitting from "./pages/services/ServicePetSitting";
import ServiceMarcheReguliere from "./pages/services/ServiceMarcheReguliere";
import BlogArticle from "./pages/BlogArticle";
// Nouvelles pages fusionnées
import ServicesLocaux from "./pages/ServicesLocaux";
import MonCompte from "./pages/MonCompte";
import EspacePromeneur from "./pages/EspacePromeneur";

const queryClient = new QueryClient();

// ScrollToTop component that scrolls to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            {/* Service Pillar Pages - 6 SEO Pillars */}
            <Route path="/services/promenade" element={<ServicePromenade />} />
            <Route path="/services/garde" element={<ServiceGarde />} />
            <Route path="/services/visite" element={<ServiceVisite />} />
            <Route path="/services/dog-sitting" element={<ServiceDogSitting />} />
            <Route path="/services/pet-sitting" element={<ServicePetSitting />} />
            <Route path="/services/marche-reguliere" element={<ServiceMarcheReguliere />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Pages fusionnées */}
            <Route path="/mon-compte" element={<MonCompte />} />
            <Route path="/espace-promeneur" element={<EspacePromeneur />} />
            <Route path="/services-locaux" element={<ServicesLocaux />} />
            
            {/* Redirections des anciennes routes */}
            <Route path="/dashboard" element={<Navigate to="/mon-compte" replace />} />
            <Route path="/profile" element={<Navigate to="/mon-compte?tab=profil" replace />} />
            <Route path="/dogs/add" element={<Navigate to="/mon-compte?tab=chiens" replace />} />
            <Route path="/bookings" element={<Navigate to="/mon-compte?tab=reservations" replace />} />
            <Route path="/walker/dashboard" element={<Navigate to="/espace-promeneur" replace />} />
            <Route path="/walker/earnings" element={<Navigate to="/espace-promeneur?tab=revenus" replace />} />
            <Route path="/pres-de-vous" element={<Navigate to="/services-locaux" replace />} />
            <Route path="/zones" element={<Navigate to="/services-locaux" replace />} />
            
            <Route path="/walkers" element={<FindWalkers />} />
            <Route path="/find-walkers" element={<FindWalkers />} />
            <Route path="/walker/:walkerId" element={<WalkerProfile />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/book/:walkerId" element={<BookWalk />} />
            <Route path="/walker/register" element={<WalkerRegister />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/securite" element={<Securite />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/referral" element={<Referral />} />
            {/* About & Regional SEO */}
            <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
            <Route path="/contact" element={<Contact />} />
            {/* Local SEO Pages */}
            <Route path="/zone/departement/:slug" element={<DepartmentZone />} />
            <Route path="/zone/:slug" element={<LocalZone />} />
            <Route path="/zone/:slug/:service" element={<LocalZone />} />
            {/* Legal Pages */}
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/cgu" element={<CGU />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
