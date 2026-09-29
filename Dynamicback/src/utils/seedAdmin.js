/**
 * Admin Seed Script
 * Run: node src/utils/seedAdmin.js
 *
 * Creates a default admin user if one doesn't already exist.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@gym.com",
      password: "admin123",
      phone: "9999999999",
      role: "admin",
      status: "approved",
    });

    console.log("🎉 Admin user created successfully!");
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: admin123`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
