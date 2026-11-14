import Department from "../models/Department.js";



// Add Department

export const addDepartment = async (req, res) => {
  try {

    const {
    name,
    head,
    location,
    description,
    status,
} = req.body;

    const exist = await Department.findOne({ name });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Department already exists.",
      });
    }

    const department = await Department.create({
    name,
    head,
    location,
    description,
    status,
});

    res.status(201).json({
      success: true,
      message: "Department created successfully.",
      department,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// Get All Departments

export const getDepartments = async (req, res) => {

  try {

    const departments = await Department.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      departments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};




// Get Single Department

export const getDepartmentById = async (req, res) => {

  try {

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    res.json({
      success: true,
      department,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};




// Update Department

export const updateDepartment = async (req, res) => {

  try {

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    res.json({
      success: true,
      message: "Department updated successfully.",
      department,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};




// Delete Department

export const deleteDepartment = async (req, res) => {

  try {

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    await department.deleteOne();

    res.json({
      success: true,
      message: "Department deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const toggleDepartmentStatus = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    department.status =
  department.status === "Active"
    ? "Inactive"
    : "Active";

await department.save();

    res.status(200).json({
      success: true,
      message: "Department status updated.",
      department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};