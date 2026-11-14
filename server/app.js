import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js" ;
import doctorRoutes from "./routes/doctorRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import weeklyScheduleRoutes from "./routes/weeklyScheduleRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import receptionistRoutes from "./routes/receptionistRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import hospitalSettingsRoutes from "./routes/hospitalSettingsRoutes.js";
import patientProfileRoutes from "./routes/patientProfileRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import { startSlotCron } from "./utils/slotCron.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";
import receptionistPaymentRoutes from "./routes/receptionistPaymentRoutes.js";
import paypalRoutes from "./routes/paypalRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import revenueReportRoutes from "./routes/revenueReportRoutes.js";
import path from "path";

import "dotenv/config";
const app=express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.get("/",(req,res)=>{
    res.json({
        success: true,
        message: "Hospital Management API Running...",
    });
});
app.use("/api/auth", authRoutes);

// Medical record routes MUST come before doctorRoutes
app.use("/api/doctors", medicalRecordRoutes);

app.use("/api/doctors", doctorRoutes);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctor", weeklyScheduleRoutes );
app.use("/api/doctor", slotRoutes);
app.use("/api/receptionists", receptionistRoutes);
app.use("/api/leaves", leaveRoutes);
app.use( "/api/notifications",notificationRoutes);
app.use("/api/hospital-settings",hospitalSettingsRoutes);
app.get("/api/patient/test", (req, res) => {
  res.json({
    success: true,
    message: "Patient route is working",
  });
});

app.use("/api/patient", patientProfileRoutes);
app.use("/api/patient/appointments", appointmentRoutes);
app.use(
  "/api/receptionist/payments",
  receptionistPaymentRoutes
);
app.use(
  "/api/paypal",
  paypalRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);
app.use("/api/admin/revenue-reports", revenueReportRoutes);
startSlotCron();
export default app;