const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  dueDate: z.string().optional().or(z.string().length(0)).optional(),
});

const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  assignee: z.string().nullable().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).optional(),
  dueDate: z.string().optional().or(z.string().length(0)).optional(),
});

const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

const updateRoleSchema = z.object({
  role: z.enum(["admin", "member"]),
});

const updateStatusSchema = z.object({
  status: z.enum(["todo", "in_progress", "in_review", "done"]),
});

module.exports = {
  registerSchema,
  loginSchema,
  projectSchema,
  taskSchema,
  addMemberSchema,
  updateRoleSchema,
  updateStatusSchema,
};
