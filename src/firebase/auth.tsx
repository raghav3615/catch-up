'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from './config';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithGithub: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error: any) {
      console.error('Error signing in with Google', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign in with Google' 
      };
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error: any) {
      console.error('Error signing in with GitHub', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign in with GitHub' 
      };
    }
  };
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('Error signing out', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign out' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      signInWithGithub,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
