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

const isProd = process.env.NODE_ENV === 'production';

// If you're using Neon (or any managed PG with sslmode=require), keep DB_SSL=true in .env
const useSSL = String(process.env.DB_SSL || '').toLowerCase() === 'true';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'stcomp_specialists',

  synchronize: false, // Never use true in production
  logging: !isProd && process.env.NODE_ENV === 'development',

  // ✅ Neon / hosted Postgres requires SSL
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  extra: useSSL ? { ssl: { rejectUnauthorized: false } } : {},

  entities: [
    Specialist,
    ServiceOffering,
    ServiceOfferingMasterList,
    PlatformFee,
    Media
  ],

  // Fix: your old path joined from current file; this is a safer pattern:
  migrations: [path.join(__dirname, '../../migrations/*{.js,.ts}')],
  subscribers: [],
});

module.exports = AppDataSource;
