import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SlideOver from "../SlideOver";
import Input from "../Input";
import Select from "../Select";
import Button from "../Button";
import { useCreateTask } from "../../hooks/useTasks";
import toast from "react-hot-toast";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  assignee: z.string().nullable().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["todo", "in_progress", "in_review", "done"]),
  dueDate: z.string().optional(),
});

const TaskSlideOver = ({ isOpen, onClose, projectId, members }) => {
  const createTaskMutation = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "medium",
      status: "todo",
      assignee: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      await createTaskMutation.mutateAsync({
        projectId,
        data: {
          ...data,
          assignee: data.assignee === "" ? null : data.assignee,
        },
      });
      toast.success("Task created successfully");
      reset();
      onClose();
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        backendErrors.forEach((err) => {
          setError(err.field, { type: "manual", message: err.message });
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create task");
      }
    }
  };

  const memberOptions = [
    { label: "Unassigned", value: "" },
    ...members.map((m) => ({ label: m.user.name, value: m.user._id })),
  ];

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-12">
        <Input
          label="Task Title"
          placeholder="e.g. Design Landing Page"
          {...register("title")}
          error={errors.title?.message}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            {...register("description")}
            className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 min-h-[120px]"
            placeholder="Add some details about this task..."
          />
          {errors.description && (
            <p className="text-xs font-medium text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
              { label: "Critical", value: "critical" },
            ]}
            {...register("priority")}
            error={errors.priority?.message}
          />
          <Select
            label="Status"
            options={[
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in_progress" },
              { label: "In Review", value: "in_review" },
              { label: "Done", value: "done" },
            ]}
            {...register("status")}
            error={errors.status?.message}
          />
        </div>

        <Select
          label="Assign To"
          options={memberOptions}
          {...register("assignee")}
          error={errors.assignee?.message}
        />

        <Input
          label="Due Date"
          type="date"
          {...register("dueDate")}
          error={errors.dueDate?.message}
        />

        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={createTaskMutation.isPending}
          >
            Create Task
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};

export default TaskSlideOver;
