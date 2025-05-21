require('dotenv').config();
const User = require('../models/authModel');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');


const generate8DigitId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const generateUniqueUserId = async () => {
  let unique = false;
  let userId = '';

  while (!unique) {
    userId = generate8DigitId();
    const existId = await User.findOne({ userId });
    if (!existId) {
      unique = true;
    }
  }
  return 'F'+userId;
};

const SignUp = async (req, res) => {
  try {
    const { name, email, phone, password, address, state, city, pin, dob, gender } = req.body;
    // Check if user already exists
    const existUser = await User.findOne({ phone });
    if (existUser) {
      return res.status(409).json({ msg: "User already exists", status: 0 });
    }
    // Check email already exists
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(409).json({ msg: "Email already exists", status: 0 });
    }

      // Generate unique 8-digit user ID
      const userId = await generateUniqueUserId();
    
    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ userId, name, email, phone, password: hashPassword, address, state, city, pin, dob, gender });
    await newUser.save();

    return res.status(201).json({
      msg: "Registration Successful!",
      status: 1,
      user: { // Send back full user data
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        state: newUser.state,
        city: newUser.city,
        pin: newUser.pin,
        dob: newUser.dob,
        gender: newUser.gender,
      },
    });

  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ msg: "Signup failed", status: 0 });
  }
};

const LogIn = async (req, res) => {
    try {
      const { phone, password } = req.body;
  
      // Check if user exists
      const findUser = await User.findOne({ phone });
      if (!findUser) {
        return res.status(400).json({ msg: "User not found", status: 0 });
      }
  
      // Compare password
      const isMatchPassword = await bcrypt.compare(password, findUser.password);
      if (!isMatchPassword) {
        return res.status(401).json({ msg: "Invalid credentials", status: 0 });
      }
  
      // Generate JWT token
      const token = JWT.sign(
        {
          id: findUser._id,
          email: findUser.email,
          phone: findUser.phone
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      // Successful response
      return res.status(200).json({
        msg: "Login successful",
        status: 1,
        access_token: token,
        // user:findUser
      });
  
    } catch (error) {
      console.error("Login error:", error.message);
      return res.status(500).json({ msg: "Login failed", status: 0 });
    }
  };

module.exports ={
    SignUp,
    LogIn
};
