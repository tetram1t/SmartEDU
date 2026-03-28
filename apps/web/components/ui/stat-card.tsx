import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  className?: string
  trend?: { value: number; isPositive: boolean }
}

export function StatCard({ title, value, description, icon, className, trend }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-surface-500 dark:text-surface-400">{title}</CardTitle>
        {icon && <div className="text-surface-500 dark:text-surface-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-surface-900 dark:text-white">{value}</div>
        {(description || trend) && (
          <p className="mt-1 flex items-center text-xs text-surface-500 dark:text-surface-400">
            {trend && (
              <span className={cn("mr-2 font-medium", trend.isPositive ? "text-green-500" : "text-red-500")}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
