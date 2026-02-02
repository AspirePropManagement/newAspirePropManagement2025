/**
 * Footer configuration for the application
 * Centralized configuration for footer content and behavior
 */

export interface FooterConfig {
  company: {
    name: string;
    tagline: string;
    description: string;
    logo: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  links: {
    quick: Array<{ label: string; href: string }>;
    services: Array<{ label: string; href: string }>;
    legal: Array<{ label: string; href: string }>;
  };
  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  hiddenPaths: string[];
}

export const footerConfig: FooterConfig = {
  company: {
    name: 'Aspire Prop Management',
    tagline: 'NO ONE TARGETS YOUR NEED BETTER',
    description: 'Your trusted partner in property management and real estate services. We provide comprehensive solutions for buyers, agents, and builders with cutting-edge technology and personalized service.',
    logo: '/logo.png'
  },
  contact: {
    email: 'aspireprop07@gmail.com',
    phone: '+91 92262 54182',
    address: 'Office No 1, Dreams Rachana, Shiv Nagar, Hadapsar, Pune, Maharashtra 411028'
  },
  social: {
    facebook: '#',
    twitter: '#',
    linkedin: '#',
    instagram: 'https://www.instagram.com/aspirepropmanagement?igsh=MWtya3gyb2t5NDV1cA=='
  },
  links: {
    quick: [
      { label: 'Home', href: '/' },
      { label: 'Properties', href: '/properties-listing' },
      { label: 'Buyer Dashboard', href: '/buyer' },
      { label: 'Agent Dashboard', href: '/agent' },
      { label: 'Builder Dashboard', href: '/builder' }
    ],
    services: [
      { label: 'Resale Properties', href: '/properties-listing?type=resale' },
      { label: 'Rental Properties', href: '/properties-listing?type=rental' },
      { label: 'New Projects', href: '/properties-listing?type=new_project' },
      { label: 'Property Management', href: '/dashboard' },
      { label: 'Account Settings', href: '/settings' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Sitemap', href: '/sitemap' }
    ]
  },
  newsletter: {
    enabled: true,
    title: 'Stay Updated',
    description: 'Subscribe to our newsletter for the latest property updates and market insights.',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe'
  },
  hiddenPaths: [
    '/auth',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ]
}
