import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validator from 'validator';
const {ObjectId}=mongoose.Schema.Types;


const schema = mongoose.Schema({
    // Name type, required
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [3, "Name should have more than 3 characters"],
  },
  // Email type, required, unique, validate
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: validator.isEmail,
  },

  // Password type, required, minLength, select
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password Must be greater than 8 chars.."],
  },
  image:{
    public_id:{
      type:String,
      required:true,
    },
    url:{
    type:String,
    required:true,
    },
  },
  posts:{
    type:[String],
    default:[],
  },
  dob:{
    type:String,
    required:[true,"Please enter your dob"]
  },
  gender:{
    type:String,
    required:[true, "Please enter your gender"]
  },
  userRequest:[{type:ObjectId,ref:"User"}],
  friendRequest:[{type:ObjectId,ref:"User"}],
  friends:[{type:ObjectId,ref:"User"}],
  
  // Role type default
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  // CreatedAt type, default
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // verification of email
  verified: {
    type: Boolean,
    default: false,
  },

  otp: {
    type: Number,
    select: false,
  },

  otp_expiry: Date,

  resetPasswordToken: String,
  resetPasswordExpire: String,

},{
  timeStamp:true,
},
)

import dotenv from 'dotenv';
dotenv.config({path:'./Config/config.env'});




  schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
  };
  
  schema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };
  
  schema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });
  

  
  
  export const User = mongoose.model("User", schema);
  