const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    const authInfo = req.headers.authorization;
    const token = authInfo?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided!' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token!' });
    }
};

module.exports = { verifyUser };
