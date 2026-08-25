import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  className?: string;
}

export function AnalyticsCard({ title, value, icon, trend, delay = 0, className }: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-card shadow-soft p-6 group transition-all duration-300 hover:shadow-soft-hover border border-gray-50",
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100 transition-colors shadow-inner">
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm border",
            trend.isPositive ? "text-green-600 bg-green-50 border-green-100" : "text-red-500 bg-red-50 border-red-100"
          )}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <h4 className="text-muted-foreground text-sm font-semibold mb-1">{title}</h4>
        <div className="font-heading text-4xl font-bold text-foreground tracking-tight">
          {value}
        </div>
      </div>
    </motion.div>
  );
}
