'use client';

import { useState, useEffect } from 'react';
import { useFinancialData } from '@/hooks/use-financial-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function DataPage() {
    const { financialData, setFinancialData, loading: dataLoading } = useFinancialData();
    const [jsonString, setJsonString] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (financialData) {
            setJsonString(JSON.stringify(financialData, null, 2));
        }
    }, [financialData]);

    const handleSave = () => {
        setError(null);
        setIsSaving(true);
        try {
            const parsedData = JSON.parse(jsonString);
            setFinancialData(parsedData);
            toast({
                title: "Data Saved",
                description: "Your financial data has been updated.",
            });
        } catch (e) {
            setError("Invalid JSON format. Please check your data and try again.");
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "The data you entered is not valid JSON.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (dataLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col space-y-1.5">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-64 w-full" /></CardContent>
                    <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-1.5">
                <h1 className="text-3xl font-headline font-bold">Manage Your Financial Data</h1>
                <p className="text-muted-foreground">Keep your financial information up-to-date for accurate insights and projections. Your data is saved locally in your browser.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Financial Data Editor (JSON)</CardTitle>
                    <CardDescription>
                        Edit your financial data directly in JSON format. The initial data is a template you can follow.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={jsonString}
                        onChange={(e) => setJsonString(e.target.value)}
                        className="min-h-[500px] font-mono text-xs"
                        placeholder="Enter your financial data in JSON format..."
                    />
                    {error && <p className="text-sm font-medium text-destructive mt-2">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Data
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
