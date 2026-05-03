const ProjectMember = require("../models/ProjectMember.model");
const User = require("../models/User.model");
const Task = require("../models/Task.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const members = await ProjectMember.find({ project: projectId }).populate("user", "name email avatar");
  res.status(200).json(new ApiResponse(200, members));
});

const addMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { email, role } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  const existingMember = await ProjectMember.findOne({ project: projectId, user: user._id });
  if (existingMember) {
    throw new ApiError(409, "User is already a member of this project");
  }

  const member = await ProjectMember.create({
    project: projectId,
    user: user._id,
    role,
  });

  const populatedMember = await ProjectMember.findById(member._id).populate("user", "name email avatar");

  res.status(201).json(new ApiResponse(201, populatedMember, "Member added successfully"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { role } = req.body;

  const targetMember = await ProjectMember.findById(memberId);
  if (!targetMember) {
    throw new ApiError(404, "Member not found");
  }

  if (targetMember.role === "admin" && role === "member") {
    const adminCount = await ProjectMember.countDocuments({ project: projectId, role: "admin" });
    if (adminCount === 1) {
      throw new ApiError(400, "Cannot demote the last admin of the project");
    }
  }

  targetMember.role = role;
  await targetMember.save();

  const populatedMember = await ProjectMember.findById(memberId).populate("user", "name email avatar");
  res.status(200).json(new ApiResponse(200, populatedMember, "Member role updated"));
});

const removeMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  const targetMember = await ProjectMember.findById(memberId);
  if (!targetMember) {
    throw new ApiError(404, "Member not found");
  }

  if (targetMember.role === "admin") {
    const adminCount = await ProjectMember.countDocuments({ project: projectId, role: "admin" });
    if (adminCount === 1) {
      throw new ApiError(400, "Cannot remove the last admin of the project");
    }
  }

  await Task.updateMany(
    { project: projectId, assignee: targetMember.user },
    { $set: { assignee: null } }
  );

  await ProjectMember.findByIdAndDelete(memberId);

  res.status(200).json(new ApiResponse(200, null, "Member removed successfully"));
});

module.exports = {
  getProjectMembers,
  addMember,
  updateMemberRole,
  removeMember,
};
