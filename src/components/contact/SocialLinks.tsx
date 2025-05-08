import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Send,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com',
    color: 'bg-blue-600', // Changed to background color for better visibility
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com',
    color: 'bg-sky-500',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com',
    color: 'bg-pink-600',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com',
    color: 'bg-red-600',
  },
  {
    name: 'Telegram',
    icon: Send,
    url: 'https://t.me/yourusername',
    color: 'bg-blue-500',
  },
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    url: 'https://wa.me/1234567890',
    color: 'bg-green-500',
  },
];

const SocialLinks = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 p-6">
      {socialLinks.map((social, index) => (
        <motion.div
          key={social.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, damping: 10, stiffness: 100 }}
          className="flex justify-center items-center"
        >
          <Button
            variant="outline"
            size="lg"
            className={`w-full aspect-square text-white transition-transform duration-300 ease-in-out hover:scale-110 ${social.color}`}
            asChild
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${social.name}`}
              className="flex justify-center items-center h-full"
            >
              <social.icon className="h-8 w-8" />
            </a>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default SocialLinks;