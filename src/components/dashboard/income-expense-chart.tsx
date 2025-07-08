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
    const chartConfig = data.reduce((acc, item, index) => {
        acc[item.category] = {
            label: item.category,
            color: COLORS[index % COLORS.length]
        };
        return acc;
    }, {});


    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Monthly Expense Breakdown</CardTitle>
                <CardDescription>A donut chart showing your spending distribution.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full aspect-square">
                     <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Tooltip
                                content={<ChartTooltipContent
                                    nameKey="category"
                                    formatter={(value, name) => [`₹${Number(value).toLocaleString()}`, name]}
                                />}
                            />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                innerRadius={60}
                                outerRadius={80}
                                dataKey="amount"
                                nameKey="category"
                                strokeWidth={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
