import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  variant: 'net-worth' | 'income' | 'expenses' | 'credit'
  description?: string
  badgeText?: string
  badgeIcon?: LucideIcon
}

const variantClasses = {
  'net-worth': {
    iconWrapper: 'bg-stat-net-worth',
    badge: 'text-stat-growth bg-stat-growth/10 border-stat-growth/20',
  },
  'income': {
    iconWrapper: 'bg-stat-income',
    badge: 'text-stat-growth bg-stat-growth/10 border-stat-growth/20',
  },
  'expenses': {
    iconWrapper: 'bg-stat-expenses',
    badge: 'text-stat-loss bg-stat-loss/10 border-stat-loss/20',
  },
  'credit': {
    iconWrapper: 'bg-stat-credit',
    badge: 'text-stat-growth bg-stat-growth/10 border-stat-growth/20',
  }
};

export default function StatCard({ title, value, icon: Icon, variant, description, badgeText, badgeIcon: BadgeIcon }: StatCardProps) {
  const classes = variantClasses[variant];

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className={cn("p-2.5 rounded-lg text-primary-foreground", classes.iconWrapper)}>
            <Icon className="h-5 w-5" />
          </div>
          {badgeText && (
            <Badge variant="outline" className={cn("flex items-center gap-1 font-medium", classes.badge)}>
              {BadgeIcon && <BadgeIcon className="h-3 w-3" />}
              {badgeText}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
