module.exports.roleAuth = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Unauthorized");
    }
    next();
  };
};
