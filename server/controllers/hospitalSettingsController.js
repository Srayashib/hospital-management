import HospitalSettings from "../models/HospitalSettings.js";


// ==========================================
// GET HOSPITAL SETTINGS
// ==========================================

export const getHospitalSettings = async (req, res) => {

  try {

    let settings = await HospitalSettings.findOne();

    // If no settings exist yet
    if (!settings) {

      settings = await HospitalSettings.create({
        hospitalName: "City Hospital",
        email: "admin@hospital.com",
        phone: "+1 234 567 890",
        emergencyPhone: "+1 234 567 891",
        address: "123 Main Street",
        city: "New York",
        state: "New York",
        zipCode: "10001",
        country: "United States",
      });

    }

    res.status(200).json({
      success: true,
      settings,
    });

  } catch (error) {

    console.error(
      "GET HOSPITAL SETTINGS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get hospital settings.",
    });

  }

};


// ==========================================
// UPDATE HOSPITAL INFORMATION
// ==========================================

export const updateHospitalInformation = async (req, res) => {

  try {

    const {
      hospitalName,
      email,
      phone,
      emergencyPhone,
      address,
      city,
      state,
      zipCode,
      country,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !hospitalName ||
      !email ||
      !phone ||
      !emergencyPhone ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !country
    ) {

      return res.status(400).json({
        success: false,
        message: "All hospital information fields are required.",
      });

    }


    // ==========================================
    // FIND EXISTING SETTINGS
    // ==========================================

    let settings = await HospitalSettings.findOne();


    // ==========================================
    // CREATE IF NOT EXISTS
    // ==========================================

    if (!settings) {

      settings = new HospitalSettings();

    }


    // ==========================================
    // UPDATE HOSPITAL INFORMATION
    // ==========================================

    settings.hospitalName = hospitalName;
    settings.email = email;
    settings.phone = phone;
    settings.emergencyPhone = emergencyPhone;
    settings.address = address;
    settings.city = city;
    settings.state = state;
    settings.zipCode = zipCode;
    settings.country = country;


    await settings.save();


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      message: "Hospital information updated successfully.",
      settings,
    });

  } catch (error) {

    console.error(
      "UPDATE HOSPITAL INFORMATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update hospital information.",
    });

  }

};

// ==========================================
// UPDATE WORKING HOURS
// ==========================================

export const updateWorkingHours = async (req, res) => {
  try {

    const { workingHours } = req.body;

    if (!workingHours) {
      return res.status(400).json({
        success: false,
        message: "Working hours are required.",
      });
    }

    // ==========================================
    // FIND EXISTING SETTINGS
    // ==========================================

    let settings = await HospitalSettings.findOne();

    // ==========================================
    // CREATE IF NOT EXISTS
    // ==========================================

    if (!settings) {
      settings = new HospitalSettings({
        hospitalName: "City Hospital",
        email: "admin@hospital.com",
        phone: "+1 234 567 890",
        emergencyPhone: "+1 234 567 891",
        address: "123 Main Street",
        city: "New York",
        state: "New York",
        zipCode: "10001",
        country: "United States",
      });
    }

    // ==========================================
    // UPDATE WORKING HOURS
    // ==========================================

    settings.workingHours = workingHours;

    await settings.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      message: "Working hours updated successfully.",
      settings,
    });

  } catch (error) {

    console.error(
      "UPDATE WORKING HOURS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update working hours.",
    });

  }
};

// ==========================================
// UPDATE APPOINTMENT SETTINGS
// ==========================================

export const updateAppointmentSettings = async (req, res) => {

  try {

    const {
      appointmentDuration,
      advanceBookingDays,
      cancellationHours,
      allowSameDay,
      allowCancellation,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      appointmentDuration === undefined ||
      advanceBookingDays === undefined ||
      cancellationHours === undefined ||
      allowSameDay === undefined ||
      allowCancellation === undefined
    ) {

      return res.status(400).json({
        success: false,
        message: "All appointment settings are required.",
      });

    }


    // ==========================================
    // FIND EXISTING SETTINGS
    // ==========================================

    let settings = await HospitalSettings.findOne();


    // ==========================================
    // CREATE IF NOT EXISTS
    // ==========================================

    if (!settings) {

      settings = new HospitalSettings({
        hospitalName: "City Hospital",
        email: "admin@hospital.com",
        phone: "+1 234 567 890",
        emergencyPhone: "+1 234 567 891",
        address: "123 Main Street",
        city: "New York",
        state: "New York",
        zipCode: "10001",
        country: "United States",
      });

    }


    // ==========================================
    // UPDATE APPOINTMENT SETTINGS
    // ==========================================

    settings.appointmentSettings = {

      appointmentDuration:
        Number(appointmentDuration),

      advanceBookingDays:
        Number(advanceBookingDays),

      cancellationHours:
        Number(cancellationHours),

      allowSameDay:
        Boolean(allowSameDay),

      allowCancellation:
        Boolean(allowCancellation),

    };


    await settings.save();


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({

      success: true,

      message:
        "Appointment settings updated successfully.",

      settings,

    });

  } catch (error) {

    console.error(
      "UPDATE APPOINTMENT SETTINGS ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to update appointment settings.",

    });

  }

};
// ==========================================
// UPDATE SYSTEM SETTINGS
// ==========================================

export const updateSystemSettings = async (req, res) => {

  try {

    const {
      currency,
      timezone,
      dateFormat,
      language,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !currency ||
      !timezone ||
      !dateFormat ||
      !language
    ) {

      return res.status(400).json({
        success: false,
        message: "All system settings fields are required.",
      });

    }


    // ==========================================
    // FIND EXISTING SETTINGS
    // ==========================================

    let settings = await HospitalSettings.findOne();


    // ==========================================
    // CREATE IF NOT EXISTS
    // ==========================================

    if (!settings) {

      settings = new HospitalSettings({
        hospitalName: "City Hospital",
        email: "admin@hospital.com",
        phone: "+1 234 567 890",
        emergencyPhone: "+1 234 567 891",
        address: "123 Main Street",
        city: "New York",
        state: "New York",
        zipCode: "10001",
        country: "United States",
      });

    }


    // ==========================================
    // UPDATE SYSTEM SETTINGS
    // ==========================================

    settings.systemSettings = {

      currency,
      timezone,
      dateFormat,
      language,

    };


    // ==========================================
    // SAVE
    // ==========================================

    await settings.save();


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({

      success: true,

      message: "System settings updated successfully.",

      settings,

    });

  } catch (error) {

    console.error(
      "UPDATE SYSTEM SETTINGS ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: "Failed to update system settings.",

    });

  }

};