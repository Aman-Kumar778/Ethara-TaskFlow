const Project = require("../models/Project.model");
const ProjectMember = require("../models/ProjectMember.model");
const Task = require("../models/Task.model");
const Notification = require("../models/Notification.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

const createProject = asyncHandler(async (req, res) => {
  const { name, description, dueDate } = req.body;

  const project = await Project.create({
    name,
    description,
    dueDate: dueDate || undefined,
    owner: req.user._id,
  });

  await ProjectMember.create({
    project: project._id,
    user: req.user._id,
    role: "admin",
  });

  res.status(201).json(new ApiResponse(201, project, "Project created successfully"));
});

const getMyProjects = asyncHandler(async (req, res) => {
  const memberships = await ProjectMember.find({ user: req.user._id })
    .populate("project")
    .sort({ createdAt: -1 });

  const projectsWithStats = await Promise.all(
    memberships.map(async (m) => {
      const taskCount = await Task.countDocuments({ project: m.project._id });
      return {
        ...m.project.toObject(),
        role: m.role,
        taskCount,
      };
    })
  );

  res.status(200).json(new ApiResponse(200, projectsWithStats));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const memberCount = await ProjectMember.countDocuments({ project: projectId });
  const taskSummary = await Task.aggregate([
    { $match: { project: project._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  res.status(200).json(new ApiResponse(200, {
    project,
    memberCount,
    taskSummary,
  }));
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, status, dueDate } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { name, description, status, dueDate },
    { new: true, runValidators: true }
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  await Promise.all([
    Task.deleteMany({ project: projectId }),
    ProjectMember.deleteMany({ project: projectId }),
    Notification.deleteMany({ project: projectId }),
    Project.findByIdAndDelete(projectId),
  ]);

  res.status(200).json(new ApiResponse(200, null, "Project and related resources deleted"));
});

const getProjectStats = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const now = new Date();

  const stats = await Task.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        todo: { $sum: { $cond: [{ $eq: ["$status", "todo"] }, 1, 0] } },
        in_progress: { $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] } },
        in_review: { $sum: { $cond: [{ $eq: ["$status", "in_review"] }, 1, 0] } },
        done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
        overdue: {
          $sum: {
            $cond: [
              { $and: [{ $lt: ["$dueDate", now] }, { $ne: ["$status", "done"] }] },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const result = stats[0] || {
    total: 0,
    todo: 0,
    in_progress: 0,
    in_review: 0,
    done: 0,
    overdue: 0,
  };

  res.status(200).json(new ApiResponse(200, result));
});

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
};
