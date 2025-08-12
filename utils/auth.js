const jwt = require('jsonwebtoken');

// generate a token
const generateToken = function (user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
}

const isAdmin = function (req, res, next) {

    // extra checking
    if (req.user.role != "Admin" ) {
        res.status(401).send('Unauthorized: Invalid role');
    } else {

    next();
    }
}

module.exports = { generateToken, isAdmin };