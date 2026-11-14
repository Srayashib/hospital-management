// import Slot from "../models/Slot.js";

// const getMinutes = (time) => {
//   const [h, m] = time.split(":").map(Number);
//   return h * 60 + m;
// };

// const getTime = (minutes) => {
//   const h = String(Math.floor(minutes / 60)).padStart(2, "0");
//   const m = String(minutes % 60).padStart(2, "0");
//   return `${h}:${m}`;
// };

// const dayNames = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// export const generateSlots = async (
//   doctorId,
//   weeklySchedule
// ) => {

//   // Delete previous available slots only
//   await Slot.deleteMany({
//     doctor: doctorId,
//     status: "Available",
//   });

//   // Today
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   // Generate only Today + Next 6 Days
//   for (let i = 0; i < 7; i++) {

//     const currentDate = new Date(today);
//     currentDate.setDate(today.getDate() + i);

//     const dayName = dayNames[currentDate.getDay()];

//     const schedule = weeklySchedule.find(
//       (item) => item.day === dayName
//     );

//     // Holiday / unavailable day
//     if (
//       !schedule ||
//       !schedule.isAvailable ||
//       !schedule.startTime ||
//       !schedule.endTime
//     ) {
//       continue;
//     }

//     let start = getMinutes(schedule.startTime);
//     const end = getMinutes(schedule.endTime);

//     const breakStart = schedule.breakStart
//       ? getMinutes(schedule.breakStart)
//       : null;

//     const breakEnd = schedule.breakEnd
//       ? getMinutes(schedule.breakEnd)
//       : null;

//     while (start + schedule.slotDuration <= end) {

//       // Skip break time
//       if (
//         breakStart !== null &&
//         start >= breakStart &&
//         start < breakEnd
//       ) {
//         start = breakEnd;
//         continue;
//       }

//       await Slot.create({
//         doctor: doctorId,
//         date: currentDate,
//         day: dayName,
//         startTime: getTime(start),
//         endTime: getTime(start + schedule.slotDuration),
//         status: "Available",
//       });

//       start += schedule.slotDuration;
//     }
//   }
// };

// import Slot from "../models/Slot.js";


// // =====================================================
// // TIME → MINUTES
// // =====================================================

// const getMinutes = (time) => {
//   const [hours, minutes] = time.split(":").map(Number);

//   return hours * 60 + minutes;
// };


// // =====================================================
// // MINUTES → TIME
// // =====================================================

// const getTime = (minutes) => {

//   const hours = String(
//     Math.floor(minutes / 60)
//   ).padStart(2, "0");

//   const mins = String(
//     minutes % 60
//   ).padStart(2, "0");

//   return `${hours}:${mins}`;
// };


// // =====================================================
// // DAY NAMES
// // =====================================================

// const dayNames = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];


// // =====================================================
// // GENERATE NEXT 30 DAYS
// // =====================================================

// export const generateSlots = async (
//   doctorId,
//   weeklySchedule
// ) => {

//   // ---------------------------------------------------
//   // Today at 00:00
//   // ---------------------------------------------------

//   const today = new Date();

//   today.setHours(
//     0,
//     0,
//     0,
//     0
//   );


//   // ---------------------------------------------------
//   // Generate today + next 29 days
//   // = 30 days total
//   // ---------------------------------------------------

//   for (let i = 0; i < 30; i++) {

//     const currentDate = new Date(today);

//     currentDate.setDate(
//       today.getDate() + i
//     );


//     // -------------------------------------------------
//     // Get day name
//     // -------------------------------------------------

//     const dayName =
//       dayNames[
//         currentDate.getDay()
//       ];


//     // -------------------------------------------------
//     // Find doctor's schedule
//     // -------------------------------------------------

//     const schedule =
//       weeklySchedule.find(
//         (item) =>
//           item.day === dayName
//       );


//     // -------------------------------------------------
//     // Doctor not working this day
//     // -------------------------------------------------

//     if (
//       !schedule ||
//       !schedule.isAvailable ||
//       !schedule.startTime ||
//       !schedule.endTime
//     ) {
//       continue;
//     }


//     // -------------------------------------------------
//     // Convert time
//     // -------------------------------------------------

//     let start =
//       getMinutes(
//         schedule.startTime
//       );

//     const end =
//       getMinutes(
//         schedule.endTime
//       );


//     // -------------------------------------------------
//     // Break
//     // -------------------------------------------------

//     const breakStart =
//       schedule.breakStart
//         ? getMinutes(
//             schedule.breakStart
//           )
//         : null;

//     const breakEnd =
//       schedule.breakEnd
//         ? getMinutes(
//             schedule.breakEnd
//           )
//         : null;


//     // -------------------------------------------------
//     // Slot duration
//     // -------------------------------------------------

//     const duration =
//       Number(
//         schedule.slotDuration || 30
//       );


//     // -------------------------------------------------
//     // Generate slots
//     // -------------------------------------------------

//     while (
//       start + duration <= end
//     ) {

//       // ---------------------------------------------
//       // Skip break
//       // ---------------------------------------------

//       if (
//         breakStart !== null &&
//         breakEnd !== null &&
//         start >= breakStart &&
//         start < breakEnd
//       ) {

//         start = breakEnd;

//         continue;
//       }


//       // ---------------------------------------------
//       // Create exact date
//       // ---------------------------------------------

//       const slotDate =
//         new Date(currentDate);


//       // ---------------------------------------------
//       // Check whether slot already exists
//       // ---------------------------------------------

//       const existingSlot =
//         await Slot.findOne({

//           doctor: doctorId,

//           date: slotDate,

//           startTime:
//             getTime(start),

//           endTime:
//             getTime(
//               start + duration
//             ),

//         });


//       // ---------------------------------------------
//       // Only create missing slot
//       // ---------------------------------------------

//       if (!existingSlot) {

//         await Slot.create({

//           doctor: doctorId,

//           date: slotDate,

//           day: dayName,

//           startTime:
//             getTime(start),

//           endTime:
//             getTime(
//               start + duration
//             ),

//           status: "Available",

//         });

//       }


//       start += duration;

//     }

//   }

// };


import Slot from "../models/Slot.js";


// =====================================================
// TIME → MINUTES
// =====================================================

const getMinutes = (time) => {

  const [hours, minutes] =
    time.split(":").map(Number);

  return hours * 60 + minutes;
};


// =====================================================
// MINUTES → TIME
// =====================================================

const getTime = (minutes) => {

  const hours = String(
    Math.floor(minutes / 60)
  ).padStart(2, "0");

  const mins = String(
    minutes % 60
  ).padStart(2, "0");

  return `${hours}:${mins}`;
};


// =====================================================
// DAY NAMES
// =====================================================

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];


// =====================================================
// GENERATE NEXT 30 DAYS
// =====================================================

export const generateSlots = async (
  doctorId,
  weeklySchedule
) => {

  // ---------------------------------------------------
  // Today 00:00
  // ---------------------------------------------------

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );


  // ---------------------------------------------------
  // Generate 30 days
  // Today + next 29 days
  // ---------------------------------------------------

  for (let i = 0; i < 30; i++) {

    const currentDate = new Date(today);

    currentDate.setDate(
      today.getDate() + i
    );


    // -------------------------------------------------
    // Day name
    // -------------------------------------------------

    const dayName =
      dayNames[currentDate.getDay()];


    // -------------------------------------------------
    // Find schedule
    // -------------------------------------------------

    const schedule =
      weeklySchedule.find(
        (item) =>
          item.day === dayName
      );


    // -------------------------------------------------
    // Doctor unavailable
    // -------------------------------------------------

    if (
      !schedule ||
      !schedule.isAvailable ||
      !schedule.startTime ||
      !schedule.endTime
    ) {
      continue;
    }


    // -------------------------------------------------
    // Working time
    // -------------------------------------------------

    const workingStart =
      getMinutes(
        schedule.startTime
      );

    const workingEnd =
      getMinutes(
        schedule.endTime
      );


    // -------------------------------------------------
    // Break time
    // -------------------------------------------------

    const breakStart =
      schedule.breakStart
        ? getMinutes(
            schedule.breakStart
          )
        : null;

    const breakEnd =
      schedule.breakEnd
        ? getMinutes(
            schedule.breakEnd
          )
        : null;


    // -------------------------------------------------
    // Slot duration
    // -------------------------------------------------

    const duration =
      Number(
        schedule.slotDuration || 30
      );


    // -------------------------------------------------
    // Start generating
    // -------------------------------------------------

    let start = workingStart;


    while (
      start + duration <= workingEnd
    ) {

      const slotEnd =
        start + duration;


      // =================================================
      // BREAK CHECK
      // =================================================

      if (
        breakStart !== null &&
        breakEnd !== null
      ) {

        // Slot overlaps break
        const overlapsBreak =
          start < breakEnd &&
          slotEnd > breakStart;


        if (overlapsBreak) {

          // Move directly to after break
          start = breakEnd;

          continue;
        }
      }


      // =================================================
      // SLOT TIMES
      // =================================================

      const startTime =
        getTime(start);

      const endTime =
        getTime(slotEnd);


      // =================================================
      // CHECK EXISTING SLOT
      // =================================================

      const existingSlot =
        await Slot.findOne({
          doctor: doctorId,
          date: currentDate,
          startTime,
          endTime,
        });


      // =================================================
      // CREATE ONLY IF NOT EXISTS
      // =================================================

      if (!existingSlot) {

        await Slot.create({

          doctor: doctorId,

          date: new Date(currentDate),

          day: dayName,

          startTime,

          endTime,

          status: "Available",

          appointment: null,

        });

      }


      // =================================================
      // NEXT SLOT
      // =================================================

      start += duration;

    }

  }

};