require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const email = process.argv[2];
if (!email) { console.error("Usage: node scripts/makeAdmin.js <email>"); process.exit(1); }

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true });
  if (!user) { console.error(`❌ User not found: ${email}`); }
  else { console.log(`✅ ${user.name} (${user.email}) is now an admin`); }
  process.exit(0);
}).catch((err) => { console.error(err.message); process.exit(1); });
