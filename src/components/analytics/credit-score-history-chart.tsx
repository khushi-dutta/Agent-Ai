'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface CreditScoreHistoryChartProps {
    data: { date: string; score: number }[];
}

export default function CreditScoreHistoryChart({ data }: CreditScoreHistoryChartProps) {
    const chartData = data.map(item => ({
        date: new Date(item.date),
        score: item.score,
    }));
    
    const chartConfig = {
      score: {
        label: "Credit Score",
        color: "hsl(var(--chart-2))",
      },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Credit Score History</CardTitle>
                <CardDescription>Your credit score trend over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(tick) => format(tick, 'MMM yy')}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            domain={['dataMin - 20', 'dataMax + 10']}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip
                            content={<ChartTooltipContent
                                labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                            />}
                        />
                        <Line type="monotone" dataKey="score" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
