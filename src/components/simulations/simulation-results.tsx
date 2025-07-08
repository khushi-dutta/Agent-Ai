'use client';
import type { ProjectFinancialOutcomesOutput } from '@/ai/flows/project-financial-outcomes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

interface SimulationResultsProps {
    results: ProjectFinancialOutcomesOutput;
}

export default function SimulationResults({ results }: SimulationResultsProps) {
    const chartData = results.projectedSavings.map((value, index) => ({
        year: `Year ${index + 1}`,
        value,
    }));
    
    const chartConfig = {
      value: {
        label: "Projected Savings",
        color: "hsl(var(--primary))",
      },
    };

    const handleExport = () => {
        const headers = ["Year", "Projected Savings"];
        const rows = chartData.map((d, i) => [i + 1, d.value]);
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "fingenie_simulation.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">Simulation Results</CardTitle>
                        <CardDescription>
                            Total projected savings after {results.projectedSavings.length} years: 
                            <span className="font-bold text-primary"> ₹{results.totalProjectedSavings.toLocaleString()}</span>
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-foreground">{results.summary}</p>
                </div>
                
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                             <linearGradient id="colorValueSim" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year" tickLine={false} axisLine={false} />
                        <YAxis
                            tickFormatter={(value) => `₹${value / 100000}L`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip
                            content={<ChartTooltipContent
                                formatter={(value) => `₹${Number(value).toLocaleString()}`}
                            />}
                        />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorValueSim)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
