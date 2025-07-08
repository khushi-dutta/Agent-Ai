'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import type { FinancialData } from "@/lib/mcp-data";

interface AssetAllocationChartProps {
    data: FinancialData;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function AssetAllocationChart({ data }: AssetAllocationChartProps) {
    const savingsBalance = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const stocksValue = data.investments.stocks.reduce((sum, stock) => sum + stock.currentValue, 0);
    const mutualFundsValue = data.investments.mutualFunds.reduce((sum, mf) => sum + mf.currentValue, 0);
    const epfValue = data.investments.epf.balance;
    const insuranceSurrenderValue = data.insurance.life.surrenderValue || 0;

    const chartData = [
        { name: "Savings", value: savingsBalance, fill: COLORS[0] },
        { name: "Stocks", value: stocksValue, fill: COLORS[1] },
        { name: "Mutual Funds", value: mutualFundsValue, fill: COLORS[2] },
        { name: "EPF", value: epfValue, fill: COLORS[3] },
        { name: "Insurance", value: insuranceSurrenderValue, fill: COLORS[4] },
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
                <CardTitle className="font-headline">Asset Allocation</CardTitle>
                <CardDescription>How your assets are distributed.</CardDescription>
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
