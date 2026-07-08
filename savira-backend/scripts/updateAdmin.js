require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const hash = await bcrypt.hash("8526139987", 12);

  // Update whichever admin account exists
  const result = await User.updateMany(
    { $or: [{ isAdmin: true }, { email: "visalanisathiyamoorthi@gmail.com" }, { email: "admin@savira.com" }] },
    { $set: { isAdmin: true, isVerified: true, password: hash } }
  );

  console.log(`✅ Updated ${result.modifiedCount} admin account(s)`);

  // Show all admin accounts
  const admins = await User.find({ isAdmin: true }).select("name email isVerified");
  admins.forEach((a) => console.log(`   → ${a.email} (verified: ${a.isVerified})`));

  process.exit(0);
}).catch((e) => { console.error("❌", e.message); process.exit(1); });
