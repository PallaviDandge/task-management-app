const express = require("express");
const { body, param, query } = require("express-validator");

const {
  getTasks,
  getTaskById,
  getTaskSummary,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { handleValidationErrors } = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  [
    query("status")
      .optional()
      .isIn(["Pending", "In Progress", "Completed"])
      .withMessage("Invalid status"),
    query("priority")
      .optional()
      .isIn(["Low", "Medium", "High"])
      .withMessage("Invalid priority"),
    query("sort")
      .optional()
      .isIn(["dueDate_asc", "dueDate_desc", "createdAt_asc", "createdAt_desc"])
      .withMessage("Invalid sort option"),
    handleValidationErrors,
  ],
  getTasks
);

router.get("/summary", getTaskSummary);
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid task id"), handleValidationErrors],
  getTaskById
);

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(["Pending", "In Progress", "Completed"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["Low", "Medium", "High"])
      .withMessage("Invalid priority"),
    body("dueDate").isISO8601().withMessage("Valid due date is required"),
    handleValidationErrors,
  ],
  createTask
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid task id"),
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(["Pending", "In Progress", "Completed"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["Low", "Medium", "High"])
      .withMessage("Invalid priority"),
    body("dueDate").optional().isISO8601().withMessage("Valid due date is required"),
    handleValidationErrors,
  ],
  updateTask
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid task id"), handleValidationErrors],
  deleteTask
);

module.exports = router;
