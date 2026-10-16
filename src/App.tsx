import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { db, INITIAL_PRODUCTS, INITIAL_SETTINGS } from './lib/db';
import { Product, Review, SiteSettings } from './types/database';

import { Switch, Route } from 'wouter';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DocsPage } from './pages/DocsPage';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { ScrollProgress } from './components/ScrollProgress';

import { HeroSection } from './sections/HeroSection';
import { KineticBreak } from './sections/KineticBreak';
import { ServicesSection } from './sections/ServicesSection';
import { MinecraftMarketplace } from './components/products/MinecraftMarketplace';
import { PricingSection } from './sections/PricingSection';
import { Process } from './sections/Process';
import { AboutSection } from './sections/AboutSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { TechStackSection } from './sections/TechStackSection';
import { MinecraftFaqSection } from './sections/MinecraftFaqSection';
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

  const flagshipProduct = products[0] || INITIAL_PRODUCTS[0];

  return (
    <div className="min-h-screen bg-[#0B0E17] text-[#F8FAFC] relative selection:bg-[#00D2FF] selection:text-[#0B0E17] w-full max-w-[100vw] overflow-x-hidden">
      {/* Reading Progress */}
      <ScrollProgress />

      <Switch>
        <Route path="/docs/:section">
          {() => <DocsPage />}
        </Route>

        <Route path="/docs">
          {() => <DocsPage />}
        </Route>

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

                {/* 2. Minecraft Store & Marketplace */}
                <MinecraftMarketplace
                  onOpenHireUs={handleOpenHireUs}
                  products={products}
                  onOpenAdmin={() => setIsAdminOpen(true)}
                  isAdmin={isAdmin}
                />

                {/* 3. Core Studio Disciplines (What We Build & Deliver) */}
                <ServicesSection
                  onOpenHireUsWithCategory={handleOpenHireUs}
                />

                {/* 4. 20.0 TPS Performance & Technical Architecture */}
                <TechStackSection />

                {/* 5. How We Build & Deliver (Methodology) */}
                <Process
                  onOpenHireUs={() => handleOpenHireUs()}
                />

                {/* 6. Verified Customer Reviews */}
                <ReviewsSection
                  reviews={reviews}
                  onOpenAccount={() => setIsAccountOpen(true)}
                  onOpenHireUs={() => handleOpenHireUs()}
                />

                {/* 7. Frequently Asked Questions */}
                <MinecraftFaqSection
                  onOpenHireUs={() => handleOpenHireUs()}
                />

                {/* 8. Community & Discord Callout */}
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
