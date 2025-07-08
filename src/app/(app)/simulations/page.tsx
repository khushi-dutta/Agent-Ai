'use client';
import { useState } from 'react';
import { projectFinancialOutcomes, ProjectFinancialOutcomesInput, ProjectFinancialOutcomesOutput } from '@/ai/flows/project-financial-outcomes';
import SimulationForm from '@/components/simulations/simulation-form';
import SimulationResults from '@/components/simulations/simulation-results';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

export default function SimulationsPage() {
    const [results, setResults] = useState<ProjectFinancialOutcomesOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSimulation = async (data: ProjectFinancialOutcomesInput) => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const output = await projectFinancialOutcomes(data);
            setResults(output);
        } catch (e) {
            setError('An error occurred while running the simulation. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Financial Projections</h1>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                     <SimulationForm onSubmit={handleSimulation} isLoading={isLoading} />
                </div>
                <div className="lg:col-span-2">
                    {isLoading && (
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-8 w-1/3 mb-2" />
                                <Skeleton className="h-5 w-full" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-80 w-full" />
                            </CardContent>
                        </Card>
                    )}
                    {error && (
                        <Card className="border-destructive">
                            <CardHeader>
                                <CardTitle className="text-destructive">Error</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{error}</p>
                            </CardContent>
                        </Card>
                    )}
                    {results && <SimulationResults results={results} />}
                    {!results && !isLoading && !error && (
                        <Card className="h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="p-4 bg-primary/10 rounded-full mb-4 ring-8 ring-primary/5">
                                <Bot className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-2xl mb-2">Ready to see your future?</CardTitle>
                            <CardDescription>
                                Fill out the form to project your financial growth. See how small changes today can make a big impact tomorrow.
                            </CardDescription>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
