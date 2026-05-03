import React from "react";
import { 
  CheckCircle, 
  Clock, 
  FolderKanban, 
  AlertCircle,
  ArrowRight,
  Users
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { Link } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import { StatusBadge, PriorityBadge } from "../components/Badge";
import { format } from "date-fns";
import Avatar from "../components/Avatar";
import Spinner from "../components/Spinner";

const DashboardPage = () => {
  const { data: dData, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const dashboard = dData?.data;
  const summary = dashboard?.summary || { myTasks: 0, overdue: 0, projects: 0, completed: 0 };
  const recentTasks = dashboard?.recentTasks || [];
  const projects = dashboard?.projects || [];

  return (
    <div className="space-y-16 animate-in fade-in duration-700 max-w-[1600px] mx-auto py-10">
      <div className="space-y-3">
        <h1 className="text-6xl font-black text-white tracking-tighter">System Overview</h1>
        <p className="text-xl text-wheat-400 font-medium tracking-tight">Monitoring project performance and team activity.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="My Assignments"
          value={summary.myTasks}
          icon={CheckCircle}
          color="blue"
          subtitle="Tasks assigned to you"
        />
        <StatsCard
          title="Overdue Items"
          value={summary.overdue}
          icon={AlertCircle}
          color="red"
          isAlert={summary.overdue > 0}
          subtitle="High priority attention"
        />
        <StatsCard
          title="Workspaces"
          value={summary.projects}
          icon={FolderKanban}
          color="indigo"
          subtitle="Active team projects"
        />
        <StatsCard
          title="Completed"
          value={summary.completed}
          icon={CheckCircle}
          color="emerald"
          subtitle="Total finished items"
        />
      </div>

      <div className="grid grid-cols-1 gap-20 lg:grid-cols-3">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white tracking-tight">Latest Intelligence</h2>
          </div>
          <div className="overflow-hidden rounded-[40px] bg-slate-800 border border-slate-700/50 shadow-2xl">
            <div className="divide-y divide-slate-700/30">
              {recentTasks.length === 0 ? (
                <div className="p-24 text-center">
                  <p className="text-wheat-500 font-bold text-2xl italic tracking-tight">System idle. No recent activity.</p>
                </div>
              ) : (
                recentTasks.map((task) => (
                  <Link
                    key={task._id}
                    to={`/projects/${task.project._id}`}
                    className="flex items-center gap-10 p-10 hover:bg-slate-700/30 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-5 mb-3">
                        <span className="text-[11px] font-black text-primary-400 uppercase tracking-[0.3em] bg-primary-500/10 px-4 py-1.5 rounded-full border border-primary-500/20">
                          {task.project.name}
                        </span>
                        <span className="text-xs font-bold text-wheat-600">
                          {format(new Date(task.updatedAt), "HH:mm | MMM d")}
                        </span>
                      </div>
                      <h4 className="text-2xl font-black text-white truncate group-hover:text-primary-400 transition-colors tracking-tight">{task.title}</h4>
                    </div>
                    <div className="flex items-center gap-8">
                      <PriorityBadge priority={task.priority} className="px-5 py-2" />
                      <StatusBadge status={task.status} className="px-5 py-2" />
                    </div>
                  </Link>
                ))
              )}
            </div>
            {recentTasks.length > 0 && (
              <div className="bg-slate-900/50 p-6 text-center border-t border-slate-700/30">
                <button className="text-[12px] font-black text-wheat-500 hover:text-white flex items-center justify-center gap-3 mx-auto uppercase tracking-[0.3em] transition-all">
                  Access Complete Logs <ArrowRight size={18} className="text-primary-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* My Projects */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white tracking-tight">Active Spaces</h2>
            <Link to="/projects" className="text-[11px] font-black text-primary-400 hover:text-primary-300 uppercase tracking-[0.3em] transition-all">
              All Units
            </Link>
          </div>
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="rounded-[40px] border-2 border-dashed border-slate-700/50 p-16 text-center">
                <p className="text-wheat-500 font-bold text-lg">Empty sector. Join a project.</p>
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block rounded-[32px] bg-slate-800 p-8 border border-slate-700/50 hover:border-primary-500/50 hover:shadow-glow-indigo transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-black text-white group-hover:text-primary-400 transition-colors tracking-tight">
                      {project.name}
                    </h4>
                    <span className="rounded-xl bg-slate-900 px-4 py-1.5 text-[10px] font-black text-wheat-600 uppercase tracking-[0.3em]">
                      {project.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-wheat-500 font-bold text-sm">
                      <Clock size={18} className="text-primary-500" />
                      <span>{project.dueDate ? format(new Date(project.dueDate), "MMM d") : "No Limit"}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/50 shadow-inner">
                      <Users size={14} className="text-primary-400" />
                      <span className="text-[10px] font-black text-wheat-400 uppercase tracking-widest">
                        {project.members?.length || 3} Units
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
