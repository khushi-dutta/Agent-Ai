'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Eye, Bell, User } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
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
