'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FinancialData } from "@/lib/mcp-data";
import { differenceInDays, isAfter, isBefore, endOfMonth, setDate, isToday, format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Calendar, Bell } from "lucide-react";

interface UpcomingPaymentsProps {
    expenses: FinancialData['expenses']['monthly'];
}

export default function UpcomingPayments({ expenses }: UpcomingPaymentsProps) {
    const today = new Date();

    const upcomingPayments = expenses
        .map(exp => ({
            name: exp.category,
            amount: exp.amount,
            dueDate: setDate(today, exp.dueDate),
        }))
        .filter(p => {
            const paymentDateInMonth = p.dueDate;
            // Only show payments due today or in the future, within the current month.
            return (isToday(paymentDateInMonth) || isAfter(paymentDateInMonth, today)) && isBefore(paymentDateInMonth, endOfMonth(today));
        })
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const getDaysLeftText = (dueDate: Date) => {
        const days = differenceInDays(dueDate, today);
        if (days < 0) return { text: "Overdue", className: "text-destructive font-bold" };
        if (days === 0) return { text: "Due today", className: "text-destructive font-bold" };
        if (days === 1) return { text: "Due tomorrow", className: "text-amber-600 font-semibold" };
        return { text: `Due in ${days} days`, className: "text-muted-foreground" };
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Bell className="text-primary"/> Upcoming Payments
                </CardTitle>
                <CardDescription>
                    Your upcoming bills for {format(today, 'MMMM')}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {upcomingPayments.length > 0 ? (
                    <ScrollArea className="h-64 pr-4">
                        <div className="space-y-4">
                            {upcomingPayments.map((payment, index) => {
                                const daysLeftInfo = getDaysLeftText(payment.dueDate);
                                return (
                                    <div key={index} className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-secondary rounded-md">
                                                <Calendar className="h-5 w-5 text-primary"/>
                                            </div>
                                            <div>
                                                <p className="font-semibold truncate">{payment.name}</p>
                                                <p className={cn("text-xs", daysLeftInfo.className)}>
                                                    {daysLeftInfo.text} &bull; {format(payment.dueDate, 'do MMMM')}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-lg whitespace-nowrap">₹{Math.round(payment.amount).toLocaleString('en-IN')}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
                        <Calendar className="h-10 w-10 mb-4" />
                        <p className="font-semibold">All clear for this month!</p>
                        <p className="text-sm">No upcoming payments due.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
