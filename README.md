# Performance Review System

A fullstack performance review management system built with NestJS, React, and PostgreSQL. This application enables organizations to manage employee performance reviews with role-based access control and API documentation.

## Tech Stack

**Backend:**
- NestJS v9.4.3
- TypeORM v0.3.17
- PostgreSQL 15
- JWT Authentication
- Swagger/OpenAPI

**Frontend:**
- React 18.2.0
- TypeScript
- Material-UI
- React Router

**DevOps:**
- Docker & docker-compose
- Node 18-alpine
- GitHub Actions

## Quick Start

1. Clone the repository
   ```bash
   git clone https://github.com/snehil21/Performance-Review-System.git
   cd Performance-Review-System
   ```

2. Start the application
   ```bash
   docker-compose up --build
   ```

3. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Swagger Documentation: http://localhost:3001/api

4. Create an admin account using the Sign Up button
   - Email: admin@example.com
   - Password: any 6+ character password
   - Role: Admin

## Development

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```
Backend runs on http://localhost:3001

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Database

PostgreSQL 15 with automatic schema synchronization via TypeORM.

**Default Credentials:**
- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: performance_review

## Deployment

**Frontend:** https://netlify.com

**Backend:** https://railway.app or https://render.com
