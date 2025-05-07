
import { useState, useEffect } from 'react';
import { Category, Subcategory, Product, getCategories, getSubcategories, getProducts } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useProductManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  
  // Fetch categories on initial load
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    }
  }, [selectedCategory]);
  
  // Fetch products when subcategory changes
  useEffect(() => {
    if (selectedSubcategory) {
      fetchProducts(selectedSubcategory);
    } else {
      setProducts([]);
    }
  }, [selectedSubcategory]);
  
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSubcategories = async (categoryId: string) => {
    setIsLoading(true);
    try {
      const subcategoriesData = await getSubcategories(categoryId);
      setSubcategories(subcategoriesData);
      
      if (subcategoriesData.length > 0) {
        setSelectedSubcategory(subcategoriesData[0].id);
      } else {
        setSelectedSubcategory(null);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subcategories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchProducts = async (subcategoryId: string) => {
    setIsLoading(true);
    try {
      const productsData = await getProducts(subcategoryId);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };
  
  return {
    categories,
    subcategories,
    products,
    selectedCategory,
    selectedSubcategory,
    isLoading,
    handleCategoryChange,
    handleSubcategoryChange,
    refreshProducts: () => selectedSubcategory && fetchProducts(selectedSubcategory)
  };
}
