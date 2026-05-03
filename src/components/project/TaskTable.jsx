import React from "react";
import { MoreHorizontal, Calendar, User, Clock } from "lucide-react";
import { StatusBadge, PriorityBadge } from "../Badge";
import Avatar from "../Avatar";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

const TaskTable = ({ tasks }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Task Title</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Assignee</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Priority</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Due Date</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">No tasks found.</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate max-w-xs">
                      {task.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignee.name} size="sm" className="h-7 w-7" />
                        <span className="text-sm font-medium text-slate-700">{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className={twMerge(
                      "flex items-center gap-2 text-sm",
                      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done" 
                        ? "text-red-500 font-semibold" 
                        : "text-slate-600"
                    )}>
                      <Calendar size={14} />
                      {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
