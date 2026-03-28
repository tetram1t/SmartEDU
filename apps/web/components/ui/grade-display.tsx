import { cn } from "@/lib/utils"
import { GRADE_SCALE } from "@smartedu/shared"

interface GradeDisplayProps {
  score: number
  maxScore?: number
  showMax?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function GradeDisplay({ score, maxScore = 10, showMax = false, size = "md", className }: GradeDisplayProps) {
  const color = (GRADE_SCALE.COLORS as Record<number, string>)[score] || "#94a3b8"
  
  const sizeClasses = {
    sm: "text-lg px-2 py-1",
    md: "text-2xl px-3 py-1.5",
    lg: "text-4xl px-4 py-2"
  }

  return (
    <div 
      className={cn("inline-flex items-center justify-center rounded-xl font-bold text-white shadow-sm", sizeClasses[size], className)}
      style={{ backgroundColor: color }}
    >
      <span>{score}</span>
      {showMax && (
        <span className="ml-1 text-sm font-normal opacity-70">/{maxScore}</span>
      )}
    </div>
  )
}
