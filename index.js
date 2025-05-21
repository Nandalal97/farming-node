const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// ✅ MongoDB Atlas Connection
mongoose.connect("mongodb+srv://FarmX_Admin82902:Admin%21X82App%25Farm@farmx.khekdnb.mongodb.net/users_db?retryWrites=true&w=majority")
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
  });


mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB Atlas");
});

// ✅ Schema
const authSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  address: { type: String, lowercase: true, trim: true },
  state: { type: String, lowercase: true, trim: true },
  city: { type: String, lowercase: true, trim: true },
  pin: { type: String, lowercase: true, trim: true },
  dob: { type: String, lowercase: true, trim: true },
  gender: { type: String, lowercase: true, trim: true },
}, { timestamps: true });

const User = mongoose.model("User", authSchema);

// ✅ Generate Users
function generateUsers(count) {
  const users = [];

  for (let i = 400001; i <= count; i++) {
    users.push({
      name: `Test User ${i}`,
      email: `user${i}@example.com`,
      phone: `9${(100000000 + i).toString().padStart(9, '0')}`,
      password: `pass${i}`,
      address: `AP Nagar ${i}`,
      state: `Bihar ${i % 10}`,
      city: `Patna ${i % 20}`,
      pin: `${700000 + i % 1000}`,
      dob: `1990-01-${(i % 28 + 1).toString().padStart(2, '0')}`,
      gender: i % 2 === 0 ? 'male' : 'female',
    });
  }

  return users;
}

let inserted = false;

// ✅ Insert on Load
app.get("/", async (req, res) => {
  if (!inserted) {
    const users = generateUsers(500000);

    try {
      await User.insertMany(users, { ordered: false });
      inserted = true;
      res.send(" users inserted into MongoDB Atlas.");
    } catch (err) {
      console.error("❌ Insertion error:", err.message);
      res.status(500).send("❌ Error inserting users.");
    }
  } else {
    res.send("ℹ️ Users already inserted.");
  }
});

// ✅ Optional Reset Route
app.get("/reset", async (req, res) => {
  await User.deleteMany({});
  inserted = false;
  res.send("🔁 All users deleted. Ready to insert again.");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
