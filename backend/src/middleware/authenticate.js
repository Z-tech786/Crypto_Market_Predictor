import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export function authenticate(req, res, next) {
  const authorization = req.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Sign in to access this resource.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload.sub !== 'string' || !mongoose.isValidObjectId(payload.sub)) {
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Your session is invalid or has expired.' });
  }
}
