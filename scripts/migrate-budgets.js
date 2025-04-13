const { connectToDatabase } = require('../lib/mongodb');
const Budget = require('../models/Budget');
const User = require('../models/User');
const mongoose = require('mongoose');

// This script will update all budgets that don't have a user field
// with a default user ID (first user found in the database)

async function migrateBudgets() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    // Find the first user in the database to use as default
    const defaultUser = await User.findOne({});
    
    if (!defaultUser) {
      console.error('No users found in the database. Please create a user first.');
      process.exit(1);
    }
    
    console.log(`Using default user: ${defaultUser.name} (${defaultUser._id})`);
    
    // Find all budgets without a user field
    const budgetsWithoutUser = await Budget.find({ user: { $exists: false } });
    
    console.log(`Found ${budgetsWithoutUser.length} budgets without a user field.`);
    
    if (budgetsWithoutUser.length === 0) {
      console.log('No budgets to migrate.');
      process.exit(0);
    }
    
    // Update all budgets without a user field
    const updateResult = await Budget.updateMany(
      { user: { $exists: false } },
      { $set: { user: defaultUser._id } }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} budgets.`);
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateBudgets(); 