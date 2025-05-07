
import { useState, useEffect } from 'react';
import { Subcategory, getSubcategories } from '@/lib/supabase';

export const useSubcategories = (categoryId: string | undefined) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Fetch subcategories when the category ID changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        const subcategoriesData = await getSubcategories(categoryId);
        setSubcategories(subcategoriesData);
        
        // Select the first subcategory by default
        if (subcategoriesData.length > 0 && !selectedSubcategory) {
          setSelectedSubcategory(subcategoriesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubcategories();
  }, [categoryId, selectedSubcategory]);
  
  return {
    subcategories,
    selectedSubcategory,
    setSelectedSubcategory,
    loading
  };
};
