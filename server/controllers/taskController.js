const Task = require("../models/Task.model");
const ProjectMember = require("../models/ProjectMember.model");
const Notification = require("../models/Notification.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignee, priority, status, dueDate } = req.body;

  if (assignee) {
    const isMember = await ProjectMember.findOne({ project: projectId, user: assignee });
    if (!isMember) {
      throw new ApiError(400, "Assignee must be a project member");
    }
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignee: assignee || null,
    createdBy: req.user._id,
    priority,
    status,
    dueDate: dueDate || undefined,
  });

  if (assignee) {
    await Notification.create({
      recipient: assignee,
      message: `You have been assigned to a new task: ${title}`,
      task: task._id,
      project: projectId,
    });
  }

  const populatedTask = await Task.findById(task._id)
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  res.status(201).json(new ApiResponse(201, populatedTask, "Task created successfully"));
});

const getProjectTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status, priority, assignee, search, sortBy = "createdAt", order = "desc", page = 1, limit = 20 } = req.query;

  const query = { project: projectId };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignee) query.assignee = assignee;
  if (search) query.title = { $regex: search, $options: "i" };

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: order === "desc" ? -1 : 1 };

  const tasks = await Task.find(query)
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Task.countDocuments(query);

  res.status(200).json(new ApiResponse(200, {
    data: tasks,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  }));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId)
    .populate("project", "name")
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json(new ApiResponse(200, task));
});

const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { role } = req.membership;
  const updates = req.body;

  if (role === "member") {
    // Members can only update status
    const allowedKeys = ["status"];
    const updateKeys = Object.keys(updates);
    const isAllowed = updateKeys.every((key) => allowedKeys.includes(key));
    
    if (!isAllowed) {
      throw new ApiError(403, "Members can only update task status");
    }
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (updates.assignee && updates.assignee !== task.assignee?.toString()) {
    if (updates.assignee !== null) {
      const isMember = await ProjectMember.findOne({ project: projectId, user: updates.assignee });
      if (!isMember) {
        throw new ApiError(400, "Assignee must be a project member");
      }
      
      await Notification.create({
        recipient: updates.assignee,
        message: `Task assigned to you: ${task.title}`,
        task: task._id,
        project: projectId,
      });
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true })
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  res.status(200).json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  await Promise.all([
    Task.findByIdAndDelete(taskId),
    Notification.deleteMany({ task: taskId }),
  ]);

  res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
