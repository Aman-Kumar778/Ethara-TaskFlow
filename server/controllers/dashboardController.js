const Task = require("../models/Task.model");
const ProjectMember = require("../models/ProjectMember.model");
const Project = require("../models/Project.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  const memberships = await ProjectMember.find({ user: userId });
  const projectIds = memberships.map((m) => m.project);

  const [
    myTasksCount,
    overdueTasksCount,
    projectsList,
    taskStats,
    recentTasks,
  ] = await Promise.all([
    Task.countDocuments({ assignee: userId }),
    Task.countDocuments({
      assignee: userId,
      dueDate: { $lt: now },
      status: { $ne: "done" },
    }),
    ProjectMember.find({ user: userId })
      .populate("project")
      .limit(5)
      .sort({ createdAt: -1 }),
    Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Task.find({ project: { $in: projectIds } })
      .populate("project", "name")
      .sort({ updatedAt: -1 })
      .limit(5),
  ]);

  const formattedStats = {
    todo: 0,
    in_progress: 0,
    in_review: 0,
    done: 0,
  };

  taskStats.forEach((stat) => {
    formattedStats[stat._id] = stat.count;
  });

  res.status(200).json(
    new ApiResponse(200, {
      summary: {
        myTasks: myTasksCount,
        overdue: overdueTasksCount,
        projects: projectIds.length,
        completed: formattedStats.done || 0,
      },
      taskStats: formattedStats,
      projects: projectsList.map((m) => ({
        ...m.project.toObject(),
        role: m.role,
      })),
      recentTasks,
    })
  );
});

module.exports = { getDashboard };
