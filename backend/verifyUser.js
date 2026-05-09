const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function verifyUser() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: 'admin@gmail.com' });
    if (user) {
      console.log('👤 User Found:');
      console.log(`- Username: ${user.username}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Password Hash: ${user.password.substring(0, 20)}...`);
    } else {
      console.log('❌ User admin@gmail.com not found!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

verifyUser();
