'use client'; 

import { useFinancialData } from "@/hooks/use-financial-data";
import StatCard from "@/components/dashboard/stat-card";
import NetWorthChart from "@/components/dashboard/net-worth-chart";
import { Wallet, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import ExpenseBreakdownChart from "@/components/dashboard/income-expense-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import SmartInsights from "@/components/dashboard/smart-insights";
import UpcomingPayments from "@/components/dashboard/upcoming-payments";

export default function DashboardPage() {
    const { financialData: data, loading } = useFinancialData();
    const { user } = useAuth();

    if (loading || !data) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/2" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                </div>
                 <div className="space-y-4 mt-6">
                    <Skeleton className="h-8 w-1/4" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                    </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-3 mt-6">
                    <div className="lg:col-span-2"><Skeleton className="h-80" /></div>
                    <div className="lg:col-span-1"><Skeleton className="h-80" /></div>
                </div>
                 <div className="grid gap-6 mt-6">
                    <Skeleton className="h-80" />
                </div>
            </div>
        )
    }
    
    // Calculations
    const totalAssets = data.accounts.reduce((sum, acc) => sum + acc.balance, 0) + 
                        data.investments.stocks.reduce((sum, stock) => sum + stock.currentValue, 0) +
                        data.investments.mutualFunds.reduce((sum, mf) => sum + mf.currentValue, 0) +
                        data.investments.epf.balance +
                        (data.insurance.life.surrenderValue || 0);

    const totalLiabilities = data.liabilities.loans.reduce((sum, loan) => sum + loan.balance, 0) + 
                             data.liabilities.creditCards.reduce((sum, card) => sum + card.outstanding, 0);

    const netWorth = totalAssets - totalLiabilities;
    const monthlyExpenses = data.expenses.monthly.reduce((sum, exp) => sum + exp.amount, 0);
    
    const monthlyIncome = data.income.reduce((sum, inc) => {
        if (inc.frequency === 'monthly') return sum + inc.amount;
        if (inc.frequency === 'annually') return sum + inc.amount / 12;
        return sum;
    }, 0);

    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    
    const welcomeName = user?.displayName?.split(' ')[0] || data.user.name.split(' ')[0];

    const netWorthHistory = data.netWorthHistory;
    const currentNetWorth = netWorth;
    const previousNetWorth = netWorthHistory.length > 1 ? netWorthHistory[netWorthHistory.length - 2].value : 0;
    const netWorthGrowth = previousNetWorth > 0 ? ((currentNetWorth - previousNetWorth) / previousNetWorth) * 100 : 100;

    const getCreditScoreDescription = (score: number) => {
        if (score >= 780) return "Excellent";
        if (score >= 740) return "Very Good";
        if (score >= 700) return "Good";
        if (score >= 650) return "Fair";
        return "Needs Improvement";
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Welcome back, {welcomeName}!</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Net Worth" 
                    value={`₹${netWorth.toLocaleString('en-IN')}`} 
                    icon={Wallet} 
                    variant="net-worth"
                    description={`+${netWorthGrowth.toFixed(1)}% from last quarter`}
                    badgeText="Growth"
                    badgeIcon={TrendingUp}
                />
                <StatCard 
                    title="Monthly Income" 
                    value={`₹${monthlyIncome.toLocaleString('en-IN')}`} 
                    icon={TrendingUp} 
                    variant="income"
                    description="After taxes"
                    badgeText="Status"
                    badgeIcon={TrendingUp}
                />
                <StatCard 
                    title="Monthly Expenses" 
                    value={`₹${monthlyExpenses.toLocaleString('en-IN')}`} 
                    icon={TrendingDown}
                    variant="expenses"
                    description={`${savingsRate.toFixed(1)}% savings rate`}
                    badgeText="Status"
                    badgeIcon={TrendingDown}
                />
                <StatCard 
                    title="Credit Score" 
                    value={data.creditScore.current.toString()} 
                    icon={CreditCard}
                    variant="credit"
                    description={getCreditScoreDescription(data.creditScore.current)}
                    badgeText="Status"
                    badgeIcon={TrendingUp}
                />
            </div>
            
            <SmartInsights financialData={data} />

            <div className="grid gap-6 lg:grid-cols-3">
                 <div className="lg:col-span-2">
                    <NetWorthChart data={data.netWorthHistory} />
                 </div>
                 <div className="lg:col-span-1">
                    <UpcomingPayments expenses={data.expenses.monthly} />
                 </div>
            </div>

            <div className="grid gap-6">
                <ExpenseBreakdownChart data={data.expenses.monthly} />
            </div>
        </div>
    )
}
