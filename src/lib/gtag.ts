// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ensureDataLayer = (): void => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

// Safe gtag function that checks if gtag exists
const safeGtag = (...args: unknown[]): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

export const pageview = (url: string): void => {
  if (typeof window !== 'undefined') {
    ensureDataLayer();
    safeGtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

interface EventParams {
  action: string;
  category: string;
  label: string;
  value?: number;
  [key: string]: unknown;
}

export const event = (params: EventParams): void => {
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    ensureDataLayer();
    safeGtag('event', params.action, {
      event_category: params.category,
      event_label: params.label,
      ...(params.value !== undefined && { value: params.value }),
      ...params,
    });
  }
};

export const initGA = (): void => {
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    ensureDataLayer();
    
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.gtag = function(...args: unknown[]) {
      (window.dataLayer || []).push(args);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID);
  }
};