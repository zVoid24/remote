const AppDataSource = require('./data-source');

async function revertMigrations() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    
    console.log('🔄 Reverting last migration...');
    await AppDataSource.undoLastMigration();
    
    console.log('✅ Migration reverted successfully!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error reverting migration:', error);
    process.exit(1);
  }
}

revertMigrations();
