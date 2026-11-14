import Notification from "../models/Notification.js";


// ==========================================
// GET NOTIFICATIONS
// ==========================================

export const getNotifications = async (
  req,
  res
) => {

  try {

    const notifications =
      await Notification.find()
        .populate(
          "doctor",
          "name email"
        )
        .populate("leave")
        .sort({
          createdAt: -1,
        });


    const unreadCount =
      await Notification.countDocuments({
        isRead: false,
      });


    return res.status(200).json({

      success: true,

      unreadCount,

      notifications,

    });

  } catch (error) {

    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// ==========================================
// MARK AS READ
// ==========================================

export const markNotificationAsRead = async (
  req,
  res
) => {

  try {

    console.log(
      "================================="
    );

    console.log(
      "MARK NOTIFICATION AS READ"
    );

    console.log(
      "NOTIFICATION ID:",
      req.params.id
    );


    const notification =
      await Notification.findByIdAndUpdate(

        req.params.id,

        {
          $set: {
            isRead: true,
          },
        },

        {
          new: true,
          runValidators: true,
        }

      );


    if (!notification) {

      console.log(
        "NOTIFICATION NOT FOUND"
      );

      return res.status(404).json({

        success: false,

        message:
          "Notification not found",

      });

    }


    console.log(
      "UPDATED NOTIFICATION:",
      notification
    );


    return res.status(200).json({

      success: true,

      message:
        "Notification marked as read",

      notification,

    });

  } catch (error) {

    console.error(
      "MARK READ ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};