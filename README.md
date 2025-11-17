# ClarityConnect

A shared, searchable platform designed to help teams across clusters, products, and functions speak the same language. It standardizes terminology while capturing the context of how terms are used across different areas.

## Features

- **Unified Glossary**: Central source for business and technical definitions
- **Contextual Mapping**: Shows how terms vary in meaning or usage across clusters or systems
- **Smart Search**: Enables quick lookup of related terms, business rules, and real-world examples
- **Onboarding Support**: Tailored role-based views to accelerate learning
- **Collaborative Governance**: Users can propose updates or flag inconsistencies

## Tech Stack

- **Backend**: Golang with Gin framework, PostgreSQL
- **Frontend**: React with TypeScript, Tailwind CSS
- **Database**: PostgreSQL with full-text search

## Project Structure

```
ClarityConnect/
├── backend/          # Golang backend API
├── frontend/         # React frontend application
└── database-setup/   # Database schema and migrations
```

## Setup Instructions

### Prerequisites

- Go 1.21 or higher
- Node.js 16+ and npm
- PostgreSQL 12+

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
go mod download
```

3. Set up your database connection. Create a `.env` file or set the `DATABASE_URL` environment variable:
```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clarityconnect?sslmode=disable"
```

4. Create the database:
```bash
createdb clarityconnect
```

5. Run the server:
```bash
go run cmd/server/main.go
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Terms
- `GET /api/v1/terms` - List all terms
- `GET /api/v1/terms/:id` - Get term details
- `POST /api/v1/terms` - Create a new term
- `PUT /api/v1/terms/:id` - Update a term
- `DELETE /api/v1/terms/:id` - Delete a term
- `POST /api/v1/terms/:id/contexts` - Add contextual variation
- `POST /api/v1/terms/:id/examples` - Add example
- `POST /api/v1/terms/:id/relationships` - Add relationship

### Search
- `GET /api/v1/search?q=query` - Search terms

### Governance
- `GET /api/v1/proposals` - List proposals
- `POST /api/v1/proposals` - Create proposal
- `PATCH /api/v1/proposals/:id/status` - Update proposal status
- `GET /api/v1/flags` - List flags
- `POST /api/v1/terms/:id/flags` - Create flag
- `PATCH /api/v1/flags/:id/status` - Update flag status

### Branding
- `GET /api/v1/branding` - Get branding configuration
- `PUT /api/v1/branding` - Update branding configuration

## Default Branding Colors

The platform supports customizable branding with a default green theme:
- Light Green: `#EAF9E7`
- Pastel Green: `#C0E6BA`
- Primary Green: `#4CA771`
- Dark Green: `#013237`

## Development

The database schema is automatically applied when the backend server starts. The schema includes:
- Terms and definitions
- Contextual variations
- Examples and relationships
- User management
- Proposals and flags
- Branding configuration

## License

Proprietary - All rights reserved

