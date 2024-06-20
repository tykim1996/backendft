const jwt = require('jsonwebtoken');
const User = require("../models/User");
const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
const sendOtpSms = async (phoneNumber, otp) => {
    try {
      const message = await twilioClient.messages.create({
        body: `Your OTP code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      console.log(`OTP sent successfully to ${phoneNumber}: ${message.sid}`);
      return message; 
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };
const getOtp = async (req, res) => {
    const { phoneNumber } = req.body;
    const otpCode = generateOtp();

    try {
        const token = jwt.sign( { otp: otpCode}, process.env.SECRETKEY, { expiresIn: '5m' });
        //await sendOtpSms(phoneNumber, otpCode);

        res.status(200).json({ token, message: 'OTP sent successfully', otpCode: otpCode });// will delete otpcode only test

    } catch (error) {
        res.status(500).json({ error: 'Error generating OTP', details: error })
    }
}
const verifyOtp = async (req, res) => {
    const { token, otpCode } = req.body;
    console.log(req.body);
    try {
        const decoded = jwt.verify(token, process.env.SECRETKEY);
        console.log(decoded);
        if (decoded.otp !== otpCode) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.verifiedOtp) {
            return res.status(400).json({ error: 'OTP already verified' });
        }

        user.verifiedOtp = true;
        user.updatedAt = Date.now();
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid or expired token', details: err });
    }
}

module.exports = {
    getOtp,
    verifyOtp
}