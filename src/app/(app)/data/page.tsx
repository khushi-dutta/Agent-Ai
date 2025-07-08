'use client';

import { useFinancialData } from '@/hooks/use-financial-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { FinancialData } from '@/lib/mcp-data';
import { Separator } from '@/components/ui/separator';


export default function DataPage() {
    const { financialData, setFinancialData, loading: dataLoading } = useFinancialData();
    const { toast } = useToast();

    if (dataLoading || !financialData) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col space-y-1.5">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
                 <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }

    const handleDataChange = (path: (string | number)[], value: any, isNumeric = false) => {
        const newData = JSON.parse(JSON.stringify(financialData));
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = isNumeric ? (parseFloat(value) || 0) : value;
        setFinancialData(newData as FinancialData);
    };

    const addArrayItem = (path: string[], newItem: any) => {
        const newData = JSON.parse(JSON.stringify(financialData));
        let current = newData;
        const arrayPath = path.slice(0);
        let targetArray = newData;
        for (const key of arrayPath) {
          targetArray = targetArray[key];
        }

        targetArray.push(newItem);
        setFinancialData(newData as FinancialData);
        toast({ title: "Item Added", description: "A new item has been added." });
    };

    const removeArrayItem = (path: (string | number)[]) => {
        const newData = JSON.parse(JSON.stringify(financialData));
        let current = newData;
        const indexToRemove = path[path.length - 1] as number;
        const arrayPath = path.slice(0, -1);
        
        let targetArray = newData;
        for (const key of arrayPath) {
            targetArray = targetArray[key as string];
        }
        
        (targetArray as any[]).splice(indexToRemove, 1);
        setFinancialData(newData as FinancialData);
        toast({ title: "Item Removed", description: "The item has been removed." });
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-1.5">
                <h1 className="text-3xl font-headline font-bold">Manage Your Financial Data</h1>
                <p className="text-muted-foreground">Keep your financial information up-to-date. Changes are saved automatically and reflected across the app in real-time.</p>
            </div>
            
            <Accordion type="multiple" defaultValue={['user-details']} className="w-full space-y-4">
                <Card>
                    <AccordionItem value="user-details" className="border-b-0">
                        <AccordionTrigger className="p-6">
                            <CardTitle>User Details</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="userName">Full Name</Label>
                                    <Input id="userName" value={financialData.user.name} onChange={e => handleDataChange(['user', 'name'], e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="userEmail">Email</Label>
                                    <Input id="userEmail" type="email" value={financialData.user.email} onChange={e => handleDataChange(['user', 'email'], e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="userAge">Age</Label>
                                    <Input id="userAge" type="number" value={financialData.user.age} onChange={e => handleDataChange(['user', 'age'], e.target.value, true)} />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>

                <Card>
                     <AccordionItem value="accounts" className="border-b-0">
                        <AccordionTrigger className="p-6">
                           <CardTitle>Bank Accounts</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <div className="space-y-4">
                                {financialData.accounts.map((account, index) => (
                                    <div key={`account-${index}`} className="p-4 border rounded-lg space-y-4 relative">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem(['accounts', index])}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><Label>Type</Label><Input value={account.type} onChange={e => handleDataChange(['accounts', index, 'type'], e.target.value)} /></div>
                                            <div><Label>Bank</Label><Input value={account.bank} onChange={e => handleDataChange(['accounts', index, 'bank'], e.target.value)} /></div>
                                            <div><Label>Balance (₹)</Label><Input type="number" value={account.balance} onChange={e => handleDataChange(['accounts', index, 'balance'], e.target.value, true)} /></div>
                                            {account.maturityDate && <div><Label>Maturity Date</Label><Input type="date" value={account.maturityDate} onChange={e => handleDataChange(['accounts', index, 'maturityDate'], e.target.value)} /></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="mt-4" variant="outline" onClick={() => addArrayItem(['accounts'], { type: "Savings", balance: 0, currency: "INR", bank: "", maturityDate: "" })}><PlusCircle className="mr-2 h-4 w-4" /> Add Account</Button>
                        </AccordionContent>
                    </AccordionItem>
                </Card>

                <Card>
                    <AccordionItem value="investments" className="border-b-0">
                        <AccordionTrigger className="p-6">
                           <CardTitle>Investments</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 space-y-6">
                            {/* Stocks */}
                            <div>
                                <h3 className="font-semibold mb-2">Stocks</h3>
                                <div className="space-y-4">
                                    {financialData.investments.stocks.map((stock, index) => (
                                         <div key={`stock-${index}`} className="p-4 border rounded-lg space-y-4 relative">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem(['investments', 'stocks', index])}><Trash2 className="h-4 w-4" /></Button>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div><Label>Symbol</Label><Input value={stock.symbol} onChange={e => handleDataChange(['investments', 'stocks', index, 'symbol'], e.target.value)} /></div>
                                                <div><Label>Quantity</Label><Input type="number" value={stock.quantity} onChange={e => handleDataChange(['investments', 'stocks', index, 'quantity'], e.target.value, true)} /></div>
                                                <div><Label>Avg. Price (₹)</Label><Input type="number" value={stock.avgPrice} onChange={e => handleDataChange(['investments', 'stocks', index, 'avgPrice'], e.target.value, true)} /></div>
                                                <div><Label>Current Value (₹)</Label><Input type="number" value={stock.currentValue} onChange={e => handleDataChange(['investments', 'stocks', index, 'currentValue'], e.target.value, true)} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="mt-4" variant="outline" onClick={() => addArrayItem(['investments', 'stocks'], { symbol: "", quantity: 0, avgPrice: 0, currentValue: 0 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Stock</Button>
                            </div>
                            <Separator />
                            {/* Mutual Funds */}
                            <div>
                                <h3 className="font-semibold mb-2">Mutual Funds</h3>
                                <div className="space-y-4">
                                    {financialData.investments.mutualFunds.map((mf, index) => (
                                         <div key={`mf-${index}`} className="p-4 border rounded-lg space-y-4 relative">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem(['investments', 'mutualFunds', index])}><Trash2 className="h-4 w-4" /></Button>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div><Label>Fund Name</Label><Input value={mf.name} onChange={e => handleDataChange(['investments', 'mutualFunds', index, 'name'], e.target.value)} /></div>
                                                <div><Label>Invested (₹)</Label><Input type="number" value={mf.invested} onChange={e => handleDataChange(['investments', 'mutualFunds', index, 'invested'], e.target.value, true)} /></div>
                                                <div><Label>Current Value (₹)</Label><Input type="number" value={mf.currentValue} onChange={e => handleDataChange(['investments', 'mutualFunds', index, 'currentValue'], e.target.value, true)} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="mt-4" variant="outline" onClick={() => addArrayItem(['investments', 'mutualFunds'], { name: "", invested: 0, currentValue: 0 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Mutual Fund</Button>
                            </div>
                             <Separator />
                            {/* EPF */}
                            <div>
                                <h3 className="font-semibold mb-2">EPF</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <div><Label>Balance (₹)</Label><Input type="number" value={financialData.investments.epf.balance} onChange={e => handleDataChange(['investments', 'epf', 'balance'], e.target.value, true)} /></div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>

                 <Card>
                    <AccordionItem value="liabilities" className="border-b-0">
                        <AccordionTrigger className="p-6">
                           <CardTitle>Liabilities</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 space-y-6">
                            {/* Loans */}
                            <div>
                                <h3 className="font-semibold mb-2">Loans</h3>
                                <div className="space-y-4">
                                    {financialData.liabilities.loans.map((loan, index) => (
                                         <div key={`loan-${index}`} className="p-4 border rounded-lg space-y-4 relative">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem(['liabilities', 'loans', index])}><Trash2 className="h-4 w-4" /></Button>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div><Label>Type</Label><Input value={loan.type} onChange={e => handleDataChange(['liabilities', 'loans', index, 'type'], e.target.value)} /></div>
                                                <div><Label>Balance (₹)</Label><Input type="number" value={loan.balance} onChange={e => handleDataChange(['liabilities', 'loans', index, 'balance'], e.target.value, true)} /></div>
                                                <div><Label>Interest Rate (%)</Label><Input type="number" value={loan.interestRate} onChange={e => handleDataChange(['liabilities', 'loans', index, 'interestRate'], e.target.value, true)} /></div>
                                                <div><Label>Tenure (Months)</Label><Input type="number" value={loan.tenureMonths} onChange={e => handleDataChange(['liabilities', 'loans', index, 'tenureMonths'], e.target.value, true)} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="mt-4" variant="outline" onClick={() => addArrayItem(['liabilities', 'loans'], { type: "Personal", balance: 0, interestRate: 0, tenureMonths: 0 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Loan</Button>
                            </div>
                            <Separator />
                             {/* Credit Cards */}
                            <div>
                                <h3 className="font-semibold mb-2">Credit Cards</h3>
                                <div className="space-y-4">
                                    {financialData.liabilities.creditCards.map((card, index) => (
                                         <div key={`cc-${index}`} className="p-4 border rounded-lg space-y-4 relative">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem(['liabilities', 'creditCards', index])}><Trash2 className="h-4 w-4" /></Button>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div><Label>Card Name</Label><Input value={card.name} onChange={e => handleDataChange(['liabilities', 'creditCards', index, 'name'], e.target.value)} /></div>
                                                <div><Label>Outstanding (₹)</Label><Input type="number" value={card.outstanding} onChange={e => handleDataChange(['liabilities', 'creditCards', index, 'outstanding'], e.target.value, true)} /></div>
                                                <div><Label>Limit (₹)</Label><Input type="number" value={card.limit} onChange={e => handleDataChange(['liabilities', 'creditCards', index, 'limit'], e.target.value, true)} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="mt-4" variant="outline" onClick={() => addArrayItem(['liabilities', 'creditCards'], { name: "", outstanding: 0, limit: 0 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Credit Card</Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>

                 <Card>
                    <AccordionItem value="income-expenses" className="border-b-0">
                        <AccordionTrigger className="p-6">
                           <CardTitle>Income & Expenses</CardTitle>
                        </AccordionTrigger>
                         <AccordionContent className="px-6 pb-6 space-y-6">
                            {/* Income */}
                            <div>
                                <h3 className="font-semibold mb-2">Income Sources</h3>
                                <div className="space-y-4">
                                    {financialData.income.map((item, index) => (
                                        <div key={`income-${index}`} className="p-4 border rounded-lg space-y-4 relative">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem(['income', index])}><Trash2 className="h-4 w-4" /></Button>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div><Label>Source</Label><Input value={item.source} onChange={e => handleDataChange(['income', index, 'source'], e.target.value)} /></div>
                                                <div><Label>Amount (₹)</Label><Input type="number" value={item.amount} onChange={e => handleDataChange(['income', index, 'amount'], e.target.value, true)} /></div>
                                                <div><Label>Frequency</Label><Input value={item.frequency} onChange={e => handleDataChange(['income', index, 'frequency'], e.target.value)} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="mt-4" variant="outline" onClick={() => addArrayItem(['income'], { source: "", amount: 0, frequency: "monthly" })}><PlusCircle className="mr-2 h-4 w-4" /> Add Income</Button>
                            </div>
                            <Separator />
                            {/* Expenses */}
                            <div>
                                <h3 className="font-semibold mb-2">Monthly Expenses</h3>
                                 <div className="space-y-4">
                                    {financialData.expenses.monthly.map((expense, index) => (
                                        <div key={`expense-${index}`} className="p-4 border rounded-lg space-y-4 relative">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem(['expenses', 'monthly', index])}><Trash2 className="h-4 w-4" /></Button>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div><Label>Category</Label><Input value={expense.category} onChange={e => handleDataChange(['expenses', 'monthly', index, 'category'], e.target.value)} /></div>
                                                <div><Label>Amount (₹)</Label><Input type="number" value={expense.amount} onChange={e => handleDataChange(['expenses', 'monthly', index, 'amount'], e.target.value, true)} /></div>
                                                <div><Label>Due Day</Label><Input type="number" value={expense.dueDate} onChange={e => handleDataChange(['expenses', 'monthly', index, 'dueDate'], e.target.value, true)} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="mt-4" variant="outline" onClick={() => addArrayItem(['expenses', 'monthly'], { category: "", amount: 0, dueDate: 1 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Expense</Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>

                <Card>
                    <AccordionItem value="goals" className="border-b-0">
                        <AccordionTrigger className="p-6">
                           <CardTitle>Financial Goals</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 space-y-6">
                            <div>
                                <div className="space-y-4">
                                    {financialData.goals.map((goal, index) => (
                                        <div key={`goal-${index}`} className="p-4 border rounded-lg space-y-4 relative">
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeArrayItem(['goals', index])}><Trash2 className="h-4 w-4" /></Button>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div><Label>Name</Label><Input value={goal.name} onChange={e => handleDataChange(['goals', index, 'name'], e.target.value)} /></div>
                                                <div><Label>Target (₹)</Label><Input type="number" value={goal.targetAmount} onChange={e => handleDataChange(['goals', index, 'targetAmount'], e.target.value, true)} /></div>
                                                <div><Label>Current (₹)</Label><Input type="number" value={goal.currentAmount} onChange={e => handleDataChange(['goals', index, 'currentAmount'], e.target.value, true)} /></div>
                                                <div><Label>Target Date</Label><Input type="date" value={goal.targetDate} onChange={e => handleDataChange(['goals', index, 'targetDate'], e.target.value)} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="mt-4" variant="outline" onClick={() => addArrayItem(['goals'], { id: `goal_${Date.now()}`, name: "New Goal", targetAmount: 100000, currentAmount: 0, targetDate: new Date().toISOString().split('T')[0] })}><PlusCircle className="mr-2 h-4 w-4" /> Add Goal</Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>

            </Accordion>
        </div>
    );
}
