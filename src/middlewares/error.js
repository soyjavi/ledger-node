export default (error, req, res, next) => {
  if (res.headersSent) next(error);
  else {
    const { code = 400 } = error;
    res.status(code).json({ error: error.message });
  }
};
