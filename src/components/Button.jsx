import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

const variants = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs font-medium",
  md: "px-4 py-2 text-sm font-medium",
  lg: "px-6 py-3 text-base font-semibold",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  isLoading = false,
  disabled = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={twMerge(
        "inline-flex items-center justify-center rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="mr-2 border-current" />}
      {children}
    </button>
  );
};

export default Button;
