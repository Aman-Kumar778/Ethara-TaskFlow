import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, Bell, Search, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import NotificationBell from "./NotificationBell";
import { twMerge } from "tailwind-merge";

const TopBar = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((p) => p);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      return { label, href, isLast: index === paths.length - 1 };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-10 flex h-24 shrink-0 items-center border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl px-10">
      <button
        className="mr-6 text-slate-400 lg:hidden p-3 hover:bg-slate-800 rounded-2xl transition-all"
        onClick={onOpenSidebar}
      >
        <Menu size={28} />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden sm:flex items-center text-sm font-black text-slate-500 uppercase tracking-widest">
        <Link to="/dashboard" className="hover:text-primary-400 transition-colors">Home</Link>
        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            <ChevronRight size={16} className="mx-4 text-slate-700" />
            <Link
              to={crumb.href}
              className={twMerge(
                "transition-all",
                crumb.isLast ? "text-white" : "hover:text-primary-400"
              )}
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-10">
        {/* Search */}
        <div className="hidden md:flex relative group w-96">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder="Search projects, tasks, members..."
            className="w-full rounded-2xl bg-slate-800 border-slate-700/50 pl-14 pr-5 py-3.5 text-sm font-medium focus:bg-slate-800/50 focus:shadow-glow-indigo transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-8">
          <NotificationBell />
          
          <div className="h-10 w-px bg-slate-800" />

          <div className="flex items-center gap-5 cursor-pointer group">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black text-white group-hover:text-primary-400 transition-colors">{user?.name}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{user?.email}</p>
            </div>
            <Avatar name={user?.name} size="md" className="h-12 w-12 ring-2 ring-slate-800 group-hover:ring-primary-500 transition-all shadow-glow-indigo" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
