import Joi from 'joi';

const adminLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.username': 'Username is required',
    'any.required': 'Username is required',
  }),
  password: Joi.string().required().messages({
    'string.password': 'Password is required',
    'any.required': 'Password is required',
  }),
});

export const websiteAdminRegisterSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username must contain only alphanumeric characters',
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must not exceed 30 characters',
    'any.required': 'Username is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export const hospitalAdminRegisterSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Hospital name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Valid email is required',
    'any.required': 'Email is required',
  }),
  phone: Joi.string().required().messages({
    'any.required': 'Phone number is required',
  }),
  address: Joi.string().required().messages({
    'any.required': 'Address is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export default adminLoginSchema;
