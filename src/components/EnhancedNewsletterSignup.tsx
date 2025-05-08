import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const EnhancedNewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== '') {
      // In a real application, you would send this to your backend
      console.log('Newsletter signup:', email);
      setSubmitted(true);
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-24 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-70"></div>
      <div className="absolute -bottom-32 -left-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl opacity-70"></div>
      
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
        whileInView={{ y: [50, 0], opacity: [0, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="bg-gradient-to-br from-primary to-secondary p-0.5">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[calc(1rem-2px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.div
                  className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Stay in touch</span>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold font-heading mb-4 gradient-text"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Subscribe to Our Newsletter
                </motion.h2>
                
                <motion.p 
                  className="text-muted-foreground mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  Get the latest updates, exclusive offers, and early access to new products and promotions.
                </motion.p>
                
                <motion.div
                  className="flex flex-col space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center">
                    <CheckCircle2 className="text-primary h-5 w-5 mr-2" />
                    <span className="text-sm">Exclusive promotions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="text-primary h-5 w-5 mr-2" />
                    <span className="text-sm">New product announcements</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="text-primary h-5 w-5 mr-2" />
                    <span className="text-sm">No spam, unsubscribe anytime</span>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-muted/50 p-6 rounded-xl">
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                          placeholder="yourname@example.com"
                          required
                        />
                      </div>
                      
                      <motion.button
                        type="submit"
                        className="w-full gradient-button text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center"
                        whileHover={{ 
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                      >
                        Subscribe Now
                        <motion.div
                          animate={{ x: isHovered ? 5 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.div>
                      </motion.button>
                      
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        By subscribing, you agree to our Privacy Policy and Terms of Service.
                      </p>
                    </form>
                  ) : (
                    <motion.div 
                      className="flex flex-col items-center justify-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="bg-primary/10 rounded-full p-3 mb-4"
                      >
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                      <p className="text-center text-muted-foreground">
                        You've been successfully subscribed to our newsletter.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedNewsletterSignup;