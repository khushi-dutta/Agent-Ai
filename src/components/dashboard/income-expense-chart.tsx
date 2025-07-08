'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";

interface ExpenseBreakdownChartProps {
    data: { category: string; amount: number }[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--accent))",
];

export default function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
    const totalExpenses = data.reduce((acc, curr) => acc + curr.amount, 0);

    const chartData = data
      .map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
        percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const chartConfig = chartData.reduce((acc, item) => {
        acc[item.category] = {
            label: item.category,
            color: item.fill
        };
        return acc;
    }, {});

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Monthly Expense Breakdown</CardTitle>
                    <CardDescription>No expense data available.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Please add expenses in the Data page.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Monthly Expense Breakdown</CardTitle>
                <CardDescription>Your spending distribution by category.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="h-48 relative">
                         <ChartContainer config={chartConfig} className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            hideLabel
                                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                                        />}
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="amount"
                                        nameKey="category"
                                        innerRadius={50}
                                        outerRadius={70}
                                        strokeWidth={1}
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        {chartData.map((entry) => (
                                            <Cell key={`cell-${entry.category}`} fill={entry.fill} name={entry.category} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="text-xl font-bold">
                                ₹{totalExpenses.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-2 text-sm">
                        {chartData.slice(0, 5).map(item => (
                            <div key={item.category} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }}></span>
                                    <span className="text-muted-foreground truncate" title={item.category}>{item.category}</span>
                                </div>
                                <span className="font-medium">{item.percentage.toFixed(0)}%</span>
                            </div>
                        ))}
                         {chartData.length > 5 && (
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-muted"></span>
                                    <span className="text-muted-foreground">Others</span>
                                </div>
                                <span className="font-medium">...</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
