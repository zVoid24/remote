const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import entities
const Specialist = require('../../domain/entities/Specialist');
const ServiceOffering = require('../../domain/entities/ServiceOffering');
const ServiceOfferingMasterList = require('../../domain/entities/ServiceOfferingMasterList');
const PlatformFee = require('../../domain/entities/PlatformFee');
const Media = require('../../domain/entities/Media');


const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'stcomp_specialists',
  synchronize: false, // Never use true in production
  logging: process.env.NODE_ENV === 'development',
  entities: [
    Specialist,
    ServiceOffering,
    ServiceOfferingMasterList,
    PlatformFee,
    Media
  ],
  migrations: [path.join(__dirname, 'migrations', '*.js')],
  subscribers: [],
});

module.exports = AppDataSource;
