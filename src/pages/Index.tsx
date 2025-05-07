
import React, { useEffect } from 'react';
import { getCategories } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import HeroSection from '@/components/HeroSection';
import PromoSection from '@/components/PromoSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import TopSellingProducts from '@/components/TopSellingProducts';
import TestimonialsSection from '@/components/TestimonialsSection';
import CategoryShowcase from '@/components/CategoryShowcase';
import TopBrands from '@/components/TopBrands';
import NewsletterSignup from '@/components/NewsletterSignup';
import CategoriesBrowser from '@/components/CategoriesBrowser';

const Index = () => {
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
    <>
      <HeroSection />
      
      <CategoryShowcase />
      
      <CategoriesBrowser categories={categories} isLoading={isLoading} />
      
      <TopSellingProducts />
      
      <PromoSection />
      
      <FeaturedProducts />
      
      <TestimonialsSection />
      
      <TopBrands />
      
      <NewsletterSignup />
    </>
  );
};

export default Index;
