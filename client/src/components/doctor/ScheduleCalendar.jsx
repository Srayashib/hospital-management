import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addWeeklySchedule, getWeeklySchedule, } from "../../services/weeklyScheduleService";
import { getDoctorProfile } from "../../services/doctorService";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ScheduleCalendar = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    loadDoctor();
  }, []);

  // const loadDoctor = async () => {
  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));

  //     const res = await getDoctorProfile(user.id);

  //     const holidays = res.doctor.weeklyHolidays || [];

  //     const workingDays = allDays.filter(
  //       (day) => !holidays.includes(day)
  //     );

  //     const scheduleData = workingDays.map((day) => ({
  //       day,
  //       isAvailable: true,
  //       startTime: "",
  //       endTime: "",
  //       breakStart: "",
  //       breakEnd: "",
  //       slotDuration: 30,
  //     }));

  //     setSchedule(scheduleData);
  //   } catch (error) {
  //     toast.error("Unable to load doctor.");
  //   }
  // };
const loadDoctor = async () => {
  try {

    // First try loading saved schedule
    const scheduleRes = await getWeeklySchedule();

    if (scheduleRes.success) {
      setSchedule(scheduleRes.schedule.schedule);
      return;
    }

  } catch (error) {

    // Schedule not found -> create blank schedule

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await getDoctorProfile(user.id);

    const holidays = res.doctor.weeklyHolidays || [];

    const workingDays = allDays.filter(
      (day) => !holidays.includes(day)
    );

    const scheduleData = workingDays.map((day) => ({
      day,
      isAvailable: true,
      startTime: "",
      endTime: "",
      breakStart: "",
      breakEnd: "",
      slotDuration: 30,
    }));

    setSchedule(scheduleData);
  }
};
  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSubmit = async () => {
    try {
      await addWeeklySchedule({
        schedule,
      });

      toast.success("Weekly Schedule Saved");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save schedule"
      );
    }
  };

  return (
    <>
      <div className="weekly-schedule-wrapper">

        {schedule.map((item, index) => (

          <div
            className="schedule-card"
            key={index}
          >

            <div className="schedule-top">

              <h3>{item.day}</h3>

              <label>
                <input
                  type="checkbox"
                  checked={item.isAvailable}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "isAvailable",
                      e.target.checked
                    )
                  }
                />

                Available
              </label>

            </div>

            {item.isAvailable && (

              <div className="schedule-grid">

                <div>
                  <label>Start Time</label>

                  <input
                    type="time"
                    value={item.startTime}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "startTime",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label>End Time</label>

                  <input
                    type="time"
                    value={item.endTime}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "endTime",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label>Break Start</label>

                  <input
                    type="time"
                    value={item.breakStart}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "breakStart",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label>Break End</label>

                  <input
                    type="time"
                    value={item.breakEnd}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "breakEnd",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label>Slot Duration</label>

                  <select
                    value={item.slotDuration}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "slotDuration",
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

              </div>

            )}

          </div>

        ))}

      </div>

      <div className="schedule-save">

        <button
          className="save-btn"
          onClick={handleSubmit}
        >
          Save Schedule
        </button>

      </div>
    </>
  );
};

export default ScheduleCalendar;