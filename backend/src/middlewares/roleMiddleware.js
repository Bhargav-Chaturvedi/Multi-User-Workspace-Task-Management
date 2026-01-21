const adminOrOwner = (req, res, next) => {
  // safety check
  if (!req.user || !req.user.role) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const { role } = req.user;

  if (role === "owner" || role === "admin") {
    return next();
  }

  res.status(403);
  throw new Error("Access denied: Admin or Owner only");
};

module.exports = { adminOrOwner };
