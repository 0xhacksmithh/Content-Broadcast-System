# Content Broadcasting System

## 1. Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Authentication

- JWT (JSON Web Token)
- bcrypt (password hashing)

### File Upload

- Multer (local storage)

### Caching

- Redis (caching live content)

### Rate Limit

- express-rate-limit (Rate limit live content)

### Others

- Postman (API Testing)
- Docker (Running mySQL and Redis)
- Table Plus (To see Database entries)

## 2. Setup Steps

### 1. Clone Project

```
git clone <repo-url>
cd project-folder
```

### 2. Install Dependencies

```
npm install
```

### 3. Setup Environment Variables

Create .env file: (Reference given in .env.example file)

```
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=content_db
DB_PORT=3306

JWT_SECRET=your_secret_key
```

### 4. Run Mysql and Redis container

```
For Redis:

docker run -d --name myRedis -p 6379:6379 redis
```

```
For MySQL:

docker run -d --name myDB -e MYSQL_ROOT_PASSWORD=1234 mysql
```

### 5. Setup MySQL Database

Run schema:

```
CREATE DATABASE content_db;
```

Then run your tables:

- users
- content
- content_schedule (Code present inside `models/schema.js`)

### 5. Start Server

```c
npm run dev
```

Server runs at:

```
http://localhost:3000
```

## 3. Authentication Flow

### Register

```
POST /auth/register
```

### Login

```
POST /auth/login
```

### Response:

```
{
  "token": "JWT_TOKEN"
}
```

### Use Token in Requests

```
Authorization: Bearer <token>
```

## 4. API Usage

## Auth APIs

**Register User**

```
POST /auth/register
```

**Login User**

```
POST /auth/login
```

## Content APIs

**Upload Content (Teacher Only)**

```
POST /content/upload
```

**Body (form-data)**

```
key	          value
title	      Math Notes
subject	      maths
file	      (upload file)
start_time	  2026-04-27 10:00
end_time	  2026-04-27 18:00
```

**Get My Content (Teacher)**

```
GET /content/my
```

**Get All Content (Principal)**

```
Multi Filter + Pagination

GET /content?subject=maths&status=approved&page=1&limit=10
```

## Approval APIs (Principal Only)

**Get Pending Content**

```
GET /approval/pending
```

**Approve Content**

```
POST /approval/approve/:id
```

**Reject Content**

```
POST /approval/reject/:id
```

```
Body:
{
  "reason": "Not relevant"
}
```

## Live API (Public)

**Get Live Content (Student)**

```
GET /content/live/:teacherId?subject=maths
```

**Response:**

```
{
"id": 1,
"title": "Algebra Notes",
"subject": "maths",
"file": "/uploads/file.pdf"
}
```

## 5. System Flow Summary

```
Teacher → Upload Content → Pending
→ Principal Approves
→ Content becomes active
```

```
Student → Calls Live API
→ System applies rotation logic
→ Returns active content
```

## 6. Core Features

### Authentication

- JWT-based login system

### RBAC

- Teacher → upload content
- Principal → approve/reject

### File Upload

- Multer-based local storage

### Scheduling

- start_time / end_time control visibility

### Rotation

- Time-based cycling per subject

### Dynamic Filter With Pagination

- Get All Content (Principal)
- `GET /content?subject=maths&status=approved&page=1&limit=10`

### Caching

- Redis caching for `/content/live`

### Rate Limit

- Rate limiting (express-rate-limit) for `/content/live`
