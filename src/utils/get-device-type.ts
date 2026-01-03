export function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const ua = userAgent.toLowerCase();
  
    if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua)) {
      return 'mobile';
    }
  
    if (/ipad|android(?!.*mobile)/.test(ua)) {
      return 'tablet';
    }
  
    return 'desktop';
  }
  