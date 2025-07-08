'use client';

import { useFinancialData } from "@/hooks/use-financial-data";
import { Skeleton } from "@/components/ui/skeleton";
import AssetAllocationChart from "@/components/analytics/asset-allocation-chart";
import LiabilityBreakdownChart from "@/components/analytics/liability-breakdown-chart";
import CreditScoreHistoryChart from "@/components/analytics/credit-score-history-chart";
import InvestmentPerformanceTable from "@/components/analytics/investment-performance-table";

export default function AnalyticsPage() {
    const { financialData: data, loading } = useFinancialData();

    if (loading || !data) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-80" />
                    <Skeleton className="h-80" />
                </div>
                 <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-80" />
                    <Skeleton className="h-80" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Financial Analytics</h1>
            <p className="text-muted-foreground">
                Dive deeper into your financial data with these detailed charts and tables.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <CreditScoreHistoryChart data={data.creditScore.history} />
                </div>
                <div className="lg:col-span-1">
                     <AssetAllocationChart data={data} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <LiabilityBreakdownChart data={data.liabilities} />
                <InvestmentPerformanceTable investments={data.investments} />
            </div>
        </div>
    );
}
