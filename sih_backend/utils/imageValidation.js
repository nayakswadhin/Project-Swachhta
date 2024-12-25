const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const validateImage = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No image file provided');
    return errors;
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push('File size exceeds 5MB limit');
  }

  // Check file type
  const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validMimeTypes.includes(file.mimetype)) {
    errors.push('Invalid file type. Only JPG, JPEG, and PNG files are allowed');
  }

  return errors;
};

export { validateImage, MAX_FILE_SIZE };