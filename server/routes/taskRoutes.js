const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authenticate = require("../middleware/authenticate");
const { requireProjectRole } = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { taskSchema } = require("../middleware/schemas");

router.use(authenticate);

router.get("/", requireProjectRole("admin", "member"), getProjectTasks);
router.post("/", requireProjectRole("admin"), validate(taskSchema), createTask);

router.get("/:taskId", requireProjectRole("admin", "member"), getTaskById);
router.patch("/:taskId", requireProjectRole("admin", "member"), updateTask);
router.delete("/:taskId", requireProjectRole("admin"), deleteTask);

module.exports = router;
