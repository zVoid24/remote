const AppDataSource = require('./data-source');

async function seedDatabase() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    
    const serviceOfferingMasterRepo = AppDataSource.getRepository('ServiceOfferingMasterList');
    
    console.log('🌱 Seeding service_offerings_master_list...');
    
    const masterOfferings = [
      {
        title: 'Company Secretary Subscription',
        description: 'Annual company secretary subscription service',
        bucket_name: 'offerings',
      },
      {
        title: 'CTC Copies',
        description: 'Certified true copy services',
        bucket_name: 'offerings',
      },
      {
        title: 'eSignature',
        description: 'Digital signature service',
        bucket_name: 'offerings',
      },
      {
        title: 'Opening of a Bank Account',
        description: 'Corporate bank account opening assistance',
        bucket_name: 'offerings',
      },
      {
        title: 'Access Company Records and SSM Forms',
        description: 'Access to all company records and SSM forms',
        bucket_name: 'offerings',
      },
      {
        title: 'Priority Filing',
        description: 'Priority filing service for urgent submissions',
        bucket_name: 'offerings',
      },
      {
        title: 'Registered Office Address Use',
        description: 'Use of registered office address',
        bucket_name: 'offerings',
      },
      {
        title: 'Compliance Calendar Setup',
        description: 'Setup compliance calendar for reminders',
        bucket_name: 'offerings',
      },
    ];

    for (const offering of masterOfferings) {
      const exists = await serviceOfferingMasterRepo.findOne({
        where: { title: offering.title },
      });
      
      if (!exists) {
        await serviceOfferingMasterRepo.save(offering);
        console.log(`  ✓ Created: ${offering.title}`);
      } else {
        console.log(`  ⊙ Skipped: ${offering.title} (already exists)`);
      }
    }

    console.log('✅ Database seeded successfully!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
