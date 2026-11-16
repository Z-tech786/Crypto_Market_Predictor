import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'crypto_secret_key_2026');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      // In offline/demo mode, decode fallback
      req.user = {
        _id: decoded.id,
        name: decoded.name || 'Academic User',
        email: decoded.email,
        role: decoded.role || 'student'
      };
      return next();
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user?.role || 'guest'}' does not have access to this resource`
      });
    }
    next();
  };
};
