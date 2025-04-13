const { connectToDatabase } = require('../lib/mongodb');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const User = require('../models/User');
const mongoose = require('mongoose');

// This script will update all transactions and budgets that don't have a user field
// with a default user ID (first user found in the database)

async function migrateAll() {
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
    
    // Migrate transactions
    console.log('\n--- Migrating Transactions ---');
    const transactionsWithoutUser = await Transaction.find({ user: { $exists: false } });
    console.log(`Found ${transactionsWithoutUser.length} transactions without a user field.`);
    
    if (transactionsWithoutUser.length > 0) {
      const transactionUpdateResult = await Transaction.updateMany(
        { user: { $exists: false } },
        { $set: { user: defaultUser._id } }
      );
      console.log(`Updated ${transactionUpdateResult.modifiedCount} transactions.`);
    } else {
      console.log('No transactions to migrate.');
    }
    
    // Migrate budgets
    console.log('\n--- Migrating Budgets ---');
    const budgetsWithoutUser = await Budget.find({ user: { $exists: false } });
    console.log(`Found ${budgetsWithoutUser.length} budgets without a user field.`);
    
    if (budgetsWithoutUser.length > 0) {
      const budgetUpdateResult = await Budget.updateMany(
        { user: { $exists: false } },
        { $set: { user: defaultUser._id } }
      );
      console.log(`Updated ${budgetUpdateResult.modifiedCount} budgets.`);
    } else {
      console.log('No budgets to migrate.');
    }
    
    console.log('\nMigration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateAll(); 