
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '35edfa8e50a7dc05da523cb3bbe99b7e1ee4852adc6532a458bdfd2361a8c1e9';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format "Bearer [token]"

    if (token == null) {
        return res.sendStatus(401); // No token provided
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Invalid token
        }

        console.log("Decoded JWT payload:", user);
        req.user = user; // Add user info to request
        next(); // Pass control to the next handler
    });
}

module.exports = authenticateToken;
