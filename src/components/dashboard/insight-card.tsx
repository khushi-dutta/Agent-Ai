'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle2, Info, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Insight } from '@/ai/flows/generate-financial-insights';

const insightCardVariants = cva(
  'rounded-xl border p-4 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1',
  {
    variants: {
      category: {
        warning: 'bg-insight-warning-bg border-insight-warning-border text-insight-warning-fg',
        success: 'bg-insight-success-bg border-insight-success-border text-insight-success-fg',
        info: 'bg-insight-info-bg border-insight-info-border text-insight-info-fg',
        opportunity: 'bg-insight-opportunity-bg border-insight-opportunity-border text-insight-opportunity-fg',
      },
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle2,
  info: TrendingUp,
  opportunity: Info,
};

interface InsightCardProps extends VariantProps<typeof insightCardVariants> {
  insight: Insight;
}

export function InsightCard({ insight, category }: InsightCardProps) {
  const Icon = iconMap[insight.category] || Sparkles;

  const ctaButtonVariant = {
      warning: "destructive",
      success: "default",
      info: "default",
      opportunity: "default"
  }

  return (
    <div className={cn(insightCardVariants({ category }))}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5" />
          <h3 className="font-semibold font-headline">{insight.title}</h3>
        </div>
        <p className="text-sm opacity-80 mb-3">{insight.description}</p>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-lg font-bold">{insight.value}</span>
        <Button 
          variant={category === 'warning' || category === 'success' ? 'ghost' : 'outline'} 
          size="sm"
          className={cn(
              "text-xs h-auto px-2 py-1",
              category === 'warning' && "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
              category === 'success' && "bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400",
              category === 'info' && "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20",
              category === 'opportunity' && "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20"
          )}
        >
          {insight.callToAction}
        </Button>
      </div>
    </div>
  );
}
