type FacebookShareResponse = {
  error_message?: string;
} | undefined;

type ShareResult = {
  success: boolean;
  error?: string;
};

declare global {
  interface Window {
    FB: {
      init: (params: {
        appId: string;
        autoLogAppEvents: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      ui: (
        params: {
          method: 'share';
          href: string;
          quote?: string;
        },
        callback: (response: FacebookShareResponse) => void
      ) => void;
    };
  }
}

export const initFacebookSDK = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (window.FB) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v19.0'
      });
      resolve();
    };
    document.body.appendChild(script);
  });
};

export const shareOnFacebook = async (url: string, quote?: string): Promise<ShareResult> => {
  await initFacebookSDK();
  
  return new Promise<ShareResult>((resolve) => {
    window.FB.ui({
      method: 'share',
      href: url,
      quote: quote,
    }, (response: FacebookShareResponse) => {
      if (response && !response.error_message) {
        resolve({ success: true });
      } else {
        resolve({ 
          success: false,
          error: response?.error_message || 'Share was cancelled'
        });
      }
    });
  });
};