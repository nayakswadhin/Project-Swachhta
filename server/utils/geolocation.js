import axios from 'axios';

// Fallback coordinates when geolocation fails
const DEFAULT_COORDINATES = { latitude: "0", longitude: "0" };

// List of IP geolocation service providers with their configurations
const GEOLOCATION_PROVIDERS = [
  {
    name: 'ipinfo',
    url: (ip) => `https://ipinfo.io/${ip}`,
    params: { token: 'a293b4fa2f2e78' },
    parseResponse: (data) => {
      const { loc } = data;
      if (!loc) return DEFAULT_COORDINATES;
      const [latitude, longitude] = loc.split(",");
      return { latitude, longitude };
    }
  },
  {
    name: 'ipapi',
    url: (ip) => `https://ipapi.co/${ip}/json/`,
    parseResponse: (data) => ({
      latitude: data.latitude?.toString() || "0",
      longitude: data.longitude?.toString() || "0"
    })
  }
];

// Check if IP is local
const isLocalIP = (ip) => {
  return ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.");
};

// Try to get geolocation from a specific provider
async function tryProvider(provider, ip) {
  try {
    const response = await axios.get(provider.url(ip), {
      params: provider.params,
      timeout: 5000 // 5 second timeout
    });
    return provider.parseResponse(response.data);
  } catch (error) {
    console.error(`Error with ${provider.name}:`, error.message);
    return null;
  }
}

// Main geolocation function with fallback providers
export async function fetchGeolocation(ip) {
  try {
    // Return default coordinates for local IPs
    if (isLocalIP(ip)) {
      console.log("Local IP detected, using default coordinates");
      return DEFAULT_COORDINATES;
    }

    // Try each provider in sequence until one works
    for (const provider of GEOLOCATION_PROVIDERS) {
      const result = await tryProvider(provider, ip);
      if (result) {
        console.log(`Successfully retrieved location using ${provider.name}`);
        return result;
      }
    }

    // If all providers fail, return default coordinates
    console.warn("All geolocation providers failed, using default coordinates");
    return DEFAULT_COORDINATES;

  } catch (error) {
    console.error("Geolocation fetch error:", error);
    return DEFAULT_COORDINATES;
  }
}