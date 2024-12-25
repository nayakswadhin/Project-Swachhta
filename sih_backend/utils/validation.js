/**
 * Validates image URL format
 * @param {string} url - The image URL to validate
 * @returns {boolean} - True if URL is valid, false otherwise
 */
export const isValidImageUrl = (url) => {
    try {
      const urlObject = new URL(url);
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      return validExtensions.some(ext => urlObject.pathname.toLowerCase().endsWith(ext));
    } catch {
      return false;
    }
  };