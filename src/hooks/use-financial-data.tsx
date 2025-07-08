'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

        const loadData = () => {
            try {
                if (user.email === DEMO_USER_EMAIL) {
                    if (isMounted) {
                        setFinancialData(sampleFinancialData);
                    }
                    return;
                }

                const storedDataKey = `financialData_${user.uid}`;
                const storedData = localStorage.getItem(storedDataKey);
                
                if (storedData) {
                    if (isMounted) {
                        setFinancialData(JSON.parse(storedData));
                    }
                } else {
                    const newUserData = JSON.parse(JSON.stringify(blankFinancialData));
                    newUserData.user.name = user.displayName || "New User";
                    newUserData.user.email = user.email || "";
                    
                    if (isMounted) {
                        setFinancialData(newUserData);
                        localStorage.setItem(storedDataKey, JSON.stringify(newUserData));
                    }
                }
            } catch (error) {
                console.error("Failed to load or initialize financial data", error);
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
        setFinancialData(data);
        
        if (user && user.email !== DEMO_USER_EMAIL) {
            try {
                const storedDataKey = `financialData_${user.uid}`;
                localStorage.setItem(storedDataKey, JSON.stringify(data));
            } catch (error) {
                console.error("Failed to save financial data to storage", error);
            }
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
