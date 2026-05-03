import React from "react";
import { twMerge } from "tailwind-merge";

const Skeleton = ({ className }) => {
  return (
    <div
      className={twMerge(
        "animate-pulse rounded-md bg-slate-200",
        className
      )}
    />
  );
};

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="mt-4 h-6 w-3/4" />
    <Skeleton className="mt-2 h-4 w-full" />
    <Skeleton className="mt-1 h-4 w-5/6" />
    <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export default Skeleton;
