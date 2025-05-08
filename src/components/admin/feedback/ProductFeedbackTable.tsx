
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star } from 'lucide-react';
import { FeedbackItem } from './types';

interface ProductFeedbackTableProps {
  productFeedback: FeedbackItem[];
  setSelectedFeedback: (feedback: FeedbackItem) => void;
}

const ProductFeedbackTable: React.FC<ProductFeedbackTableProps> = ({ 
  productFeedback, 
  setSelectedFeedback 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Product</TableHead>
            <TableHead className="text-left">User ID</TableHead>
            <TableHead className="text-left">Rating</TableHead>
            <TableHead className="text-left">Tags</TableHead>
            <TableHead className="text-left">Date</TableHead>
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
              <TableCell>{item.user_id?.substring(0, 8) || 'Anonymous'}</TableCell>
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
  );
};

export default ProductFeedbackTable;
