
import { useEffect, useState } from "react";
import {
  FiHeart,
  FiActivity,
  FiDroplet,
  FiBox,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import {
  getMyPatientProfile,
  getMyMedicalHistory,
} from "../../services/patientProfileService";


const PatientHealthSummary = () => {

  const [healthData, setHealthData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =====================================================
     LOAD HEALTH SUMMARY
  ===================================================== */

  const loadHealthSummary = async () => {
  try {
    setLoading(true);
    setError("");

    const [profileResponse, medicalResponse] =
      await Promise.all([
        getMyPatientProfile(),
        getMyMedicalHistory(),
      ]);

    console.log("Patient profile:", profileResponse);
    console.log("Patient medical history:", medicalResponse);

    // =====================================================
    // PATIENT PROFILE
    // =====================================================

    const profile =
      profileResponse?.profile ||
      profileResponse?.patientProfile ||
      profileResponse;

    // =====================================================
    // MEDICAL HISTORY
    // =====================================================

    let history = [];

    if (Array.isArray(medicalResponse)) {
      history = medicalResponse;
    } else if (
      Array.isArray(medicalResponse?.medicalHistory)
    ) {
      history = medicalResponse.medicalHistory;
    } else if (
      Array.isArray(medicalResponse?.records)
    ) {
      history = medicalResponse.records;
    } else if (
      Array.isArray(medicalResponse?.history)
    ) {
      history = medicalResponse.history;
    } else if (medicalResponse) {
      history = [medicalResponse];
    }

    // =====================================================
    // SORT MEDICAL HISTORY
    // =====================================================

    history.sort((a, b) => {
      const dateA = new Date(
        a?.createdAt ||
        a?.updatedAt ||
        a?.date ||
        a?.createdDate ||
        0
      ).getTime();

      const dateB = new Date(
        b?.createdAt ||
        b?.updatedAt ||
        b?.date ||
        b?.createdDate ||
        0
      ).getTime();

      return dateB - dateA;
    });

    const latestMedicalRecord =
      history.length > 0
        ? history[0]
        : null;

    // =====================================================
    // COMBINE BOTH SOURCES
    // =====================================================

    setHealthData({
      profile,
      medicalRecord: latestMedicalRecord,
    });

  } catch (err) {
    console.error(
      "Failed to load patient health summary:",
      err
    );

    setError(
      err?.response?.data?.message ||
      "Unable to load your health summary."
    );

    setHealthData(null);
  } finally {
    setLoading(false);
  }
};


  /* =====================================================
     LOAD ON COMPONENT MOUNT
  ===================================================== */

  useEffect(() => {

    loadHealthSummary();

  }, []);


  /* =====================================================
     GET VALUE SAFELY
  ===================================================== */

  const getValue = (...values) => {

    for (const value of values) {

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return value;
      }

    }

    return "Not available";

  };


  /* =====================================================
     HEALTH VALUES
  ===================================================== */

 const medicalRecord =
  healthData?.medicalRecord;

const profile =
  healthData?.profile;

const latestVitals =
  profile?.latestVitals;

const diagnosis = getValue(
  medicalRecord?.diagnosis
);

const clinicalFindings = getValue(
  medicalRecord?.clinicalFindings
);

const bloodTest = getValue(
  medicalRecord?.bloodTestName
);

const bloodTestResult = getValue(
  medicalRecord?.bloodTestResult
);

const treatmentNotes = getValue(
  medicalRecord?.treatmentNotes
);

const remarks = getValue(
  medicalRecord?.remarks
);


  /* =====================================================
     OPTIONAL VITAL VALUES

     These will work automatically if your backend
     later provides these fields.
  ===================================================== */

 const bloodPressure = getValue(
  latestVitals?.bloodPressure
);

const heartRate = getValue(
  latestVitals?.heartRate
);

const weight = getValue(
  latestVitals?.weight
);

const bloodSugar = getValue(
  latestVitals?.bloodSugar
);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-5
          sm:p-6
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <div>

            <h3
              className="
                font-bold
                text-slate-900
                text-lg
              "
            >
              Health Summary
            </h3>

            <p
              className="
                text-sm
                text-slate-400
                mt-1
              "
            >
              Loading your latest information...
            </p>

          </div>

          <FiHeart
            className="
              text-red-500
            "
            size={20}
          />

        </div>


        <div
          className="
            flex
            items-center
            justify-center
            py-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-slate-500
            "
          >

            <FiRefreshCw
              className="
                animate-spin
                text-sky-600
              "
              size={18}
            />

            Loading health summary...

          </div>

        </div>

      </section>

    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {

    return (

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-5
          sm:p-6
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <div>

            <h3
              className="
                font-bold
                text-slate-900
                text-lg
              "
            >
              Health Summary
            </h3>

            <p
              className="
                text-sm
                text-slate-400
                mt-1
              "
            >
              Your latest health information
            </p>

          </div>

          <FiHeart
            className="
              text-red-500
            "
            size={20}
          />

        </div>


        <div
          className="
            rounded-xl
            border
            border-red-100
            bg-red-50
            p-4
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <FiAlertCircle
              className="
                text-red-500
                mt-0.5
                flex-shrink-0
              "
              size={18}
            />

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-red-700
                "
              >
                Unable to load health summary
              </p>

              <p
                className="
                  text-xs
                  text-red-600
                  mt-1
                "
              >
                {error}
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={loadHealthSummary}
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-lg
              bg-red-600
              hover:bg-red-700
              text-white
              text-sm
              font-semibold
              transition
            "
          >

            <FiRefreshCw size={15} />

            Try Again

          </button>

        </div>

      </section>

    );

  }


  /* =====================================================
     NO MEDICAL RECORD
  ===================================================== */

  if (!healthData) {

    return (

      <section
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-5
          sm:p-6
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <div>

            <h3
              className="
                font-bold
                text-slate-900
                text-lg
              "
            >
              Health Summary
            </h3>

            <p
              className="
                text-sm
                text-slate-400
                mt-1
              "
            >
              Your latest information
            </p>

          </div>

          <FiHeart
            className="
              text-red-500
            "
            size={20}
          />

        </div>


        <div
          className="
            rounded-xl
            bg-sky-50
            border
            border-sky-100
            p-5
            text-center
          "
        >

          <div
            className="
              w-11
              h-11
              mx-auto
              rounded-full
              bg-white
              flex
              items-center
              justify-center
              shadow-sm
            "
          >

            <FiHeart
              className="
                text-sky-500
              "
              size={20}
            />

          </div>


          <p
            className="
              text-sm
              font-semibold
              text-slate-700
              mt-3
            "
          >
            No medical record available
          </p>


          <p
            className="
              text-xs
              text-slate-400
              mt-1
            "
          >
            Your latest health information will
            appear here after a medical consultation.
          </p>

        </div>

      </section>

    );

  }


  /* =====================================================
     MAIN HEALTH SUMMARY
  ===================================================== */

  return (

    <section
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-5
        sm:p-6
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-5
        "
      >

        <div>

          <h3
            className="
              font-bold
              text-slate-900
              text-lg
            "
          >
            Health Summary
          </h3>

          <p
            className="
              text-sm
              text-slate-400
              mt-1
            "
          >
            Your latest health information
          </p>

        </div>


        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-red-50
            flex
            items-center
            justify-center
          "
        >

          <FiHeart
            className="
              text-red-500
            "
            size={19}
          />

        </div>

      </div>


      {/* =================================================
          VITALS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-3
          mb-6
        "
      >

        <HealthItem
          label="Blood Pressure"
          value={bloodPressure}
          unit="mmHg"
          icon={<FiActivity size={17} />}
        />


        <HealthItem
          label="Heart Rate"
          value={heartRate}
          unit="bpm"
          icon={<FiHeart size={17} />}
        />


        <HealthItem
          label="Weight"
          value={weight}
          unit="kg"
          icon={<FiBox size={17} />}
        />


        <HealthItem
          label="Blood Sugar"
          value={bloodSugar}
          unit="mg/dL"
          icon={<FiDroplet size={14} />}
        />

      </div>


      {/* =================================================
          LATEST MEDICAL INFORMATION
      ================================================= */}

      


      {/* =================================================
          PRESCRIPTIONS
      ================================================= */}

      {Array.isArray(
        healthData?.prescriptions
      ) &&
        healthData.prescriptions.length > 0 && (

          <div
            className="
              border-t
              border-slate-100
              mt-5
              pt-5
            "
          >

            <h4
              className="
                text-sm
                font-bold
                text-slate-900
                mb-4
              "
            >
              Current Prescriptions
            </h4>


            <div
              className="
                space-y-3
              "
            >

              {healthData.prescriptions.map(
                (prescription, index) => (

                  <div
                    key={
                      prescription?._id ||
                      index
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <div>

                        <p
                          className="
                            text-sm
                            font-bold
                            text-slate-800
                          "
                        >
                          {prescription?.medicineName ||
                            "Medicine"}
                        </p>


                        {prescription?.dosage && (

                          <p
                            className="
                              text-xs
                              text-slate-500
                              mt-1
                            "
                          >
                            Dosage:{" "}
                            {prescription.dosage}
                          </p>

                        )}

                      </div>


                      {prescription?.duration && (

                        <span
                          className="
                            text-xs
                            font-semibold
                            text-sky-600
                            bg-sky-50
                            px-2.5
                            py-1
                            rounded-lg
                          "
                        >
                          {prescription.duration}
                        </span>

                      )}

                    </div>


                    {prescription?.frequency && (

                      <p
                        className="
                          text-xs
                          text-slate-500
                          mt-2
                        "
                      >
                        Frequency:{" "}
                        {prescription.frequency}
                      </p>

                    )}


                    {prescription?.instructions && (

                      <p
                        className="
                          text-xs
                          text-slate-500
                          mt-1
                        "
                      >
                        Instructions:{" "}
                        {prescription.instructions}
                      </p>

                    )}

                  </div>

                )
              )}

            </div>

          </div>

        )}

    </section>

  );

};


/* =====================================================
   HEALTH ITEM
===================================================== */

const HealthItem = ({
  label,
  value,
  unit,
  icon,
}) => {

  const isUnavailable =
    value === "Not available";


  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        p-3.5
        rounded-xl
        bg-slate-50
        border
        border-slate-100
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          min-w-0
        "
      >

        <div
          className="
            w-9
            h-9
            rounded-lg
            bg-white
            border
            border-slate-100
            flex
            items-center
            justify-center
            text-sky-600
            flex-shrink-0
          "
        >

          {icon}

        </div>


        <span
          className="
            text-xs
            text-slate-500
          "
        >
          {label}
        </span>

      </div>


      <div
        className="
          text-right
          flex-shrink-0
        "
      >

        <span
          className={`
            font-bold
            ${
              isUnavailable
                ? "text-slate-400 text-xs"
                : "text-slate-800"
            }
          `}
        >
          {value}
        </span>


        {!isUnavailable && (

          <span
            className="
              text-xs
              text-slate-400
              ml-1
            "
          >
            {unit}
          </span>

        )}

      </div>

    </div>

  );

};


/* =====================================================
   HEALTH INFORMATION
===================================================== */

const HealthInformation = ({
  label,
  value,
}) => {

  return (

    <div>

      <p
        className="
          text-xs
          font-semibold
          text-slate-400
          uppercase
          tracking-wide
        "
      >
        {label}
      </p>


      <p
        className="
          text-xs
          text-slate-700
          mt-1
          leading-6
        "
      >
        {value}
      </p>

    </div>

  );

};


export default PatientHealthSummary;