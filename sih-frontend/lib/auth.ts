export type User = {
    id: string;
    name: string;
    email: string;
    area: string;
    postOffice: string;
    phoneno: number;
  };
  
  export type LoginCredentials = {
    id: string;
    password: string;
  };
  
  export type SignupCredentials = {
    name: string;
    id: string;
    email: string;
    password: string;
    area: string;
    postOffice: string;
    phoneno: number;
  };
  
  const API_URL = 'http://localhost:3000/user'; // Replace with your actual API URL
  
  export async function loginUser({ id, password }: LoginCredentials): Promise<User> {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
  
    const data = await response.json();
    return {
      id: data.userid,
      name: data.name,
      email: '',  // These will be populated if needed
      area: '',
      postOffice: '',
      phoneno: 0,
    };
  }
  
  export async function registerUser(credentials: SignupCredentials): Promise<void> {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
  }