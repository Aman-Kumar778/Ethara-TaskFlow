import React from "react";
import { twMerge } from "tailwind-merge";

const StatusBadge = ({ status, className }) => {
  const variants = {
    todo: "bg-slate-900 text-slate-400 border-slate-700",
    in_progress: "bg-primary-500/10 text-primary-400 border-primary-500/20",
    in_review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    completed: "bg-primary-500/10 text-primary-400 border-primary-500/20",
  };

  const label = status?.replace("_", " ").toUpperCase() || "TODO";

  return (
    <span className={twMerge(
      "px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border shadow-sm",
      variants[status] || variants.todo,
      className
    )}>
      {label}
    </span>
  );
};

const PriorityBadge = ({ priority, className }) => {
  const variants = {
    low: "bg-slate-900 text-slate-500 border-slate-800",
    medium: "bg-primary-500/10 text-primary-400 border-primary-500/20",
    high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span className={twMerge(
      "px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border shadow-sm",
      variants[priority] || variants.medium,
      className
    )}>
      {priority || "MEDIUM"}
    </span>
  );
};

const RoleBadge = ({ role, className }) => {
  const variants = {
    admin: "bg-primary-500/10 text-primary-400 border-primary-500/20",
    member: "bg-slate-900 text-slate-500 border-slate-800",
  };

  return (
    <span className={twMerge(
      "px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border shadow-sm",
      variants[role] || variants.member,
      className
    )}>
      {role}
    </span>
  );
};

export { StatusBadge, PriorityBadge, RoleBadge };
