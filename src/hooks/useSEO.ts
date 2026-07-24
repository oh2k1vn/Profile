import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export function useSEO({ title, description, keywords, ogImage }: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    const defaultTitle = 'Nguyễn Minh Hiếu | Middle Frontend & Mobile Developer Portfolio';
    if (title) {
      document.title = `${title} | Nguyễn Minh Hiếu`;
    } else {
      document.title = defaultTitle;
    }

    // 2. Helper to set or update meta tags
    const updateMetaTag = (selector: string, attribute: string, value?: string) => {
      if (!value) return;
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, value);
      }
    };

    // Update meta description
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="twitter:description"]', 'content', description);

    // Update title meta tags
    const fullTitle = title ? `${title} | Nguyễn Minh Hiếu` : defaultTitle;
    updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
    updateMetaTag('meta[property="twitter:title"]', 'content', fullTitle);

    // Update keywords
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'content', keywords);
    }

    // Update OG Image
    if (ogImage) {
      updateMetaTag('meta[property="og:image"]', 'content', ogImage);
      updateMetaTag('meta[property="twitter:image"]', 'content', ogImage);
    }
  }, [title, description, keywords, ogImage]);
}
