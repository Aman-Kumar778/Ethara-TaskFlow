import React from "react";
import { twMerge } from "tailwind-merge";

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getColorFromName = (name) => {
  if (!name) return colors[0];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const Avatar = ({ name, src, size = "md", className }) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={twMerge(
          "rounded-full object-cover border-2 border-white shadow-sm",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={twMerge(
        "flex items-center justify-center rounded-full font-bold text-white shadow-sm border-2 border-white",
        sizeClasses[size],
        getColorFromName(name),
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
