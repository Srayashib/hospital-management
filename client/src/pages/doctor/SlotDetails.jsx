// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import SlotList from "../../components/doctor/SlotList";
// import { getSlotsByDate } from "../../services/slotService";

// const SlotDetails = () => {

//   const { date } = useParams();

//   const [slots,setSlots] = useState([]);

//   useEffect(()=>{

//     loadSlots();

//   },[date]);

//   const loadSlots = async()=>{

//     try{

//       const res = await getSlotsByDate(date);

//       setSlots(res.slots);

//     }
//     catch(error){

//       toast.error(
//         error.response?.data?.message ||
//         "Unable to load slots."
//       );

//     }

//   };

//   return(

//     <div className="doctor-page-wrapper">

//       <h2 className="doctor-page-title">

//         Slot Details

//       </h2>

//       <SlotList slots={slots}/>

//     </div>

//   );

// };

// export default SlotDetails;



import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import SlotList from "../../components/doctor/SlotList";
import { getSlotsByDate } from "../../services/slotService";

const SlotDetails = () => {

  const { date } = useParams();

  const [slots, setSlots] = useState([]);

  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {

    loadSlots();

  }, [date]);

  const loadSlots = async () => {

    try {

      const res = await getSlotsByDate(date);

      setSlots(res.slots || []);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load slots."
      );

    }

  };

  return (

    <div className="doctor-page-wrapper">

      <h2 className="doctor-page-title">
        Slot Details
      </h2>

      <SlotList
        slots={slots}
        onViewDetails={setSelectedSlot}
      />


      {/* =====================================================
          SLOT DETAILS POPUP
      ===================================================== */}

      {selectedSlot && (

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
          onClick={() => setSelectedSlot(null)}
        >

          <div
            className="
              bg-white
              w-full
              max-w-md
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* ==========================================
                POPUP HEADER
            ========================================== */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-slate-200
              "
            >

              <div>

                <h2 className="
                  text-xl
                  font-bold
                  text-slate-900
                ">
                  Slot Details
                </h2>

                <p className="
                  text-sm
                  text-slate-500
                  mt-1
                ">
                  Appointment slot information
                </p>

              </div>


              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
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
                "
              >
                ×
              </button>

            </div>


            {/* ==========================================
                POPUP BODY
            ========================================== */}

            <div className="p-6">

              {/* Date */}

              <div className="
                mb-5
                p-4
                rounded-xl
                bg-sky-50
                border
                border-sky-100
              ">

                <p className="
                  text-xs
                  font-medium
                  text-slate-500
                  mb-1
                ">
                  Appointment Date
                </p>

                <p className="
                  text-base
                  font-bold
                  text-slate-900
                ">
                  {new Date(
                    selectedSlot.date
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

              </div>


              {/* Time */}

              <div className="
                flex
                items-center
                justify-between
                py-4
                border-b
                border-slate-100
              ">

                <span className="
                  text-sm
                  text-slate-500
                ">
                  Time
                </span>

                <span className="
                  text-sm
                  font-bold
                  text-slate-900
                ">
                  {selectedSlot.startTime}
                  {" - "}
                  {selectedSlot.endTime}
                </span>

              </div>


              {/* Day */}

              <div className="
                flex
                items-center
                justify-between
                py-4
                border-b
                border-slate-100
              ">

                <span className="
                  text-sm
                  text-slate-500
                ">
                  Day
                </span>

                <span className="
                  text-sm
                  font-semibold
                  text-slate-800
                ">
                  {selectedSlot.day}
                </span>

              </div>


              {/* Status */}

              <div className="
                flex
                items-center
                justify-between
                py-4
              ">

                <span className="
                  text-sm
                  text-slate-500
                ">
                  Status
                </span>

                <span
                  className={`
                    inline-flex
                    items-center
                    px-3
                    py-1.5
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      selectedSlot.status === "Available"
                        ? "bg-emerald-50 text-emerald-700"
                        : selectedSlot.status === "Booked"
                        ? "bg-red-50 text-red-700"
                        : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  {selectedSlot.status}
                </span>

              </div>

            </div>


            {/* ==========================================
                POPUP FOOTER
            ========================================== */}

            <div className="
              px-6
              py-4
              bg-slate-50
              border-t
              border-slate-200
              flex
              justify-end
            ">

              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
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

export default SlotDetails;