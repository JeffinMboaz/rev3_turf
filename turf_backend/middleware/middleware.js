const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token from Authorization header
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Expected format: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRETKEY, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = decodedUser; // decodedUser contains payload like { id, role }
        console.log("✅ User authenticated:", req.user);
        next();
    });
};



module.exports = authenticateToken;
