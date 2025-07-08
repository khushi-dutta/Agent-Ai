'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
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

    const chartData = [
        { name: "Loans", value: loansValue, fill: COLORS[0] },
        { name: "Credit Cards", value: creditCardsValue, fill: COLORS[1] },
    ].filter(d => d.value > 0);
    
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
                <ChartContainer config={chartConfig} className="h-64 w-full aspect-square">
                     <ResponsiveContainer width="100%" height={250}>
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
                            <Legend content={<ChartLegendContent />} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
