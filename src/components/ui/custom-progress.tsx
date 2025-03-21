"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CustomProgressProps {
    value: number
    max?: number
    className?: string
    indicatorClassName?: string
    showLabel?: boolean
    labelPosition?: 'inside' | 'outside'
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function CustomProgress({
    value,
    max = 100,
    className,
    indicatorClassName,
    showLabel = false,
    labelPosition = 'outside',
    onClick
}: CustomProgressProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
        <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-indigo-900/50", className)} onClick={onClick}>
            <div
                className={cn(
                    "h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full transition-all duration-300 ease-in-out",
                    indicatorClassName
                )}
                style={{ width: `${percentage}%` }}
            >
                {showLabel && labelPosition === 'inside' && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {percentage.toFixed(0)}%
                    </span>
                )}
            </div>
            {showLabel && labelPosition === 'outside' && (
                <span className="absolute right-0 -top-5 text-xs font-medium text-cyan-300">
                    {percentage.toFixed(0)}%
                </span>
            )}
        </div>
    )
} 