import React from "react";
import { twMerge } from "tailwind-merge";

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

const Spinner = ({ size = "md", className }) => {
  return (
    <div
      className={twMerge(
        "animate-spin rounded-full border-slate-200 border-t-primary-600",
        sizes[size],
        className
      )}
    />
  );
};

export default Spinner;
