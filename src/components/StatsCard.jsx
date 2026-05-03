import React from "react";
import { twMerge } from "tailwind-merge";
import { Clock, TrendingUp, Activity } from "lucide-react";

const colorVariants = {
  blue: {
    icon: "bg-primary-500/10 text-primary-400 ring-primary-500/20",
    accent: "text-primary-400",
    glow: "shadow-primary-500/20",
    pulse: "bg-primary-500"
  },
  red: {
    icon: "bg-red-500/10 text-red-400 ring-red-500/20",
    accent: "text-red-400",
    glow: "shadow-red-500/20",
    pulse: "bg-red-500"
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    accent: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    pulse: "bg-emerald-500"
  },
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20",
    accent: "text-indigo-400",
    glow: "shadow-indigo-500/20",
    pulse: "bg-indigo-500"
  }
};

const StatsCard = ({ title, value, icon: Icon, color = "blue", isAlert = false, subtitle = "Recently updated" }) => {
  const config = colorVariants[color] || colorVariants.blue;

  return (
    <div className={twMerge(
      "relative overflow-hidden rounded-[32px] p-8 border border-slate-800 bg-slate-800 transition-all duration-500 hover:shadow-glow-indigo hover:border-slate-700 hover:-translate-y-2 group"
    )}>
      {/* Decorative gradient blob */}
      <div className={twMerge(
        "absolute -right-10 -top-10 h-40 w-40 rounded-full blur-[80px] opacity-20 transition-opacity group-hover:opacity-30",
        color === 'red' ? 'bg-red-500' : 'bg-primary-500'
      )} />

      <div className="relative flex items-center justify-between mb-10">
        <div className={twMerge(
          "rounded-2xl p-4 ring-1 transition-all duration-500 group-hover:scale-110 shadow-lg",
          config.icon
        )}>
          <Icon size={32} strokeWidth={2} />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 text-[10px] font-black text-wheat-400 uppercase tracking-widest shadow-xl">
          <div className={twMerge("h-1.5 w-1.5 rounded-full animate-pulse", config.pulse)} />
          System Active
        </div>
      </div>

      <div className="relative space-y-2">
        <p className="text-[11px] font-black text-wheat-600 uppercase tracking-[0.4em]">{title}</p>
        <p className={twMerge(
          "text-6xl font-black tracking-tighter leading-none text-white",
          isAlert && "text-red-400"
        )}>
          {value}
        </p>
        <div className="flex flex-col gap-3 pt-8">
          <div className="flex items-center gap-3 text-[11px] font-black text-wheat-500 uppercase tracking-[0.2em]">
            <Activity size={14} className="text-primary-500" />
            {subtitle}
          </div>
          {/* Progress Indicator line */}
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/30">
            <div className={twMerge("h-full rounded-full transition-all duration-1000 group-hover:brightness-125", config.pulse)} style={{ width: value > 0 ? '65%' : '10%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
