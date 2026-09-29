/**
 * Wraps an async function and catches any errors,
 * forwarding them to Express error handling middleware.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
