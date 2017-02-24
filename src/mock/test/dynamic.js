module.exports = function (req, res, next) {
  res.json({
    code: 0,
    message: "",
    data: {
      query: req.query,
      body: req.body
    }
  });
};