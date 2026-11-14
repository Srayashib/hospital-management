import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SlotCard from "../../components/doctor/SlotCard";
import { getAvailableSlots } from "../../services/slotService";
import "../../assets/css/doctorDashboard.css";

const AvailableSlots = () => {

  const [groupedSlots, setGroupedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // SELECTED DAY FOR POPUP
  // =====================================================

  const [selectedDaySlots, setSelectedDaySlots] =
    useState(null);


  // =====================================================
  // LOAD SLOTS
  // =====================================================

  useEffect(() => {
    loadSlots();
  }, []);


  const loadSlots = async () => {

    try {

      setLoading(true);

      const res = await getAvailableSlots();

      const groups = {};

      res.slots.forEach((slot) => {

        const slotDate = new Date(slot.date);

        const key =
          `${slotDate.getFullYear()}-${String(
            slotDate.getMonth() + 1
          ).padStart(2, "0")}-${String(
            slotDate.getDate()
          ).padStart(2, "0")}`;

        if (!groups[key]) {
          groups[key] = [];
        }

        groups[key].push(slot);

      });

      setGroupedSlots(
        Object.values(groups)
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load slots."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

  };


  // =====================================================
  // CLOSE POPUP
  // =====================================================

  const closeDetails = () => {

    setSelectedDaySlots(null);

  };


  return (

    <div className="doctor-page-wrapper">

      <h2 className="doctor-page-title">
        Available Slots
      </h2>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="slot-loader">

          <div className="loader"></div>

          <h3>
            Generating Slots...
          </h3>

          <p>
            Please wait a moment.
          </p>

        </div>


      ) : groupedSlots.length === 0 ? (

        <div className="empty-card">
          No slots generated.
        </div>


      ) : (

        <div className="slot-grid">

          {groupedSlots.map((daySlots) => (

            <SlotCard
              key={daySlots[0]._id}
              slots={daySlots}
              onViewDetails={() =>
                setSelectedDaySlots(daySlots)
              }
            />

          ))}

        </div>

      )}


      {/* =================================================
          SLOT DETAILS POPUP
      ================================================= */}

      {selectedDaySlots && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/40
            flex
            items-center
            justify-center
            p-4
          "
          onClick={closeDetails}
        >

          <div
            className="
              bg-white
              w-full
              max-w-3xl
              rounded-2xl
              shadow-2xl
              overflow-hidden
              max-h-[90vh]
              flex
              flex-col
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =========================================
                POPUP HEADER
            ========================================= */}

            <div
              className="
                px-6
                py-5
                border-b
                border-slate-200
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Slot Details
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  {formatDate(
                    selectedDaySlots[0].date
                  )}
                </p>

              </div>


              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={closeDetails}
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-slate-100
                  hover:bg-slate-200
                  text-slate-600
                  flex
                  items-center
                  justify-center
                  text-xl
                  cursor-pointer
                  transition
                "
              >
                ×
              </button>

            </div>


            {/* =========================================
                SUMMARY
            ========================================= */}

            <div
              className="
                px-6
                py-4
                bg-slate-50
                border-b
                border-slate-200
                flex
                flex-wrap
                gap-3
              "
            >

              {/* TOTAL */}

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-white
                  border
                  border-slate-200
                "
              >

                <p
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  Total Slots
                </p>

                <p
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  {selectedDaySlots.length}
                </p>

              </div>


              {/* AVAILABLE */}

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-emerald-50
                  border
                  border-emerald-100
                "
              >

                <p
                  className="
                    text-xs
                    text-emerald-600
                  "
                >
                  Available
                </p>

                <p
                  className="
                    text-lg
                    font-bold
                    text-emerald-700
                  "
                >
                  {
                    selectedDaySlots.filter(
                      (slot) =>
                        slot.status === "Available"
                    ).length
                  }
                </p>

              </div>


              {/* BOOKED */}

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-red-50
                  border
                  border-red-100
                "
              >

                <p
                  className="
                    text-xs
                    text-red-600
                  "
                >
                  Booked
                </p>

                <p
                  className="
                    text-lg
                    font-bold
                    text-red-700
                  "
                >
                  {
                    selectedDaySlots.filter(
                      (slot) =>
                        slot.status === "Booked"
                    ).length
                  }
                </p>

              </div>


              {/* BLOCKED */}

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-slate-100
                  border
                  border-slate-200
                "
              >

                <p
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  Blocked
                </p>

                <p
                  className="
                    text-lg
                    font-bold
                    text-slate-700
                  "
                >
                  {
                    selectedDaySlots.filter(
                      (slot) =>
                        slot.status === "Blocked"
                    ).length
                  }
                </p>

              </div>

            </div>


            {/* =========================================
                SLOT LIST
            ========================================= */}

            <div
              className="
                p-6
                overflow-y-auto
              "
            >

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                "
              >

                {selectedDaySlots.map(
                  (slot) => {

                    const isAvailable =
                      slot.status === "Available";

                    const isBooked =
                      slot.status === "Booked";

                    const isBlocked =
                      slot.status === "Blocked";


                    return (

                      <div
                        key={slot._id}
                        className="
                          border
                          border-slate-200
                          rounded-xl
                          p-4
                          bg-white
                        "
                      >

                        {/* TIME */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <div>

                            <p
                              className="
                                text-lg
                                font-bold
                                text-slate-900
                              "
                            >
                              {slot.startTime}
                              {" - "}
                              {slot.endTime}
                            </p>

                          </div>


                          {/* STATUS */}

                          {isAvailable && (

                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                bg-emerald-50
                                text-emerald-700
                                text-xs
                                font-semibold
                              "
                            >
                              Available
                            </span>

                          )}


                          {isBooked && (

                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                bg-red-50
                                text-red-700
                                text-xs
                                font-semibold
                              "
                            >
                              Booked
                            </span>

                          )}


                          {isBlocked && (

                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                bg-slate-100
                                text-slate-600
                                text-xs
                                font-semibold
                              "
                            >
                              Blocked
                            </span>

                          )}

                        </div>


                        {/* DATE */}

                        <p
                          className="
                            text-xs
                            text-slate-400
                            mt-2
                          "
                        >
                          {slot.day}
                        </p>

                      </div>

                    );

                  }
                )}

              </div>

            </div>


            {/* =========================================
                FOOTER
            ========================================= */}

            <div
              className="
                px-6
                py-4
                border-t
                border-slate-200
                flex
                justify-end
              "
            >

              <button
                type="button"
                onClick={closeDetails}
                className="
                  px-5
                  py-2.5
                  bg-sky-600
                  hover:bg-sky-700
                  text-white
                  rounded-xl
                  text-sm
                  font-semibold
                  cursor-pointer
                  transition
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default AvailableSlots;