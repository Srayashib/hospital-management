import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// =====================================================
// AUTH
// =====================================================

import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";

// =====================================================
// LAYOUTS
// =====================================================

import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import ReceptionistLayout from "../layouts/ReceptionistLayout";
import PatientLayout from "../layouts/PatientLayout";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "../pages/admin/Dashboard";
import AdminDoctors from "../pages/admin/Doctors";
import AdminPatients from "../pages/admin/Patients";
import AdminDepartments from "../pages/admin/Departments";
import AdminReceptionists from "../pages/admin/Receptionists";
import AdminAppointments from "../pages/admin/Appointments";
import AdminSettings from "../pages/admin/Settings";
import AddDoctor from "../pages/admin/AddDoctor";
import AddDepartment from "../pages/admin/AddDepartment";
import AddReceptionist from "../pages/admin/AddReceptionist";
import Leaves from "../pages/admin/Leaves";
import AdminNotifications from "../pages/admin/Notifications";
import RevenueReports from "../pages/admin/RevenueReports";

// =====================================================
// DOCTOR PAGES
// =====================================================

import DoctorDashboard from "../pages/doctor/Dashboard";
import DoctorAppointments from "../pages/doctor/Appointments";
import DoctorPatients from "../pages/doctor/Patients";
import WeeklySchedule from "../pages/doctor/WeeklySchedule";
import AvailableSlots from "../pages/doctor/AvailableSlots";
import SlotDetails from "../pages/doctor/SlotDetails";
import Leave from "../pages/doctor/Leave";
import DoctorPrescriptions from "../pages/doctor/Prescriptions";
import Reports from "../pages/doctor/Reports";
import DoctorProfile from "../pages/doctor/Profile";
import MedicalRecord from "../pages/doctor/MedicalRecord";
import TodayAllAppointments from "../pages/doctor/TodayAllAppointments";

// =====================================================
// PATIENT PAGES
// =====================================================

import PatientDashboard from "../pages/patient/Dashboard";
import PatientAppointments from "../pages/patient/Appointments";
import PatientDoctors from "../pages/patient/Doctors";
import PatientPrescriptions from "../pages/patient/Prescriptions";
import PatientPayments from "../pages/patient/Payments";
import PatientSettings from "../pages/patient/Settings";
import PatientProfile from "../pages/patient/Profile";
import Availability from "../pages/patient/Availability";
import MedicalHistory from "../pages/patient/MedicalHistory";

// =====================================================
// RECEPTIONIST PAGES
// =====================================================

import ReceptionistDashboard from "../pages/receptionist/Dashboard";
import ReceptionistProfile from "../pages/receptionist/Profile";
import DoctorAvailability from "../pages/receptionist/DoctorAvailability";
import BookAppointment from "../pages/receptionist/BookAppointment";
import ReceptionistAppointments from "../pages/receptionist/Appointments";
import CancelAppointment from "../pages/receptionist/CancelAppointment";
import ReceptionistPatients from "../pages/receptionist/Patients";
import PatientCheckIn from "../pages/receptionist/PatientCheckIn";
import ReceptionistPayments from "../pages/receptionist/Payments";

// =====================================================
// APP ROUTES
// =====================================================

const AppRoutes = () => {

  return (

    <Routes>

      {/* ================================================= */}
      {/* AUTH ROUTES */}
      {/* ================================================= */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />


      {/* ================================================= */}
      {/* ADMIN ROUTES */}
      {/* ================================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          />
        }
      >

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="doctors"
            element={<AdminDoctors />}
          />

          <Route
            path="doctors/add"
            element={<AddDoctor />}
          />

          <Route
            path="doctors/edit/:id"
            element={<AddDoctor />}
          />

          <Route
            path="leaves"
            element={<Leaves />}
          />

          <Route
            path="notifications"
            element={<AdminNotifications />}
          />

          <Route
            path="patients"
            element={<AdminPatients />}
          />

          <Route
            path="departments"
            element={<AdminDepartments />}
          />

          <Route
            path="departments/add"
            element={<AddDepartment />}
          />

          <Route
            path="departments/edit/:id"
            element={<AddDepartment />}
          />

          <Route
            path="receptionists"
            element={<AdminReceptionists />}
          />

          <Route
            path="receptionists/add"
            element={<AddReceptionist />}
          />

          <Route
            path="receptionists/edit/:id"
            element={<AddReceptionist />}
          />

          <Route
            path="appointments"
            element={<AdminAppointments />}
          />

          <Route
            path="settings"
            element={<AdminSettings />}
          />

          <Route
            path="/admin/reports"
            element={<RevenueReports />}
          />

        </Route>

      </Route>


      {/* ================================================= */}
      {/* DOCTOR ROUTES */}
      {/* ================================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["doctor"]}
          />
        }
      >

        <Route
          path="/doctor"
          element={<DoctorLayout />}
        >

          <Route
            index
            element={<DoctorDashboard />}
          />

          <Route
            path="dashboard"
            element={<DoctorDashboard />}
          />

          <Route
            path="appointments"
            element={<DoctorAppointments />}
          />

          <Route
            path="patients"
            element={<DoctorPatients />}
          />

          <Route
            path="weekly-schedule"
            element={<WeeklySchedule />}
          />

          <Route
            path="available-slots"
            element={<AvailableSlots />}
          />

          <Route
            path="available-slots/:date"
            element={<SlotDetails />}
          />

          <Route
            path="leave"
            element={<Leave />}
          />

          <Route
            path="prescriptions"
            element={<DoctorPrescriptions />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="profile"
            element={<DoctorProfile />}
          />

          <Route
            path="/doctor/medical-record/:patientId"
            element={<MedicalRecord />}
          />

          <Route
            path="/doctor/today-appointments"
            element={<TodayAllAppointments />}
          />

        </Route>

      </Route>


      {/* ================================================= */}
      {/* PATIENT ROUTES */}
      {/* ================================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["patient"]}
          />
        }
      >

        <Route
          path="/patient"
          element={<PatientLayout />}
        >

          {/* /patient */}
          <Route
            index
            element={<PatientDashboard />}
          />

          {/* /patient/dashboard */}
          <Route
            path="dashboard"
            element={<PatientDashboard />}
          />

          {/* /patient/appointments */}
          <Route
            path="appointments"
            element={<PatientAppointments />}
          />

          {/* /patient/doctors */}
          <Route
            path="doctors"
            element={<PatientDoctors />}
          />

          

          {/* /patient/prescriptions */}
          <Route
            path="prescriptions"
            element={<PatientPrescriptions />}
          />

          {/* /patient/payments */}
          <Route
            path="payments"
            element={<PatientPayments />}
          />

          

          {/* /patient/settings */}
          <Route
            path="settings"
            element={<PatientSettings />}
          />
          <Route
            path="profile"
            element={<PatientProfile />}
          />

          <Route
            path="doctors/:doctorId/availability"
            element={<Availability />}
          />
          <Route
            path="medical-history"
            element={<MedicalHistory />}
          />

        </Route>

      </Route>


      {/* ================================================= */}
      {/* RECEPTIONIST ROUTES */}
      {/* ================================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["receptionist"]}
          />
        }
      >

        <Route
          path="/receptionist"
          element={<ReceptionistLayout />}
        >

          {/* /receptionist */}
          <Route
            index
            element={<ReceptionistDashboard />}
          />

          {/* /receptionist/dashboard */}
          <Route
            path="dashboard"
            element={<ReceptionistDashboard />}
          />

          {/* /receptionist/profile */}
          <Route
            path="profile"
            element={<ReceptionistProfile />}
          />

          {/* /receptionist/doctors */}
          <Route
            path="doctors"
            element={<DoctorAvailability />}
          />
          <Route
              path="appointments/book"
              element={<BookAppointment />}
            />

            <Route
              path="appointments"
              element={<ReceptionistAppointments />}
            />

            <Route
              path="appointments/cancel"
              element={<CancelAppointment />}
            />

            


              {/* /receptionist/patients */}

              <Route
                path="patients"
                element={<ReceptionistPatients />}
              />


              {/* /receptionist/patients/check-in */}

              <Route
                path="patients/check-in"
                element={<PatientCheckIn />}
              />
              {/* /receptionist/payments */}
              <Route
                path="payments"
                element={<ReceptionistPayments />}
              />

        </Route>

      </Route>

    </Routes>

  );

};

export default AppRoutes;