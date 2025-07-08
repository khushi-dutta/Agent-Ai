
'use client'

import * as React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Bot, LineChart, ShieldCheck, Star, Facebook, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ThemeToggle } from '@/components/theme-toggle';

const TestimonialCard = ({ name, role, text, avatarSrc }: { name: string, role: string, text: string, avatarSrc: string }) => {
    return (
        <figure className="bg-card p-6 rounded-xl shadow-sm border h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
            <div className="flex mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
            </div>
            <blockquote className="text-muted-foreground italic flex-grow">
                <p>"{text}"</p>
            </blockquote>
            <figcaption className="flex items-center mt-6 pt-4 border-t">
                <Image src={avatarSrc} alt={name} width={48} height={48} className="rounded-full mr-4" data-ai-hint="person portrait" />
                <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                </div>
            </figcaption>
        </figure>
    )
}

export default function LandingPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <div className="flex flex-col min-h-screen bg-background animate-fade-in">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 md:py-32">
            <div className="animate-slide-up">
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
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="relative rounded-xl shadow-2xl border animate-slide-up">
             <Image 
              src="https://placehold.co/1200x600.png"
              alt="FinGenie Dashboard Preview"
              width={1200}
              height={600}
              className="rounded-xl"
              data-ai-hint="dashboard application"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">A Smarter Way to Manage Your Money</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mt-4">FinGenie provides the clarity and tools you need to take control of your financial future.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="p-4 bg-primary/10 rounded-full mb-4 ring-8 ring-primary/5">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">AI-Powered Chat</h3>
                <p className="text-muted-foreground">Ask any financial question in plain English and get instant, intelligent answers.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="p-4 bg-primary/10 rounded-full mb-4 ring-8 ring-primary/5">
                  <LineChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Insightful Dashboard</h3>
                <p className="text-muted-foreground">Visualize your net worth, track spending, and monitor investments all in one place.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="p-4 bg-primary/10 rounded-full mb-4 ring-8 ring-primary/5">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">Your data is yours. We use bank-level security to keep your information safe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Loved by users worldwide</h2>
                    <p className="max-w-2xl mx-auto text-muted-foreground mt-4">Don't just take our word for it. Here's what our users have to say.</p>
                </div>
                <Carousel
                  plugins={[plugin.current]}
                  className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent className="-ml-4">
                    <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                        <TestimonialCard 
                            name="Sarah K." 
                            role="Freelance Designer"
                            text="FinGenie has been a game-changer for managing my finances. The AI insights are scarily accurate and have helped me save more than I thought possible."
                            avatarSrc="https://placehold.co/100x100.png"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                        <TestimonialCard 
                            name="Michael R." 
                            role="Tech Startup Founder"
                            text="As a busy founder, I don't have time to track every penny. FinGenie does it for me and gives me a clear picture of my financial health in seconds."
                            avatarSrc="https://placehold.co/100x100.png"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                        <TestimonialCard 
                            name="Priya S." 
                            role="Marketing Manager"
                            text="I finally feel in control of my money. Setting and tracking goals is so easy, and the upcoming payment reminders have saved me from late fees twice!"
                            avatarSrc="https://placehold.co/100x100.png"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                        <TestimonialCard 
                            name="Alex T." 
                            role="Student"
                            text="FinGenie is super intuitive. I'm learning so much about budgeting and saving for the future. It's making 'adulting' feel less scary!"
                            avatarSrc="https://placehold.co/100x100.png"
                        />
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </div>
        </section>

        {/* FAQs Section */}
        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Frequently Asked Questions</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground mt-4">
                Have questions? We've got answers. If you don't see your question here, feel free to reach out.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="item-1" className="bg-card border-b-0 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">Is my financial data secure with FinGenie?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Absolutely. Security is our top priority. We use bank-level encryption (AES-256) for all your data, both in transit and at rest. We never store your bank credentials and use secure, token-based connections via the Fi MCP Server.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-card border-b-0 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">How does the AI assistant work?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our AI assistant is powered by Google's Gemini model. It's trained to understand natural language and analyze the financial data you provide within the app. It can answer questions, generate insights, and even run projections, but it never makes decisions or transactions on your behalf.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-card border-b-0 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">Is FinGenie free to use?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, FinGenie offers a powerful free tier that includes access to the core features like the dashboard, AI chat, and goal tracking. We may introduce premium features in the future for advanced users.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="bg-card border-b-0 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">Can I export my data?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, you own your data. You can export all of your financial information as a CSV file anytime from the settings page. You can also permanently delete your account and all associated data from our servers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-background">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                 <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Ready to unlock your financial potential?</h2>
                 <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join thousands of users who are building a better financial future with FinGenie.</p>
                 <Button size="lg" asChild>
                    <Link href="/signup">Get Started for Free</Link>
                </Button>
            </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="bg-secondary border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <Logo />
                    <p className="text-muted-foreground mt-4 text-sm">Your Smart Financial AI</p>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Security</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} FinGenie. All rights reserved.</p>
                <div className="flex gap-4 mt-4 sm:mt-0">
                    <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5"/></Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5"/></Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground"><Linkedin className="h-5 w-5"/></Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
