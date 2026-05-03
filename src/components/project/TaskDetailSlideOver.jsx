import React from "react";
import SlideOver from "../SlideOver";
import { StatusBadge, PriorityBadge } from "../Badge";
import Avatar from "../Avatar";
import { format } from "date-fns";
import { Clock, AlignLeft, User, Calendar, Tag, CheckCircle2, RotateCcw } from "lucide-react";
import Button from "../Button";
import { useUpdateTask } from "../../hooks/useTasks";
import toast from "react-hot-toast";

const TaskDetailSlideOver = ({ isOpen, onClose, task, projectId }) => {
  const updateTaskMutation = useUpdateTask();

  if (!task) return null;

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateTaskMutation.mutateAsync({
        projectId,
        taskId: task._id,
        data: { status: newStatus },
      });
      toast.success(`Task moved to ${newStatus.replace("_", " ")}`);
      onClose();
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title="Task Intelligence">
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <PriorityBadge priority={task.priority} className="px-5 py-2 text-xs" />
            <StatusBadge status={task.status} className="px-5 py-2 text-xs" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">
            {task.title}
          </h2>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-6 p-6 rounded-[32px] bg-slate-900 border border-slate-800">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <User size={14} className="text-primary-500" /> Operator
            </p>
            <div className="flex items-center gap-3">
              <Avatar name={task.assignee?.name} size="sm" />
              <span className="text-sm font-bold text-white">{task.assignee?.name || "Unassigned"}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Calendar size={14} className="text-accent-500" /> Deadline
            </p>
            <p className="text-sm font-bold text-white">
              {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "No Limit"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="flex items-center gap-2 text-[11px] font-black text-wheat-600 uppercase tracking-widest">
            <AlignLeft size={16} className="text-primary-500" /> Strategic Objectives
          </p>
          <div className="rounded-[32px] bg-slate-800/50 p-8 border border-slate-700/30 text-wheat-400 font-medium leading-relaxed">
            {task.description || "No specific objectives defined for this task."}
          </div>
        </div>

        {/* Actions Section */}
        <div className="space-y-4 pt-10 border-t border-slate-800">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Execution Controls</p>
          <div className="grid grid-cols-1 gap-4">
            {task.status !== "in_review" && task.status !== "done" && (
              <Button 
                onClick={() => handleStatusUpdate("in_review")}
                className="w-full py-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all shadow-lg"
              >
                <RotateCcw size={18} className="mr-2" /> Submit for Review
              </Button>
            )}
            {task.status !== "done" && (
              <Button 
                onClick={() => handleStatusUpdate("done")}
                className="w-full py-4 rounded-2xl shadow-glow-indigo btn-primary-glow"
              >
                <CheckCircle2 size={18} className="mr-2" /> Mark as Completed
              </Button>
            )}
            {task.status === "done" && (
              <Button 
                onClick={() => handleStatusUpdate("in_progress")}
                variant="secondary"
                className="w-full py-4 rounded-2xl"
              >
                <RotateCcw size={18} className="mr-2" /> Re-open Task
              </Button>
            )}
          </div>
        </div>
      </div>
    </SlideOver>
  );
};

export default TaskDetailSlideOver;
