
import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import EnhancedIndex from "@/pages/EnhancedIndex";
import NotFound from "@/pages/NotFound";
import Search from "@/pages/Search";
import EnhancedSearch from "@/pages/EnhancedSearch";
import Admin from "@/pages/Admin";
import Category from "@/pages/Category";
import Cart from "@/pages/Cart";
import Contact from "@/pages/Contact";
import { Toaster as SonnerToaster } from "sonner";
import Login from "@/pages/Login";
import ProductDetailPage from "@/pages/product-detail";
import "./App.css";

function App() {
  const location = useLocation();
  const [useEnhancedUI, setUseEnhancedUI] = useState(() => {
    // Check if there's a stored preference
    const storedPreference = localStorage.getItem('useEnhancedUI');
    return storedPreference ? storedPreference === 'true' : true; // Default to enhanced UI
  });
  
  // Save preference when it changes
  useEffect(() => {
    localStorage.setItem('useEnhancedUI', useEnhancedUI.toString());
  }, [useEnhancedUI]);
  
  // Add UI toggle
  const toggleUI = () => {
    setUseEnhancedUI(prev => !prev);
  };
  
  return (
    <>
      <SonnerToaster position="top-right" />
      
      {/* UI Toggle Button */}
      <button 
        onClick={toggleUI}
        className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-primary/10"
        title={useEnhancedUI ? "Switch to classic UI" : "Switch to enhanced UI"}
      >
        {useEnhancedUI ? "⚙️ Classic UI" : "✨ Enhanced UI"}
      </button>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={useEnhancedUI ? <EnhancedIndex /> : <Index />} />
          <Route path="/search" element={useEnhancedUI ? <EnhancedSearch /> : <Search />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
