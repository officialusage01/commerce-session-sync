import React from "react";
import { useOrder } from "@/lib/checkout/order-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle, ShoppingBag } from "lucide-react";
import "./OrderConfirmation.css"; // Import the CSS styles

interface OrderConfirmationProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  onClose,
  showCloseButton = true,
}) => {
  const { currentOrder, clearCurrentOrder } = useOrder();

  if (!currentOrder) {
    return null;
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      clearCurrentOrder();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="order-confirmation-card">
      <CardHeader className="order-confirmation-header">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <CardTitle className="text-green-800">Order Confirmed!</CardTitle>
            <CardDescription>Thank you for your purchase</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="order-details-label">Order ID</h4>
            <p className="order-details-value">{currentOrder.id}</p>
          </div>

          <div>
            <h4 className="order-details-label">Order Date</h4>
            <p className="order-details-value">{formatDate(currentOrder.timestamp)}</p>
          </div>

          <div>
            <h4 className="order-details-label">Items</h4>
            <div className="mt-2 space-y-2">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.productName} &times; {item.quantity}
                  </span>
                  <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="total-price-section">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${currentOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="order-status-message">
            <div className="flex items-start">
              <ShoppingBag className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div>
                <h4 className="font-medium text-blue-800">Order Status</h4>
                <p className="text-sm text-blue-700">
                  Your order details have been sent via WhatsApp. Please check your WhatsApp messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {showCloseButton && (
        <CardFooter className="justify-center border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderConfirmation;