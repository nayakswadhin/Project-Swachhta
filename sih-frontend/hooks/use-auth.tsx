"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface UserData {
  email: string;
  area: string;
  postOffice: string;
  phoneno: number;
  userId: string;
  userName: string;
  token: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
  staff?: UserData;
  token?: string;
}

interface LoginCredentials {
  id: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  id: string;
  password: string;
  email: string;
  phoneno: number;
  area: string;
  postOffice: string;
}

interface AuthContextType {
  user: UserData | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: SignupCredentials) => Promise<ApiResponse>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

interface StoredUserData {
  user: {
    email: string;
    phoneno: number;
    token: string;
    userId: string;
    userName: string;
    postOffice: string;
    area: string;
    longitude: number;
    latitude: number;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const saveToLocalStorage = (userData: UserData, token: string) => {
  const dataToStore: StoredUserData = {
    user: {
      email: userData.email,
      phoneno: userData.phoneno,
      token: token,
      userId: userData.userId,
      userName: userData.userName,
      postOffice: userData.postOffice,
      area: userData.area,
      longitude: userData.longitude,
      latitude: userData.latitude
    }
  };
  localStorage.setItem('userData', JSON.stringify(dataToStore));
};

const clearLocalStorage = () => {
  localStorage.removeItem('userData');
};

const loadFromLocalStorage = (): UserData | null => {
  const storedData = localStorage.getItem('userData');
  if (!storedData) return null;

  const parsedData: StoredUserData = JSON.parse(storedData);
  if (!parsedData.user) return null;

  return {
    email: parsedData.user.email,
    phoneno: parsedData.user.phoneno,
    token: parsedData.user.token,
    userId: parsedData.user.userId,
    userName: parsedData.user.userName,
    postOffice: parsedData.user.postOffice,
    area: parsedData.user.area
  };
};

export async function loginUser(credentials: LoginCredentials): Promise<ApiResponse> {
  const response = await fetch('http://localhost:3000/user/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export async function registerUser(credentials: SignupCredentials): Promise<ApiResponse> {
  const response = await fetch('http://localhost:3000/user/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  return {
    success: response.ok,
    message: data.message,
    ...(data.staff && { staff: data.staff }),
    ...(data.token && { token: data.token })
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = loadFromLocalStorage();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await loginUser(credentials);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      const userData = response.staff;
      if (userData && response.token) {
        saveToLocalStorage(userData, response.token);
        setUser(userData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: SignupCredentials): Promise<ApiResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await registerUser(credentials);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearLocalStorage();
  }, []);

  const contextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}