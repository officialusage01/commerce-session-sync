
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import UserPage from "@/pages/User";
import StockAnalysis from "@/pages/StockAnalysis";
import Performance from "@/pages/Performance";
import NotFound from "@/pages/NotFound";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "@/pages/Index";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Check if Supabase is initialized correctly before rendering the app
    const checkSupabase = async () => {
      try {
        // Simple ping to check if Supabase connection works
        await supabase.auth.getSession();
        console.log("Supabase connection established");
        setAppIsReady(true);
      } catch (error) {
        console.error("Failed to connect to Supabase:", error);
        // Set app ready anyway to avoid infinite loading, the errors will be handled per component
        setAppIsReady(true);
      }
    };

    checkSupabase();
  }, []);

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Navbar />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/index" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/performance" element={<Performance />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <AuthGuard requireAuth={true}>
                    <Dashboard />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AuthGuard requireAuth={true} requireAdmin={true}>
                    <Admin />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/user" 
                element={
                  <AuthGuard requireAuth={true}>
                    <UserPage />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/stock-analysis" 
                element={
                  <AuthGuard requireAuth={true} requireAdmin={true}>
                    <StockAnalysis />
                  </AuthGuard>
                } 
              />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
