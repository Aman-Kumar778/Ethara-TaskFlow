import React, { useState } from "react";
import { Plus, UserPlus, Trash2, Shield, User } from "lucide-react";
import { useAddMember, useUpdateMemberRole, useRemoveMember } from "../../hooks/useMembers";
import Button from "../Button";
import Input from "../Input";
import Modal from "../Modal";
import Avatar from "../Avatar";
import { RoleBadge } from "../Badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { format } from "date-fns";

const addMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member"]),
});

const MembersTab = ({ projectId, isAdmin, members }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addMemberMutation = useAddMember();
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { role: "member" },
  });

  const onSubmit = async (data) => {
    try {
      await addMemberMutation.mutateAsync({ projectId, data });
      toast.success("Member added successfully");
      setIsModalOpen(false);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateRoleMutation.mutateAsync({ projectId, memberId, data: { role: newRole } });
      toast.success("Role updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleRemove = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        await removeMemberMutation.mutateAsync({ projectId, memberId });
        toast.success("Member removed");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove member");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Project Members ({members.length})</h2>
        {isAdmin && (
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} className="mr-2" /> Add Member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <Avatar name={member.user.name} size="md" />
              <div>
                <h4 className="font-bold text-slate-900">{member.user.name}</h4>
                <p className="text-sm text-slate-500">{member.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</p>
                <p className="text-sm text-slate-700">{format(new Date(member.joinedAt), "MMM d, yyyy")}</p>
              </div>

              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member._id, e.target.value)}
                    className="rounded-lg bg-slate-50 border-transparent px-3 py-1.5 text-sm font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-200 transition-all outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <RoleBadge role={member.role} />
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleRemove(member._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Remove Member"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="User Email"
            placeholder="colleague@company.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                register("role").value === "member" ? "border-primary-500 bg-primary-50" : "border-slate-100 hover:border-slate-200"
              }`}>
                <input type="radio" value="member" {...register("role")} className="text-primary-600 focus:ring-primary-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Member</p>
                  <p className="text-[10px] text-slate-500">Can view and update tasks</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                register("role").value === "admin" ? "border-primary-500 bg-primary-50" : "border-slate-100 hover:border-slate-200"
              }`}>
                <input type="radio" value="admin" {...register("role")} className="text-primary-600 focus:ring-primary-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Admin</p>
                  <p className="text-[10px] text-slate-500">Full control over project</p>
                </div>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={addMemberMutation.isPending}>
              Add Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MembersTab;
