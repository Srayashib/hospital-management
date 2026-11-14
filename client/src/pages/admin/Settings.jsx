import { useEffect, useState } from "react";

import {
  getHospitalSettings,
  updateHospitalInformation,
  updateWorkingHours,
  updateAppointmentSettings,
  updateSystemSettings,
} from "../../services/hospitalSettingsService";

const Settings = () => {

  const [settings, setSettings] = useState({
    // Hospital Information
    hospitalName: "City Hospital",
    email: "admin@hospital.com",
    phone: "+1 234 567 890",
    emergencyPhone: "+1 234 567 891",
    address: "123 Main Street",
    city: "New York",
    state: "New York",
    zipCode: "10001",
    country: "United States",

    // Working Hours
    monday: true,
    mondayStart: "09:00",
    mondayEnd: "18:00",

    tuesday: true,
    tuesdayStart: "09:00",
    tuesdayEnd: "18:00",

    wednesday: true,
    wednesdayStart: "09:00",
    wednesdayEnd: "18:00",

    thursday: true,
    thursdayStart: "09:00",
    thursdayEnd: "18:00",

    friday: true,
    fridayStart: "09:00",
    fridayEnd: "18:00",

    saturday: true,
    saturdayStart: "10:00",
    saturdayEnd: "14:00",

    sunday: false,
    sundayStart: "09:00",
    sundayEnd: "18:00",

    // Appointment Settings
    appointmentDuration: "30",
    advanceBookingDays: "30",
    cancellationHours: "24",
    allowSameDay: true,
    allowCancellation: true,

    // Notifications
    appointmentConfirmation: true,
    appointmentCancellation: true,
    newPatient: true,
    leaveRequest: true,
    leaveStatus: true,
    paymentNotification: true,

    // Security
    sessionTimeout: "30",
    loginNotification: true,
    twoFactor: false,

    // System
    currency: "USD",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    language: "English",
  });

  useEffect(() => {
  loadHospitalSettings();
}, []);

const loadHospitalSettings = async () => {

  try {

    const response = await getHospitalSettings();

    console.log(
      "HOSPITAL SETTINGS:",
      response
    );


    if (
      response.success &&
      response.settings
    ) {

      setSettings((prev) => ({

  ...prev,

  // Hospital Information

  hospitalName:
    response.settings.hospitalName,

  email:
    response.settings.email,

  phone:
    response.settings.phone,

  emergencyPhone:
    response.settings.emergencyPhone,

  address:
    response.settings.address,

  city:
    response.settings.city,

  state:
    response.settings.state,

  zipCode:
    response.settings.zipCode,

  country:
    response.settings.country,


  // Working Hours

  monday:
    response.settings.workingHours?.monday?.enabled
    ?? prev.monday,

  mondayStart:
    response.settings.workingHours?.monday?.start
    ?? prev.mondayStart,

  mondayEnd:
    response.settings.workingHours?.monday?.end
    ?? prev.mondayEnd,


  tuesday:
    response.settings.workingHours?.tuesday?.enabled
    ?? prev.tuesday,

  tuesdayStart:
    response.settings.workingHours?.tuesday?.start
    ?? prev.tuesdayStart,

  tuesdayEnd:
    response.settings.workingHours?.tuesday?.end
    ?? prev.tuesdayEnd,


  wednesday:
    response.settings.workingHours?.wednesday?.enabled
    ?? prev.wednesday,

  wednesdayStart:
    response.settings.workingHours?.wednesday?.start
    ?? prev.wednesdayStart,

  wednesdayEnd:
    response.settings.workingHours?.wednesday?.end
    ?? prev.wednesdayEnd,


  thursday:
    response.settings.workingHours?.thursday?.enabled
    ?? prev.thursday,

  thursdayStart:
    response.settings.workingHours?.thursday?.start
    ?? prev.thursdayStart,

  thursdayEnd:
    response.settings.workingHours?.thursday?.end
    ?? prev.thursdayEnd,


  friday:
    response.settings.workingHours?.friday?.enabled
    ?? prev.friday,

  fridayStart:
    response.settings.workingHours?.friday?.start
    ?? prev.fridayStart,

  fridayEnd:
    response.settings.workingHours?.friday?.end
    ?? prev.fridayEnd,


  saturday:
    response.settings.workingHours?.saturday?.enabled
    ?? prev.saturday,

  saturdayStart:
    response.settings.workingHours?.saturday?.start
    ?? prev.saturdayStart,

  saturdayEnd:
    response.settings.workingHours?.saturday?.end
    ?? prev.saturdayEnd,


  sunday:
    response.settings.workingHours?.sunday?.enabled
    ?? prev.sunday,

  sundayStart:
    response.settings.workingHours?.sunday?.start
    ?? prev.sundayStart,

  sundayEnd:
    response.settings.workingHours?.sunday?.end
    ?? prev.sundayEnd,
  // Appointment Settings

appointmentDuration:
  response.settings.appointmentSettings?.appointmentDuration
  ?? prev.appointmentDuration,

advanceBookingDays:
  response.settings.appointmentSettings?.advanceBookingDays
  ?? prev.advanceBookingDays,

cancellationHours:
  response.settings.appointmentSettings?.cancellationHours
  ?? prev.cancellationHours,

allowSameDay:
  response.settings.appointmentSettings?.allowSameDay
  ?? prev.allowSameDay,

allowCancellation:
  response.settings.appointmentSettings?.allowCancellation
  ?? prev.allowCancellation,
// System Settings

currency:
  response.settings.systemSettings?.currency
  ?? prev.currency,

timezone:
  response.settings.systemSettings?.timezone
  ?? prev.timezone,

dateFormat:
  response.settings.systemSettings?.dateFormat
  ?? prev.dateFormat,

language:
  response.settings.systemSettings?.language
  ?? prev.language,
}));

    }

  } catch (error) {

    console.error(
      "LOAD HOSPITAL SETTINGS ERROR:",
      error
    );

  }

};
  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

  };


  const handleSaveHospitalInformation = async () => {

  try {

    const response =
      await updateHospitalInformation({

        hospitalName:
          settings.hospitalName,

        email:
          settings.email,

        phone:
          settings.phone,

        emergencyPhone:
          settings.emergencyPhone,

        address:
          settings.address,

        city:
          settings.city,

        state:
          settings.state,

        zipCode:
          settings.zipCode,

        country:
          settings.country,

      });


    console.log(
      "UPDATE HOSPITAL SETTINGS:",
      response
    );


    if (response.success) {

      console.log(
        "Hospital information saved successfully."
      );

    }

  } catch (error) {

    console.error(
      "SAVE HOSPITAL INFORMATION ERROR:",
      error
    );

  }

};
const handleSaveWorkingHours = async () => {

  try {

    const response = await updateWorkingHours({

      workingHours: {

        monday: {
          enabled: settings.monday,
          start: settings.mondayStart,
          end: settings.mondayEnd,
        },

        tuesday: {
          enabled: settings.tuesday,
          start: settings.tuesdayStart,
          end: settings.tuesdayEnd,
        },

        wednesday: {
          enabled: settings.wednesday,
          start: settings.wednesdayStart,
          end: settings.wednesdayEnd,
        },

        thursday: {
          enabled: settings.thursday,
          start: settings.thursdayStart,
          end: settings.thursdayEnd,
        },

        friday: {
          enabled: settings.friday,
          start: settings.fridayStart,
          end: settings.fridayEnd,
        },

        saturday: {
          enabled: settings.saturday,
          start: settings.saturdayStart,
          end: settings.saturdayEnd,
        },

        sunday: {
          enabled: settings.sunday,
          start: settings.sundayStart,
          end: settings.sundayEnd,
        },

      },

    });


    console.log(
      "UPDATE WORKING HOURS:",
      response
    );


    if (response.success) {

      console.log(
        "Working hours saved successfully."
      );

    }

  } catch (error) {

    console.error(
      "SAVE WORKING HOURS ERROR:",
      error
    );

  }

};

const handleSaveAppointmentSettings = async () => {

  try {

    const response =
      await updateAppointmentSettings({

        appointmentDuration:
          settings.appointmentDuration,

        advanceBookingDays:
          settings.advanceBookingDays,

        cancellationHours:
          settings.cancellationHours,

        allowSameDay:
          settings.allowSameDay,

        allowCancellation:
          settings.allowCancellation,

      });


    console.log(
      "UPDATE APPOINTMENT SETTINGS:",
      response
    );


    if (response.success) {

      console.log(
        "Appointment settings saved successfully."
      );

    }

  } catch (error) {

    console.error(
      "SAVE APPOINTMENT SETTINGS ERROR:",
      error
    );

  }

};
const handleSaveSystemSettings = async () => {

  try {

    const response =
      await updateSystemSettings({

        currency:
          settings.currency,

        timezone:
          settings.timezone,

        dateFormat:
          settings.dateFormat,

        language:
          settings.language,

      });


    console.log(
      "UPDATE SYSTEM SETTINGS:",
      response
    );


    if (response.success) {

      console.log(
        "System settings saved successfully."
      );

    }

  } catch (error) {

    console.error(
      "SAVE SYSTEM SETTINGS ERROR:",
      error
    );

  }

};
  return (

    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div>

        <h2 className="text-2xl font-bold text-slate-800">
          Hospital Settings
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Manage hospital information, appointments,
          notifications and system preferences.
        </p>

      </div>


      {/* =====================================================
          1. HOSPITAL INFORMATION
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Hospital Information
        </h3>

        <p className="text-sm text-slate-500 mb-6">
          Basic information about your hospital.
        </p>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Hospital Name
            </label>

            <input
              type="text"
              name="hospitalName"
              value={settings.hospitalName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Hospital Email
            </label>

            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Emergency Phone
            </label>

            <input
              type="text"
              name="emergencyPhone"
              value={settings.emergencyPhone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>


          <div>
            <label className="block mb-2 font-medium">
              City
            </label>

            <input
              type="text"
              name="city"
              value={settings.city}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              State
            </label>

            <input
              type="text"
              name="state"
              value={settings.state}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              ZIP Code
            </label>

            <input
              type="text"
              name="zipCode"
              value={settings.zipCode}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Country
            </label>

            <input
              type="text"
              name="country"
              value={settings.country}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

                </div>


        {/* ==========================================
            SAVE HOSPITAL INFORMATION
        ========================================== */}

        <div className="mt-6 flex justify-end">

          <button
            type="button"
            onClick={handleSaveHospitalInformation}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Save Hospital Information
          </button>

        </div>


      </div>


      {/* =====================================================
          2. WORKING HOURS
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h3 className="text-lg font-bold text-slate-800">
          Working Hours
        </h3>

        <p className="text-sm text-slate-500 mt-1 mb-6">
          Set the hospital's working days and hours.
        </p>


        {[
          ["Monday", "monday"],
          ["Tuesday", "tuesday"],
          ["Wednesday", "wednesday"],
          ["Thursday", "thursday"],
          ["Friday", "friday"],
          ["Saturday", "saturday"],
          ["Sunday", "sunday"],
        ].map(([label, key]) => (

          <div
            key={key}
            className="flex flex-col md:flex-row md:items-center gap-4 py-4 border-b last:border-b-0"
          >

            <div className="w-32">

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  name={key}
                  checked={settings[key]}
                  onChange={handleChange}
                />

                <span className="font-medium">
                  {label}
                </span>

              </label>

            </div>


            <input
              type="time"
              name={`${key}Start`}
              value={settings[`${key}Start`]}
              onChange={handleChange}
              disabled={!settings[key]}
              className="border rounded-lg px-3 py-2"
            />


            <span className="text-slate-500">
              to
            </span>


            <input
              type="time"
              name={`${key}End`}
              value={settings[`${key}End`]}
              onChange={handleChange}
              disabled={!settings[key]}
              className="border rounded-lg px-3 py-2"
            />

          </div>

        ))}
        <div className="flex justify-end mt-6">

            <button
              type="button"
              onClick={handleSaveWorkingHours}
              className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium"
            >
              Save Working Hours
            </button>

          </div>

      </div>


      {/* =====================================================
          3. APPOINTMENT SETTINGS
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h3 className="text-lg font-bold text-slate-800">
          Appointment Settings
        </h3>

        <p className="text-sm text-slate-500 mt-1 mb-6">
          Configure appointment booking rules.
        </p>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <label className="block mb-2 font-medium">
              Appointment Duration
            </label>

            <select
              name="appointmentDuration"
              value={settings.appointmentDuration}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >

              <option value="15">
                15 Minutes
              </option>

              <option value="30">
                30 Minutes
              </option>

              <option value="45">
                45 Minutes
              </option>

              <option value="60">
                60 Minutes
              </option>

            </select>

          </div>


          <div>

            <label className="block mb-2 font-medium">
              Advance Booking
            </label>

            <select
              name="advanceBookingDays"
              value={settings.advanceBookingDays}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >

              <option value="7">
                7 Days
              </option>

              <option value="15">
                15 Days
              </option>

              <option value="30">
                30 Days
              </option>

              <option value="60">
                60 Days
              </option>

            </select>

          </div>


          <div>

            <label className="block mb-2 font-medium">
              Cancellation Deadline
            </label>

            <select
              name="cancellationHours"
              value={settings.cancellationHours}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >

              <option value="2">
                2 Hours
              </option>

              <option value="12">
                12 Hours
              </option>

              <option value="24">
                24 Hours
              </option>

              <option value="48">
                48 Hours
              </option>

            </select>

          </div>


          <div className="space-y-4">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="allowSameDay"
                checked={settings.allowSameDay}
                onChange={handleChange}
              />

              <span>
                Allow same-day appointments
              </span>

            </label>


            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="allowCancellation"
                checked={settings.allowCancellation}
                onChange={handleChange}
              />

              <span>
                Allow appointment cancellation
              </span>

            </label>

          </div>

        </div>


        {/* SAVE BUTTON */}

        <div className="flex justify-end mt-6">

          <button
            type="button"
            onClick={handleSaveAppointmentSettings}
            className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium"
          >
            Save Appointment Settings
          </button>

        </div>

      </div>


      {/* =====================================================
          4. NOTIFICATION SETTINGS
      ===================================================== */}

      {/* <div className="bg-white rounded-xl shadow-sm p-6">

        <h3 className="text-lg font-bold text-slate-800">
          Notification Settings
        </h3>

        <p className="text-sm text-slate-500 mt-1 mb-6">
          Choose which hospital notifications are enabled.
        </p>


        <div className="space-y-4">

          {[
            ["appointmentConfirmation", "Appointment Confirmation"],
            ["appointmentCancellation", "Appointment Cancellation"],
            ["newPatient", "New Patient Registration"],
            ["leaveRequest", "New Doctor Leave Request"],
            ["leaveStatus", "Leave Approval / Rejection"],
            ["paymentNotification", "Payment Notifications"],
          ].map(([name, label]) => (

            <label
              key={name}
              className="flex items-center justify-between border-b pb-4"
            >

              <span className="font-medium text-slate-700">
                {label}
              </span>

              <input
                type="checkbox"
                name={name}
                checked={settings[name]}
                onChange={handleChange}
              />

            </label>

          ))}

        </div>

      </div> */}


      {/* =====================================================
          5. SECURITY
      ===================================================== */}

      {/* <div className="bg-white rounded-xl shadow-sm p-6">

        <h3 className="text-lg font-bold text-slate-800">
          Security
        </h3>

        <p className="text-sm text-slate-500 mt-1 mb-6">
          Manage admin account and security preferences.
        </p>


        <div className="space-y-5">

          <div>

            <label className="block mb-2 font-medium">
              Session Timeout
            </label>

            <select
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleChange}
              className="border rounded-lg px-4 py-3"
            >

              <option value="15">
                15 Minutes
              </option>

              <option value="30">
                30 Minutes
              </option>

              <option value="60">
                1 Hour
              </option>

              <option value="120">
                2 Hours
              </option>

            </select>

          </div>


          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="loginNotification"
              checked={settings.loginNotification}
              onChange={handleChange}
            />

            <span>
              Notify admin about new login
            </span>

          </label>


          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="twoFactor"
              checked={settings.twoFactor}
              onChange={handleChange}
            />

            <span>
              Enable Two-Factor Authentication
            </span>

          </label>


          <button
            type="button"
            className="border border-slate-300 px-5 py-3 rounded-lg font-medium hover:bg-slate-50"
          >
            Change Admin Password
          </button>

        </div>

      </div> */}


      {/* =====================================================
          6. SYSTEM SETTINGS
      ===================================================== */}

      <div className="bg-white rounded-xl shadow-sm p-6">

        <h3 className="text-lg font-bold text-slate-800">
          System Settings
        </h3>

        <p className="text-sm text-slate-500 mt-1 mb-6">
          Configure regional and system preferences.
        </p>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <label className="block mb-2 font-medium">
              Currency
            </label>

            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >

              <option value="USD">
                USD - US Dollar
              </option>

              <option value="EUR">
                EUR - Euro
              </option>

              <option value="GBP">
                GBP - British Pound
              </option>

              <option value="INR">
                INR - Indian Rupee
              </option>

            </select>

          </div>


          <div>

            <label className="block mb-2 font-medium">
              Time Zone
            </label>

            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >

              <option value="America/New_York">
                America/New_York
              </option>

              <option value="America/Chicago">
                America/Chicago
              </option>

              <option value="America/Denver">
                America/Denver
              </option>

              <option value="America/Los_Angeles">
                America/Los_Angeles
              </option>

            </select>

          </div>


          <div>

            <label className="block mb-2 font-medium">
              Date Format
            </label>

            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >

              <option value="MM/DD/YYYY">
                MM/DD/YYYY
              </option>

              <option value="DD/MM/YYYY">
                DD/MM/YYYY
              </option>

              <option value="YYYY-MM-DD">
                YYYY-MM-DD
              </option>

            </select>

          </div>


          <div>

            <label className="block mb-2 font-medium">
              Language
            </label>

            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >

              <option value="English">
                English
              </option>

            </select>

          </div>

        </div>


        <div className="mt-6 flex justify-end">

          <button
            type="button"
            onClick={handleSaveSystemSettings}
            className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700"
          >
            Save System Settings
          </button>

        </div>

      </div>


      {/* =====================================================
          SAVE
      ===================================================== */}

      <div className="flex justify-end pb-8">

        <button
          type="button"
          onClick={handleSaveHospitalInformation}
          className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Save Changes
        </button>

      </div>

    </div>

  );

};

export default Settings;