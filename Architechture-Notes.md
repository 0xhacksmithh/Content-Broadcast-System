# ARCHITECTURE NOTES – Content Broadcasting System

## 1. Authentication & RBAC Flow

The system uses **JWT-based authentication**.

- On login, the server validates credentials and generates a JWT containing:
  - user_id
  - role (teacher / principal)

- The client sends the token in:
  - Authorization: Bearer

- Middleware flow:
  - **authenticate middleware**
    - Verifies JWT
    - Attaches decoded payload to `req.user`

  - **allowRoles middleware**
    - Checks if `req.user.role` is allowed for the route

## 2. Subject-Based System Design

- Every content item belongs to a subject (maths, science, etc.)
- Subjects are logically independent streams

**Key Design:**

- Content is filtered by:
  - `teacher_id`
  - `subject`

- Each subject has its own rotation cycle

## 3. Upload Handling Approach

- File uploads handled using multer middleware
- Supported formats:
  JPG, PNG, GIF
- File size validation enforced (e.g., 10MB)

### Flow:

- Request hits upload route
- Multer parses `multipart/form-data`
- File stored in `/uploads` directory
- Metadata stored in DB:
  - file_path
  - file_type
  - file_size

### Validation:

- Title required
- Subject required
- File required

## 4. Approval Workflow Design

### Content Lifecycle:

uploaded → pending → approved / rejected

### Flow:

**Teacher:**

```
Teacher uploads → status = pending
```

**Principal:**

```
Approves → status = approved + approved_by + timestamp

Rejects → status = rejected + rejection_reason
```

### Rules:

- Only principal can approve/reject
- Rejected content is not visible in public API
- Approved content still depends on scheduling window

## 5. Scheduling & Rotation Logic

**Conditions for content to be LIVE:**

- status = approved

- `current time` BETWEEN `start_time` and `end_time`

**Rotation Logic:**

- Fetch all eligible content for:
  - teacher_id
  - subject (optional)
- Determine:

```c
rotation duration (default 5 min if not defined)
```

- Compute:

```c
elapsed_time = current_time - start_time

index = floor(elapsed_time / duration) % total_content
```

- Active content:

```c
active_content = contents[index]
```

**Important Design Decision:**

- Computed dynamically using current time
- Rotation is applied per subject
- Each subject loops independently

## 6. Database Design Decisions

### Tables:

**Users**

- id
- name
- email
- password_hash
- role

**Content**

- id
- title
- subject
- file_path
- uploaded_by
- status (pending/approved/rejected)
- start_time
- end_time

**Content Schedule**

- content_id
- duration
- rotation_order

## 7. Folder Structure

```
config/
controllers/
databse/
middlewares/
models/
routes/
uploads/ (excluded by .gitignore)
utils/
server.js
Architechture-Notes.md

```

## 8. Middleware Usage

**Core Middlewares:**

```
authenticate → JWT verification

allowRoles → RBAC enforcement

multer → file upload handling
```

## 9. Scalability Approach

### 1. Caching (Redis)

- Cached `/assignment/live` API
- Reduces DB load for high-frequency requests

### 2. Rate Limiting

- Protected public API from abuse

### 3. Stateless APIs

- No session storage
- Horizontal scaling supported

### 4. Indexing

- Improves query performance for filters

### 5. Edge Case Handling

- `No content` → return "No content available"
- `Approved but outside schedule` → not shown
- `Invalid subject` → empty response
- `Missing token` → 401 Unauthorized
- `Forbidden role` → 403 Forbidden

### 6. S3 Storage (Future)

- Will Move file storage from local → cloud

### 7. Queue System (Future)

- Will Use queue (e.g., Kafka / RabbitMQ) for:
  - content processing
  - notifications
