const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "VALIDATION ERROR",
        message: err.message,
        stackTace: err.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "NOT FOUND",
        message: err.message,
        stackTace: err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "UNAUTHORIZED",
        message: err.message,
        stackTace: err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "FORBIDDEN",
        message: err.message,
        stackTace: err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "SERVER ERROR",
        message: err.message,
        stackTace: err.stack,
      });
      break;

    default:
      console.log("No error found ✔️");
      // Fallback for unhandled errors but with 200 or other status codes
      // Ideally should not happen if constants cover all errors
      res.status(statusCode !== 200 ? statusCode : 500).json({
        title: "UNHANDLED ERROR",
        message: err.message,
        stackTrace: err.stack
      });
      break;
  }
};
module.exports = errorHandler;
