import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AuthProvider, useAuth } from './context/AuthContext';
import { db, INITIAL_PRODUCTS, INITIAL_SETTINGS } from './lib/db';
import { Product, Review, SiteSettings } from './types/database';

import { Switch, Route } from 'wouter';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { OpeningExperience } from './components/OpeningExperience';

import { HeroSection } from './sections/HeroSection';
import { KineticBreak } from './sections/KineticBreak';
import { ServicesSection } from './sections/ServicesSection';
import { ProductShowcase } from './components/products/ProductShowcase';
import { PricingSection } from './sections/PricingSection';
import { Process } from './sections/Process';
import { AboutSection } from './sections/AboutSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { ContactFinale } from './sections/ContactFinale';
import { Footer } from './sections/Footer';

import { HireUsModal } from './components/tickets/HireUsModal';
import { CustomerAccountModal } from './components/account/CustomerAccountModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { AuthModal } from './components/auth/AuthModal';

const MainExperience: React.FC = () => {
  const { user, isAdmin } = useAuth();

  // Modals state
  const [isHireUsOpen, setIsHireUsOpen] = useState(false);
  const [hireUsCategory, setHireUsCategory] = useState<string>('Custom Plugin Development');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Data state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  const handleOpenHireUs = (category?: string) => {
    if (category) {
      setHireUsCategory(category);
    }
    setIsHireUsOpen(true);
  };

  // Load live data
  const refreshSiteData = async () => {
    try {
      const [prods, revs, sets] = await Promise.all([
        db.getProducts(),
        db.getReviews(),
        db.getSettings(),
      ]);
      if (prods && prods.length > 0) setProducts(prods);
      if (revs) setReviews(revs);
      if (sets) setSettings(sets);
    } catch (err) {
      console.warn('Failed to refresh site data:', err);
    }
  };

  useEffect(() => {
    refreshSiteData();
    const handleSync = () => refreshSiteData();
    window.addEventListener('flix_product_updated', handleSync);
    return () => window.removeEventListener('flix_product_updated', handleSync);
  }, []);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const flagshipProduct = products[0] || INITIAL_PRODUCTS[0];

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F4F3EE] relative selection:bg-[#D7FF3F] selection:text-[#08090B] w-full max-w-[100vw] overflow-x-hidden">
      {/* Visual Cursor & Reading Progress */}
      <CustomCursor />
      <ScrollProgress />

      {/* Opening Intro Sequence */}
      {showIntro && <OpeningExperience onComplete={() => setShowIntro(false)} />}

      <Switch>
        <Route path="/products/:slug">
          {() => (
            <>
              <ProductDetailPage
                onOpenHireUs={handleOpenHireUs}
                onOpenAccount={() => setIsAccountOpen(true)}
                isAdmin={isAdmin}
                onOpenAdmin={() => setIsAdminOpen(true)}
              />
              <Footer
                settings={settings}
                onOpenHireUs={() => handleOpenHireUs()}
                onOpenAccount={() => setIsAccountOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                isAdmin={isAdmin}
              />
            </>
          )}
        </Route>

        <Route path="/products">
          {() => (
            <>
              <ProductsPage
                onOpenHireUs={handleOpenHireUs}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenAccount={() => setIsAccountOpen(true)}
                isAdmin={isAdmin}
              />
              <Footer
                settings={settings}
                onOpenHireUs={() => handleOpenHireUs()}
                onOpenAccount={() => setIsAccountOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                isAdmin={isAdmin}
              />
            </>
          )}
        </Route>

        <Route>
          {() => (
            <>
              {/* Sticky Top Navigation */}
              <Navbar
                onOpenHireUs={() => handleOpenHireUs()}
                onOpenAccount={() => setIsAccountOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              />

              {/* Mobile Drawer Menu */}
              <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onOpenHireUs={() => handleOpenHireUs()}
                onOpenAccount={() => setIsAccountOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                companyEmail={settings.company_email}
              />

              {/* Main Experience Stream */}
              <main id="main-content">
                {/* 1. Hero Section */}
                <HeroSection
                  onOpenHireUs={() => handleOpenHireUs('Custom Plugin Development')}
                  headlineOverride={settings.headline_override}
                  subheadlineOverride={settings.subheadline_override}
                  ctaPrimaryOverride={settings.cta_primary_override}
                />

                {/* 2. Kinetic Visual Typographic Break */}
                <KineticBreak />

                {/* 3. Three Core Services */}
                <ServicesSection
                  onOpenHireUsWithCategory={handleOpenHireUs}
                  servicesContent={settings.services_content}
                />

                {/* 4. Flagship Product Showcase (FlixCore Plugin) */}
                <ProductShowcase
                  product={flagshipProduct}
                  reviews={reviews}
                  onOpenHireUs={() => handleOpenHireUs('Custom Plugin Development')}
                  isAdmin={isAdmin}
                  onOpenAdmin={() => setIsAdminOpen(true)}
                />

                {/* 5. Transparent Pricing & Scope */}
                <PricingSection
                  plans={settings.pricing_plans}
                  introOverride={settings.pricing_intro_override}
                  onOpenHireUsWithCategory={handleOpenHireUs}
                />

                {/* 6. Six-Stage Disciplined Engineering Workflow */}
                <Process
                  onOpenHireUs={() => handleOpenHireUs()}
                  stages={settings.process_stages}
                />

                {/* 7. About FlixCore Studios */}
                <AboutSection
                  onOpenHireUs={() => handleOpenHireUs()}
                  paragraphs={settings.about_paragraphs}
                  pillars={settings.about_pillars}
                />

                {/* 8. Verified Customer Reviews */}
                <ReviewsSection
                  reviews={reviews}
                  onOpenAccount={() => setIsAccountOpen(true)}
                  onOpenHireUs={() => handleOpenHireUs()}
                />

                {/* 9. Contact Finale */}
                <ContactFinale
                  onOpenHireUs={() => handleOpenHireUs()}
                  onOpenAccount={() => setIsAccountOpen(true)}
                  companyEmail={settings.company_email}
                />
              </main>

              {/* 10. Studio Footer */}
              <Footer
                settings={settings}
                onOpenHireUs={() => handleOpenHireUs()}
                onOpenAccount={() => setIsAccountOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                isAdmin={isAdmin}
              />
            </>
          )}
        </Route>
      </Switch>

      {/* Modals & Portals */}
      <HireUsModal
        isOpen={isHireUsOpen}
        onClose={() => setIsHireUsOpen(false)}
        onTicketCreated={() => refreshSiteData()}
        initialCategory={hireUsCategory}
      />

      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenHireUs={() => handleOpenHireUs()}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          refreshSiteData();
        }}
      />

      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainExperience />
    </AuthProvider>
  );
};

export default App;
