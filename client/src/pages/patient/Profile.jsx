import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiSave,
} from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  /* =====================================================
     LOAD PATIENT PROFILE
  ===================================================== */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login again");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/patient/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("PATIENT PROFILE API RESPONSE:", response.data);

        /*
        =====================================================
        IMPORTANT

        NAME / EMAIL / PHONE
        --------------------
        These come from User collection.

        DOB / GENDER / ADDRESS
        ----------------------
        These come from PatientProfile collection.
        =====================================================
        */

        const patient = response.data.user || {};
        const profile = response.data.profile || {};


        /* =================================================
           USER TABLE DATA
        ================================================= */

        const userName = patient.name || "";
        const userEmail = patient.email || "";
        const userPhone = patient.phone || "";


        /* =================================================
           PATIENT PROFILE TABLE DATA
        ================================================= */

        const dateOfBirth = profile.dateOfBirth
          ? new Date(profile.dateOfBirth)
              .toISOString()
              .substring(0, 10)
          : "";


        const gender = profile.gender || "";


        /*
        =====================================================
        ADDRESS

        Your PatientProfile model stores address as:

        address: {
          street,
          city,
          state,
          zipCode,
          country
        }

        So convert it to readable text for textarea.
        =====================================================
        */

        const addressObject = profile.address || {};

        const address = [
          addressObject.street,
          addressObject.city,
          addressObject.state,
          addressObject.zipCode,
          addressObject.country,
        ]
          .filter(Boolean)
          .join(", ");


        /* =================================================
           PUT EVERYTHING INTO FORM
        ================================================= */

        reset({
          /*
          USER MODEL
          */
          name: userName,
          email: userEmail,
          phone: userPhone,

          /*
          PATIENT PROFILE MODEL
          */
          dob: dateOfBirth,
          gender: gender,
          bloodGroup: profile.bloodGroup || "",
          address: address,
        });


        /*
        =====================================================
        DEBUG

        Check browser console.

        You should see:

        User:
        name
        email
        phone

        Profile:
        dateOfBirth
        gender
        address
        =====================================================
        */

        console.log("USER TABLE DATA:", patient);
        console.log("PATIENT PROFILE DATA:", profile);

      } catch (error) {
        console.error("Profile loading error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);


  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }


      /*
      =====================================================
      DATA SENT TO BACKEND

      User.js receives:
        name
        email
        phone

      PatientProfile.js receives:
        dateOfBirth
        gender
        address
      =====================================================
      */

      const requestData = {
        name: data.name,
        email: data.email,
        phone: data.phone,

        dateOfBirth: data.dob,
        gender: data.gender,
        bloodGroup: data.bloodGroup,

        /*
        Your backend currently accepts address.
        Since your textarea contains a complete address,
        send it as an object with street.
        */

        address: {
          street: data.address,
        },
      };


      console.log(
        "PROFILE UPDATE DATA:",
        requestData
      );


      const response = await axios.put(
        "http://localhost:5000/api/patient/profile",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      console.log(
        "PROFILE UPDATE RESPONSE:",
        response.data
      );


      /* =================================================
         UPDATE LOCAL STORAGE
      ================================================= */

      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );


      const updatedUser = {
        ...oldUser,
        ...(response.data.user || {}),
      };


      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );


      /* =================================================
         SHOW SUCCESS
      ================================================= */

      toast.success(
        response.data.message ||
          "Profile updated successfully"
      );


      /* =================================================
         REFRESH FORM WITH UPDATED SERVER DATA
      ================================================= */

      const updatedServerUser =
        response.data.user || {};

      const updatedServerProfile =
        response.data.profile || {};


      const updatedAddress =
        updatedServerProfile.address || {};


      reset({
        name: updatedServerUser.name || "",
        email: updatedServerUser.email || "",
        phone: updatedServerUser.phone || "",

        dob: updatedServerProfile.dateOfBirth
          ? new Date(
              updatedServerProfile.dateOfBirth
            )
              .toISOString()
              .substring(0, 10)
          : "",

        gender:
          updatedServerProfile.gender || "",

        bloodGroup:
         updatedServerProfile.bloodGroup || "",

        address: [
          updatedAddress.street,
          updatedAddress.city,
          updatedAddress.state,
          updatedAddress.zipCode,
          updatedAddress.country,
        ]
          .filter(Boolean)
          .join(", "),
      });

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      console.error(
        "Backend error:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-slate-500">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="max-w-[1100px] mx-auto">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your personal information and patient details.
          </p>

        </div>


        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="p-5 sm:p-7 border-b border-slate-100">

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                <div className="w-20 h-20 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-bold">

                  <FiUser size={32} />

                </div>


                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Keep your patient information up to date.
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <div className="p-5 sm:p-7">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                {/* =================================================
                    FULL NAME

                    COMES FROM User.name
                ================================================= */}

                <ProfileInput
                  label="Full Name"
                  icon={<FiUser />}
                  error={errors.name?.message}
                  {...register("name", {
                    required: "Full name is required",
                  })}
                />


                {/* =================================================
                    EMAIL

                    COMES FROM User.email
                ================================================= */}

                <ProfileInput
                  label="Email Address"
                  type="email"
                  icon={<FiMail />}
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                  })}
                />


                {/* =================================================
                    PHONE

                    COMES FROM User.phone
                ================================================= */}

                <ProfileInput
                  label="Phone Number"
                  icon={<FiPhone />}
                  error={errors.phone?.message}
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />


                {/* =================================================
                    DATE OF BIRTH

                    COMES FROM PatientProfile.dateOfBirth
                ================================================= */}

                <ProfileInput
                  label="Date of Birth"
                  type="date"
                  icon={<FiCalendar />}
                  {...register("dob")}
                />


                {/* =================================================
                    GENDER

                    COMES FROM PatientProfile.gender
                ================================================= */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Gender
                  </label>

                  <div className="relative">

                    <FiUser
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      {...register("gender")}
                      className="
                        w-full
                        h-12
                        pl-11
                        pr-4
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        text-slate-800
                        outline-none
                        focus:border-sky-500
                        focus:ring-2
                        focus:ring-sky-100
                        transition
                      "
                    >

                      <option value="">
                        Select gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                </div>

                {/* =================================================
    BLOOD GROUP

    COMES FROM PatientProfile.bloodGroup
================================================= */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Blood Group
                  </label>

                  <div className="relative">

                    <span
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        font-semibold
                        text-sm
                      "
                    >
                      +
                    </span>

                    <select
                      {...register("bloodGroup")}
                      className="
                        w-full
                        h-12
                        pl-11
                        pr-4
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        text-slate-800
                        outline-none
                        focus:border-sky-500
                        focus:ring-2
                        focus:ring-sky-100
                        transition
                      "
                    >

                      <option value="">
                        Select blood group
                      </option>

                      <option value="A+">
                        A+
                      </option>

                      <option value="A-">
                        A-
                      </option>

                      <option value="B+">
                        B+
                      </option>

                      <option value="B-">
                        B-
                      </option>

                      <option value="AB+">
                        AB+
                      </option>

                      <option value="AB-">
                        AB-
                      </option>

                      <option value="O+">
                        O+
                      </option>

                      <option value="O-">
                        O-
                      </option>

                    </select>

                  </div>

                </div>


                {/* =================================================
                    ADDRESS

                    COMES FROM PatientProfile.address
                ================================================= */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Address
                  </label>

                  <div className="relative">

                    <FiMapPin
                      className="
                        absolute
                        left-4
                        top-4
                        text-slate-400
                      "
                    />

                    <textarea
                      rows="4"
                      placeholder="Enter your address"
                      {...register("address")}
                      className="
                        w-full
                        pl-11
                        pr-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        text-slate-800
                        outline-none
                        resize-none
                        focus:border-sky-500
                        focus:ring-2
                        focus:ring-sky-100
                        transition
                      "
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  SAVE BUTTON
              ================================================= */}

              <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-6
                    py-3
                    rounded-xl
                    bg-sky-600
                    hover:bg-sky-700
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    shadow-lg
                    shadow-sky-600/20
                    transition
                    cursor-pointer
                  "
                >

                  <FiSave />

                  {saving
                    ? "Saving..."
                    : "Save Changes"
                  }

                </button>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};


/* =====================================================
   PROFILE INPUT
===================================================== */

const ProfileInput = ({
  label,
  icon,
  type = "text",
  error,
  ...props
}) => {

  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">

        <span
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        >
          {icon}
        </span>

        <input
          type={type}
          {...props}
          className="
            w-full
            h-12
            pl-11
            pr-4
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-800
            outline-none
            focus:border-sky-500
            focus:ring-2
            focus:ring-sky-100
            transition
          "
        />

      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}

    </div>
  );
};


export default Profile;