'use client'; 

import { useFinancialData } from "@/hooks/use-financial-data";
import StatCard from "@/components/dashboard/stat-card";
import NetWorthChart from "@/components/dashboard/net-worth-chart";
import { DollarSign, Wallet, Landmark, AlertTriangle, ShieldCheck } from "lucide-react";
import IncomeExpenseChart from "@/components/dashboard/income-expense-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
    const { financialData: data, loading } = useFinancialData();
    const { user } = useAuth();

    if (loading || !data) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/2" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
                <div className="grid gap-4 lg:grid-cols-5">
                    <div className="lg:col-span-3"><Skeleton className="h-80" /></div>
                    <div className="lg:col-span-2"><Skeleton className="h-80" /></div>
                </div>
            </div>
        )
    }
    
    const totalAssets = data.accounts.reduce((sum, acc) => sum + acc.balance, 0) + 
                        data.investments.stocks.reduce((sum, stock) => sum + stock.currentValue, 0) +
                        data.investments.mutualFunds.reduce((sum, mf) => sum + mf.currentValue, 0) +
                        data.investments.epf.balance +
                        (data.insurance.life.surrenderValue || 0);

    const totalLiabilities = data.liabilities.loans.reduce((sum, loan) => sum + loan.balance, 0) + 
                             data.liabilities.creditCards.reduce((sum, card) => sum + card.outstanding, 0);

    const netWorth = totalAssets - totalLiabilities;
    const monthlyExpenses = data.expenses.monthly.reduce((sum, exp) => sum + exp.amount, 0);
    const welcomeName = user?.displayName?.split(' ')[0] || data.user.name.split(' ')[0];
    const lastCreditScore = data.creditScore.history.length > 1 ? data.creditScore.history[data.creditScore.history.length - 2].score : data.creditScore.current;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Welcome back, {welcomeName}!</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Net Worth" value={`₹${netWorth.toLocaleString()}`} icon={Wallet} />
                <StatCard title="Total Assets" value={`₹${totalAssets.toLocaleString()}`} icon={Landmark} />
                <StatCard title="Monthly Expenses" value={`₹${monthlyExpenses.toLocaleString()}`} icon={DollarSign} />
                <StatCard title="Credit Score" value={data.creditScore.current.toString()} icon={ShieldCheck} description={`Up from ${lastCreditScore}`}/>
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
                 <div className="lg:col-span-3">
                    <NetWorthChart data={data.netWorthHistory} />
                 </div>
                 <div className="lg:col-span-2">
                    <IncomeExpenseChart data={data.expenses.monthly} />
                 </div>
            </div>

            <Card className="bg-destructive/10 border-destructive/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-destructive"/>
                        <CardTitle className="text-lg font-headline text-destructive">Anomaly Detected</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm">View Details</Button>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive/90">This month you spent 25% more on shopping than usual.</p>
                </CardContent>
            </Card>
        </div>
    )
}
