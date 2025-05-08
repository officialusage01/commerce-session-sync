
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import EnhancedIndex from "@/pages/EnhancedIndex";
import NotFound from "@/pages/NotFound";
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
  return (
    <>
      <SonnerToaster position="top-right" />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EnhancedIndex />} />
          <Route path="/search" element={<EnhancedSearch />} />
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
