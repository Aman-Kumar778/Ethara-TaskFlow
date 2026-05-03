import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Settings, 
  Trash2, 
  Calendar, 
  LayoutGrid, 
  Table as TableIcon,
  Users,
  PieChart,
  ListTodo,
  Plus
} from "lucide-react";
import { useProject, useDeleteProject } from "../hooks/useProjects";
import { useMembers } from "../hooks/useMembers";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import { StatusBadge } from "../components/Badge";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Sub-components
import TasksTab from "../components/project/TasksTab";
import MembersTab from "../components/project/MembersTab";
import OverviewTab from "../components/project/OverviewTab";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");

  const { data: pData, isLoading: isProjectLoading } = useProject(projectId);
  const { data: mData, isLoading: isMembersLoading } = useMembers(projectId);
  const deleteProjectMutation = useDeleteProject();

  const project = pData?.data?.project;
  const members = mData?.data || [];
  const currentUserMembership = members.find(m => m.user._id === user?._id);
  const isAdmin = currentUserMembership?.role === "admin";

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProjectMutation.mutateAsync(projectId);
        toast.success("Project deleted successfully");
        navigate("/projects");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  if (isProjectLoading || isMembersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Project not found</h2>
        <Button variant="primary" className="mt-4" onClick={() => navigate("/projects")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "tasks", name: "Tasks", icon: ListTodo },
    { id: "members", name: "Members", icon: Users },
    { id: "overview", name: "Overview", icon: PieChart },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{project.name}</h1>
            <StatusBadge status={project.status} className="px-4 py-1.5 text-xs" />
            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] border-2 ${
              isAdmin ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-500 border-slate-100"
            }`}>
              {isAdmin ? "Admin Access" : "Member View"}
            </div>
          </div>
          <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">{project.description || "No description provided."}</p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span>Due: {project.dueDate ? format(new Date(project.dueDate), "MMM d, yyyy") : "No due date"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-slate-400" />
              <span>{members.length} Members</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Settings size={16} className="mr-2" /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete} isLoading={deleteProjectMutation.isPending}>
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${
              activeTab === tab.id
                ? "text-primary-600"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <tab.icon size={18} />
            {tab.name}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "tasks" && <TasksTab projectId={projectId} isAdmin={isAdmin} members={members} />}
        {activeTab === "members" && <MembersTab projectId={projectId} isAdmin={isAdmin} members={members} />}
        {activeTab === "overview" && <OverviewTab projectId={projectId} />}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
