import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiPhone,
  FiFileText,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getDoctorSlots,
  bookAppointment,
} from "../../services/patientProfileService";


const Availability = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const { doctorId } = useParams();

  const doctor = location.state?.doctor;

  const department = location.state?.department;

  const [selectedDate, setSelectedDate] = useState("");

  const [slots, setSlots] = useState([]);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedSlot, setSelectedSlot] =
    useState(null);

    const [booking, setBooking] =
    useState(false);


    const [formData, setFormData] = useState({
    reason: "",
    notes: "",
    });


  /* =====================================================
     LOAD SLOTS WHEN DATE CHANGES
  ===================================================== */

  useEffect(() => {

    if (!selectedDate) {
      setSlots([]);
      return;
    }


    const loadSlots = async () => {

      try {

        setLoadingSlots(true);

        const response = await getDoctorSlots(
          doctorId,
          selectedDate
        );


        setSlots(
          response.slots || []
        );

      } catch (error) {

        console.error(
          "Slot loading error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
          "Failed to load availability"
        );

        setSlots([]);

      } finally {

        setLoadingSlots(false);

      }

    };


    loadSlots();

  }, [doctorId, selectedDate]);


  /* =====================================================
     DATE
  ===================================================== */

  const today = new Date()
    .toISOString()
    .split("T")[0];
const handleInputChange = (e) => {

  const {
    name,
    value,
  } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

};
const handleBookAppointment = async (e) => {

  e.preventDefault();


  if (!selectedSlot) {

    toast.error(
      "Please select a slot."
    );

    return;

  }


  if (!formData.reason.trim()) {

    toast.error(
      "Please enter the reason for your appointment."
    );

    return;

  }


  try {

    setBooking(true);


    const response =
      await bookAppointment({

        slotId: selectedSlot._id,

        reason:
          formData.reason.trim(),

        notes:
          formData.notes.trim(),

      });


    toast.success(
      response.message ||
      "Appointment booked successfully."
    );


    /*
    ================================================
    CLOSE FORM
    ================================================
    */

    setSelectedSlot(null);


    setFormData({
      reason: "",
      notes: "",
    });


    /*
    ================================================
    RELOAD SLOTS
    ================================================
    */

    const updated =
      await getDoctorSlots(
        doctorId,
        selectedDate
      );

    setSlots(
      updated.slots || []
    );


  } catch (error) {

    console.error(
      "Booking error:",
      error
    );


    toast.error(

      error.response?.data?.message ||

      "Failed to book appointment."

    );


    /*
    ================================================
    RELOAD SLOTS
    ================================================
    */

    try {

      const updated =
        await getDoctorSlots(
          doctorId,
          selectedDate
        );

      setSlots(
        updated.slots || []
      );

    } catch (refreshError) {

      console.error(
        refreshError
      );

    }

  } finally {

    setBooking(false);

  }

};

  return (

    <div className="
      p-4
      sm:p-6
      lg:p-8
      max-w-[1200px]
      mx-auto
    ">


      {/* =================================================
          BACK
      ================================================= */}

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="
          flex
          items-center
          gap-2
          mb-6
          text-sm
          font-semibold
          text-sky-600
          hover:text-sky-700
          cursor-pointer
        "
      >

        <FiArrowLeft />

        Back to Doctors

      </button>


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-7">

        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-slate-900
        ">

          Check Availability

        </h1>

        <p className="
          text-slate-500
          mt-2
        ">

          Check available appointment slots for the selected date.

        </p>

      </div>


      {/* =================================================
          DOCTOR CARD
      ================================================= */}

      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        p-5
        mb-6
      ">

        <div className="
          flex
          items-center
          gap-4
        ">


          {/* Doctor image */}

          <div className="
            w-16
            h-16
            rounded-2xl
            overflow-hidden
            bg-sky-100
            text-sky-700
            flex
            items-center
            justify-center
            text-xl
            font-bold
            shrink-0
          ">

            {doctor?.image ? (

              <img
                src={`http://localhost:5000/uploads/doctors/${doctor.image}`}
                alt={`Dr. ${doctor.name}`}
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              doctor?.name
                ?.charAt(0)
                ?.toUpperCase()

            )}

          </div>


          <div className="flex-1">

            <h2 className="
              text-lg
              font-bold
              text-slate-900
            ">
              Dr. {doctor?.name}
            </h2>

            <p className="
              text-sm
              text-sky-600
              font-medium
              mt-1
            ">
              {department?.name || doctor?.department}
            </p>

            {doctor?.fee !== undefined && doctor?.fee !== null && (
              <div className="
                mt-2
                inline-flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-lg
                bg-emerald-50
                border border-emerald-100
              ">
                <span className="
                  text-xs
                  font-medium
                  text-slate-500
                ">
                  Consultation Fee
                </span>

                <span className="
                  text-sm
                  font-bold
                  text-emerald-700
                ">
                  ₹{doctor.fee}
                </span>
              </div>
            )}

          </div>

        </div>

      </div>


      {/* =================================================
          DATE SELECTOR
      ================================================= */}

      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        p-5
        mb-6
      ">

        <div className="
          flex
          items-center
          gap-2
          mb-3
        ">

          <FiCalendar className="text-sky-600" />

          <label className="
            text-sm
            font-semibold
            text-slate-800
          ">

            Select Date

          </label>

        </div>


        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
          className="
            w-full
            sm:w-auto
            px-4
            py-3
            border
            border-slate-200
            rounded-xl
            text-sm
            text-slate-700
            outline-none
            focus:border-sky-500
            focus:ring-2
            focus:ring-sky-100
          "
        />

      </div>


      {/* =================================================
          BEFORE DATE SELECTED
      ================================================= */}

      {!selectedDate && (

        <div className="
          bg-white
          rounded-2xl
          border border-slate-200
          p-10
          text-center
        ">

          <FiCalendar
            size={40}
            className="
              mx-auto
              text-slate-300
            "
          />

          <h3 className="
            mt-4
            font-semibold
            text-slate-700
          ">

            Select a date

          </h3>

          <p className="
            text-sm
            text-slate-400
            mt-1
          ">

            Choose a date above to see all appointment slots.

          </p>

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {selectedDate && loadingSlots && (

        <div className="
          bg-white
          rounded-2xl
          border border-slate-200
          p-10
          text-center
        ">

          <div className="
            w-10
            h-10
            border-4
            border-sky-100
            border-t-sky-600
            rounded-full
            animate-spin
            mx-auto
            mb-4
          " />

          <p className="text-slate-500">

            Loading appointment slots...

          </p>

        </div>

      )}


      {/* =================================================
          NO SLOTS
      ================================================= */}

      {selectedDate &&
        !loadingSlots &&
        slots.length === 0 && (

        <div className="
          bg-white
          rounded-2xl
          border border-slate-200
          p-10
          text-center
        ">

          <FiClock
            size={40}
            className="
              mx-auto
              text-slate-300
            "
          />

          <h3 className="
            mt-4
            font-semibold
            text-slate-700
          ">

            No slots available

          </h3>

          <p className="
            text-sm
            text-slate-400
            mt-1
          ">

            No appointment slots were created for this date.

          </p>

        </div>

      )}


      {/* =================================================
          SLOT CARDS
      ================================================= */}

      {selectedDate &&
        !loadingSlots &&
        slots.length > 0 && (

        <div>

          <div className="
            flex
            items-center
            justify-between
            mb-4
          ">

            <h2 className="
              text-lg
              font-bold
              text-slate-900
            ">

              Appointment Slots

            </h2>


            <span className="
              text-sm
              text-slate-500
            ">

              {slots.length} slots

            </span>

          </div>


          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
          ">

            {slots.map((slot) => {

              const isAvailable =
                slot.status === "Available";


              const isBooked =
                slot.status === "Booked";


              return (

                <div
                  key={slot._id}
                  className={`
                    bg-white
                    rounded-2xl
                    border
                    shadow-sm
                    p-5
                    transition
                    ${
                      isAvailable
                        ? "border-emerald-200 hover:shadow-md"
                        : "border-red-200"
                    }
                  `}
                >

                  {/* Time */}

                  <div className="
                    flex
                    items-center
                    gap-2
                    text-slate-800
                    font-bold
                    text-lg
                  ">

                    <FiClock className="text-sky-600" />

                    {slot.startTime}

                    <span className="text-slate-400">
                      -
                    </span>

                    {slot.endTime}

                  </div>


                  {/* Status */}

                  <div className="mt-4">

                    {isAvailable ? (

                      <div className="
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-1.5
                        rounded-full
                        bg-emerald-50
                        text-emerald-700
                        text-xs
                        font-semibold
                      ">

                        <FiCheckCircle />

                        Available

                      </div>

                    ) : isBooked ? (

                      <div className="
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-1.5
                        rounded-full
                        bg-red-50
                        text-red-700
                        text-xs
                        font-semibold
                      ">

                        <FiXCircle />

                        Booked

                      </div>

                    ) : (

                      <div className="
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-1.5
                        rounded-full
                        bg-slate-100
                        text-slate-600
                        text-xs
                        font-semibold
                      ">

                        <FiXCircle />

                        Blocked

                      </div>

                    )}

                  </div>


                  {/* Button */}

                  {isAvailable && (

                    <button
                        type="button"
                        onClick={() => {
                        setSelectedSlot(slot);
                        }}
                        className="
                        w-full
                        mt-4
                        px-4
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

                        Book Slot

                    </button>

                    )}

                </div>

              );

            })}

          </div>

        </div>

      )}
      {/* =====================================================
    BOOKING FORM
===================================================== */}

            {selectedSlot && (

            <div className="
                fixed
                inset-0
                z-50
                bg-black/40
                flex
                items-center
                justify-center
                p-4
            ">

                <div className="
                bg-white
                w-full
                max-w-lg
                rounded-2xl
                shadow-xl
                overflow-hidden
                max-h-[90vh]
                overflow-y-auto
                ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    p-5
                    border-b
                    border-slate-200
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                    <h2 className="
                        text-xl
                        font-bold
                        text-slate-900
                    ">

                        Book Appointment

                    </h2>

                    <p className="
                        text-sm
                        text-slate-500
                        mt-1
                    ">

                        Complete the details below.

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


                {/* =================================================
                    SLOT INFORMATION
                ================================================= */}

                <div className="
                    p-5
                    bg-sky-50
                    border-b
                    border-sky-100
                ">

                    <div className="
                    flex
                    items-center
                    gap-3
                    ">

                    <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-white
                        text-sky-600
                        flex
                        items-center
                        justify-center
                    ">

                        <FiCalendar size={22} />

                    </div>


                    <div>

                        <p className="
                        text-sm
                        text-slate-500
                        ">

                        Appointment

                        </p>

                        <p className="
                        font-bold
                        text-slate-900
                        ">

                        {selectedSlot.startTime}
                        {" - "}
                        {selectedSlot.endTime}

                        </p>

                    </div>

                    </div>


                    <div className="
                    mt-3
                    text-sm
                    text-slate-600
                    ">

                    {new Date(
                        selectedSlot.date
                    ).toLocaleDateString(
                        "en-US",
                        {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        }
                    )}

                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleBookAppointment}
                    className="p-5"
                >

                    {/* Reason */}

                    <div className="mb-5">

                    <label className="
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                        mb-2
                    ">

                        Reason for Appointment
                        <span className="text-red-500">
                        *
                        </span>

                    </label>


                    <div className="
                        relative
                    ">

                        <FiFileText
                        className="
                            absolute
                            left-3
                            top-3.5
                            text-slate-400
                        "
                        />

                        <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        placeholder="Enter the reason for your visit"
                        className="
                            w-full
                            pl-10
                            pr-4
                            py-3
                            border
                            border-slate-200
                            rounded-xl
                            text-sm
                            outline-none
                            resize-none
                            focus:border-sky-500
                            focus:ring-2
                            focus:ring-sky-100
                        "
                        />

                    </div>

                    </div>


                    {/* Notes */}

                    <div className="mb-5">

                    <label className="
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                        mb-2
                    ">

                        Additional Notes

                        <span className="
                        text-slate-400
                        font-normal
                        ">

                        {" "}
                        (Optional)

                        </span>

                    </label>


                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Any additional information for the doctor..."
                        className="
                        w-full
                        px-4
                        py-3
                        border
                        border-slate-200
                        rounded-xl
                        text-sm
                        outline-none
                        resize-none
                        focus:border-sky-500
                        focus:ring-2
                        focus:ring-sky-100
                        "
                    />

                    </div>


                    {/* Buttons */}

                    <div className="
                    flex
                    gap-3
                    pt-2
                    ">

                    <button
                        type="button"
                        onClick={() =>
                        setSelectedSlot(null)
                        }
                        disabled={booking}
                        className="
                        flex-1
                        px-4
                        py-3
                        border
                        border-slate-200
                        rounded-xl
                        text-sm
                        font-semibold
                        text-slate-600
                        hover:bg-slate-50
                        cursor-pointer
                        "
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        disabled={booking}
                        className="
                        flex-1
                        px-4
                        py-3
                        bg-sky-600
                        hover:bg-sky-700
                        disabled:bg-sky-300
                        text-white
                        rounded-xl
                        text-sm
                        font-semibold
                        cursor-pointer
                        disabled:cursor-not-allowed
                        "
                    >

                        {booking
                        ? "Booking..."
                        : "Confirm Booking"}

                    </button>

                    </div>

                </form>

                </div>

            </div>

            )}

    </div>

  );

};


export default Availability;