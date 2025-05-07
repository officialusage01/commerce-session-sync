
import { supabase } from './client';

// Demo product images
const demoProductImages = {
  electronics: [
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80'
  ],
  fashion: [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
  ],
  home: [
    'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  ],
  pets: [
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'
  ]
};

// Initialize database with demo data if empty
export const initializeDemoData = async () => {
  try {
    // Check if categories exist
    const { data: existingCategories, error: categoryError } = await supabase
      .from('categories')
      .select('*');
      
    if (categoryError) {
      console.error('Error checking categories:', categoryError);
      return;
    }
    
    if (existingCategories && existingCategories.length > 0) {
      console.log('Demo data already exists');
      return; // Data already exists
    }
    
    // Demo categories
    const demoCategories = [
      { id: 1, name: 'Electronics', icon: 'laptop' },
      { id: 2, name: 'Fashion', icon: 'shirt' },
      { id: 3, name: 'Home & Kitchen', icon: 'sofa' },
      { id: 4, name: 'Pets', icon: 'cat' },
    ];
    
    // Demo subcategories
    const demoSubcategories = [
      { id: 1, name: 'Laptops', category_id: 1, icon: 'laptop' },
      { id: 2, name: 'Smartphones', category_id: 1, icon: 'smartphone' },
      { id: 3, name: 'Accessories', category_id: 1, icon: 'headphones' },
      { id: 4, name: 'Men\'s Clothing', category_id: 2, icon: 'shirt' },
      { id: 5, name: 'Women\'s Clothing', category_id: 2, icon: 'dress' },
      { id: 6, name: 'Shoes', category_id: 2, icon: 'boot' },
      { id: 7, name: 'Furniture', category_id: 3, icon: 'sofa' },
      { id: 8, name: 'Kitchen', category_id: 3, icon: 'kitchen-pot' },
      { id: 9, name: 'Decor', category_id: 3, icon: 'lamp' },
      { id: 10, name: 'Cat Supplies', category_id: 4, icon: 'cat' },
      { id: 11, name: 'Dog Supplies', category_id: 4, icon: 'dog' },
      { id: 12, name: 'Pet Food', category_id: 4, icon: 'bowl-food' },
    ];
    
    // Demo products
    const demoProducts = [
      {
        id: 1,
        name: 'Ultrabook Pro',
        description: 'Powerful laptop with high-performance specs for work and gaming',
        price: 1299.99,
        subcategory_id: 1,
        stock: 15,
        images: demoProductImages.electronics.slice(0, 2)
      },
      {
        id: 2,
        name: 'Business Laptop',
        description: 'Lightweight laptop perfect for business professionals on the go',
        price: 899.99,
        subcategory_id: 1,
        stock: 8,
        images: demoProductImages.electronics.slice(1, 3)
      },
      {
        id: 3,
        name: 'SmartPhone X',
        description: 'Latest smartphone with advanced camera system and all-day battery life',
        price: 799.99,
        subcategory_id: 2,
        stock: 20,
        images: [demoProductImages.electronics[2], demoProductImages.electronics[0]]
      },
      {
        id: 4,
        name: 'Wireless Earbuds',
        description: 'Premium wireless earbuds with noise cancellation',
        price: 129.99,
        subcategory_id: 3,
        stock: 35,
        images: [demoProductImages.electronics[1], demoProductImages.electronics[2]]
      },
      {
        id: 5,
        name: 'Men\'s Casual Shirt',
        description: 'Comfortable cotton shirt for everyday wear',
        price: 39.99,
        subcategory_id: 4,
        stock: 50,
        images: [demoProductImages.fashion[0], demoProductImages.fashion[1]]
      },
      {
        id: 6,
        name: 'Women\'s Summer Dress',
        description: 'Elegant summer dress with floral pattern',
        price: 59.99,
        subcategory_id: 5,
        stock: 30,
        images: [demoProductImages.fashion[2], demoProductImages.fashion[0]]
      },
      {
        id: 7,
        name: 'Running Shoes',
        description: 'Lightweight running shoes with excellent support',
        price: 89.99,
        subcategory_id: 6,
        stock: 25,
        images: [demoProductImages.fashion[1], demoProductImages.fashion[2]]
      },
      {
        id: 8,
        name: 'Modern Sofa',
        description: 'Stylish and comfortable sofa for your living room',
        price: 599.99,
        subcategory_id: 7,
        stock: 5,
        images: [demoProductImages.home[0], demoProductImages.home[1]]
      },
      {
        id: 9,
        name: 'Kitchen Mixer',
        description: 'Professional kitchen mixer for baking enthusiasts',
        price: 249.99,
        subcategory_id: 8,
        stock: 12,
        images: [demoProductImages.home[2], demoProductImages.home[0]]
      },
      {
        id: 10,
        name: 'Decorative Lamp',
        description: 'Modern lamp to add style to any room',
        price: 79.99,
        subcategory_id: 9,
        stock: 18,
        images: [demoProductImages.home[1], demoProductImages.home[2]]
      },
      {
        id: 11,
        name: 'Cat Bed',
        description: 'Cozy bed for your feline friend',
        price: 49.99,
        subcategory_id: 10,
        stock: 22,
        images: [demoProductImages.pets[0], demoProductImages.pets[1]]
      },
      {
        id: 12,
        name: 'Dog Leash Set',
        description: 'Durable leash and collar set for dogs',
        price: 34.99,
        subcategory_id: 11,
        stock: 28,
        images: [demoProductImages.pets[1], demoProductImages.pets[2]]
      },
      {
        id: 13,
        name: 'Premium Pet Food',
        description: 'Nutritious food for healthy pets',
        price: 29.99,
        subcategory_id: 12,
        stock: 0,
        images: [demoProductImages.pets[2], demoProductImages.pets[0]]
      },
    ];
    
    // Insert demo data into Supabase
    try {
      const { error: catError } = await supabase.from('categories').insert(demoCategories);
      if (catError) throw catError;
      
      const { error: subError } = await supabase.from('subcategories').insert(demoSubcategories);
      if (subError) throw subError;
      
      const { error: prodError } = await supabase.from('products').insert(demoProducts);
      if (prodError) throw prodError;
      
      console.log('Demo data initialized successfully');
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
};
