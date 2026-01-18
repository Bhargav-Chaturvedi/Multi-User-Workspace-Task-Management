const asyncHandler = require("express-async-handler");
const Auth = require("../models/User");

// @desc create a User
// @routes GET /api/users/create
// @access public - but only once, user become owner

const authOwner = asyncHandler(async (req, res) => {});
