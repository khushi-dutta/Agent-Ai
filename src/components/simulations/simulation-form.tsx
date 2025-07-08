'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { financialData } from '@/lib/mcp-data';
import type { ProjectFinancialOutcomesInput } from '@/ai/flows/project-financial-outcomes';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
    savings: z.coerce.number().min(0, "Savings must be positive"),
    annualIncome: z.coerce.number().min(0, "Annual income must be positive"),
    monthlyExpenses: z.coerce.number().min(0, "Monthly expenses must be positive"),
    annualSavingsRate: z.coerce.number().min(0).max(100, "Savings rate must be between 0 and 100"),
    yearsToProject: z.coerce.number().min(1, "Must project for at least 1 year").max(50),
    assumedInvestmentReturnRate: z.coerce.number().min(0).max(50),
    additionalContext: z.string().optional(),
});

interface SimulationFormProps {
    onSubmit: (data: ProjectFinancialOutcomesInput) => void;
    isLoading: boolean;
}

export default function SimulationForm({ onSubmit, isLoading }: SimulationFormProps) {
    const totalSavings = financialData.accounts.reduce((sum, acc) => sum + acc.balance, 0) + 
                         financialData.investments.stocks.reduce((sum, stock) => sum + stock.currentValue, 0) +
                         financialData.investments.mutualFunds.reduce((sum, mf) => sum + mf.currentValue, 0);
    const annualIncome = financialData.income.find(inc => inc.source === 'Salary')?.amount ?? 0;
    const monthlyExpenses = financialData.expenses.monthly.reduce((sum, exp) => sum + exp.amount, 0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            savings: totalSavings,
            annualIncome: annualIncome,
            monthlyExpenses: monthlyExpenses,
            annualSavingsRate: 20,
            yearsToProject: 10,
            assumedInvestmentReturnRate: 8,
            additionalContext: "Planning to buy a house in 5 years.",
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Simulation Parameters</CardTitle>
                <CardDescription>Adjust the values to project your financial future. We've pre-filled some data for you.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="savings" render={({ field }) => (
                            <FormItem><FormLabel>Current Savings (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="annualIncome" render={({ field }) => (
                            <FormItem><FormLabel>Annual Income (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="monthlyExpenses" render={({ field }) => (
                            <FormItem><FormLabel>Monthly Expenses (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="annualSavingsRate" render={({ field }) => (
                            <FormItem><FormLabel>Annual Savings Rate (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="yearsToProject" render={({ field }) => (
                            <FormItem><FormLabel>Years to Project</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="assumedInvestmentReturnRate" render={({ field }) => (
                            <FormItem><FormLabel>Investment Return (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="additionalContext" render={({ field }) => (
                            <FormItem><FormLabel>Additional Context / Goals</FormLabel><FormControl><Textarea placeholder="e.g., retirement planning, child's education" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Run Simulation
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
