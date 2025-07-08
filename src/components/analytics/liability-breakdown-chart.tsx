'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { FinancialData } from "@/lib/mcp-data";

interface LiabilityBreakdownChartProps {
    data: FinancialData['liabilities'];
}

const COLORS = [
  "hsl(var(--chart-3))",
  "hsl(var(--chart-5))",
];

export default function LiabilityBreakdownChart({ data }: LiabilityBreakdownChartProps) {
    const loansValue = data.loans.reduce((sum, loan) => sum + loan.balance, 0);
    const creditCardsValue = data.creditCards.reduce((sum, card) => sum + card.outstanding, 0);
    const totalLiabilities = loansValue + creditCardsValue;

    const chartData = [
        { name: "Loans", value: loansValue, fill: COLORS[0] },
        { name: "Credit Cards", value: creditCardsValue, fill: COLORS[1] },
    ].filter(d => d.value > 0)
     .map(item => ({
        ...item,
        percentage: totalLiabilities > 0 ? (item.value / totalLiabilities) * 100 : 0
     }));
    
    const chartConfig = chartData.reduce((acc, item) => {
        acc[item.name] = {
            label: item.name,
            color: item.fill
        };
        return acc;
    }, {} as any);


    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Liability Breakdown</CardTitle>
                <CardDescription>How your liabilities are composed.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="h-56">
                        <ChartContainer config={chartConfig} className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        content={<ChartTooltipContent
                                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                                        />}
                                    />
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                    <div className="flex flex-col justify-center space-y-2 text-sm">
                        {chartData.map(item => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }}></span>
                                    <span className="text-muted-foreground truncate" title={item.name}>{item.name}</span>
                                </div>
                                <span className="font-medium">{item.percentage.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
