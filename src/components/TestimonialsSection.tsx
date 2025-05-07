
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Regular Customer",
    content: "I've been shopping here for years and the quality is always excellent. The customer service team is responsive and helpful.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "New Customer",
    content: "Fast shipping and the product was exactly as described. Will definitely be shopping here again!",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Williams",
    role: "Verified Buyer",
    content: "Great prices and an amazing selection of products. The website is also very easy to navigate.",
    rating: 4
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                  <Quote className="text-purple-500 h-6 w-6" />
                </div>
                
                <p className="text-slate-600">{testimonial.content}</p>
                
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
