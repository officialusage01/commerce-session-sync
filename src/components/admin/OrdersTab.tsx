
import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/supabase/orders';
import { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Search, Loader2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  
  const ordersPerPage = 10;
  
  useEffect(() => {
    fetchOrders();
  }, [currentPage]);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await getOrders(currentPage, ordersPerPage);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  
  const handleUpdateStatus = async (orderId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      const success = await updateOrderStatus(orderId, status);
      
      if (success) {
        // Update local state
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status } 
              : order
          )
        );
        
        // Update selected order if it's currently being viewed
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({...selectedOrder, status});
        }
        
        toast.success(`Order status updated to ${status}`);
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };
  
  // Filter orders based on search query
  const filteredOrders = searchQuery
    ? orders.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : orders;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <Card className="shadow-md border-slate-200">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-800">Orders</CardTitle>
            <CardDescription>Manage customer orders</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[280px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{formatDate(order.timestamp)}</TableCell>
                    <TableCell>
                      {order.customerName || 'Guest'}
                      {order.customerEmail && (
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      )}
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrder(order)}
                          className="h-8 w-8 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, 'pending')}
                              className="cursor-pointer"
                            >
                              Set as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, 'processing')}
                              className="cursor-pointer"
                            >
                              Set as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, 'completed')}
                              className="cursor-pointer"
                            >
                              Set as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                              className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-4">No orders found</p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
        
        {/* Pagination controls */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>Page {currentPage}</span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={orders.length < ordersPerPage}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Order ID:</h3>
                  <p>{selectedOrder.id}</p>
                </div>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Date:</h3>
                <p>{formatDate(selectedOrder.timestamp)}</p>
              </div>
              
              {(selectedOrder.customerName || selectedOrder.customerEmail || selectedOrder.customerPhone) && (
                <div>
                  <h3 className="font-semibold mb-2">Customer Information:</h3>
                  {selectedOrder.customerName && <p>Name: {selectedOrder.customerName}</p>}
                  {selectedOrder.customerEmail && <p>Email: {selectedOrder.customerEmail}</p>}
                  {selectedOrder.customerPhone && <p>Phone: {selectedOrder.customerPhone}</p>}
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">Order Items:</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Update Status:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedOrder.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : ''}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                  >
                    Pending
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedOrder.status === 'processing' ? 'bg-blue-50 border-blue-200' : ''}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                  >
                    Processing
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedOrder.status === 'completed' ? 'bg-green-50 border-green-200' : ''}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                  >
                    Completed
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedOrder.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-700' : 'text-red-500'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                  >
                    Cancel Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OrdersTab;
