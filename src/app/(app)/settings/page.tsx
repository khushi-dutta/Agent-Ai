'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Eye, Bell, User, Download, Trash2, FileJson } from "lucide-react";
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

export default function SettingsPage() {
    const { financialData } = useFinancialData();
    const { deleteAccount } = useAuth();
    const { toast } = useToast();

    const handleExportData = () => {
        try {
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(financialData, null, 2)
            )}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = "fingenie_data.json";

            link.click();
            toast({
                title: "Data Exported",
                description: "Your financial data has been downloaded.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: "Could not export your data. Please try again.",
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
                        <FileJson className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline text-2xl">Data Export & Management</CardTitle>
                    </div>
                    <CardDescription>Export or delete your account data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div>
                            <h3 className="font-semibold">Export Your Data</h3>
                            <p className="text-sm text-muted-foreground">Download all your financial data in JSON format.</p>
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
