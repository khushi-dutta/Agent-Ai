'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    signUpWithEmail: (email:string, password:string) => Promise<any>;
    signInWithEmail: (email:string, password:string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
            if (user) {
                router.push('/dashboard');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            console.error("Error signing up with email and password", error);
            throw error;
        }
    }

    const signInWithEmail = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            console.error("Error signing in with email and password", error);
            throw error;
        }
    }

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            router.push('/login');
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const value = { user, loading, signInWithGoogle, signOut, signUpWithEmail, signInWithEmail };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
