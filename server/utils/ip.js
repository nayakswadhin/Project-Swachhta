import requestIp from 'request-ip';

// Enhanced IP detection with various header checks
export function getClientIp(req) {
  const ipHeaders = [
    'x-client-ip',
    'x-forwarded-for',
    'cf-connecting-ip', // Cloudflare
    'fastly-client-ip', // Fastly
    'x-real-ip', // Nginx
    'x-cluster-client-ip', // GCP
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ];

  // Check custom headers first
  for (const header of ipHeaders) {
    const value = req.headers[header];
    if (value) {
      // Get first IP if there are multiple
      const ip = value.split(',')[0].trim();
      if (ip) return ip;
    }
  }

  // Fallback to request-ip library
  return requestIp.getClientIp(req);
}

// Validate IP address format
export function isValidIp(ip) {
  if (!ip) return false;
  
  // IPv4 regex pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 regex pattern
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}