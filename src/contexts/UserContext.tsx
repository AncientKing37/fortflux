import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  updateUser: (updatedUser: User) => void;
  becomeASeller: () => Promise<boolean>;
  loginAsRole: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  assignRole: (userId: string, role: UserRole) => Promise<boolean>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => ({ success: false }),
  updateProfile: async () => false,
  updateUser: () => {},
  becomeASeller: async () => false,
  loginAsRole: async () => ({ success: false }),
  assignRole: async () => false
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        avatar: data.avatar_url,
        balance: data.balance || 0,
        description: data.description,
        vouch_count: data.vouch_count || 0,
        wallet_address: data.wallet_address,
        ltc_wallet_address: data.ltc_wallet_address,
        preferred_crypto: data.preferred_crypto,
        favorite_listings: data.favorite_listings || [],
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUser(profile);
          setLoading(false);
          return { success: true };
        }
      }

      setLoading(false);
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Error logging in:', error);
      setLoading(false);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const loginAsRole = async (email: string, password: string, role: UserRole) => {
    try {
      const { success, error } = await login(email, password);
      
      if (!success) {
        return { success: false, error };
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id || '')
        .single();
      
      if (profile?.role !== role) {
        await logout();
        return { success: false, error: `You must have ${role} privileges to access this area` };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error with role login:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Error registering:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          email: updates.email,
          description: updates.description,
          avatar_url: updates.avatar,
          wallet_address: updates.wallet_address,
          ltc_wallet_address: updates.ltc_wallet_address,
          preferred_crypto: updates.preferred_crypto,
        })
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = await fetchUserProfile(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  const becomeASeller = async () => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'seller' })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({
        ...user,
        role: 'seller'
      });
      
      return true;
    } catch (error) {
      console.error('Error becoming a seller:', error);
      return false;
    }
  };

  const assignRole = async (userId: string, role: UserRole) => {
    if (!user || user.role !== 'admin') return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{ 
        user, 
        loading,
        login, 
        logout, 
        register, 
        updateProfile,
        updateUser,
        becomeASeller,
        loginAsRole,
        assignRole
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
