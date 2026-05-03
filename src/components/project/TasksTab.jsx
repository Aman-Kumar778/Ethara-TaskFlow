import React, { useState } from "react";
import { Search, LayoutGrid, Table as TableIcon, Plus, Filter } from "lucide-react";
import Button from "../Button";
import Input from "../Input";
import KanbanBoard from "./KanbanBoard";
import TaskTable from "./TaskTable";
import TaskSlideOver from "./TaskSlideOver";
import { useTasks } from "../../hooks/useTasks";
import Spinner from "../Spinner";
import { twMerge } from "tailwind-merge";

const TasksTab = ({ projectId, isAdmin, members }) => {
  const [view, setView] = useState("kanban");
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: tData, isLoading } = useTasks(projectId, {
    search: searchQuery,
    status: statusFilter,
  });

  const tasks = tData?.data?.data || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-800 p-6 rounded-[32px] border border-slate-700/50 shadow-2xl">
        <div className="flex flex-1 items-center gap-6">
          <div className="relative flex-1 max-w-sm group">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl bg-slate-900 border-slate-800 pl-12 pr-5 py-3 text-sm font-bold text-white placeholder:text-slate-600 focus:bg-slate-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl bg-slate-900 border-slate-800 px-5 py-3 text-sm font-bold text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all outline-none cursor-pointer"
          >
            <option value="">All Systems</option>
            <option value="todo">Pending</option>
            <option value="in_progress">Active</option>
            <option value="in_review">Evaluation</option>
            <option value="done">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center rounded-2xl bg-slate-900 p-1.5 border border-slate-800 shadow-inner">
            <button
              onClick={() => setView("kanban")}
              className={twMerge(
                "p-2.5 rounded-xl transition-all",
                view === "kanban" ? "bg-slate-800 text-primary-400 shadow-xl border border-slate-700/50" : "text-slate-600 hover:text-slate-300"
              )}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setView("table")}
              className={twMerge(
                "p-2.5 rounded-xl transition-all",
                view === "table" ? "bg-slate-800 text-primary-400 shadow-xl border border-slate-700/50" : "text-slate-600 hover:text-slate-300"
              )}
            >
              <TableIcon size={20} />
            </button>
          </div>
          {isAdmin && (
            <Button size="md" onClick={() => setIsSlideOverOpen(true)} className="rounded-2xl shadow-glow-indigo btn-primary-glow">
              <Plus size={20} className="mr-2" /> New Task
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      ) : view === "kanban" ? (
        <KanbanBoard projectId={projectId} tasks={tasks} isAdmin={isAdmin} />
      ) : (
        <TaskTable projectId={projectId} tasks={tasks} isAdmin={isAdmin} />
      )}

      {/* New Task SlideOver */}
      <TaskSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        projectId={projectId}
        members={members}
      />
    </div>
  );
};

export default TasksTab;
