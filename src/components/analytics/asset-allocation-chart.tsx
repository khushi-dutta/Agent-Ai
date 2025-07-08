'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
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

    const totalAssets = savingsBalance + stocksValue + mutualFundsValue + epfValue + insuranceSurrenderValue;

    const chartData = [
        { name: "Savings", value: savingsBalance, fill: COLORS[0] },
        { name: "Stocks", value: stocksValue, fill: COLORS[1] },
        { name: "Mutual Funds", value: mutualFundsValue, fill: COLORS[2] },
        { name: "EPF", value: epfValue, fill: COLORS[3] },
        { name: "Insurance", value: insuranceSurrenderValue, fill: COLORS[4] },
    ].filter(d => d.value > 0)
     .map(item => ({
        ...item,
        percentage: totalAssets > 0 ? (item.value / totalAssets) * 100 : 0
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
                <CardTitle className="font-headline">Asset Allocation</CardTitle>
                <CardDescription>How your assets are distributed.</CardDescription>
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
