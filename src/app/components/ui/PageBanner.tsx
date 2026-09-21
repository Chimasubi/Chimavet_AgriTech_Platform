import * as React from "react";
import { Sprout } from "lucide-react";
import { Badge } from "./badge";
import { cn } from "./utils";

interface PageBannerProps {
  badge?: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function PageBanner({
  badge,
  title,
  subtitle,
  icon,
  actions,
  footer,
  className,
}: PageBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-green-950 via-green-700 to-green-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-green-500/20 [@media(orientation:landscape)_and_(max-height:480px)]:p-4 [@media(orientation:landscape)_and_(max-height:480px)]:mb-4",
        className
      )}
    >
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-green-500/10 blur-2xl pointer-events-none" />
      <Sprout className="absolute -right-4 -bottom-6 w-40 h-40 text-white/5 rotate-12 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {badge && (
            <Badge className="bg-white/15 text-green-100 border-white/20 mb-3 backdrop-blur-md px-3 py-1 bg-clip-padding">
              {badge}
            </Badge>
          )}
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3 [@media(orientation:landscape)_and_(max-height:480px)]:text-2xl">
            {icon && <span className="text-green-300">{icon}</span>}
            {title}
          </h1>
          {subtitle && <p className="text-green-100 text-sm mt-1 max-w-xl leading-relaxed [@media(orientation:landscape)_and_(max-height:480px)]:text-xs">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center gap-3 flex-wrap shrink-0">{actions}</div>}
      </div>

      {footer && <div className="relative z-10 mt-6 pt-4 border-t border-green-500/20">{footer}</div>}
    </div>
  );
}