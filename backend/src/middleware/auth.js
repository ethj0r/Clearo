const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
        }

        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User not found'
        });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired'
        });
    }
};

module.exports = { protect };