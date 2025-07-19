'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // TODO: Firebase Auth - Listen to auth state changes
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     setAuthState({
    //       user: mapFirebaseUserToUser(user),
    //       loading: false,
    //       isAuthenticated: true,
    //     });
    //   } else {
    //     setAuthState({
    //       user: null,
    //       loading: false,
    //       isAuthenticated: false,
    //     });
    //   }
    // });

    // Simulate auth check
    const savedUser = localStorage.getItem('rx-user');
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        loading: false,
        isAuthenticated: true,
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      // TODO: Firebase Auth - Sign in with email and password
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;

      // Mock login for now
      const mockUser: User = {
        id: '1',
        name: 'Usuario Mock',
        email: email,
        phone: '',
        createdAt: new Date(),
      };

      localStorage.setItem('rx-user', JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        loading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      // TODO: Firebase Auth - Create user with email and password
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;

      // TODO: Firestore - Save additional user data
      // await setDoc(doc(db, 'users', user.uid), {
      //   name,
      //   email,
      //   phone,
      //   createdAt: serverTimestamp(),
      // });

      // Mock registration for now
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        phone: phone,
        createdAt: new Date(),
      };

      localStorage.setItem('rx-user', JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        loading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  };

  const logout = () => {
    // TODO: Firebase Auth - Sign out
    // signOut(auth);

    localStorage.removeItem('rx-user');
    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
    });
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!authState.user) throw new Error('Usuário não autenticado');

    try {
      // TODO: Firestore - Update user document
      // await updateDoc(doc(db, 'users', authState.user.id), data);

      const updatedUser = { ...authState.user, ...data };
      localStorage.setItem('rx-user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      throw new Error('Erro ao atualizar perfil.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        loading: authState.loading,
        isAuthenticated: authState.isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
