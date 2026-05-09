const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is missing in .env');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@gmail.com';
    const password = 'admin123';
    const username = 'admin';
    const role = 'admin';
    const phone = '01111111111';

    let user = await User.findOne({ email });

    if (user) {
      console.log('ℹ️ User already exists. Updating password and role...');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.role = role;
      user.username = username;
      user.phone = phone;
      await user.save();
      console.log('✅ Admin user updated successfully!');
    } else {
      console.log('🆕 Creating new admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        username,
        email,
        phone,
        password: hashedPassword,
        role
      });

      await user.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('---------------------------');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('---------------------------');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
