// hello.js
module.exports = (req, res, next) => {
    res.header('X-Hello', 'World') // adds a 'X-Hello' paramater to HTTP header
    next()
}