import { useEffect, useState } from "react";
import {
  getMyPatientProfile,
  updateNotificationPreferences,
   updatePrivacySettings,
   logoutPatient,
  deletePatientAccount,
   updateAppointmentPreferences,
   changePatientPassword,
} from "../../services/patientProfileService";
import {
  FiUser,
  FiLock,
  FiBell,
  FiCalendar,
  FiShield,
  FiLogOut,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";

import toast from "react-hot-toast";

const Settings = () => {

  /* =====================================================
     STATE
  ===================================================== */

  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [profile, setProfile] = useState({});


  /* =====================================================
     LOAD PATIENT PROFILE
     
     User data:
     name
     email
     phone

     PatientProfile data:
     dateOfBirth
     gender
     address
     notificationPreferences
     privacySettings
     appointmentPreferences
  ===================================================== */

useEffect(() => {

  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await getMyPatientProfile();

      console.log(
        "Patient profile response:",
        response
      );


      /* =========================================
         USER TABLE DATA
      ========================================= */

      if (response.user) {

        setUser(response.user);

        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

      }


      /* =========================================
         PATIENT PROFILE DATA
      ========================================= */

      if (response.profile) {

        setProfile(response.profile);

      }

    } catch (error) {

      console.error(
        "Settings profile loading error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load patient profile"
      );

    } finally {

      setLoading(false);

    }

  };


  fetchProfile();

}, []);


  /* =====================================================
     PATIENT NAME
  ===================================================== */

  const patientName =
    user.name ||
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Patient";


  /* =====================================================
     PATIENT EMAIL
  ===================================================== */

  const patientEmail =
    user.email ||
    "Not added";


  /* =====================================================
     PATIENT PHONE
  ===================================================== */

  const patientPhone =
    user.phone ||
    "Not added";


  /* =====================================================
     DATE OF BIRTH

     IMPORTANT:
     DOB comes from PatientProfile,
     NOT User table.
  ===================================================== */

  const patientDateOfBirth = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "Not added";


  /* =====================================================
     GENDER
  ===================================================== */

  const patientGender =
    profile.gender ||
    "Not added";


  /* =====================================================
     INITIALS
  ===================================================== */

  const initials = patientName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  

/* =====================================================
   UPDATE NOTIFICATION PREFERENCE
===================================================== */



const updateNotificationPreference = async (
  setting,
  value
) => {

  try {

    /* =========================================
       GET CURRENT VALUES
    ========================================= */

    const currentPreferences = {
      appointmentReminders:
        profile.notificationPreferences
          ?.appointmentReminders ?? true,

      emailNotifications:
        profile.notificationPreferences
          ?.emailNotifications ?? true,

      prescriptionUpdates:
        profile.notificationPreferences
          ?.prescriptionUpdates ?? true,
    };


    /* =========================================
       CHANGE ONLY CLICKED TOGGLE
    ========================================= */

    const updatedPreferences = {
      ...currentPreferences,
      [setting]: value,
    };


    console.log(
      "Sending notification preferences:",
      updatedPreferences
    );


    /* =========================================
       UPDATE UI
    ========================================= */

    setProfile((prev) => ({
      ...prev,
      notificationPreferences:
        updatedPreferences,
    }));


    /* =========================================
       SAVE USING SERVICE
    ========================================= */

    const response =
      await updateNotificationPreferences(
        updatedPreferences
      );


    console.log(
      "Notification preferences saved:",
      response
    );


    /* =========================================
       USE DATABASE RESPONSE
    ========================================= */

    if (response.profile) {

      setProfile((prev) => ({
        ...prev,

        notificationPreferences:
          response.profile.notificationPreferences,
      }));

    }


    toast.success(
      "Notification setting updated"
    );

  } catch (error) {

    console.error(
      "Notification preference update error:",
      error
    );


    /* =========================================
       RELOAD DATABASE VALUE IF UPDATE FAILS
    ========================================= */

    try {

      const response =
        await getMyPatientProfile();

      if (response.profile) {

        setProfile(response.profile);

      }

    } catch (reloadError) {

      console.error(
        "Failed to reload profile:",
        reloadError
      );

    }


    toast.error(
      error.response?.data?.message ||
      "Failed to update notification setting"
    );

  }
};
/* =====================================================
   UPDATE PRIVACY PREFERENCE
===================================================== */

const updatePrivacyPreference = async (
  setting,
  value
) => {

  try {

    /* =========================================
       GET CURRENT VALUES
    ========================================= */

    const currentPreferences = {

      medicalRecordPrivacy:
        profile.privacySettings
          ?.medicalRecordPrivacy ?? true,

      dataSharing:
        profile.privacySettings
          ?.dataSharing ?? false,

    };


    /* =========================================
       CHANGE ONLY CLICKED TOGGLE
    ========================================= */

    const updatedPreferences = {

      ...currentPreferences,

      [setting]: value,

    };


    console.log(
      "Sending privacy preferences:",
      updatedPreferences
    );


    /* =========================================
       UPDATE UI IMMEDIATELY
    ========================================= */

    setProfile((prev) => ({

      ...prev,

      privacySettings:
        updatedPreferences,

    }));


    /* =========================================
       SAVE TO DATABASE
    ========================================= */

    const response =
      await updatePrivacySettings(
        updatedPreferences
      );


    console.log(
      "Privacy preferences saved:",
      response
    );


    /* =========================================
       USE DATABASE RESPONSE
    ========================================= */

    if (response.profile) {

      setProfile((prev) => ({

        ...prev,

        privacySettings:
          response.profile.privacySettings,

      }));

    }


    toast.success(
      "Privacy setting updated"
    );

  } catch (error) {

    console.error(
      "Privacy preference update error:",
      error
    );


    /* =========================================
       RELOAD DATABASE VALUE IF UPDATE FAILS
    ========================================= */

    try {

      const response =
        await getMyPatientProfile();


      if (response.profile) {

        setProfile(response.profile);

      }

    } catch (reloadError) {

      console.error(
        "Failed to reload profile:",
        reloadError
      );

    }


    toast.error(
      error.response?.data?.message ||
      "Failed to update privacy setting"
    );

  }
};
const handleDeleteAccount = async () => {

  try {

    setDeletingAccount(true);


    const response =
      await deletePatientAccount();


    toast.success(
      response.message ||
      "Account deleted successfully"
    );


    /* Clear authentication */

    logoutPatient();


    /* Redirect to login */

    window.location.href = "/login";

  } catch (error) {

    console.error(
      "Delete account error:",
      error
    );

    toast.error(
      error.response?.data?.message ||
      "Failed to delete account"
    );

    setDeletingAccount(false);

  }

};
const handleLogout = () => {

  logoutPatient();

  toast.success("Logged out successfully");

  window.location.href = "/login";

};
const handleAppointmentPreferenceUpdate = async (
  setting,
  value
) => {

  try {

    /* =========================================
       CURRENT VALUES
    ========================================= */

    const currentPreferences = {
      preferredDepartment:
        profile.appointmentPreferences
          ?.preferredDepartment || "",

      reminderTime:
        profile.appointmentPreferences
          ?.reminderTime || "",
    };


    /* =========================================
       UPDATED VALUES
    ========================================= */

    const updatedPreferences = {
      ...currentPreferences,
      [setting]: value,
    };


    console.log(
      "Sending appointment preferences:",
      updatedPreferences
    );


    /* =========================================
       UPDATE UI
    ========================================= */

    setProfile((prev) => ({
      ...prev,

      appointmentPreferences:
        updatedPreferences,
    }));


    /* =========================================
       SAVE THROUGH SERVICE
    ========================================= */

    const response =
      await updateAppointmentPreferences(
        updatedPreferences
      );


    /* =========================================
       USE DATABASE RESPONSE
    ========================================= */

    if (response.profile) {

      setProfile((prev) => ({
        ...prev,

        appointmentPreferences:
          response.profile.appointmentPreferences,
      }));

    }


    toast.success(
      "Appointment preference updated"
    );

  } catch (error) {

    console.error(
      "Appointment preference update error:",
      error
    );


    toast.error(
      error.response?.data?.message ||
      "Failed to update appointment preference"
    );

  }
};
const handleChangePassword = async () => {

  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;


    /* =========================================
       VALIDATION
    ========================================= */

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      toast.error(
        "Please fill all password fields"
      );

      return;

    }


    if (newPassword.length < 6) {

      toast.error(
        "New password must be at least 6 characters"
      );

      return;

    }


    if (newPassword !== confirmPassword) {

      toast.error(
        "New passwords do not match"
      );

      return;

    }


    setChangingPassword(true);


    /* =========================================
       CALL SERVICE
    ========================================= */

    const response =
      await changePatientPassword({

        currentPassword,
        newPassword,

      });


    toast.success(
      response.message ||
      "Password changed successfully"
    );


    /* =========================================
       RESET FORM
    ========================================= */

    setPasswordForm({

      currentPassword: "",
      newPassword: "",
      confirmPassword: "",

    });


    setShowPasswordModal(false);


  } catch (error) {

    console.error(
      "Change password error:",
      error
    );


    toast.error(
      error.response?.data?.message ||
      "Failed to change password"
    );

  } finally {

    setChangingPassword(false);

  }

};
  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="p-4 sm:p-6 lg:p-8">

        <div className="max-w-[1200px] mx-auto">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

            <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-slate-500">
              Loading settings...
            </p>

          </div>

        </div>

      </div>

    );

  }


  return (

    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">


      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-7">

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your patient account and preferences.
        </p>

      </div>


      {/* =========================================
          PROFILE CARD
      ========================================= */}

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">


          {/* Avatar */}

          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl font-bold shrink-0">

            {initials}

          </div>


          {/* Patient */}

          <div className="flex-1">

            <h2 className="text-lg font-bold text-slate-900">
              {patientName}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {patientEmail}
            </p>

            <span className="inline-block mt-2 text-xs font-semibold bg-sky-50 text-sky-700 px-3 py-1 rounded-full">
              Patient
            </span>

          </div>


          <button
            type="button"
            onClick={() => {
              window.location.href = "/patient/profile";
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            Edit Profile
          </button>

        </div>

      </section>


      {/* =========================================
          SETTINGS GRID
      ========================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* =========================================
            PROFILE INFORMATION
        ========================================= */}

        <SettingsCard
          icon={<FiUser />}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
          title="Profile Information"
          description="Manage your personal information."
        >

          {/* FULL NAME */}

          <SettingItem
            label="Full Name"
            value={patientName}
          />


          {/* EMAIL */}

          <SettingItem
            label="Email"
            value={patientEmail}
          />


          {/* PHONE */}

          <SettingItem
            label="Phone"
            value={patientPhone}
          />


          {/* DATE OF BIRTH */}

          <SettingItem
            label="Date of Birth"
            value={patientDateOfBirth}
          />


          {/* GENDER */}

          <SettingItem
            label="Gender"
            value={patientGender}
          />

        </SettingsCard>


        {/* =========================================
            SECURITY
        ========================================= */}
          <SettingsCard
            icon={<FiLock />}
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
            title="Security"
            description="Keep your account secure."
          >

            <ActionItem
              title="Change Password"
              description="Update your account password"
              onClick={() => setShowPasswordModal(true)}
            />

            <ActionItem
              title="Login Security"
              description="Manage your account security"
              onClick={() => {
                toast("Login security settings coming soon");
              }}
            />

          </SettingsCard>

        {/* =========================================
            NOTIFICATIONS
        ========================================= */}


        <SettingsCard
          icon={<FiBell />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          title="Notifications"
          description="Choose which notifications you receive."
        >

          <ToggleItem
            title="Appointment Reminders"
            description="Receive reminders before appointments"
            checked={
              profile.notificationPreferences
                ?.appointmentReminders ?? true
            }
            onChange={(checked) =>
              updateNotificationPreference(
                "appointmentReminders",
                checked
              )
            }
          />

          <ToggleItem
            title="Email Notifications"
            description="Receive important updates by email"
            checked={
              profile.notificationPreferences
                ?.emailNotifications ?? true
            }
            onChange={(checked) =>
              updateNotificationPreference(
                "emailNotifications",
                checked
              )
            }
          />

          <ToggleItem
            title="Prescription Updates"
            description="Get notified when prescriptions are available"
            checked={
              profile.notificationPreferences
                ?.prescriptionUpdates ?? true
            }
            onChange={(checked) =>
              updateNotificationPreference(
                "prescriptionUpdates",
                checked
              )
            }
          />

        </SettingsCard>


        {/* =========================================
            APPOINTMENT PREFERENCES
        ========================================= */}

        <SettingsCard
              icon={<FiCalendar />}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="Appointment Preferences"
              description="Manage your appointment preferences."
            >

              {/* =========================================
                  PREFERRED DEPARTMENT
              ========================================= */}

              <div className="flex items-center justify-between gap-4">

                <div className="flex-1">

                  <p className="text-sm font-semibold text-slate-800">
                    Preferred Department
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Choose your preferred medical department
                  </p>

                </div>

                <select
                  value={
                    profile.appointmentPreferences
                      ?.preferredDepartment || ""
                  }
                  onChange={(e) =>
                    handleAppointmentPreferenceUpdate(
                      "preferredDepartment",
                      e.target.value
                    )
                  }
                  className="
                    w-44
                    px-3 py-2
                    text-sm
                    border border-slate-200
                    rounded-xl
                    bg-white
                    text-slate-700
                    outline-none
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-100
                  "
                >

                  <option value="">
                    Select department
                  </option>

                  <option value="Cardiology">
                    Cardiology
                  </option>

                  <option value="Dermatology">
                    Dermatology
                  </option>

                  <option value="Neurology">
                    Neurology
                  </option>

                  <option value="Orthopedics">
                    Orthopedics
                  </option>

                  <option value="Pediatrics">
                    Pediatrics
                  </option>

                  <option value="General Medicine">
                    General Medicine
                  </option>

                </select>

              </div>


              {/* =========================================
                  REMINDER TIME
              ========================================= */}

              <div className="flex items-center justify-between gap-4">

                <div className="flex-1">

                  <p className="text-sm font-semibold text-slate-800">
                    Reminder Time
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Choose how early you want appointment reminders
                  </p>

                </div>

                <select
                  value={
                    profile.appointmentPreferences
                      ?.reminderTime || ""
                  }
                  onChange={(e) =>
                    handleAppointmentPreferenceUpdate(
                      "reminderTime",
                      Number(e.target.value)
                    )
                  }
                  className="
                    w-44
                    px-3 py-2
                    text-sm
                    border border-slate-200
                    rounded-xl
                    bg-white
                    text-slate-700
                    outline-none
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-100
                  "
                >

                  <option value="">
                    Select time
                  </option>

                  <option value="1">
                    1 hour before
                  </option>

                  <option value="2">
                    2 hours before
                  </option>

                  <option value="6">
                    6 hours before
                  </option>

                  <option value="12">
                    12 hours before
                  </option>

                  <option value="24">
                    24 hours before
                  </option>

                  <option value="48">
                    48 hours before
                  </option>

                </select>

              </div>

            </SettingsCard>


        {/* =========================================
            PRIVACY
        ========================================= */}
          <SettingsCard
            icon={<FiShield />}
            iconBg="bg-cyan-100"
            iconColor="text-cyan-600"
            title="Privacy"
            description="Manage your privacy preferences."
          >

            <ToggleItem
              title="Medical Record Privacy"
              description="Keep your medical information private"
              checked={
                profile.privacySettings
                  ?.medicalRecordPrivacy ?? true
              }
              onChange={(checked) =>
                updatePrivacyPreference(
                  "medicalRecordPrivacy",
                  checked
                )
              }
            />

            <ToggleItem
              title="Data Sharing"
              description="Control how your information is shared"
              checked={
                profile.privacySettings
                  ?.dataSharing ?? false
              }
              onChange={(checked) =>
                updatePrivacyPreference(
                  "dataSharing",
                  checked
                )
              }
            />

          </SettingsCard>


        {/* =========================================
            ACCOUNT
        ========================================= */}

        <SettingsCard
          icon={<FiUser />}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          title="Account"
          description="Manage your patient account."
        >

          <ActionItem
            title="Logout"
            description="Sign out from this device"
            icon={<FiLogOut />}
            danger
            onClick={handleLogout}
          />


          <ActionItem
            title="Delete Account"
            description="Permanently delete your patient account"
            icon={<FiTrash2 />}
            danger
            onClick={() => setShowDeleteModal(true)}
          />

        </SettingsCard>

      </div>
      {showDeleteModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

    {/* Background */}

    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => {
        if (!deletingAccount) {
          setShowDeleteModal(false);
        }
      }}
    />


    {/* Modal */}

    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

      {/* Icon */}

      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">

        <FiTrash2 size={22} />

      </div>


      {/* Title */}

      <h2 className="text-xl font-bold text-slate-900">

        Delete Account?

      </h2>


      {/* Description */}

      <p className="text-sm text-slate-500 mt-2 leading-6">

        Are you sure you want to permanently delete your
        patient account? This action cannot be undone.

      </p>


      {/* Buttons */}

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">

        <button
          type="button"
          disabled={deletingAccount}
          onClick={() => setShowDeleteModal(false)}
          className="flex-1 px-4 py-2.5 rounded-xl
                     border border-slate-200
                     text-slate-700
                     font-semibold
                     hover:bg-slate-50
                     transition
                     cursor-pointer
                     disabled:opacity-50"
        >

          Cancel

        </button>


        <button
          type="button"
          disabled={deletingAccount}
          onClick={handleDeleteAccount}
          className="flex-1 px-4 py-2.5 rounded-xl
                     bg-red-600
                     text-white
                     font-semibold
                     hover:bg-red-700
                     transition
                     cursor-pointer
                     disabled:opacity-50
                     flex items-center justify-center gap-2"
        >

          {deletingAccount ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

              Deleting...
            </>
          ) : (
            "Delete Account"
          )}

        </button>

      </div>

    </div>

  </div>

)}
{showPasswordModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

    {/* Overlay */}

    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => {

        if (!changingPassword) {
          setShowPasswordModal(false);
        }

      }}
    />


    {/* Modal */}

    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

      {/* Header */}

      <div className="flex items-center gap-3 mb-5">

        <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

          <FiLock size={20} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Change Password
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Update your account password
          </p>

        </div>

      </div>


      {/* Current Password */}

      <div className="mb-4">

        <label className="block text-sm font-semibold text-slate-700 mb-2">

          Current Password

        </label>

        <input
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              currentPassword: e.target.value,
            }))
          }
          placeholder="Enter current password"
          className="
            w-full
            px-4 py-3
            border border-slate-200
            rounded-xl
            outline-none
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-100
          "
        />

      </div>


      {/* New Password */}

      <div className="mb-4">

        <label className="block text-sm font-semibold text-slate-700 mb-2">

          New Password

        </label>

        <input
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              newPassword: e.target.value,
            }))
          }
          placeholder="Enter new password"
          className="
            w-full
            px-4 py-3
            border border-slate-200
            rounded-xl
            outline-none
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-100
          "
        />

      </div>


      {/* Confirm Password */}

      <div className="mb-6">

        <label className="block text-sm font-semibold text-slate-700 mb-2">

          Confirm New Password

        </label>

        <input
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          placeholder="Confirm new password"
          className="
            w-full
            px-4 py-3
            border border-slate-200
            rounded-xl
            outline-none
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-100
          "
        />

      </div>


      {/* Buttons */}

      <div className="flex flex-col-reverse sm:flex-row gap-3">

        <button
          type="button"
          disabled={changingPassword}
          onClick={() =>
            setShowPasswordModal(false)
          }
          className="
            flex-1
            px-4 py-2.5
            rounded-xl
            border border-slate-200
            text-slate-700
            font-semibold
            hover:bg-slate-50
            transition
            cursor-pointer
            disabled:opacity-50
          "
        >

          Cancel

        </button>


        <button
          type="button"
          disabled={changingPassword}
          onClick={handleChangePassword}
          className="
            flex-1
            px-4 py-2.5
            rounded-xl
            bg-violet-600
            text-white
            font-semibold
            hover:bg-violet-700
            transition
            cursor-pointer
            disabled:opacity-50
          "
        >

          {changingPassword
            ? "Updating..."
            : "Update Password"}

        </button>

      </div>

    </div>

  </div>

)}

    </div>

  );
};


/* =====================================================
   SETTINGS CARD
===================================================== */

const SettingsCard = ({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  children,
}) => {

  return (

    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">


      {/* Header */}

      <div className="p-5 sm:p-6 border-b border-slate-100">

        <div className="flex items-center gap-3">

          <div
            className={`
              w-11 h-11 rounded-xl
              ${iconBg}
              ${iconColor}
              flex items-center justify-center
            `}
          >

            {icon}

          </div>


          <div>

            <h3 className="font-bold text-slate-900">
              {title}
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              {description}
            </p>

          </div>

        </div>

      </div>


      {/* Content */}

      <div className="p-5 sm:p-6 space-y-4">

        {children}

      </div>

    </section>

  );
};


/* =====================================================
   SETTING ITEM
===================================================== */

const SettingItem = ({
  label,
  value,
}) => {

  return (

    <div className="flex items-center justify-between gap-4">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-800 text-right break-all">
        {value}
      </span>

    </div>

  );

};


/* =====================================================
   ACTION ITEM
===================================================== */

const ActionItem = ({
  title,
  description,
  icon,
  danger = false,
  onClick,
}) => {

  return (

    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-3
        text-left p-3 rounded-xl
        transition
        cursor-pointer
        ${
          danger
            ? "hover:bg-red-50"
            : "hover:bg-slate-50"
        }
      `}
    >

      <div className="flex-1">

        <p
          className={`
            text-sm font-semibold
            ${
              danger
                ? "text-red-600"
                : "text-slate-800"
            }
          `}
        >
          {title}
        </p>

        <p className="text-xs text-slate-400 mt-1">
          {description}
        </p>

      </div>


      {icon || (
        <FiChevronRight className="text-slate-400 shrink-0" />
      )}

    </button>

  );
};


/* =====================================================
   TOGGLE ITEM
===================================================== */

/* =====================================================
   TOGGLE ITEM
===================================================== */

const ToggleItem = ({
  title,
  description,
  checked = false,
  onChange,
}) => {

  return (

    <div className="flex items-center justify-between gap-4">

      <div className="flex-1">

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="text-xs text-slate-400 mt-1">
          {description}
        </p>

      </div>


      <label className="relative inline-flex items-center cursor-pointer shrink-0">

        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />

        <div
          className="
            w-11 h-6
            bg-slate-200
            rounded-full
            peer
            peer-checked:bg-sky-600
            transition
          "
        />

        <div
          className="
            absolute
            left-1
            top-1
            w-4 h-4
            bg-white
            rounded-full
            transition-transform
            peer-checked:translate-x-5
          "
        />

      </label>

    </div>

  );

};


export default Settings;