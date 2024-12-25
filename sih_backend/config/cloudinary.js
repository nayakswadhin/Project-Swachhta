import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'dzxgf75bh',
  api_key: process.env.API_KEY || '717325818898533',
  api_secret: process.env.API_SECRET || '2hZvtoosYUuThtDHKkeSPXYTC5M'
});

export default cloudinary;
