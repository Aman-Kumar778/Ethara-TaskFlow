import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  LayoutPanelLeft, 
  Settings, 
  LogOut, 
  X,
  ChevronRight,
  Workflow
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useAuth";
import { useProjects } from "../hooks/useProjects";
import { twMerge } from "tailwind-merge";

const Logo = () => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="relative h-12 w-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white shadow-glow-indigo">
      <Workflow size={24} />
    </div>
    <div className="flex flex-col -space-y-1">
      <span className="text-2xl font-black tracking-tighter text-white">
        TaskFlow
      </span>
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] ml-1">Systems</span>
    </div>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const logoutMutation = useLogout();
  const { data: projectsData } = useProjects();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: LayoutPanelLeft },
  ];

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      authLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const projects = projectsData?.data || [];

  return (
    <aside
      className={twMerge(
        "fixed inset-y-0 left-0 z-30 w-72 transform bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo Area */}
        <div className="flex h-24 items-center justify-between px-8 border-b border-slate-800/50">
          <Link to="/dashboard">
            <Logo />
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-6 py-10 overflow-y-auto">
          <div className="mb-8">
            <p className="px-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Core Menu</p>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={twMerge(
                "group flex items-center rounded-2xl px-4 py-4 text-base font-bold transition-all duration-300",
                location.pathname === link.href
                  ? "sidebar-item-active"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
              )}
              onClick={() => onClose()}
            >
              <link.icon
                className={twMerge(
                  "mr-4 h-6 w-6 transition-all duration-300",
                  location.pathname === link.href ? "text-primary-400" : "text-slate-600 group-hover:text-primary-400"
                )}
              />
              {link.name}
            </Link>
          ))}

          {/* Recent Projects */}
          <div className="mt-12">
            <div className="flex items-center justify-between px-3 mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Workspaces</p>
            </div>
            <div className="space-y-1">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className={twMerge(
                    "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
                    location.pathname === `/projects/${project._id}`
                      ? "bg-slate-800 text-white border border-slate-700 shadow-xl"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                  onClick={() => onClose()}
                >
                  <div className="flex items-center min-w-0">
                    <div className="mr-4 h-2 w-2 rounded-full bg-slate-800 border border-slate-700 group-hover:bg-primary-500 transition-all shadow-glow-indigo" />
                    <span className="truncate">{project.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800/50 p-8">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-2xl px-4 py-4 text-base font-bold text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400 group"
          >
            <LogOut className="mr-4 h-6 w-6 text-slate-600 group-hover:text-red-400 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
