import React from "react";
import Button from "./Button";
import { twMerge } from "tailwind-merge";

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction, 
  className 
}) => {
  return (
    <div className={twMerge(
      "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center",
      className
    )}>
      {Icon && (
        <div className="mb-4 rounded-full bg-slate-50 p-4 text-slate-300">
          <Icon size={48} />
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-slate-500 max-w-xs mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary" className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
