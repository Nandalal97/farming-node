const { z } = require('zod');
const signupSchema = z.object({
  name: z.string().min(2, 'Name Min. 2 characters').max(50, 'Name Max. 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter Valid Number').max(10, 'Enter Valid Number'),
  password: z.string().min(8, 'password Min. 8 characters'),
  address: z.string().min(3, 'Address Min. 3 characters').max(100, 'Address Max. 100 characters'),
  state: z.string().min(1, 'Please select a valid state'),
  city: z.string().min(1, 'Please select a city'),
  pin: z.string().min(6, 'Enter valid Pin code').max(6, 'Enter valid Pin code'),
  dob: z.string('Select Date Of Birth'),
  gender: z.string('Select Your Gender'),
});

const validateSignup = (req, res, next) => {
  try {
    req.body = signupSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ msg: error.errors[0].message, status: 0, errors: 'Validation failed' });
    }
    next(error);
  }
};


// Login Validation
const loginSchema = z.object({
  phone: z.string().min(10, 'Enter Invalid Number').max(10, 'Enter Valid Number'),
  password: z.string().min(6, 'Unauthorized access'),
});

const validateLogin = (req, res, next) => {
  try {
    req.body = loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If validation fails, 
      return res.status(400).json({
        //   msg: 'Validation failed',
        status: 0,
        errors: error.errors[0].message,
      });
    }

    next(error);
  }
};


// Update Validation

const updateuser = z.object({
  name: z.string().min(2, 'Name Min. 2 characters').max(50, 'Name Max. 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter Valid Number').max(10, 'Enter Valid Number'),
  // password: z.string().min(8, 'Min. 8 characters').optional(),
  address: z.string().min(3, 'Address Min. 3 characters').max(100, 'Address Max. 100 characters'),
  state: z.string().min(1, 'Please select a valid state'),
  city: z.string().min(1, 'Please select a city'),
  pin: z.string().min(6, 'Enter Valid Pin code').max(6, 'Enter Valid Pin code'),
  dob: z.string('Select Date Of Birth'),
  gender: z.string('Select Your Gender'),
});

const updateUser = (req, res, next) => {
  try {
    req.body = updateuser.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ msg: error.errors[0].message, status: 0, errors: 'Validation failed' });
    }
    next(error);
  }
};
// updatepassword
const updatepassword = z.object({
  currentPassword:z.string().min(8, 'Invalid Current Password'),
  newPassword:z.string().min(8, 'Password Min. 8 characters').max(16, 'Password Max.16 Characters')

});

const updatePassword = (req, res, next) => {
  try {
    req.body = updatepassword.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ msg: error.errors[0].message, status: 0, errors: 'Validation failed' });
    }
    next(error);
  }
};


module.exports = {
  validateSignup,
  validateLogin,
  updateUser,
  updatePassword
}
