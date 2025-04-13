const { connectToDatabase } = require('../lib/mongodb');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// This script will create a default user if none exists

async function createDefaultUser() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    // Check if any users exist
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('Users already exist in the database. Skipping default user creation.');
      process.exit(0);
    }
    
    // Create a default user
    const defaultUser = {
      name: 'Default User',
      email: 'user@example.com',
      password: await bcrypt.hash('password123', 12),
      preferences: {
        currency: 'USD',
        theme: 'light'
      }
    };
    
    console.log('Creating default user...');
    const user = await User.create(defaultUser);
    
    console.log(`Default user created with ID: ${user._id}`);
    console.log('Email: user@example.com');
    console.log('Password: password123');
    
    console.log('\nPlease change these credentials after logging in!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating default user:', error);
    process.exit(1);
  }
}

// Run the script
createDefaultUser(); 