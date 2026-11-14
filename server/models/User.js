import mongoose from "mongoose";

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:String,
            trim:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            lowercase:true
        },
        phone:{
            type:String,
            unique:true,
            required:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        role:{
            type: String,
            enum: ["patient", "doctor", "receptionist", "admin"],
            default: "patient",
        },

    },
    {
    timestamps: true,
  }
);

export default mongoose.model("User",userSchema);