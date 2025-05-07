
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Feedback, getFeedbackList } from '@/lib/supabase/feedback';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface FeedbackItem {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  feedback_tags: string[];
  message: string | null;
  created_at: string;
  product: {
    name: string;
  };
  user: {
    email: string;
  };
}

interface UserFeedback extends Feedback {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  rating?: number;
  created_at: string;
}

const FeedbackTab = () => {
  // Product feedback state
  const [productFeedback, setProductFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  
  // User feedback state
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);
  const [userFeedbackLoading, setUserFeedbackLoading] = useState(true);
  const [userFeedbackPage, setUserFeedbackPage] = useState(1);
  const [userFeedbackTotalPages, setUserFeedbackTotalPages] = useState(1);
  const [selectedUserFeedback, setSelectedUserFeedback] = useState<UserFeedback | null>(null);
  const [userFeedbackTotal, setUserFeedbackTotal] = useState(0);
  
  const itemsPerPage = 10;
  const [activeTab, setActiveTab] = useState("product");

  useEffect(() => {
    if (activeTab === "product") {
      loadProductFeedback();
    } else {
      loadUserFeedback();
    }
  }, [currentPage, userFeedbackPage, activeTab]);

  const loadProductFeedback = async () => {
    try {
      setLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from('product_feedbacks')
        .select('*', { count: 'exact', head: true });
      
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));

      // Get paginated feedback with product and user details
      const { data, error } = await supabase
        .from('product_feedbacks')
        .select(`
          *,
          product:products(name),
          user:users(email)
        `)
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductFeedback(data || []);
    } catch (error) {
      console.error('Error loading product feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserFeedback = async () => {
    try {
      setUserFeedbackLoading(true);
      
      // Use the new function to get paginated data and count
      const { data, count } = await getFeedbackList(userFeedbackPage, itemsPerPage);
      
      setUserFeedback(data);
      setUserFeedbackTotal(count);
      setUserFeedbackTotalPages(Math.ceil(count / itemsPerPage));
      
    } catch (error) {
      console.error('Error loading user feedback:', error);
    } finally {
      setUserFeedbackLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleProductPageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserFeedbackPageChange = (newPage: number) => {
    setUserFeedbackPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="product" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="product">Product Feedback</TabsTrigger>
            <TabsTrigger value="user">
              User Feedback
              {userFeedbackTotal > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {userFeedbackTotal}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="product">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productFeedback.map((item) => (
                        <TableRow
                          key={item.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedFeedback(item)}
                        >
                          <TableCell className="font-medium">
                            {item.product?.name}
                          </TableCell>
                          <TableCell>{item.user?.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Star
                                  key={rating}
                                  className={`h-4 w-4 ${
                                    item.rating >= rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.feedback_tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProductPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProductPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="user">
            {userFeedbackLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userFeedback.length > 0 ? (
                        userFeedback.map((item) => (
                          <TableRow
                            key={item.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedUserFeedback(item)}
                          >
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.subject || '—'}</TableCell>
                            <TableCell>
                              {item.rating ? (
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <Star
                                      key={rating}
                                      className={`h-4 w-4 ${
                                        item.rating && item.rating >= rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              ) : (
                                '—'
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(item.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <MessageSquare className="h-10 w-10 mb-2" />
                              <p>No user feedback found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {userFeedback.length > 0 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserFeedbackPageChange(userFeedbackPage - 1)}
                      disabled={userFeedbackPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {userFeedbackPage} of {userFeedbackTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserFeedbackPageChange(userFeedbackPage + 1)}
                      disabled={userFeedbackPage >= userFeedbackTotalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Product feedback details dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Product Feedback Details</DialogTitle>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {selectedFeedback && (
              <motion.div
                key={selectedFeedback.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Product</h4>
                      <p className="text-sm">{selectedFeedback.product?.name}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">User</h4>
                      <p className="text-sm">{selectedFeedback.user?.email}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Rating</h4>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`h-5 w-5 ${
                              selectedFeedback.rating >= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Feedback Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedFeedback.feedback_tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedFeedback.message && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Message</h4>
                        <div className="bg-muted p-3 rounded-md text-sm max-h-48 overflow-auto">
                          {selectedFeedback.message}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="font-medium">Date Submitted</h4>
                      <p className="text-sm">
                        {new Date(selectedFeedback.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* User feedback details dialog */}
      <Dialog open={!!selectedUserFeedback} onOpenChange={() => setSelectedUserFeedback(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Feedback Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedUserFeedback && new Date(selectedUserFeedback.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {selectedUserFeedback && (
              <motion.div
                key={selectedUserFeedback.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ScrollArea className="h-[50vh] pr-4">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">Contact Information</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Name</span>
                          <span>{selectedUserFeedback.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Email</span>
                          <span className="text-primary">{selectedUserFeedback.email}</span>
                        </div>
                      </div>
                    </div>
                    {selectedUserFeedback.subject && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Subject</h4>
                        <p className="font-medium">{selectedUserFeedback.subject}</p>
                      </div>
                    )}
                    {selectedUserFeedback.rating !== undefined && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Rating</h4>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Star
                              key={rating}
                              className={`h-5 w-5 ${
                                selectedUserFeedback.rating && selectedUserFeedback.rating >= rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">Message</h4>
                      <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
                        {selectedUserFeedback.message}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FeedbackTab;
