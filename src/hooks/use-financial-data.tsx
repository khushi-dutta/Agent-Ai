'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { financialData as initialData, FinancialData } from '@/lib/mcp-data';

interface FinancialDataContextType {
    financialData: FinancialData;
    setFinancialData: (data: FinancialData) => void;
    loading: boolean;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: ReactNode }) {
    const [financialData, setFinancialData] = useState<FinancialData>(initialData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('financialData');
            if (storedData) {
                setFinancialData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error("Failed to load financial data from storage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSetFinancialData = (data: FinancialData) => {
        setFinancialData(data);
        try {
            localStorage.setItem('financialData', JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save financial data to storage", error);
        }
    };

    const value = { financialData, setFinancialData: handleSetFinancialData, loading };

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
