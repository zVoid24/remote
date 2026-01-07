# ST Comp Holdings - Backend API

Professional Node.js/Express backend with PostgreSQL and TypeORM, following Domain-Driven Design (DDD) architecture.

## 🚀 Features

- **RESTful API** with Express.js
- **PostgreSQL** database with TypeORM
- **Domain-Driven Design** architecture
- **Professional migrations** system
- **Joi validation** for request data
- **Error handling** middleware
- **CORS** configuration
- **Environment-based** configuration

## 📁 Project Structure

```
backend/
├── src/
│   ├── domain/                 # Domain layer (entities, interfaces)
│   │   └── entities/          # TypeORM entities
│   ├── application/           # Application layer (services, DTOs)
│   │   ├── dtos/             # Data Transfer Objects
│   │   └── services/         # Business logic services
│   ├── infrastructure/        # Infrastructure layer (database, storage)
│   │   ├── database/         # Database configuration & migrations
│   │   └── repositories/     # Repository implementations
│   ├── presentation/          # Presentation layer (controllers, routes)
│   │   ├── controllers/      # API controllers
│   │   ├── middleware/       # Express middleware
│   │   └── routes/           # Route definitions
│   └── index.js              # Application entry point
├── .env.example              # Environment variables template
├── .eslintrc.json           # ESLint configuration
└── package.json             # Dependencies and scripts
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your database connection:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=stcomp_specialists
   PORT=3000
   ```

3. **Create PostgreSQL database:**

   ```bash
   createdb stcomp_specialists
   ```

4. **Run migrations:**

   ```bash
   npm run migration:run
   ```

5. **Seed database (optional):**

   ```bash
   npm run seed
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📚 API Endpoints

### Specialists

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| GET    | `/api/specialists`             | Get all specialists (with filters) |
| GET    | `/api/specialists/:id`         | Get single specialist              |
| POST   | `/api/specialists`             | Create new specialist              |
| PUT    | `/api/specialists/:id`         | Update specialist                  |
| DELETE | `/api/specialists/:id`         | Delete specialist                  |
| PATCH  | `/api/specialists/:id/publish` | Publish specialist                 |
| POST   | `/api/specialists/:id/media`   | Upload media                       |

### Query Parameters (GET /api/specialists)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title/description
- `status` - Filter by status: `all`, `drafts`, `published`

### Example Requests

**Create Specialist:**

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

**Get All Specialists:**

```bash
curl "http://localhost:3000/api/specialists?page=1&limit=10&status=published"
```

## 🗄️ Database Schema

### Tables

1. **specialists** - Main specialist services
2. **service_offerings** - Junction table for specialist-service relationships
3. **service_offerings_master_list** - Master list of available services
4. **platform_fee** - Platform fee configuration
5. **media** - File storage metadata

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migration:run` - Run database migrations
- `npm run migration:revert` - Revert last migration
- `npm run seed` - Seed database with sample data

### Code Quality

- ESLint configuration included
- Follow DDD principles
- Use JSDoc comments for documentation

## 🚢 Deployment

### Environment Variables (Production)

Make sure to set these in your production environment:

```env
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=stcomp_specialists
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Deployment Platforms

- **Render** - Recommended for Node.js + PostgreSQL
- **Railway** - Easy deployment with database
- **Heroku** - Classic PaaS platform

## 📝 License

ISC

## 👥 Contact

For questions or support, contact: contact@stcompholdings.com
