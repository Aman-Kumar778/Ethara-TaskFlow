import React, { useState } from "react";
import { Plus, Search, FolderKanban, MoreVertical, Calendar, Users, Briefcase } from "lucide-react";
import { useProjects, useCreateProject } from "../hooks/useProjects";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Spinner from "../components/Spinner";
import { StatusBadge } from "../components/Badge";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).optional(),
  dueDate: z.string().optional(),
});

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: pData, isLoading } = useProjects();
  const createProjectMutation = useCreateProject();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const projects = pData?.data || [];
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = async (data) => {
    try {
      await createProjectMutation.mutateAsync(data);
      toast.success("Project created successfully!");
      setIsModalOpen(false);
      reset();
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        backendErrors.forEach((err) => {
          setError(err.field, { type: "manual", message: err.message });
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create project");
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-[1600px] mx-auto py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-800 pb-12">
        <div className="space-y-3">
          <h1 className="text-6xl font-black text-white tracking-tighter">Workspaces</h1>
          <p className="text-xl text-wheat-400 font-medium tracking-tight">Active hubs for your team collaboration and output.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group w-80 hidden lg:block">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
            <input
              type="text"
              placeholder="Filter spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl bg-slate-800 border-slate-700/50 pl-12 pr-5 py-4 text-sm font-bold text-white focus:bg-slate-800/80 focus:shadow-glow-indigo transition-all outline-none"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="px-8 py-4 text-base shadow-glow-indigo btn-primary-glow rounded-2xl">
            <Plus size={20} className="mr-2" /> Initialize New Space
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-slate-800 bg-slate-800/20 p-24 text-center">
          <div className="mb-8 rounded-3xl bg-slate-800 p-8 shadow-xl">
            <FolderKanban size={64} className="text-slate-600" />
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight">Zero Activity Detected</h3>
          <p className="mt-4 text-lg text-wheat-500 max-w-sm font-medium">Your sector is currently idle. Initialize your first workspace to begin operations.</p>
          <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="mt-10 px-10 py-4 rounded-2xl">
            <Plus size={20} className="mr-2" /> Launch Initial Space
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="group flex flex-col rounded-[48px] bg-slate-800 border border-slate-700/50 p-10 shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] hover:-translate-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="h-20 w-20 rounded-3xl bg-slate-900 flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-700 shadow-2xl border border-slate-700/50">
                  <Briefcase size={40} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-end gap-4">
                  <StatusBadge status={project.status} className="px-6 py-2" />
                  <span className={`text-[11px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-xl border-2 ${
                    project.role === 'admin' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20 shadow-glow-indigo' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    {project.role}
                  </span>
                </div>
              </div>
              
              <h3 className="mt-12 text-3xl font-black text-white group-hover:text-primary-400 transition-colors truncate tracking-tighter">
                {project.name}
              </h3>
              <p className="mt-4 text-lg text-wheat-400 line-clamp-2 min-h-[4rem] font-medium leading-snug">
                {project.description || "No strategic objectives defined."}
              </p>

              <div className="mt-12 flex flex-col gap-10 pt-10 border-t border-slate-700/30">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.3em] text-wheat-600">
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-primary-500" />
                    <span>3 Unit Members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-accent-500" />
                    <span>
                      {project.dueDate ? format(new Date(project.dueDate), "MMM d, yyyy") : "Open-ended"}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.3em]">
                    <span className="text-wheat-500">Operation Deployment</span>
                    <span className="text-primary-400 font-black">65%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-700/50 p-[3px]">
                    <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-primary-600 to-primary-400 shadow-glow-indigo transition-all duration-1000 group-hover:brightness-125" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initialize New Workspace"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
          <Input
            label="Space Identity"
            placeholder="e.g. Operation Alpha"
            {...register("name")}
            error={errors.name?.message}
            className="rounded-2xl"
          />
          <div className="space-y-3">
            <label className="block text-sm font-black text-white uppercase tracking-widest ml-1">Strategic Objectives</label>
            <textarea
              {...register("description")}
              className="block w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm font-bold text-white transition-all placeholder:text-slate-600 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 min-h-[120px] outline-none"
              placeholder="Define the primary goals for this workspace..."
            />
            {errors.description && (
              <p className="text-xs font-black text-red-500 ml-1">{errors.description.message}</p>
            )}
          </div>
          <Input
            label="Deadline (Optional)"
            type="date"
            {...register("dueDate")}
            error={errors.dueDate?.message}
            className="rounded-2xl"
          />
          <div className="flex gap-4 pt-8">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 py-4 rounded-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              Abort
            </Button>
            <Button
              type="submit"
              className="flex-1 py-4 rounded-2xl shadow-glow-indigo btn-primary-glow"
              isLoading={createProjectMutation.isPending}
            >
              Launch Space
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
