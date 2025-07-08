import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Wallet className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold font-headline text-foreground">
        FinGenie
      </h1>
    </div>
  );
}
