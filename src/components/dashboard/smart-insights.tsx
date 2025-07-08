'use client';
import { useState, useEffect } from 'react';
import { generateFinancialInsights, Insight } from '@/ai/flows/generate-financial-insights';
import type { FinancialData } from '@/lib/mcp-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { InsightCard } from './insight-card';

interface SmartInsightsProps {
    financialData: FinancialData;
}

export default function SmartInsights({ financialData }: SmartInsightsProps) {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await generateFinancialInsights({
                    financialData: JSON.stringify(financialData),
                });
                setInsights(result.insights);
            } catch (e) {
                console.error("Failed to generate financial insights:", e);
                setError("Sorry, I couldn't generate insights at this moment. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, [financialData]);

    const renderSkeletons = () => (
        Array.from({ length: 4 }).map((_, index) => (
             <div key={index} className="p-4 border rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-1/2" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-1/3" />
                </div>
            </div>
        ))
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-headline font-bold">Smart Insights</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live monitoring
                </div>
            </div>

            {isLoading && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {renderSkeletons()}
                </div>
            )}

            {error && (
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {!isLoading && !error && (
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {insights.map((insight, index) => (
                        <InsightCard key={index} insight={insight} category={insight.category} />
                    ))}
                </div>
            )}
        </div>
    );
}
