import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Bot, LineChart, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 md:py-24">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter mb-4">
            Your Smart Financial AI
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Connect your finances, chat with our AI assistant, and get personalized insights to achieve your financial goals faster.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Start for Free</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Image 
            src="https://placehold.co/1200x600.png"
            alt="FinGenie Dashboard Preview"
            width={1200}
            height={600}
            className="rounded-xl shadow-2xl mx-auto"
            data-ai-hint="dashboard application"
          />
        </section>

        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">A Smarter Way to Manage Your Money</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mt-4">FinGenie provides the clarity and tools you need to take control of your financial future.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 ring-8 ring-primary/5">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">AI-Powered Chat</h3>
                <p className="text-muted-foreground">Ask any financial question in plain English and get instant, intelligent answers.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 ring-8 ring-primary/5">
                  <LineChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Insightful Dashboard</h3>
                <p className="text-muted-foreground">Visualize your net worth, track spending, and monitor investments all in one place.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 ring-8 ring-primary/5">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">Your data is yours. We use bank-level security to keep your information safe.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} FinGenie. All rights reserved.</p>
      </footer>
    </div>
  );
}
