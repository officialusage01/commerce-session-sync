
import { useState, useEffect } from 'react';
import { Category, Subcategory, Product, getCategories, getSubcategories, getProducts } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

export function useProductManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast: uiToast } = useToast();
  
  // Fetch categories on initial load
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      // Reset subcategories when no category is selected
      setSubcategories([]);
      setSelectedSubcategory(null);
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
      console.log('Fetching categories...');
      const categoriesData = await getCategories();
      console.log('Categories fetched:', categoriesData);
      setCategories(categoriesData);
      
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      } else {
        console.log('No categories found');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSubcategories = async (categoryId: string) => {
    setIsLoading(true);
    try {
      console.log(`Fetching subcategories for category ${categoryId}...`);
      const subcategoriesData = await getSubcategories(categoryId);
      console.log('Subcategories fetched:', subcategoriesData);
      setSubcategories(subcategoriesData);
      
      if (subcategoriesData.length > 0) {
        setSelectedSubcategory(subcategoriesData[0].id);
      } else {
        setSelectedSubcategory(null);
        console.log('No subcategories found for this category');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchProducts = async (subcategoryId: string) => {
    setIsLoading(true);
    try {
      console.log(`Fetching products for subcategory ${subcategoryId}...`);
      const productsData = await getProducts(subcategoryId);
      console.log('Products fetched:', productsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    console.log('Category changed to:', categoryId);
    setSelectedCategory(categoryId);
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    console.log('Subcategory changed to:', subcategoryId);
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
    refreshCategories: fetchCategories,
    refreshSubcategories: () => selectedCategory && fetchSubcategories(selectedCategory),
    refreshProducts: () => selectedSubcategory && fetchProducts(selectedSubcategory)
  };
}
