
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import ProductFeedbackTab from './ProductFeedbackTab';
import UserFeedbackTab from './UserFeedbackTab';
import { Feedback } from '@/lib/supabase/feedback';
import { FeedbackItem } from './types';
import FeedbackStats from './FeedbackStats';

const FeedbackTab = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("product");
  
  // Product feedback state
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [productFeedbackCount, setProductFeedbackCount] = useState(0);
  
  // User feedback state
  const [selectedUserFeedback, setSelectedUserFeedback] = useState<Feedback | null>(null);
  const [userFeedbackTotal, setUserFeedbackTotal] = useState(0);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Function to update product feedback count from ProductFeedbackTab
  const updateProductFeedbackCount = (count: number) => {
    setProductFeedbackCount(count);
  };

  // Function to update user feedback count from UserFeedbackTab
  const updateUserFeedbackCount = (count: number) => {
    setUserFeedbackTotal(count);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Feedback Management</CardTitle>
      </CardHeader>
      <CardContent>
        <FeedbackStats 
          productFeedbackCount={productFeedbackCount} 
          userFeedbackCount={userFeedbackTotal}
        />
        
        <Tabs defaultValue="product" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="product">
              Product Feedback
              {productFeedbackCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {productFeedbackCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="user">
              User Feedback
              {userFeedbackTotal > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {userFeedbackTotal}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="product" className="text-left">
            <ProductFeedbackTab 
              selectedFeedback={selectedFeedback}
              setSelectedFeedback={setSelectedFeedback}
              updateFeedbackCount={updateProductFeedbackCount}
            />
          </TabsContent>
          
          <TabsContent value="user" className="text-left">
            <UserFeedbackTab 
              selectedFeedback={selectedUserFeedback}
              setSelectedFeedback={setSelectedUserFeedback}
              updateTotal={updateUserFeedbackCount}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeedbackTab;
