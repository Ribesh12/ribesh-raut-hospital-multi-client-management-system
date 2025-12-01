import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'JWT_SECRET_KEY'
    );

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorizeWebsiteAdmin = (req, res, next) => {
  if (req.user.userType !== 'website_admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};

export const authorizeHospitalAdmin = (req, res, next) => {
  if (req.user.userType !== 'hospital_admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};

export const authorizeAdmin = (req, res, next) => {
  if (
    req.user.userType !== 'website_admin' &&
    req.user.userType !== 'hospital_admin'
  ) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};
