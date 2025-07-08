'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Eye, Bell, User, Download, Trash2, FileText, Plug } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useFinancialData } from "@/hooks/use-financial-data";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
    const { financialData } = useFinancialData();
    const { deleteAccount } = useAuth();
    const { toast } = useToast();

    const handleExportData = () => {
        if (!financialData) {
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: "No data available to export.",
            });
            return;
        }

        try {
            const toCsvRow = (arr: (string | number | undefined | null)[]) => 
                arr.map(val => `"${String(val === undefined || val === null ? '' : val).replace(/"/g, '""')}"`).join(',');

            let csvContent = `FinGenie Data Export for ${financialData.user.name}\n\n`;

            // User Details
            csvContent += "--- USER DETAILS ---\n";
            csvContent += `Name,${financialData.user.name}\n`;
            csvContent += `Email,${financialData.user.email}\n`;
            csvContent += `Age,${financialData.user.age}\n\n`;

            // Accounts
            if (financialData.accounts.length > 0) {
                csvContent += "--- BANK ACCOUNTS ---\n";
                const headers = ["Type", "Bank", "Balance", "Currency", "Maturity Date"];
                csvContent += toCsvRow(headers) + '\n';
                financialData.accounts.forEach(item => {
                    csvContent += toCsvRow([item.type, item.bank, item.balance, item.currency, item.maturityDate]) + '\n';
                });
                csvContent += '\n';
            }

            // Investments Section
            csvContent += "--- INVESTMENTS ---\n\n";

            // Stocks
            if (financialData.investments.stocks.length > 0) {
                csvContent += "Stocks\n";
                const headers = ["Symbol", "Quantity", "Avg Price", "Current Value"];
                csvContent += toCsvRow(headers) + '\n';
                financialData.investments.stocks.forEach(item => {
                    csvContent += toCsvRow([item.symbol, item.quantity, item.avgPrice, item.currentValue]) + '\n';
                });
                csvContent += '\n';
            }
            
            // Mutual Funds
            if (financialData.investments.mutualFunds.length > 0) {
                csvContent += "Mutual Funds\n";
                const headers = ["Fund Name", "Invested", "Current Value"];
                csvContent += toCsvRow(headers) + '\n';
                financialData.investments.mutualFunds.forEach(item => {
                    csvContent += toCsvRow([item.name, item.invested, item.currentValue]) + '\n';
                });
                csvContent += '\n';
            }

            // EPF
            csvContent += "EPF\n";
            csvContent += `Balance,${financialData.investments.epf.balance}\n\n`;

            // Liabilities Section
            csvContent += "--- LIABILITIES ---\n\n";
            
            // Loans
            if (financialData.liabilities.loans.length > 0) {
                csvContent += "Loans\n";
                const headers = ["Type", "Balance", "Interest Rate (%)", "Tenure (Months)"];
                csvContent += toCsvRow(headers) + '\n';
                financialData.liabilities.loans.forEach(item => {
                    csvContent += toCsvRow([item.type, item.balance, item.interestRate, item.tenureMonths]) + '\n';
                });
                csvContent += '\n';
            }

            // Credit Cards
            if (financialData.liabilities.creditCards.length > 0) {
                csvContent += "Credit Cards\n";
                const headers = ["Card Name", "Outstanding", "Limit"];
                csvContent += toCsvRow(headers) + '\n';
                financialData.liabilities.creditCards.forEach(item => {
                    csvContent += toCsvRow([item.name, item.outstanding, item.limit]) + '\n';
                });
                csvContent += '\n';
            }

            // Income
            if (financialData.income.length > 0) {
                csvContent += "--- INCOME SOURCES ---\n";
                const headers = ["Source", "Amount", "Frequency"];
                csvContent += toCsvRow(headers) + '\n';
                financialData.income.forEach(item => {
                    csvContent += toCsvRow([item.source, item.amount, item.frequency]) + '\n';
                });
                csvContent += '\n';
            }

            // Expenses
            if (financialData.expenses.monthly.length > 0) {
                csvContent += "--- MONTHLY EXPENSES ---\n";
                const headers = ["Category", "Amount"];
                csvContent += toCsvRow(headers) + '\n';
                financialData.expenses.monthly.forEach(item => {
                    csvContent += toCsvRow([item.category, item.amount]) + '\n';
                });
                csvContent += '\n';
            }

            // Insurance
            csvContent += "--- INSURANCE ---\n\n";
            csvContent += "Life Insurance\n";
            csvContent += `Policy,${financialData.insurance.life.policy}\n`;
            csvContent += `Sum Assured,${financialData.insurance.life.sumAssured}\n`;
            csvContent += `Premium,${financialData.insurance.life.premium} ${financialData.insurance.life.premiumFrequency}\n`;
            csvContent += `Surrender Value,${financialData.insurance.life.surrenderValue}\n\n`;

            csvContent += "Health Insurance\n";
            csvContent += `Policy,${financialData.insurance.health.policy}\n`;
            csvContent += `Coverage,${financialData.insurance.health.coverage}\n`;
            csvContent += `Premium,${financialData.insurance.health.premium} ${financialData.insurance.health.premiumFrequency}\n\n`;

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "fingenie_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
                title: "Data Exported",
                description: "Your financial data has been downloaded as a CSV file.",
            });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: "Could not export your data as CSV. Please try again.",
            });
        }
    };
    
    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            toast({
                title: "Account Deleted",
                description: "Your account and all associated data have been permanently deleted.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: "Could not delete your account. This may require you to log in again for security reasons.",
            });
        }
    }


    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
            <div>
                <h1 className="text-3xl font-headline font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and privacy settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline text-2xl">Privacy & Security</CardTitle>
                    </div>
                     <CardDescription>Control your data and account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div>
                            <h3 className="font-semibold">Data Encryption</h3>
                            <p className="text-sm text-muted-foreground">All your data is encrypted at rest and in transit.</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="h-3 w-3 rounded-full bg-green-500"></div>
                           <span className="text-sm font-medium text-green-600">Active</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div>
                            <h3 className="font-semibold">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                        </div>
                        <Button>Enable</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div>
                            <h3 className="font-semibold">Data Sharing</h3>
                            <p className="text-sm text-muted-foreground">Control how your data is used for insights.</p>
                        </div>
                         <Button variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            Show Details
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline text-2xl">Profile</CardTitle>
                    </div>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-muted-foreground text-sm">Profile editing options will be available here in a future update.</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Plug className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline text-2xl">Connected Services</CardTitle>
                    </div>
                    <CardDescription>Manage your connected accounts and data sources.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">Fi</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">Fi Money</h3>
                                <p className="text-sm text-muted-foreground">Connected via MCP</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-stat-growth"></div>
                           <span className="text-sm font-medium text-stat-growth">Active</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                         <div className="flex items-center gap-4">
                             <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-stat-growth/10 text-stat-growth font-semibold">G</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">Google Account</h3>
                                <p className="text-sm text-muted-foreground">Authentication</p>
                            </div>
                         </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-stat-growth"></div>
                            <span className="text-sm font-medium text-stat-growth">Active</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline text-2xl">Data Export & Management</CardTitle>
                    </div>
                    <CardDescription>Export or delete your account data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div>
                            <h3 className="font-semibold">Export Your Data</h3>
                            <p className="text-sm text-muted-foreground">Download all your financial data in a readable CSV file.</p>
                        </div>
                        <Button onClick={handleExportData} className="bg-stat-income hover:bg-stat-income/90 text-primary-foreground">
                           <Download className="mr-2 h-4 w-4" /> Export Data
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div>
                            <h3 className="font-semibold text-destructive">Delete Account</h3>
                            <p className="text-sm text-destructive/80">Permanently delete your account and all data.</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                                        Yes, delete account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
             </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline text-2xl">Notifications</CardTitle>
                    </div>
                    <CardDescription>Choose what you want to be notified about.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="smart-insights-notif" className="font-semibold">Smart Insight Alerts</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications for new financial insights.</p>
                        </div>
                        <Switch id="smart-insights-notif" defaultChecked />
                    </div>
                    <Separator />
                     <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="summary-notif" className="font-semibold">Weekly Summary</Label>
                            <p className="text-sm text-muted-foreground">Get a weekly summary of your financial activity.</p>
                        </div>
                        <Switch id="summary-notif" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
