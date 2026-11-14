import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";
import Receptionist from "../models/Receptionist.js"; 

export const registerUser=async(req,res)=>{
    try{
        const {name,email,password,phone}=req.body;

        if(!name||!email||!phone||!password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        const emailExists=await User.findOne({email});
        if(emailExists){
            return res.status(400).json({
                success:false,
                message:"Email already exist"
            });
        }
        const phoneExists=await User.findOne({phone});
        if(phoneExists){
            return res.status(400).json({
                success:false,
                message:"Phone number already register"
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            phone,
            password:hashedPassword
        });
        res.status(201).json({
            success:true,
            message:"Registration Successful",
            data:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone
            },
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// export const loginUser=async(req,res)=>{
//     try{
//         const {email,password}=req.body;
//         if(!email||!password){
//             return res.status(400).json({
//                 success:false,
//                 message:"All fields are required"
//             })
//         }
//        console.log("Login Email:", email);

// const userData = await User.find();
// console.log(
//   "Users:",
//   userData.map((u) => u.email)
// );

// const doctorData = await Doctor.find();
// console.log(
//   "Doctors:",
//   doctorData.map((d) => d.email)
// );

// let user = await User.findOne({ email });

// console.log("User Found:", user);

// if (!user) {
//   user = await Doctor.findOne({ email });
//   console.log("Doctor Found:", user);
// }

//             // Later
//             // if (!user) {
//             //     user = await Receptionist.findOne({ email });
//             // }

//             if (!user) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "User not found",
//                 });
//             }
//             console.log("DB Password:", user.password);

//     const isMatch = await bcrypt.compare(password, user.password);

//     console.log("Password Match:", isMatch);
//         if(!isMatch){
//             return res.status(400).json({
//                 success:false,
//                 message:"Password wrong"
//             });
//         }
//         const token = jwt.sign(
//         {
//             id: user._id,
//             email: user.email,
//         },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: "7d",
//         }
//         );

//         res.status(200).json({
//         success: true,
//         message: "Login Successful",
//         token,
//         user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             phone: user.phone,
//              role: user.role,
//         },
//         });
//     } catch (error) {
//         res.status(500).json({
//         success: false,
//         message: error.message,
//         });
//     }
//     };
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const loginEmail = email.toLowerCase().trim();

    console.log("Login Email:", loginEmail);

    // ==========================================
    // CHECK USER COLLECTION
    // Admin + Patient
    // ==========================================

    let user = await User.findOne({
      email: loginEmail,
    });

    let role = null;

    if (user) {
      role = user.role;
      console.log("User Found:", user.email);
      console.log("User Role:", role);
    }

    // ==========================================
    // CHECK DOCTOR COLLECTION
    // ==========================================

    if (!user) {
      user = await Doctor.findOne({
        email: loginEmail,
      });

      if (user) {
        role = "doctor";

        console.log("Doctor Found:", user.email);
        console.log("Doctor Role:", role);
      }
    }

    // ==========================================
    // CHECK RECEPTIONIST COLLECTION
    // ==========================================

    if (!user) {
      user = await Receptionist.findOne({
        email: loginEmail,
      });

      if (user) {
        role = "receptionist";

        console.log(
          "Receptionist Found:",
          user.email
        );

        console.log(
          "Receptionist Role:",
          role
        );
      }
    }

    // ==========================================
    // USER NOT FOUND
    // ==========================================

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Final User:", user);
    console.log("Final Role:", role);

    // ==========================================
    // PASSWORD CHECK
    // ==========================================

    console.log("DB Password:", user.password);

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log(
      "Password Match:",
      isMatch
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password wrong",
      });
    }

    // ==========================================
    // JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: role,
      },
    });

  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};