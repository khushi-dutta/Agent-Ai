'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";

interface NetWorthChartProps {
    data: { date: string; value: number }[];
}

export default function NetWorthChart({ data }: NetWorthChartProps) {
    const chartData = data.map(item => ({
        date: new Date(item.date),
        value: item.value,
    }));

    const chartConfig = {
      value: {
        label: "Net Worth",
        color: "hsl(var(--primary))",
      },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Net Worth Growth</CardTitle>
                <CardDescription>Your net worth over the last 18 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(tick) => format(tick, 'MMM yy')}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickFormatter={(value) => `₹${value / 1000}k`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip
                            content={<ChartTooltipContent
                              formatter={(value) => `₹${Number(value).toLocaleString()}`}
                              labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                            />}
                        />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorValue)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
