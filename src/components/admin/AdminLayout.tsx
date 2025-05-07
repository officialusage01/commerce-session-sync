import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUser, signOut } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, Layers, Package, Grid, Home, MessageSquare } from 'lucide-react';
import ProductsTab from './ProductsTab';
import CategoriesTab from './CategoriesTab';
import SubcategoriesTab from './SubcategoriesTab';
import FeedbackTab from './FeedbackTab';

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);
      try {
        const { data, error } = await getCurrentUser();
        
        if (error || !data.user) {
          setIsAdmin(false);
          navigate('/login');
        } else {
          setIsAdmin(true);
          setUsername(data.user.email || 'Admin');
        }
      } catch (error) {
        console.error('Admin check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
          <p className="text-slate-200">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // This will redirect in the useEffect
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <p className="text-white/80 hidden md:block">{username}</p>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 space-x-2"
              onClick={() => navigate('/')}
            >
              <Home size={16} />
              <span className="hidden sm:inline">View Store</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 space-x-2"
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 w-full justify-start bg-white border border-slate-200 shadow-sm rounded-lg p-1 sticky top-[72px] z-20 backdrop-blur-sm bg-white/90">
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md"
            >
              <Package className="mr-2 h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="categories"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md"
            >
              <Layers className="mr-2 h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="subcategories"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md"
            >
              <Grid className="mr-2 h-4 w-4" />
              Subcategories
            </TabsTrigger>
            <TabsTrigger 
              value="feedback"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Feedback
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-0">
            <ProductsTab />
          </TabsContent>
          
          <TabsContent value="categories" className="mt-0">
            <CategoriesTab />
          </TabsContent>
          
          <TabsContent value="subcategories" className="mt-0">
            <SubcategoriesTab />
          </TabsContent>
          
          <TabsContent value="feedback" className="mt-0">
            <FeedbackTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminLayout;