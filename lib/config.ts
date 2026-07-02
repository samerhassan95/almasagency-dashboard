// Runtime configuration for API endpoints
// This is more reliable than NEXT_PUBLIC_ env vars which are baked at build time

export const config = {
  apiUrl: typeof window !== 'undefined' 
    ? (window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api'
        : 'https://almasagency.com/api')
    : (process.env.NEXT_PUBLIC_API_URL || 'https://almasagency.com/api'),
  
  apiKey: process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'almasa_secret_key_2025',
  
  // Helper to get full image URL
  getFullImageUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    return `https://almasagency.com${url}`;
  }
};
