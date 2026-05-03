const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getProjectMembers,
  addMember,
  updateMemberRole,
  removeMember,
} = require("../controllers/memberController");
const authenticate = require("../middleware/authenticate");
const { requireProjectRole } = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { addMemberSchema, updateRoleSchema } = require("../middleware/schemas");

router.use(authenticate);

router.get("/", requireProjectRole("admin", "member"), getProjectMembers);
router.post("/", requireProjectRole("admin"), validate(addMemberSchema), addMember);
router.patch("/:memberId", requireProjectRole("admin"), validate(updateRoleSchema), updateMemberRole);
router.delete("/:memberId", requireProjectRole("admin"), removeMember);

module.exports = router;
