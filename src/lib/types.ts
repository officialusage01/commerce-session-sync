
export type UserRole = 'admin' | 'non-admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}
