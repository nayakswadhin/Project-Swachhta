interface LoginFormData {
    id: string;
    password: string;
  }
  
  interface SignupCredentials {
    name: string;
    id: string;
    email: string;
    password: string;
    area: string;
    postOffice: string;
    phoneno: number;
  }
  
  export const validateLoginForm = (data: LoginFormData) => {
    const errors: Record<string, string> = {};
  
    if (!data.id?.trim()) {
      errors.id = 'User ID is required';
    } else if (data.id.length < 1) {
      errors.id = 'User ID must be at least 3 characters long';
    }
  
    if (!data.password?.trim()) {
      errors.password = 'Password is required';
    } else if (data.password.length < 1) {
      errors.password = 'Password must be at least 6 characters long';
    }
  
    return errors;
  };
  
  export const validateRegistrationForm = (data: SignupCredentials) => {
    const errors: Record<string, string> = {};
  
    // Name validation
    if (!data.name?.trim()) {
      errors.name = 'Full name is required';
    } else if (data.name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
  
    // ID validation
    if (!data.id?.trim()) {
      errors.id = 'User ID is required';
    } else if (data.id.length < 1) {
      errors.id = 'User ID must be at least 3 characters long';
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  
    // Password validation
    if (!data.password?.trim()) {
      errors.password = 'Password is required';
    } else if (data.password.length < 1) {
      errors.password = 'Password must be at least 1 characters long';
     } //else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    //   errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    // }
  
    // Area validation
    if (!data.area?.trim()) {
      errors.area = 'Area is required';
    }
  
    // Post Office validation
    if (!data.postOffice?.trim()) {
      errors.postOffice = 'Post Office is required';
    }
  
    // Phone number validation
    if (!data.phoneno) {
      errors.phoneno = 'Phone number is required';
    } else if (data.phoneno.toString().length < 10) {
      errors.phoneno = 'Please enter a valid phone number';
    }
  
    return errors;
  };