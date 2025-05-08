import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCategories } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Enhanced Components
import EnhancedHeroSection from '@/components/EnhancedHeroSection';

// Original components (would be upgraded later)
import PromoSection from '@/components/PromoSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import TopSellingProducts from '@/components/TopSellingProducts';
import TestimonialsSection from '@/components/TestimonialsSection';
import CategoryShowcase from '@/components/CategoryShowcase';
import TopBrands from '@/components/TopBrands';
import EnhancedNewsletterSignup from '@/components/EnhancedNewsletterSignup';
import CategoriesBrowser from '@/components/CategoriesBrowser';

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const EnhancedIndex = () => {
  const { toast } = useToast();
  
  // Use React Query for data fetching
  const { data: categories, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Clear any existing cache before fetching new data
      localStorage.removeItem('categories');
      
      try {
        const categoriesData = await getCategories();
        return categoriesData;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    }
  });
  
  // Effect for visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Refreshing categories on visibility change');
        refetch();
      }
    };
    
    // Add route change detector
    const handleRouteChange = () => {
      console.log('Detected route change to home, refreshing categories');
      refetch();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [refetch]);
  
  // Show error notification
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories. Using local data if available.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  // Show empty state notification
  useEffect(() => {
    if (categories && categories.length === 0) {
      toast({
        title: "No categories found",
        description: "Admin can add categories from the dashboard",
      });
    }
  }, [categories, toast]);
  
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with enhanced design */}
      <EnhancedHeroSection />
      
      {/* Category Showcase with animation */}
      <motion.section
        className="py-20 bg-gradient-to-b from-background to-primary/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Popular Categories
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Browse through our most searched categories and find exactly what you need
            </motion.p>
          </div>
          <CategoryShowcase />
        </div>
      </motion.section>
      
      {/* Categories Browser with animation */}
      <motion.section
        className="py-16 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto">
          <CategoriesBrowser categories={categories} isLoading={isLoading} />
        </div>
      </motion.section>
      
      {/* Top Selling Products with animation */}
      <motion.section
        className="py-20 bg-gradient-to-t from-background to-primary/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Trending Now
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              See what other customers are loving right now
            </motion.p>
          </div>
          <TopSellingProducts />
        </div>
      </motion.section>
      
      {/* Promo Section with animation */}
      <motion.section
        className="py-20 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto">
          <PromoSection />
        </div>
      </motion.section>
      
      {/* Featured Products with animation */}
      <motion.section
        className="py-20 bg-gradient-to-b from-background to-primary/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Featured Collection
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Handpicked by our experts
            </motion.p>
          </div>
          <FeaturedProducts />
        </div>
      </motion.section>
      
      {/* Testimonials with animation */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What Our Customers Say
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Hear from people who have shopped with us
            </motion.p>
          </div>
          <TestimonialsSection />
        </div>
      </motion.section>
      
      {/* Top Brands with animation */}
      <motion.section
        className="py-20 bg-gradient-to-t from-background to-primary/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Trusted Brands
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              We partner with the best to bring you quality products
            </motion.p>
          </div>
          <TopBrands />
        </div>
      </motion.section>
      
      {/* Newsletter Signup with animation */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto">
          <EnhancedNewsletterSignup />
        </div>
      </motion.section>
    </div>
  );
};

export default EnhancedIndex;