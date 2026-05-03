const express = require("express");
const router = express.Router();
const {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
} = require("../controllers/projectController");
const authenticate = require("../middleware/authenticate");
const { requireProjectRole } = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { projectSchema } = require("../middleware/schemas");

router.use(authenticate);

router.get("/", getMyProjects);
router.post("/", validate(projectSchema), createProject);

router.get("/:projectId", requireProjectRole("admin", "member"), getProjectById);
router.put("/:projectId", requireProjectRole("admin"), validate(projectSchema), updateProject);
router.delete("/:projectId", requireProjectRole("admin"), deleteProject);
router.get("/:projectId/stats", requireProjectRole("admin", "member"), getProjectStats);

module.exports = router;
