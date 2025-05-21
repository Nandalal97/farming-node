require('dotenv').config();
const User = require('../models/authModel');
const bcrypt=require('bcrypt');
const { status } = require('init');
const mongoose=require('mongoose')

// Route: /api/users-chunk?page=1&limit=1000
const userList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1000; // Default load
  const skip = (page - 1) * limit;
  const search = req.query.search || ""; // Optional search parameter

  try {
    // Create a query for search
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
      ]
    };

    // Fetch users with pagination and search
    const users = await User.find(query)
      .select("-password") 
      .skip(skip)
      .limit(limit);

    // Get total count of matching users
    const total = await User.countDocuments(query);

    // Send the response with pagination info
    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ msg: "Server error", status: 0 });
  }
};

const singleUser=async(req,res)=>{
    try {
      const userId = req.user.id;

      const user = await User.findById(userId).select('-password');
    
        if (!user) {
          return res.status(404).json({ msg: "User not found", status: 0 });
        }
    
        // Return the user data
        return res.status(200).json({
          msg: "User fetched successfully",
          status: 1,
          user,
        });
      } catch (error) {
        console.error('Error fetching user:', error.message);
        return res.status(500).json({ msg: "Failed to fetch user", status: 0 });
      }
};

const editUser=async(req,res)=>{
    try {
      const { name, email, phone, password, address, state, city, pin, dob, gender } = req.body;
    
        // Get user ID from the jwt token
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ msg: "User not found", status: 0 });
        }
        // Update the user's fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (password) {
          // If password is provided, hash it
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
        }
        if (address) user.address = address;
        if (state) user.state = state;
        if (city) user.city = city;
        if (pin) user.pin = pin;
        if (dob) user.dob = dob;
        if (gender) user.gender = gender;
        // Save the updated user data to the database
        await user.save();
    
        // Return the updated user
        return res.status(200).json({
          msg: "Profile updated successfully",
          status: 1,
          // user: user
          
        });
      } catch (error) {
        console.error('Error updating user:', error.message);
        return res.status(500).json({ msg: "Failed to update user", status: 0 });
      }
};
const updatePaswword=async(req,res)=>{
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found', status:0 });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect',status:0 });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password updated successfully',status:1 });
  } catch (err) {
    res.status(500).json({ msg: 'Server error',status:0 });
  }
};



const deleteUser=async(req,res)=>{
    try {
      const userId = req.user.id;
    
        // Validate if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ msg: "Invalid user ID", status: 0 });
        }
    
        // Attempt to find and delete the user by ID
        const user = await User.findByIdAndDelete(userId);
    
        if (!user) {
          return res.status(404).json({ msg: "User not found", status: 0 });
        }
    
        return res.status(200).json({
          msg: "User deleted successfully",
          status: 1
        });
      } catch (error) {
        console.error('Error deleting user:', error.message);
        return res.status(500).json({
          msg: "Failed to delete user",
          status: 0,
          error: error.message
        });
      }
}

module.exports=
{userList, 
singleUser,
editUser,
deleteUser,
updatePaswword
};