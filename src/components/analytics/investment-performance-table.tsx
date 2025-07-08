'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FinancialData } from "@/lib/mcp-data";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface InvestmentPerformanceTableProps {
    investments: FinancialData['investments'];
}

export default function InvestmentPerformanceTable({ investments }: InvestmentPerformanceTableProps) {
    
    const allInvestments = [
        ...investments.stocks.map(s => ({
            name: s.symbol,
            type: "Stock",
            invested: s.quantity * s.avgPrice,
            currentValue: s.currentValue,
        })),
        ...investments.mutualFunds.map(mf => ({
            name: mf.name,
            type: "Mutual Fund",
            invested: mf.invested,
            currentValue: mf.currentValue,
        }))
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Investment Performance</CardTitle>
                <CardDescription>A look at your individual investment returns.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Investment</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Return</TableHead>
                            <TableHead className="text-right">Return (%)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allInvestments.map((inv, index) => {
                            const pnl = inv.currentValue - inv.invested;
                            const pnlPercentage = inv.invested > 0 ? (pnl / inv.invested) * 100 : 0;
                            const isProfit = pnl >= 0;

                            return (
                                <TableRow key={`${inv.name}-${index}`}>
                                    <TableCell className="font-medium truncate max-w-40">{inv.name}</TableCell>
                                    <TableCell>{inv.type}</TableCell>
                                    <TableCell className={cn("text-right", isProfit ? "text-stat-growth" : "text-stat-loss")}>
                                        {isProfit ? '+' : ''}₹{pnl.toLocaleString()}
                                    </TableCell>
                                    <TableCell className={cn("text-right flex items-center justify-end gap-1", isProfit ? "text-stat-growth" : "text-stat-loss")}>
                                        {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                        {pnlPercentage.toFixed(2)}%
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
