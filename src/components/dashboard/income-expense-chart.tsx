'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";

interface IncomeExpenseChartProps {
    data: { category: string; amount: number }[];
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
    const chartConfig = {
      amount: {
        label: "Amount",
        color: "hsl(var(--accent))",
      },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Monthly Expenses</CardTitle>
                <CardDescription>A breakdown of your spending this month.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="category"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={80}
                        />
                        <Tooltip
                            cursor={{ fill: "hsl(var(--muted))" }}
                            content={<ChartTooltipContent
                                formatter={(value) => `₹${Number(value).toLocaleString()}`}
                            />}
                        />
                        <Bar dataKey="amount" radius={4} fill="var(--color-amount)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
