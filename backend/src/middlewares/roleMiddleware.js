const adminOrOwner = (req, res, next) => {
  const role = req.user.role;

  if (role === "owner" || role === "admin") {
    return next();
  }

  res.status(403);
  throw new Error("Access denied: Admin or Owner only");
};

module.exports = { adminOrOwner };
