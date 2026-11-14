import Leave from "../models/Leave.js";
import Doctor from "../models/Doctor.js";
import Notification from "../models/Notification.js";

// =====================================================
// DOCTOR - APPLY LEAVE
// =====================================================

export const applyLeave = async (req, res) => {
  try {

   


    const {
      leaveType,
      startDate,
      endDate,
      reason,
      description,
    } = req.body;


    // -----------------------------------------------
    // Check authentication
    // -----------------------------------------------

    if (!req.user || !req.user.id) {

      return res.status(401).json({
        success: false,
        message: "Doctor authentication failed.",
      });

    }


    // -----------------------------------------------
    // Check doctor
    // -----------------------------------------------

    const doctor = await Doctor.findById(req.user.id);

    if (!doctor) {

      return res.status(404).json({
        success: false,
        message: "Doctor account not found.",
      });

    }


    // -----------------------------------------------
    // Validate fields
    // -----------------------------------------------

    if (
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason
    ) {

      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });

    }


    // -----------------------------------------------
    // Validate dates
    // -----------------------------------------------

    if (
      new Date(endDate) <
      new Date(startDate)
    ) {

      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date.",
      });

    }


    // -----------------------------------------------
    // Create leave
    // -----------------------------------------------

    const leave = await Leave.create({
      doctor: req.user.id,
      leaveType,
      startDate,
      endDate,
      reason,
      description: description || "",
      status: "Pending",
    });

    const notification = await Notification.create({
      type: "leave",
      title: "New Leave Request",
      message: `Dr. ${doctor.name} submitted a new ${leaveType} leave request.`,
      leave: leave._id,
      doctor: doctor._id,
      isRead: false,
    });

    return res.status(201).json({
      success: true,
      message: "Leave applied successfully.",
      leave,
      notification,
    });


  


  


  } catch (error) {

    console.error("LEAVE CREATE ERROR:", error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};



// =====================================================
// DOCTOR - GET MY LEAVES
// =====================================================

export const getMyLeaves = async (req, res) => {

  try {

    const leaves = await Leave.find({
      doctor: req.user.id,
    })
      .sort({
        createdAt: -1,
      });


    return res.status(200).json({

      success: true,

      count: leaves.length,

      leaves,

    });


  } catch (error) {

    console.error(
      "Get My Leaves Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};



// =====================================================
// ADMIN - GET ALL LEAVES
// =====================================================

export const getAllLeaves = async (req, res) => {

  try {

    const leaves = await Leave.find()

      .populate(
        "doctor",
        "name email phone"
      )

      .sort({
        createdAt: -1,
      });


    return res.status(200).json({

      success: true,

      count: leaves.length,

      leaves,

    });


  } catch (error) {

    console.error(
      "Get All Leaves Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};



// =====================================================
// ADMIN - GET PENDING LEAVES
// =====================================================

export const getPendingLeaves = async (req, res) => {

  try {

    const leaves = await Leave.find({

      status: "Pending",

    })

      .populate(
        "doctor",
        "name email phone"
      )

      .sort({
        createdAt: -1,
      });


    return res.status(200).json({

      success: true,

      count: leaves.length,

      leaves,

    });


  } catch (error) {

    console.error(
      "Get Pending Leaves Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};



// =====================================================
// ADMIN - GET PENDING LEAVE COUNT
// =====================================================

export const getPendingLeaveCount = async (
  req,
  res
) => {

  try {

    const count = await Leave.countDocuments({

      status: "Pending",

    });


    return res.status(200).json({

      success: true,

      count,

    });


  } catch (error) {

    console.error(
      "Get Pending Leave Count Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};



// =====================================================
// DOCTOR - CANCEL LEAVE
// =====================================================

export const cancelLeave = async (
  req,
  res
) => {

  try {

    const { id } = req.params;


    const leave = await Leave.findOne({

      _id: id,

      doctor: req.user.id,

    });


    if (!leave) {

      return res.status(404).json({

        success: false,

        message: "Leave application not found.",

      });

    }


    // -----------------------------------------------
    // Already cancelled
    // -----------------------------------------------

    if (
      leave.status ===
      "Cancelled by Doctor"
    ) {

      return res.status(400).json({

        success: false,

        message: "Leave is already cancelled.",

      });

    }


    // -----------------------------------------------
    // Rejected leave cannot be cancelled
    // -----------------------------------------------

    if (
      leave.status === "Rejected"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Rejected leave cannot be cancelled.",

      });

    }


    // -----------------------------------------------
    // Check start date
    // -----------------------------------------------

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const startDate =
      new Date(leave.startDate);

    startDate.setHours(0, 0, 0, 0);


    if (startDate <= today) {

      return res.status(400).json({

        success: false,

        message:
          "Leave cannot be cancelled after the start date.",

      });

    }


    // -----------------------------------------------
    // Update status
    // -----------------------------------------------

    leave.status =
      "Cancelled by Doctor";


    await leave.save();


    return res.status(200).json({

      success: true,

      message:
        "Leave cancelled successfully.",

      leave,

    });


  } catch (error) {

    console.error(
      "Cancel Leave Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

// =====================================================
// ADMIN - APPROVE LEAVE
// =====================================================

export const approveLeave = async (req, res) => {
  try {

    const { id } = req.params;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found.",
      });
    }


    // -----------------------------------------------
    // Cancelled leave cannot be approved
    // -----------------------------------------------

    if (leave.status === "Cancelled by Doctor") {
      return res.status(400).json({
        success: false,
        message: "Cancelled leave cannot be approved.",
      });
    }


    // -----------------------------------------------
    // Already processed
    // -----------------------------------------------

    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Leave is already ${leave.status}.`,
      });
    }


    // -----------------------------------------------
    // Check start date
    // -----------------------------------------------

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const startDate = new Date(leave.startDate);

    startDate.setHours(0, 0, 0, 0);


    if (startDate <= today) {
      return res.status(400).json({
        success: false,
        message:
          "This leave cannot be approved because the start date has arrived.",
      });
    }


    // -----------------------------------------------
    // APPROVE
    // -----------------------------------------------

    leave.status = "Approved";

    await leave.save();


    return res.status(200).json({
      success: true,
      message: "Leave approved successfully.",
      leave,
    });

  } catch (error) {

    console.error(
      "Approve Leave Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


// =====================================================
// ADMIN - REJECT LEAVE
// =====================================================

export const rejectLeave = async (req, res) => {
  try {

    const { id } = req.params;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found.",
      });
    }


    // -----------------------------------------------
    // Cancelled leave cannot be rejected
    // -----------------------------------------------

    if (leave.status === "Cancelled by Doctor") {
      return res.status(400).json({
        success: false,
        message: "Cancelled leave cannot be rejected.",
      });
    }


    // -----------------------------------------------
    // Already processed
    // -----------------------------------------------

    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Leave is already ${leave.status}.`,
      });
    }


    // -----------------------------------------------
    // Check start date
    // -----------------------------------------------

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const startDate = new Date(leave.startDate);

    startDate.setHours(0, 0, 0, 0);


    if (startDate <= today) {
      return res.status(400).json({
        success: false,
        message:
          "This leave cannot be rejected because the start date has arrived.",
      });
    }


    // -----------------------------------------------
    // REJECT
    // -----------------------------------------------

    leave.status = "Rejected";

    await leave.save();


    return res.status(200).json({
      success: true,
      message: "Leave rejected successfully.",
      leave,
    });

  } catch (error) {

    console.error(
      "Reject Leave Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};