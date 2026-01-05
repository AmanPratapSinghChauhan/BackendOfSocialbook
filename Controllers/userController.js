
import { User } from '../Models/userModel.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendToken } from '../utils/sendTokens.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/dataUri.js';
import cloudinary from 'cloudinary';
dotenv.config({ path: './Config/config.env' });

export const register = async (req, res, next) => {
  try {
    console.log("Handling User Register");
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const dob = req.body?.date;
    const gender = req.body?.gender;
    const image = req?.file;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exist', status: false });
    }
    console.log("User not exists");
    const fileUri = getDataUri(image);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);



    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(Math.random() * 1000000);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: {
        public_id: mycloud?.public_id,
        url: mycloud?.secure_url,
      },
      dob,
      gender,
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });
    console.log("user saved successfully");
    const message = `Please Verify Your Account, Your OTP is ${otp}`;

    await sendEmail({
      email: user.email,
      subject: `Socialbook Verification Email`,
      message,
    });
    console.log("Email sent successfully");
    const token = user.getJWTToken();
    res.status(200).json({
      status: true,
      msg: `OTP sent to ${user.email} successfully, Valid for 5 minutes.`,
      user,
      token,
    });
  }
  catch (error) {
    console.log("User creation Failed with error = ", error.message);
    return res.status(400).json({ msg: error.message, status: false });
  }
};

export const verify = async (req, res, next) => {
  console.log("Handling User Verify");
  const { otp } = req.body;

  try {
    console.log(req.user._id);

    const user = await User.findById(req.user._id).select("+otp");
    if (!user) {
      return res.status(400).json({ msg: "User not found in database", status: false });
    }

    if (user.otp != otp || user.otp_expiry < Date.now()) {
      return res.status(400).json({ status: false, msg: "Invalid OTP or has been Expired" });
    }

    user.verified = true;
    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    sendToken(res, user, `Successfully Verified , Welcome ${user.name}`);
  } catch (error) {
    console.log("User verification Failed", error.message);
    res.status(400).json({ status: false, msg: error.message });
  }
};

export const login = async (req, res, next) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: false, msg: 'Incorrect Email or Password' });
    }
    bcrypt.compare(password, user.password).then((isPasswordValid) => {
      if (!isPasswordValid) {
        return res.status(400).json({ msg: "Incorrect Password", status: false });
      }
      else {

        sendToken(res, user, `Welcome back, ${user.name}`);
      }
    })
      .catch(error => {

        res.status(400).json({ status: false, msg: error.message });
      });
  }
  catch (error) {
    res.status(400).json({ status: false, msg: error.message });
  }


};

export const logout = async (req, res, next) => {
  res.status(200).json({
    status: true,
    msg: "Logged Out Successfully ",
  });
};

export const getMyProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  try {
    // const post = await Post.find();

    res.status(200).json({
      status: true,
      user,
      msg: `Welcome Back ${user.name}`,
    });
  }
  catch (error) {
    res.status(400).json({ status: false, msg: error.message });
  }
};

export const getUser = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    res.status(200).json({ status: true, data: user });
  }
  catch (error) {
    res.status(400).json({ status: false, msg: error.message });
  }

}


export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: false, msg: 'user not found' });
    }
    const resetToken = await user.getResetToken();
    await user.save();

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = `Your password reset url is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
      await sendEmail({
        email: email,
        subject: 'Socialbook Recovery email',
        message,
      })

      res.status(200).json({
        status: true,
        msg: `Reset Password Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(400).json({ status: false, msg: error.message });
    }

  }
  catch (error) {
    console.log(error);
  }


};
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.body;
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      res.status(400).json({ status: false, msg: 'Token is invalid or has been expired' })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      status: true,
      msg: "Password Changed Successfully, Please login with new Password.",
    });
  }
  catch (error) {
    console.log(error);
  }

};

export const getAllUsers = async (req, res, next) => {
  try {
    const pageSize = req.body.pagesize;
    const pageIndex = req.body.pageindex;
    const users = await User.find()
      .skip((pageIndex) * pageSize)
      .limit(pageSize);
    return res.status(200).json({ status: true, users });
  }
  catch (error) {
    res.status(400).json({ status: false, msg: error.message });
  }
}

export const addFriend = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.friendId, {
      $push: { friendRequest: req.user._id },
    },
      { new: true },
    );

    await User.findByIdAndUpdate(req.user._id, {
      $push: { userRequest: req.body.friendId },
    }, {
      new: true,
    });
    const user = await User.findById(req.user._id);
    res.status(200).json({ status: true, data: user });
  }
  catch (error) {
    res.status(400).json({ status: false, msg: error.message });
  }
}

export const cancelRequest = async (req, res, next) => {
  try {
    const friendId = req.body.friendId;
    const userId = req.user._id;
    await User.findByIdAndUpdate(friendId, {
      $pull: { friendRequest: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { userRequest: friendId },
    });
    const user = await User.findById(userId);
    res.status(200).json({ status: true, data: user });
  }
  catch (error) {
    res.status(400).json({ status: false, msg: error.message })
  }

}

export const friendAccept = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequest: friendId },
    }, { new: true });
    await User.findByIdAndUpdate(userId, {
      $push: { friends: friendId }
    }, {
      new: true
    });
    await User.findByIdAndUpdate(friendId, {
      $pull: { userRequest: userId },
    },
      { new: true });
    await User.findByIdAndUpdate(friendId, {
      $push: { friends: userId }
    }, {
      new: true
    });

    const user = await User.findById(userId);
    res.status(200).json({ status: true, data: user });

  }
  catch (error) {
    res.status(400).json({ status: false, msg: error.message });
  }
}


export const deleteFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequest: friendId },

    }, {
      new: true,
    });
    await User.findByIdAndUpdate(friendId, {
      $pull: { userRequest: userId },
    },
      { new: true });
    const user = await User.findById(userId);
    res.status(200).json({ status: true, data: user });

  }
  catch (error) {
    res.status(400).json({ status: false, msg: error.message })
  }
}

export const GetUserByIds = async (req, res) => {
  try {
    const ids = req.body.ids;
    const result = await User.find({
      _id: { $in: ids }
    });
    res.status(200).json({ status: true, data: result });

  }
  catch (error) {
    res.status(400).json({ status: false, msg: error.message });
  }
}

// export const forgetPassword = catchAsyncError(async (req, res, next) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) return res.json({status:false,msg:'User not found'});

//   const resetToken = await user.getResetToken();

//   await user.save();

//   // const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

//   // const message = `Click on the link to reset your password. ${url}. If you have not request then please ignore.`;

//   const resetPasswordUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

//   // const resetPasswordUrl = `${req.protocol}://${req.get(
//   //   "host"
//   // )}/resetpassword/${resetToken}`;

//   const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

//   // Send token via email

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: `Tic Tac Toe Password recovery`,
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${user.email} successfully`,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(new ErrorHandler(error.message, 500));
//   }

//   // await sendEmail(user.email, "CourseBundler Reset Password", message);

//   // res.status(200).json({
//   //   success: true,
//   //   message: `Reset Token has been sent to ${user.email}`,
//   // });
// });

// export const resetPassword = catchAsyncError(async (req, res, next) => {
//   const { token } = req.params;

//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(token)
//     .digest("hex");

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: {
//       $gt: Date.now(),
//     },
//   });

//   if (!user)
//     return next(new ErrorHandler("Token is invalid or has been expired", 401));

//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;

//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: "Password Changed Successfully",
//   });
// });


