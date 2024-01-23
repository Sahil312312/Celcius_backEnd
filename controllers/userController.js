const Usermodel = require("../models/userModel");
const Otpmodel = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");
const otpGenerator = require("otp-generator");

class UserController {
  static OtpsenderAndpassobjects = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Usermodel.findOne({ email: email });
      const otpuser = await Otpmodel.findOneAndDelete({email : email});
      
      if (user) {
        return res.send({ status: "failed", message: "Email already exists" });
      }

      // Generate OTP
      const otp = otpGenerator.generate(6, { upperCaseAlphabets: false });

      // Send OTP to the user's email
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "-otp",
        html: `<h1>${otp}</h1>`,
      });

      // Save OTP and email in the database
      const otpDoc = new Otpmodel({
        email: email,
        otp: otp,
      });

      await otpDoc.save();

      const saved_otp = await Otpmodel.findOne({ email: email });
      const token = jwt.sign(
        { userID: saved_otp._id },
        process.env.JWT_SECRET_KEY_OTP,
        { expiresIn: "5d" }
      );
     
      res
        .status(201)
        .send({
          status: "success",
          message: "otp send",
           token: token,
        });
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to Register" });
    }
  };

  static checkotp = async (req, res) => {
    try {
      const { otp } = req.body;
      const token = req.headers.authorization.split(' ')[1];
      
      // Decode the token to get userID
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY_OTP);
      const userID = decodedToken.userID;
  
      // Retrieve the stored OTP from the database
      const storedOtpDoc = await Otpmodel.findById(userID);
  
      if (!storedOtpDoc) {
        return res.status(400).send({ status: "failed", message: "Invalid OTP or user not found" });
      }
  
      const storedOtp = storedOtpDoc.otp;
  
      // Compare the entered OTP with the stored OTP
      if (otp === storedOtp) {
        // OTPs match, you can proceed with further actions
        const saved_otp = await Otpmodel.findOne({ email: storedOtpDoc.email });
        const token = jwt.sign(
          { userID: saved_otp._id, email: saved_otp.email },
          process.env.JWT_SECRET_KEY_EMAIL,
          { expiresIn: "5d" }
        );

        res.status(200).send({ status: "success", message: "OTP verified successfully",token: token });
      } else {
        res.status(400).send({ status: "failed", message: "Invalid OTP" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", message: "Unable to verify OTP" });
    }
  };
  

  static userRegistration = async (req, res) => {
    const { name, password, password_confirmation, tc, Enrollment, Phone_no } = req.body;
    console.log("chla hai g")
    const token = req.headers.authorization.split(' ')[1];
      
      // Decode the token to get userID
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY_EMAIL);
      console.log(decodedToken);
      const email = decodedToken.email;

      console.log(email);
      const user = await Usermodel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      if (name && email && password && password_confirmation && tc && Enrollment && Phone_no) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new Usermodel({
              Name: name,
              email: email,
              password: hashPassword,
              tc: tc,
              Enrollment: Enrollment,
              Phone_no: Phone_no,
            });

            doc.save();

            const saved_user = await Usermodel.findOne({ email: email });
            // Generate JWT Token
            const token = jwt.sign(
              { userID: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.status(201).send({
              status: "success",
              message: "Registration Success",
              token: token,
            });
          } catch (error) {
            console.log(error);
            res.send({ status: "failed", message: "Unable to Register" });
          }
        } else {
          res.send({ status: "failed", message: "Password Does not match" });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are required" });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await Usermodel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" });
            res.send({ status: "success", message: "Login Success", token: token });
          } else {
            res.send({ status: "failed", message: "Email or Password is not Valid" });
          }
        } else {
          res.send({ status: "failed", message: "You are not a Registered User" });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to Login" });
    }
  };

  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({ status: "failed", message: "New Password and Confirm New Password don't match" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await Usermodel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } });
        res.send({ status: "success", message: "Password changed successfully" });
      }
    } else {
      res.send({ status: "failed", message: "All Fields are Required" });
    }
  };

  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await Usermodel.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" });
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
        console.log(link);
        // Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "GeekShop - Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`,
        });
        res.send({
          status: "success",
          message: "Password Reset Email Sent... Please Check Your Email",
        });
      } else {
        res.send({ status: "failed", message: "Email doesn't exist" });
      }
    } else {
      res.send({ status: "failed", message: "Email Field is Required" });
    }
  };

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await Usermodel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ status: "failed", message: "New Password and Confirm New Password don't match" });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await Usermodel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });
          res.send({ status: "success", message: "Password Reset Successfully" });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Invalid Token" });
    }
  }
}

module.exports = UserController;





