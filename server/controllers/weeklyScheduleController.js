import WeeklySchedule from "../models/WeeklySchedule.js";
import { generateSlots } from "../utils/generateSlots.js";

// export const addWeeklySchedule = async (req, res) => {
//   try {

//     const doctorId = req.user.id;
//     const { schedule } = req.body;

//     if (!schedule || schedule.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Schedule is required",
//       });
//     }

//     const weeklySchedule =
//       await WeeklySchedule.findOneAndUpdate(
//         {
//           doctor: doctorId,
//         },
//         {
//           doctor: doctorId,
//           schedule,
//         },
//         {
//           new: true,
//           upsert: true,
//         }
//       );
//       // await generateSlots(
//       //     doctorId,
//       //     weeklySchedule.schedule
//       // );

//     res.status(200).json({
//       success: true,
//       message: "Schedule saved successfully.",
//       weeklySchedule,
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });

//   }
// };

// export const addWeeklySchedule = async (req, res) => {

//   try {

//     const doctorId = req.user.id;

//     const { schedule } = req.body;


//     if (
//       !schedule ||
//       schedule.length === 0
//     ) {

//       return res.status(400).json({

//         success: false,

//         message:
//           "Schedule is required",

//       });

//     }


//     const weeklySchedule =
//       await WeeklySchedule.findOneAndUpdate(

//         {
//           doctor: doctorId,
//         },

//         {
//           doctor: doctorId,
//           schedule,
//         },

//         {
//           new: true,
//           upsert: true,
//         }

//       );


//     return res.status(200).json({

//       success: true,

//       message:
//         "Schedule saved successfully.",

//       weeklySchedule,

//     });


//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({

//       success: false,

//       message:
//         "Server Error",

//     });

//   }

// };
export const getWeeklySchedule = async (req, res) => {
    try{
        const doctorId=req.user.id;
        const schedule=await WeeklySchedule.findOne({
            doctor:doctorId,
        })
        .populate("doctor", "name email department")
        if(!schedule){
            return res.status(400).json({
                success:false,
                message:"Schedule not found."
            });
        }
        res.status(200).json({
            success: true,
            schedule,
            });

        } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};
export const addWeeklySchedule = async (req, res) => {

  try {

    const doctorId = req.user.id;

    const { schedule } = req.body;


    // =====================================================
    // VALIDATE SCHEDULE
    // =====================================================

    if (
      !schedule ||
      schedule.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Schedule is required",

      });

    }


    // =====================================================
    // SAVE / UPDATE WEEKLY SCHEDULE
    // =====================================================

    const weeklySchedule =
      await WeeklySchedule.findOneAndUpdate(

        {
          doctor: doctorId,
        },

        {
          doctor: doctorId,
          schedule,
        },

        {
          new: true,
          upsert: true,
        }

      );


    // =====================================================
    // GENERATE NEXT 30 DAYS SLOTS
    // =====================================================

    await generateSlots(
      doctorId,
      weeklySchedule.schedule
    );


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({

      success: true,

      message:
        "Schedule saved and slots generated successfully.",

      weeklySchedule,

    });


  } catch (error) {

    console.error(
      "Add weekly schedule error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Server Error",

      error: error.message,

    });

  }

};