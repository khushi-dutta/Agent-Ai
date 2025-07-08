'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { blankFinancialData, sampleFinancialData, FinancialData } from '@/lib/mcp-data';
import { useAuth } from './use-auth';

interface FinancialDataContextType {
    financialData: FinancialData;
    setFinancialData: (data: FinancialData) => void;
    loading: boolean;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

const DEMO_USER_EMAIL = 'john.doe@example.com';

export function FinancialDataProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            return;
        }

        let isMounted = true;
        setLoading(true);

        const loadData = async () => {
            try {
                if (user.email === DEMO_USER_EMAIL) {
                    if (isMounted) {
                        setFinancialData(sampleFinancialData);
                    }
                    return;
                }

                const docRef = doc(db, "financialData", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    if (isMounted) {
                        setFinancialData(docSnap.data() as FinancialData);
                    }
                } else {
                    const newUserData = JSON.parse(JSON.stringify(blankFinancialData));
                    newUserData.user.name = user.displayName || "New User";
                    newUserData.user.email = user.email || "";
                    
                    if (isMounted) {
                        await setDoc(docRef, newUserData);
                        setFinancialData(newUserData);
                    }
                }
            } catch (error) {
                console.error("Failed to load or initialize financial data from Firestore", error);
                if (isMounted) {
                    setFinancialData(blankFinancialData);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        loadData();

        return () => {
            isMounted = false;
        };

    }, [user]);

    const handleSetFinancialData = (data: FinancialData) => {
        // Optimistic update for UI responsiveness
        setFinancialData(data);
        
        if (user && user.email !== DEMO_USER_EMAIL) {
            const saveData = async () => {
                try {
                    const docRef = doc(db, "financialData", user.uid);
                    await setDoc(docRef, data);
                } catch (error) {
                    console.error("Failed to save financial data to Firestore", error);
                    // Optionally: revert optimistic update and show toast
                }
            };
            saveData();
        }
    };

    const value = { 
        financialData: financialData!, 
        setFinancialData: handleSetFinancialData, 
        loading: loading || !financialData 
    };

    return (
        <FinancialDataContext.Provider value={value}>
            {children}
        </FinancialDataContext.Provider>
    );
}

export function useFinancialData() {
    const context = useContext(FinancialDataContext);
    if (context === undefined) {
        throw new Error('useFinancialData must be used within a FinancialDataProvider');
    }
    return context;
}
