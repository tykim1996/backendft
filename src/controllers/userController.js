const passport = require("../config/passport");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService ');
const helper = require('../utils/helpers')
const User = require("../models/User")

const signUp = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await userService.findUserByUsername(email);
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    
    if (!userService.isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email" });
    }
    
    if (!userService.validatePassword(password)) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    user = new User({email,password});
    user.password = await helper.hashPassword(password);

    await user.save();

     
    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, "wiserobot", { expiresIn: "1h" });
    const {HOST, PROTOCOL} = process.env
    const url = `${PROTOCOL}:${HOST}/api/auth/confirm-email/${token}`;

    let transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
          user: '1adf530103bd8f', // Thay thế bằng tên người dùng Mailtrap của bạn
          pass: '7a0f9f12e7d3cb'  // Thay thế bằng mật khẩu Mailtrap của bạn
      }
    });
    
    let mailOptions = {
      from: 'kimle@example.com',
      to: 'recipient-email@example.com',
      subject: 'Test Email',
      text: 'Hello, this is a test email!',
      html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
  };
  
  // Gửi email
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res.status(400).json({ message: "err while authenticating" });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(400).json({msg:"Registered failed"})
      }
      return res
        .status(201)
        .json({token: token, msg: "Registered successfully, please verify your email" });
    });
  })(req, res, next);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const signIn = async (req, res, next) => {
  const emailCorect = userService.isValidEmail(req.body.email);
  const passwordCorrect = userService.validatePassword(req.body.password);
  if (!emailCorect) {
    return res.status(400).json({ msg: "Invalid email" });
  }
  if (!passwordCorrect) {
    return res.status(400).json({ msg: "Invalid password" });
  }

  const user = await User.findOne({ email: req.body.email });

  if (user && !user.isVerified) {
    return res.status(400).json({ msg: "User has not verified email" });
  }

  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res.status(400).json({ msg: "err while authenticating" });
    }

    if (!user) {
      return res.status(400).json({ success: false, msg: info.msg });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ success: true, msg: "Login compete !", user });
    });
  })(req, res, next);
};

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ msg: "Missing tokens" });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, "wiserobot"||process.env.JWT_SECRET);
    } catch (verifyErr) {
      if (verifyErr.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token has expired" });
      } else if (verifyErr.name === "JsonWebTokenError") {
        return res.status(400).json({ msg: "Invalid token" });
      }
      throw verifyErr; 
    }

    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ isVerified: user.isVerified, msg: "The email has been previously confirmed" });
    }
    user.isVerified = true;
    await user.save();

    res.status(200).json({ msg: "Email verified successfully" });
  } catch (err) {
    console.error("Error verifying email:", err); 
    res.status(500).json({ msg: "Server error" });
  }
};


const checkEmailConfirmation = async (req, res) => {
  console.log("5s checkEmailConfirmation");
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ msg: "Thiếu token" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "wiserobot");
    } catch (verifyErr) {
      if (verifyErr.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token đã hết hạn" });
      } else if (verifyErr.name === "JsonWebTokenError") {
        return res.status(400).json({ msg: "Token không hợp lệ" });
      }
      throw verifyErr;
    }

    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ isVerified: user.isVerified });

  } catch (err) {
    console.error("Error verifying email:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

const signOut = (req, res, next) => {
  console.log(req.headers);
  console.log(req.user);
  if (!req.session || !req.session.passport || !req.session.passport.user) {
    return res.status(401).json({ status: 'User not login!' });
  }
  const userId = req.session.passport.user;

  console.log(`User ID ${userId} Sign out .`);

  req.logout(err => {
    if (err) {
      return next(err);
    }

    req.session.destroy(err => {
      if (err) {
        console.error('Error while destroy session:', err);
        return res.status(500).json({ status: 'error server' });
      }

      return res.status(200).json({ status: 'Signed out successfully!' });
    });
  });
};

let checkauth =  (req, res, next) => {
  console.log("service user checkauth")
  //req.session.passport = {}
  console.log('req.user',req.user);
  let userInfo = req.user;
  // console.log(req);
  if (userInfo === undefined)
      return res.status(403).send({ success: false, message: 'User Not Login' });
  return res.status(200).json(userInfo);
};


module.exports = {
  signUp,
  signIn,
  confirmEmail,
  checkEmailConfirmation,
  signOut,
  checkauth
};
