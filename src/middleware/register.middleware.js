const { user } = require("../../models");

isUserExist = (req, res, next) => {
  user
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((user) => {
      if (user) {
        res.status(400).send({
          message: "Email Already Exist",
        });
        return;
      }
      next();
    });
};

module.exports = {
  isUserExist,
};
