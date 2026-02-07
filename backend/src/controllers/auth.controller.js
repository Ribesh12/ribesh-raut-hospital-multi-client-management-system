import adminLoginSchema, {
  websiteAdminRegisterSchema,
  hospitalAdminRegisterSchema,
} from '../joi/admin.joi.js';
import Admin from '../models/admin.model.js';
import Hospital from '../models/hospital.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    console.time('login-total');
    console.time('validation');
    const { error, value } = adminLoginSchema.validate(req.body);
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors: messages });
    }
    console.timeEnd('validation');

    const { username, password } = value;

    console.time('admin-query');
    let user = await Admin.findOne({ username }).lean();
    console.timeEnd('admin-query');
    
    if (user) {
      console.time('bcrypt-compare-admin');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.timeEnd('bcrypt-compare-admin');
      
      if (!isPasswordValid) {
        console.timeEnd('login-total');
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign(
        { id: user._id, userType: 'website_admin' },
        process.env.JWT_SECRET || 'your_secret_key',
        { expiresIn: '24h' }
      );

      console.timeEnd('login-total');
      return res.status(200).json({
        message: 'Website Admin login successful',
        userType: 'website_admin',
        token,
        user: { id: user._id, username: user.username },
      });
    }

    console.time('hospital-query');
    user = await Hospital.findOne({ email: username }).lean();
    console.timeEnd('hospital-query');
    
    if (user) {
      console.time('bcrypt-compare-hospital');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.timeEnd('bcrypt-compare-hospital');
      
      if (!isPasswordValid) {
        console.timeEnd('login-total');
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign(
        { id: user._id, userType: 'hospital_admin', hospitalId: user._id },
        process.env.JWT_SECRET || 'your_secret_key',
        { expiresIn: '24h' }
      );

      console.timeEnd('login-total');
      return res.status(200).json({
        message: 'Hospital Admin login successful',
        userType: 'hospital_admin',
        token,
        user: { id: user._id, email: user.email, name: user.name, hospitalId: user._id },
      });
    }

    console.timeEnd('login-total');
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerWebsiteAdmin = async (req, res) => {
  try {
    const { error, value } = websiteAdminRegisterSchema.validate(req.body);
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors: messages });
    }

    const { username, password } = value;

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, userType: 'website_admin' },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Website Admin registration successful',
      userType: 'website_admin',
      token,
      user: { id: newAdmin._id, username: newAdmin.username },
    });
  } catch (error) {
    console.error('Error during website admin registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerHospitalAdmin = async (req, res) => {
  try {
    const { error, value } = hospitalAdminRegisterSchema.validate(req.body);
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors: messages });
    }

    const { name, email, phone, address, password } = value;

    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const newHospital = new Hospital({
      name,
      email,
      phone,
      address,
      password,
    });
    await newHospital.save();

    const token = jwt.sign(
      {
        id: newHospital._id,
        userType: 'hospital_admin',
        hospitalId: newHospital._id,
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Hospital Admin registration successful',
      userType: 'hospital_admin',
      token,
      user: {
        id: newHospital._id,
        name: newHospital.name,
        email: newHospital.email,
        hospitalId: newHospital._id,
      },
    });
  } catch (error) {
    console.error('Error during hospital admin registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
