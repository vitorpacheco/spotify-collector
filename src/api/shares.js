module.exports = (req, res) => {
  res.json({
    body: req.body,
    query: res.query,
    cookies: req.cookies
  })
}