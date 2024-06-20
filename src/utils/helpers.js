const bcrypt = require("bcryptjs");

async function hashPassword(plainTextPassword) {
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error("Lỗi khi tạo mật khẩu:", error);
      throw error;
    }
  }
  module.exports = {
    hashPassword
  };