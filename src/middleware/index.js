const { isUserExist } = require("./register.middleware");
const { auth } = require("./auth.middleware");

module.exports = {
  isUserExist,
  auth,
};
