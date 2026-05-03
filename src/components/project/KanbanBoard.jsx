import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useUpdateTask } from "../../hooks/useTasks";
import { StatusBadge, PriorityBadge } from "../Badge";
import Avatar from "../Avatar";
import { format } from "date-fns";
import { Clock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import TaskDetailSlideOver from "./TaskDetailSlideOver";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-slate-800/50", glow: "shadow-slate-500/10" },
  { id: "in_progress", title: "In Progress", color: "bg-primary-500/5", glow: "shadow-primary-500/10" },
  { id: "in_review", title: "In Review", color: "bg-amber-500/5", glow: "shadow-amber-500/10" },
  { id: "done", title: "Done", color: "bg-emerald-500/5", glow: "shadow-emerald-500/10" },
];

const KanbanBoard = ({ projectId, tasks, isAdmin }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const updateTaskMutation = useUpdateTask();

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    try {
      await updateTaskMutation.mutateAsync({
        projectId,
        taskId: draggableId,
        data: { status: destination.droppableId },
      });
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[700px] overflow-x-auto pb-10 scrollbar-hide">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex flex-col min-w-[270px]">
              <div className="flex items-center justify-between mb-5 px-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-white tracking-tight">{column.title}</h3>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-wheat-400 shadow-xl">
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 rounded-[32px] p-4 transition-all duration-300 border border-slate-800/50 ${
                      snapshot.isDraggingOver ? "bg-slate-800/80 shadow-glow-indigo" : "bg-slate-800/30"
                    }`}
                  >
                    <div className="space-y-6">
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              className={`group relative rounded-[24px] bg-slate-800 p-5 border transition-all duration-300 shadow-lg cursor-pointer ${
                                snapshot.isDragging 
                                  ? "shadow-[0_0_50px_rgba(99,102,241,0.4)] ring-2 ring-primary-500 scale-105 z-50 border-primary-500" 
                                  : "border-slate-700/50 hover:border-primary-500/30 hover:shadow-glow-indigo hover:-translate-y-1"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3 mb-4">
                                <PriorityBadge priority={task.priority} className="px-3 py-1 text-[10px]" />
                                {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done" && (
                                  <div className="p-1.5 rounded-full bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
                                    <AlertCircle size={14} />
                                  </div>
                                )}
                              </div>
                              <h4 className="text-base font-black text-white leading-tight mb-6 group-hover:text-primary-400 transition-colors tracking-tight">
                                {task.title}
                              </h4>
                              
                              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/30">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-wheat-500">
                                  {task.dueDate && (
                                    <>
                                      <Clock size={14} className={new Date(task.dueDate) < new Date() && task.status !== "done" ? "text-red-500" : "text-primary-500"} />
                                      <span className={new Date(task.dueDate) < new Date() && task.status !== "done" ? "text-red-500" : ""}>
                                        {format(new Date(task.dueDate), "MMM d")}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <Avatar name={task.assignee?.name} size="sm" className="h-8 w-8 ring-2 ring-slate-900 shadow-xl" />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskDetailSlideOver
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        projectId={projectId}
      />
    </>
  );
};

export default KanbanBoard;
