
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeedbackList, Feedback } from '@/lib/supabase/feedback';
import { UserFeedbackTabProps } from './types';
import UserFeedbackDialog from './UserFeedbackDialog';

const UserFeedbackTab = ({ selectedFeedback, setSelectedFeedback, updateTotal }: UserFeedbackTabProps) => {
  const [userFeedback, setUserFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadUserFeedback();
  }, [page]);

  const loadUserFeedback = async () => {
    try {
      setLoading(true);
      
      // Use the new function to get paginated data and count
      const { data, count } = await getFeedbackList(page, itemsPerPage);
      
      setUserFeedback(data);
      
      // Immediately update the total count in parent component
      if (updateTotal) {
        updateTotal(count);
      }
      
      setTotalPages(Math.ceil(count / itemsPerPage));
      
    } catch (error) {
      console.error('Error loading user feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
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
                      onClick={() => setSelectedFeedback(item)}
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
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <UserFeedbackDialog
        selectedFeedback={selectedFeedback}
        setSelectedFeedback={setSelectedFeedback}
      />
    </>
  );
};

export default UserFeedbackTab;
