const { connectToDatabase } = require('../lib/mongodb');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

// This script will update all transactions that don't have a user field
// with a default user ID (first user found in the database)

async function migrateTransactions() {
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
    
    // Find all transactions without a user field
    const transactionsWithoutUser = await Transaction.find({ user: { $exists: false } });
    
    console.log(`Found ${transactionsWithoutUser.length} transactions without a user field.`);
    
    if (transactionsWithoutUser.length === 0) {
      console.log('No transactions to migrate.');
      process.exit(0);
    }
    
    // Update all transactions without a user field
    const updateResult = await Transaction.updateMany(
      { user: { $exists: false } },
      { $set: { user: defaultUser._id } }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} transactions.`);
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateTransactions(); 