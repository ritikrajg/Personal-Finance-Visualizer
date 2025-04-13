const { spawn } = require('child_process');

// This script will run both the create-user and migrate scripts

console.log('=== Setting up Personal Finance Visualizer ===\n');

// Run create-user script
console.log('Step 1: Creating default user if needed...');
const createUserProcess = spawn('node', ['scripts/create-default-user.js'], { stdio: 'inherit' });

createUserProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('Error creating default user. Exiting setup.');
    process.exit(1);
  }
  
  console.log('\nStep 2: Migrating existing data...');
  
  // Run migrate script
  const migrateProcess = spawn('node', ['scripts/migrate-all.js'], { stdio: 'inherit' });
  
  migrateProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Error migrating data. Setup incomplete.');
      process.exit(1);
    }
    
    console.log('\n=== Setup completed successfully! ===');
    console.log('You can now run the application with: npm run dev');
    process.exit(0);
  });
}); 