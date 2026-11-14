import cron from "node-cron";

import WeeklySchedule from "../models/WeeklySchedule.js";

import { generateSlots } from "./generateSlots.js";


// =====================================================
// GENERATE SLOTS FOR ALL DOCTORS
// =====================================================

const generateAllDoctorSlots = async () => {

  try {

    console.log(
      "Starting automatic slot generation..."
    );


    const schedules =
      await WeeklySchedule.find();


    for (const weeklySchedule of schedules) {

      try {

        await generateSlots(
          weeklySchedule.doctor,
          weeklySchedule.schedule
        );

        console.log(
          `Slots generated for doctor: ${weeklySchedule.doctor}`
        );

      } catch (error) {

        console.error(
          `Slot generation failed for doctor ${weeklySchedule.doctor}:`,
          error
        );

      }

    }


    console.log(
      "Automatic slot generation completed."
    );


  } catch (error) {

    console.error(
      "Automatic slot generation error:",
      error
    );

  }

};


// =====================================================
// RUN EVERY DAY AT 12:00 AM
// =====================================================

export const startSlotCron = async () => {

  // Generate immediately when server starts
  await generateAllDoctorSlots();


  // Then generate every day at midnight
  cron.schedule(
    "0 0 * * *",
    async () => {

      console.log(
        "12:00 AM - generating next 30 days slots..."
      );

      await generateAllDoctorSlots();

    },
    {
      timezone: "Asia/Kolkata",
    }
  );


  console.log(
    "Slot cron job started."
  );

};