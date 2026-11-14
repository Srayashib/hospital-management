import express from "express";

import {
  addDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentStatus,
} from "../controllers/departmentController.js";

const router = express.Router();

// Add Department
router.post("/", addDepartment);

// Get All Departments
router.get("/", getDepartments);

// Get Single Department
router.get("/:id", getDepartmentById);

// Update Department
router.put("/:id", updateDepartment);

// Delete Department
router.delete("/:id", deleteDepartment);

router.patch(
  "/:id/toggle-status",
  toggleDepartmentStatus
);
export default router;