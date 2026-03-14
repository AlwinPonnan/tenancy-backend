# Tenancy – Multi-Tenant SaaS Platform (Backend)

## Overview

**Tenancy** is a production-style backend project built to learn and implement real-world backend architecture used in modern SaaS platforms.

The goal of this project is **not just to build features**, but to understand **how scalable backend systems are designed**, including:

* Multi-tenant architecture
* Authentication systems
* RBAC (Role Based Access Control)
* Secure token handling
* Database design for SaaS
* Clean layered architecture
* Production-grade practices

The project is implemented using:

* **NestJS**
* **TypeScript**
* **PostgreSQL**
* **Raw SQL (no ORM initially)**
* **JWT authentication**
* **Refresh token rotation**
* **Shared database multi-tenant model**

The frontend will later be built using **Next.js**, but the current focus is **backend architecture first**.

---

# Project Goal

Build a **multi-tenant project management SaaS backend** similar to systems like:

* Linear
* Jira
* Notion
* ClickUp

Where multiple organizations can use the same platform while keeping their data isolated.

Example structure:

```
Platform
 ├── Organization A
 │     ├── Projects
 │     ├── Tasks
 │     └── Members
 │
 └── Organization B
       ├── Projects
       ├── Tasks
       └── Members
```

Each organization is a **tenant**.

---

# Tech Stack

## Backend

* NestJS
* TypeScript
* PostgreSQL
* Node.js
* bcrypt (password hashing)
* JWT (authentication)
* Raw SQL
* Custom migration system

## Database

* PostgreSQL
* Shared database architecture
* UUID primary keys
* Composite indexes
* Transaction safety

## Tools

* DBeaver / psql
* Docker (later phase)
* Redis (later phase)

---

# Architecture

The backend follows a **layered architecture**.

```
HTTP Request
     ↓
Controller
     ↓
Service (Business Logic)
     ↓
Repository (Database Queries)
     ↓
Database Service
     ↓
PostgreSQL
```

Responsibilities:

### Controller

Handles HTTP requests and responses.

Example:

```
POST /users
GET /users?email=test@test.com
```

### Service

Contains business logic such as:

* password hashing
* email normalization
* validation
* orchestration between repositories

### Repository

Handles database queries only.

Example:

```
SELECT id, email FROM users WHERE email = $1
```

### Database Service

Responsible for:

* PostgreSQL connection pool
* executing queries
* managing database connections

---

# Multi-Tenant Architecture

The platform uses a **shared database with tenant isolation**.

Tenant isolation is achieved through **organization IDs**.

Schema concept:

```
organizations
users
memberships
projects
tasks
```

Example relationship:

```
users
 ├── id
 └── email

organizations
 ├── id
 └── name

memberships
 ├── user_id
 ├── organization_id
 └── role
```

This allows:

* users to belong to multiple organizations
* role-based access control
* clear tenant boundaries

---

# Current Features Implemented

### Infrastructure

* NestJS backend setup
* PostgreSQL database connection
* Database connection pooling
* Custom migration system
* Environment configuration
* UUID based IDs

### Database

Migration system implemented:

```
scripts/runMigrations.ts
```

Migration files stored in:

```
/migrations
```

Example migration:

```
001_create_users_table.sql
```

Migration tracking table:

```
migrations
```

---

### Users Module

Structure:

```
src/users
 ├── users.controller.ts
 ├── users.service.ts
 └── users.repository.ts
```

Implemented endpoints:

```
POST /users
GET /users?email=
```

Features:

* create user
* normalize email
* password hashing using bcrypt
* database query through repository layer

---

# Authentication Plan

Next major module:

```
auth
```

Features to implement:

### Login

```
POST /auth/login
```

Flow:

```
1. Find user by email
2. Compare password
3. Generate access token
4. Generate refresh token
```

### Access Tokens

* short lived
* stored in memory on frontend

### Refresh Tokens

* stored as httpOnly cookies
* rotated on each refresh

---

# Future Modules

## Organizations

```
organizations
```

Features:

* create organization
* invite users
* manage members

---

## Memberships

Handles:

```
user ↔ organization relationship
```

Roles:

```
owner
admin
member
viewer
```

---

## Projects

```
projects
```

Fields:

```
id
organization_id
name
created_by
created_at
```

Composite indexes:

```
(organization_id, created_at)
```

---

## Tasks

```
tasks
```

Linked to projects.

---

## Audit Logs

Track important actions:

```
user login
project creation
role changes
```

---

## Subscription Plans

Future system for SaaS monetization.

Example plans:

```
Free
Pro
Enterprise
```

Plan limits enforced with transactions.

---

# Security Features

Planned security implementations:

* password hashing (bcrypt)
* JWT authentication
* refresh token rotation
* httpOnly cookies
* RBAC authorization
* tenant data isolation
* SQL injection prevention using prepared queries

---

# Database Design Principles

The database follows these rules:

### UUID Primary Keys

All entities use UUIDs instead of auto-increment IDs.

Benefits:

* safer APIs
* easier distributed systems
* non-guessable identifiers

---

### Composite Indexes

Example:

```
(organization_id, created_at)
```

Used for pagination and tenant isolation queries.

---

### Pagination Strategy

Offset pagination initially:

```
LIMIT
OFFSET
```

Later possibly move to **cursor pagination**.

---

# Migration System

Custom migration runner implemented.

Command:

```
npm run migrate
```

Process:

```
1. Read migration files
2. Check migrations table
3. Run pending migrations
4. Record execution
```

---

# Development Commands

Run server:

```
npm run start:dev
```

Run migrations:

```
npm run migrate
```

---

# Project Structure

```
src
 ├── auth
 ├── users
 ├── database
 ├── common
 └── migrations

scripts
 └── runMigrations.ts
```

---

# Learning Goals

This project focuses on learning:

* backend system design
* database schema design
* multi-tenant SaaS architecture
* authentication and security
* scalable backend patterns
* production engineering practices

The goal is to build this project in a way that mirrors **real SaaS backend systems used in production**.

---

# Future Improvements

Planned improvements:

* DTO validation with class-validator
* request validation pipes
* global error handling
* structured logging
* Redis caching
* rate limiting
* Docker deployment
* CI/CD pipeline

---

# Status

Current progress:

```
Infrastructure complete
Database migrations complete
Users module implemented
Authentication module next
```

---

# Author

Built as a learning project to master **backend architecture for multi-tenant SaaS platforms**.




## System Architecture

The backend follows a **layered architecture** that separates responsibilities across different parts of the system.

```
Client (Frontend / API Consumer)
            │
            ▼
        Controller
            │
            ▼
         Service
   (Business Logic Layer)
            │
            ▼
        Repository
   (Database Access Layer)
            │
            ▼
      DatabaseService
      (Connection Pool)
            │
            ▼
        PostgreSQL
```

### Controller

Responsible for:

* handling HTTP requests
* parsing request parameters
* returning responses

Controllers **should not contain business logic**.

Example:

```
POST /users
GET /users?email=
POST /auth/login
```

---

### Service Layer

Services contain **business logic**.

Examples:

* password hashing
* authentication flows
* validation rules
* coordinating multiple repositories

Example flow:

```
login request
    ↓
find user by email
    ↓
compare password
    ↓
generate tokens
```

---

### Repository Layer

Repositories handle **database queries only**.

They should:

* run SQL queries
* return database results
* avoid business logic

Example:

```
SELECT id, email, password_hash
FROM users
WHERE email = $1
```

---

### Database Service

Handles:

* PostgreSQL connection pool
* executing queries
* database access abstraction

All repositories interact with the database through this layer.

---

## Database Architecture

This platform uses a **shared database multi-tenant architecture**.

This means:

```
One database
Multiple tenants
Tenant isolation using organization_id
```

### Tenant Isolation Strategy

Each tenant is an **organization**.

Example:

```
organizations
 ├── id
 └── name
```

Tenant-owned tables include:

```
projects
tasks
memberships
```

All tenant data contains:

```
organization_id
```

This ensures queries always filter by tenant.

Example:

```
SELECT *
FROM projects
WHERE organization_id = $1
```

---

### Users and Organizations

Users can belong to **multiple organizations**.

This is implemented using a **membership table**.

```
users
 ├── id
 └── email

organizations
 ├── id
 └── name

memberships
 ├── user_id
 ├── organization_id
 └── role
```

This design allows:

* one user in multiple organizations
* role based access control
* clean tenant separation

---

### Example Schema

```
users
------
id (UUID)
name
email
password_hash
created_at
updated_at


organizations
-------------
id (UUID)
name
created_at


memberships
-----------
user_id
organization_id
role


projects
--------
id
organization_id
name
created_by
created_at


tasks
-----
id
project_id
title
status
created_at
```

---

## API Design

The backend exposes a REST API.

### Users API

Create user

```
POST /users
```

Body:

```
{
  "name": "Alwin",
  "email": "alwin@test.com",
  "password": "secret123"
}
```

Response:

```
{
  "id": "uuid",
  "email": "alwin@test.com"
}
```

---

Get user by email

```
GET /users?email=test@test.com
```

---

### Authentication API (Planned)

Login

```
POST /auth/login
```

Body:

```
{
  "email": "user@email.com",
  "password": "password"
}
```

Flow:

```
1. find user
2. compare password
3. generate access token
4. generate refresh token
```

---

### Authentication Strategy

The system will use:

```
Access Token
Refresh Token
```

Access token:

* short lifetime
* sent in Authorization header

Refresh token:

* stored in httpOnly cookies
* rotated on refresh

---

## Security Strategy

Security practices implemented or planned:

* password hashing using bcrypt
* SQL injection prevention using prepared queries
* email normalization
* JWT authentication
* refresh token rotation
* RBAC authorization
* tenant isolation via organization_id

---

## Migration System

A custom migration system is implemented.

Migration files are stored in:

```
/migrations
```

Example:

```
001_create_users_table.sql
```

Migration runner:

```
scripts/runMigrations.ts
```

Command:

```
npm run migrate
```

Process:

```
1. check migrations table
2. read migration files
3. run new migrations
4. record execution
```

---

## Development Roadmap

Planned implementation order:

```
✔ Infrastructure setup
✔ PostgreSQL connection
✔ Migration system
✔ Users module

Next:
→ Auth module
→ Organizations module
→ Memberships
→ Projects
→ Tasks
→ RBAC
→ Audit logs
→ Subscription plans
```

---

## Long-Term System Features

The final SaaS platform will support:

```
Multi-tenant organizations
Project management
Task tracking
Role-based permissions
Audit logs
Subscription plans
API security
Scalable backend architecture
```

---

## Learning Objective

This project is intentionally built without heavy ORMs initially to understand:

```
database design
query performance
connection pools
transactions
backend architecture
```

The goal is to simulate how **real SaaS backend systems are designed and implemented**.


## System Request Flow

This diagram shows how an HTTP request flows through the backend.

```id="reqflow01"
Client
  │
  ▼
HTTP Request
  │
  ▼
Controller
  │
  ▼
Service Layer
  │
  ▼
Repository Layer
  │
  ▼
DatabaseService (Connection Pool)
  │
  ▼
PostgreSQL
```

Example request flow:

```id="reqflow02"
POST /users
      │
      ▼
UsersController
      │
      ▼
UsersService
  ├─ normalize email
  ├─ hash password
  └─ generate UUID
      │
      ▼
UsersRepository
      │
      ▼
INSERT INTO users (...)
      │
      ▼
PostgreSQL
```

---

## Authentication Flow

Planned login process:

```id="authflow01"
Client
  │
  ▼
POST /auth/login
  │
  ▼
AuthController
  │
  ▼
AuthService
  │
  ├─ normalize email
  ├─ find user
  ├─ compare password
  ├─ generate access token
  └─ generate refresh token
  │
  ▼
Response
```

Response example:

```id="authflow02"
{
  "accessToken": "...",
  "user": {
    "id": "...",
    "email": "user@email.com"
  }
}
```

Refresh token will be stored in:

```id="authflow03"
httpOnly cookies
```

---

## Database ER Diagram

The database is designed for **multi-tenant SaaS architecture**.

```id="erd01"
users
-----
id (UUID) PK
name
email UNIQUE
password_hash
created_at
updated_at


organizations
-------------
id (UUID) PK
name
created_at


memberships
-----------
user_id FK → users.id
organization_id FK → organizations.id
role


projects
--------
id (UUID) PK
organization_id FK
name
created_by
created_at


tasks
-----
id (UUID) PK
project_id FK
title
status
created_at
```

Relationships:

```id="erd02"
users
  │
  │ 1..*
  ▼
memberships
  ▲
  │ *..1
  │
organizations
```

Meaning:

```id="erd03"
one user can belong to many organizations
one organization can have many users
```

---

## Multi-Tenant Data Isolation

Every tenant-owned entity contains an **organization_id**.

Example query pattern:

```id="tenantquery01"
SELECT *
FROM projects
WHERE organization_id = $1
```

This ensures:

```id="tenantquery02"
Organization A cannot access Organization B data
```

---

## Planned Index Strategy

For tenant-heavy queries, composite indexes will be used.

Example:

```id="index01"
CREATE INDEX idx_projects_org_created
ON projects (organization_id, created_at);
```

Benefits:

```id="index02"
fast tenant filtering
efficient pagination
better query planning
```

---

## Example Login Sequence

```id="loginsequence01"
User
 │
 │ enters email + password
 ▼
Frontend
 │
 │ POST /auth/login
 ▼
Backend
 │
 │ find user
 │ compare password
 │ generate tokens
 ▼
Response
 │
 ├─ access_token
 └─ refresh_token (cookie)
```

---

## Planned Token Architecture

Access Token:

```id="token01"
short-lived
stored in memory (frontend)
sent in Authorization header
```

Refresh Token:

```id="token02"
longer lifetime
stored in httpOnly cookie
rotated on each refresh
```

---

## Future Scalability Plan

Later improvements will include:

```id="scale01"
Redis caching
Rate limiting
Background jobs
Queue system
Docker deployment
Horizontal scaling
```

---

## Repository Pattern Example

Example repository query:

```id="repo01"
SELECT id, email, password_hash
FROM users
WHERE email = $1
```

Repositories should:

```id="repo02"
only interact with database
avoid business logic
return plain data
```

Business logic belongs to **services**.

---

## Security Principles

The backend follows these rules:

```id="sec01"
Never store plain passwords
Use bcrypt hashing
Use prepared SQL queries
Normalize emails
Never expose password_hash
```

Authentication responses never return:

```id="sec02"
password_hash
```

---

## Development Philosophy

This project intentionally avoids ORMs initially to learn:

```id="philo01"
SQL fundamentals
query planning
database indexing
transaction handling
```

Once these concepts are understood, an ORM can be evaluated if needed.

---

# Key Architectural Decisions
w
# Progress

## Infrastructure
✔ NestJS project setup  
✔ PostgreSQL connection pool  
✔ Environment configuration  
✔ Custom migration system  

## Users
✔ Create user  
✔ Find user by email  

## Authentication
⬜ Login endpoint  
⬜ JWT access token  
⬜ Refresh tokens  
⬜ Refresh token rotation  

## Organizations
⬜ Organizations module  
⬜ Membership system  

## Core Features
⬜ Projects module  
⬜ Tasks module  
⬜ RBAC permissions  
⬜ Audit logs  

## Infrastructure Improvements
⬜ Redis caching  
⬜ Rate limiting  
⬜ Docker setup  
⬜ CI/CD