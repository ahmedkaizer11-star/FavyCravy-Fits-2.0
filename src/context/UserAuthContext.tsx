import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { Order } from '../types';

export interface CustomerProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string;
  deliveryAddress?: string;
  district?: string;
  thanaArea?: string;
  stylePreferences?: string[];
  favoriteFit?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface UserAuthContextType {
  currentUser: User | null;
  customerProfile: CustomerProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<CustomerProfile>) => Promise<void>;
  fetchUserOrders: () => Promise<Order[]>;
  saveOrderToFirestore: (order: Order) => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync Customer Profile in Firestore
  const syncUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as CustomerProfile;
        setCustomerProfile(data);
      } else {
        const newProfile: CustomerProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, newProfile, { merge: true });
        setCustomerProfile(newProfile);
      }
    } catch (err) {
      console.warn('Firestore profile sync note:', err);
      // Fallback local memory profile
      setCustomerProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
      } else {
        setCustomerProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
        return result.user;
      }
      return null;
    } catch (error: any) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
      setCustomerProfile(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const updateProfileData = async (data: Partial<CustomerProfile>) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          ...data,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      setCustomerProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      console.error('Failed to update Firestore customer profile:', error);
      throw error;
    }
  };

  const saveOrderToFirestore = async (order: Order) => {
    try {
      const orderRef = doc(db, 'orders', order.id);
      await setDoc(orderRef, {
        ...order,
        userId: currentUser ? currentUser.uid : 'guest',
        userEmail: currentUser?.email || order.email || null,
        syncedAt: serverTimestamp()
      });
    } catch (error) {
      console.warn('Firestore order backup note:', error);
    }
  };

  const fetchUserOrders = async (): Promise<Order[]> => {
    if (!currentUser) return [];
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid)
      );
      const snap = await getDocs(q);
      const orders: Order[] = [];
      snap.forEach((docSnap) => {
        orders.push(docSnap.data() as Order);
      });
      return orders;
    } catch (err) {
      console.warn('Firestore orders fetch error:', err);
      return [];
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        currentUser,
        customerProfile,
        loading,
        signInWithGoogle,
        logout,
        updateProfileData,
        fetchUserOrders,
        saveOrderToFirestore
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}
