const User = require("../models/User")

function isValidEmail(email) {
    const emailValidatorRegExp = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
    return emailValidatorRegExp.test(email);
  }
  function validatePassword(password) {
    if (password.length >= 8) {
      return true;
    } else {
      return false;
    }
  }
  const findUserByUsername = async (email) => {
    try {
      const user = await User.findOne({ email: email });
      return user; 
    } catch (error) {
      console.error("Error while searching for users:", error);
      throw error; 
    }
  };
  const findUserById = async (id) => {
    try {
      const user = await User.findById(id).select('id email');
      return user; 
    } catch (error) {
      console.error("Error while searching for users ID:", error);
      throw error; 
    }
  };

  module.exports = {
    findUserByUsername,
    validatePassword,
    isValidEmail,
    findUserById
  };