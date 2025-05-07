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
    color: 'hover:bg-blue-600',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com',
    color: 'hover:bg-sky-500',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com',
    color: 'hover:bg-pink-600',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com',
    color: 'hover:bg-red-600',
  },
  {
    name: 'Telegram',
    icon: Send,
    url: 'https://t.me/yourusername',
    color: 'hover:bg-blue-500',
  },
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    url: 'https://wa.me/1234567890',
    color: 'hover:bg-green-500',
  },
];

const SocialLinks = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
      {socialLinks.map((social, index) => (
        <motion.div
          key={social.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="lg"
            className={`w-full h-full aspect-square ${social.color} hover:text-white transition-all duration-300 hover:scale-105`}
            asChild
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${social.name}`}
            >
              <social.icon className="h-6 w-6" />
            </a>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default SocialLinks;