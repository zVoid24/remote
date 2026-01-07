# Backend Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages:

- express
- typeorm
- pg (PostgreSQL driver)
- dotenv
- joi
- multer
- cors
- uuid
- nodemon (dev dependency)
- eslint (dev dependency)

### 2. Set Up PostgreSQL Database

#### Option A: Using PostgreSQL Command Line

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE stcomp_specialists;

# Exit psql
\q
```

#### Option B: Using pgAdmin

1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Enter database name: `stcomp_specialists`
5. Click "Save"

### 3. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password_here
DB_DATABASE=stcomp_specialists

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Important:** Replace `your_postgres_password_here` with your actual PostgreSQL password.

### 4. Run Database Migrations

Migrations will create all the necessary tables in your database:

```bash
npm run migration:run
```

You should see output like:

```
✅ Database connected successfully
🔄 Running migrations...
✅ Migrations completed successfully!
```

**Troubleshooting:**

- If you get a connection error, verify your PostgreSQL credentials in `.env`
- If you get "database does not exist", make sure you created the database in Step 2
- If you get "password authentication failed", check your PostgreSQL password

### 5. Seed the Database

This will populate the `service_offerings_master_list` table with initial data:

```bash
npm run seed
```

You should see output like:

```
🌱 Seeding service_offerings_master_list...
  ✓ Created: Company Secretary Subscription
  ✓ Created: CTC Copies
  ✓ Created: eSignature
  ...
✅ Database seeded successfully!
```

### 6. Start the Development Server

```bash
npm run dev
```

You should see:

```
✅ Database connected successfully
🚀 Server is running on port 3000
📍 Environment: development
```

The backend is now running at `http://localhost:3000`

### 7. Verify the Setup

Test the health check endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

Test the specialists endpoint:

```bash
curl http://localhost:3000/api/specialists
```

Expected response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## Common Issues and Solutions

### Issue: "Cannot find module"

**Solution:** Make sure you ran `npm install` in the backend directory.

### Issue: "password authentication failed for user"

**Solution:**

1. Check your PostgreSQL password in `.env`
2. Verify you can connect to PostgreSQL: `psql -U postgres`
3. If you forgot your password, reset it using pgAdmin or command line

### Issue: "database does not exist"

**Solution:** Create the database using one of the methods in Step 2.

### Issue: "Port 3000 is already in use"

**Solution:**

1. Change the port in `.env`: `PORT=3001`
2. Or kill the process using port 3000

### Issue: "Migration failed"

**Solution:**

1. Drop all tables and try again:
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```
2. Then run migrations again: `npm run migration:run`

## Database Schema

After running migrations, you'll have these tables:

1. **specialists** - Main specialist services
2. **service_offerings** - Junction table for specialist-service relationships
3. **service_offerings_master_list** - Master list of available services
4. **platform_fee** - Platform fee configuration
5. **media** - File storage metadata

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run migration:run` - Run all pending migrations
- `npm run migration:revert` - Revert the last migration
- `npm run seed` - Seed the database with initial data

## API Endpoints

### Specialists

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| GET    | `/api/specialists`             | Get all specialists (with filters) |
| GET    | `/api/specialists/:id`         | Get single specialist              |
| POST   | `/api/specialists`             | Create new specialist              |
| PUT    | `/api/specialists/:id`         | Update specialist                  |
| DELETE | `/api/specialists/:id`         | Delete specialist                  |
| PATCH  | `/api/specialists/:id/publish` | Publish specialist                 |

### Service Offerings Master List

| Method | Endpoint                        | Description               |
| ------ | ------------------------------- | ------------------------- |
| GET    | `/api/service-offerings-master` | Get all service offerings |

## Query Parameters (GET /api/specialists)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title/description
- `status` - Filter by status: `all`, `drafts`, `published`

## Example API Calls

### Create a Specialist

```bash
curl -X POST http://localhost:3000/api/specialists \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Company Incorporation Service",
    "description": "Complete company incorporation with all documentation",
    "base_price": 2000,
    "duration_days": 3,
    "is_draft": true
  }'
```

### Get All Published Specialists

```bash
curl "http://localhost:3000/api/specialists?status=published&page=1&limit=10"
```

### Search Specialists

```bash
curl "http://localhost:3000/api/specialists?search=incorporation"
```

### Update a Specialist

```bash
curl -X PUT http://localhost:3000/api/specialists/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "base_price": 2500
  }'
```

### Publish a Specialist

```bash
curl -X PATCH http://localhost:3000/api/specialists/{id}/publish
```

### Delete a Specialist

```bash
curl -X DELETE http://localhost:3000/api/specialists/{id}
```

## Next Steps

1. **Test the API** - Use Postman or curl to test all endpoints
2. **Connect Frontend** - The frontend is already configured to connect to `http://localhost:3000`
3. **Create Specialists** - Use the frontend or API to create some test specialists
4. **Verify Data** - Check the database to ensure data is being saved correctly

## Production Deployment

For production deployment, see the main README.md file for instructions on deploying to Render, Railway, or Heroku.

## Support

If you encounter any issues not covered in this guide, please check:

1. PostgreSQL is running: `pg_isready`
2. Node.js version: `node --version` (should be v18+)
3. All dependencies installed: `npm list`
4. Environment variables are correct in `.env`

---

**Last Updated:** January 7, 2026
