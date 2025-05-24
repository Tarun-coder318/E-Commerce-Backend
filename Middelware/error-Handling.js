
function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: "The user is not authorized",
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message || "Validation failed",
    });
  }

  // Default error handler
  return res.status(500).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
