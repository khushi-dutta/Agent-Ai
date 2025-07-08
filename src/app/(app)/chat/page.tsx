'use client';

import { useState, useRef, useEffect } from "react";
import { answerFinancialQuestion } from "@/ai/flows/answer-financial-question";
import { financialData } from "@/lib/mcp-data"; // Using mock data
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Loader } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
      { id: '1', text: "Hello! I'm FinGenie. How can I help you with your finances today? You can ask things like 'What is my net worth?' or 'How much did I spend on groceries last month?'.", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await answerFinancialQuestion({
                question: input,
                financialData: JSON.stringify(financialData),
            });
            const aiMessage: Message = { id: (Date.now() + 1).toString(), text: response.answer, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't process that. Please try again.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
            console.error("Error with AI chat:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col">
        <Card className="flex-1 flex flex-col w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Bot className="text-primary"/> AI Financial Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="space-y-6 pr-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.sender === 'ai' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("max-w-xs md:max-w-md p-3 rounded-xl", message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                     {message.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><User size={20}/></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs md:max-w-md p-3 rounded-xl bg-muted flex items-center">
                            <Loader className="h-5 w-5 animate-spin"/>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                    id="message"
                    placeholder="Ask a financial question..."
                    className="flex-1"
                    autoComplete="off"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    );
}
