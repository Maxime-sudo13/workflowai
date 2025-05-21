# EcoLocal AI: MVP Backend Design

This document outlines the conceptual backend logic, database schema, and API endpoints necessary to support the 'EcoLocal AI' Minimum Viable Product (MVP) feature set, as defined in `mvp_feature_set.md`.

## 1. Overall Backend Approach for MVP

*   **Architectural Style:** For the MVP, a **Simplified Monolith** approach is recommended. While the long-term vision is a microservices architecture (as detailed in `system_architecture.md`), a monolith is faster to develop and deploy for an initial product, reducing complexity for a small team and rapid iteration. Core functionalities will be organized into modules within this monolith.
*   **Primary Language/Framework:** **Python with Flask or FastAPI** is recommended.
    *   **Flask:** Lightweight, flexible, and easy to get started with. Good for smaller applications and APIs.
    *   **FastAPI:** Offers modern features like automatic data validation and API documentation (Swagger UI), which can speed up development and testing even for an MVP. It's built on Starlette and Pydantic, offering high performance.
    *   Both have a strong ecosystem of libraries for tasks like database interaction and JWT handling.

## 2. Database Schema (Conceptual - for MVP features only)

A relational database is suitable for the MVP's structured data needs. PostgreSQL or SQLite (for extreme simplicity in local development) could be used.

*   **`Users` Table:** Stores information about registered users.
    *   `user_id`: Primary Key (e.g., UUID, Integer auto-increment)
    *   `name`: Text (nullable, as users might only provide email initially)
    *   `email`: Text, Unique, Not Null (for login)
    *   `password_hash`: Text, Not Null (stores hashed password)
    *   `community_location`: Text (manually entered by user, for context)
    *   `created_at`: Timestamp (defaults to current time)

*   **`Projects` Table:** Stores information about sustainability projects created by users.
    *   `project_id`: Primary Key (e.g., UUID, Integer auto-increment)
    *   `title`: Text, Not Null
    *   `description`: Text (nullable)
    *   `status`: Text, Not Null (e.g., 'Planning', 'In Progress', 'Completed' - defaults to 'Planning')
    *   `user_id`: Foreign Key, Not Null (references `Users.user_id` - the project lead/owner)
    *   `created_at`: Timestamp (defaults to current time)
    *   `updated_at`: Timestamp (updates on modification)

*   **`Tasks` Table:** Stores tasks associated with projects.
    *   `task_id`: Primary Key (e.g., UUID, Integer auto-increment)
    *   `project_id`: Foreign Key, Not Null (references `Projects.project_id`)
    *   `description`: Text, Not Null
    *   `status`: Text, Not Null (e.g., 'To Do', 'Done' - defaults to 'To Do')
    *   `created_at`: Timestamp (defaults to current time)
    *   `updated_at`: Timestamp (updates on modification)

*   **`FeedbackPosts` Table:** Stores posts made on the global "Ideas & Feedback" page.
    *   `post_id`: Primary Key (e.g., UUID, Integer auto-increment)
    *   `user_id`: Foreign Key, Not Null (references `Users.user_id` - the author of the post)
    *   `content`: Text, Not Null
    *   `created_at`: Timestamp (defaults to current time)

**Relationships:**
*   `Users` to `Projects`: One-to-Many (one user can lead multiple projects).
*   `Projects` to `Tasks`: One-to-Many (one project can have multiple tasks).
*   `Users` to `FeedbackPosts`: One-to-Many (one user can write multiple feedback posts).

## 3. Key API Endpoints (Conceptual)

Base URL: `/api/v1`

### User Authentication

*   **`POST /auth/register`**
    *   **Purpose:** Register a new user.
    *   **Request Body:** `{"email": "user@example.com", "password": "securepassword123", "name": "Jane Doe", "community_location": "Springfield"}`
    *   **Response Body (Success):** `{"user_id": "uuid-123", "email": "user@example.com", "name": "Jane Doe", "community_location": "Springfield", "message": "User registered successfully"}` (or a JWT token directly)
    *   **Response Body (Error):** `{"error": "Email already exists"}`

*   **`POST /auth/login`**
    *   **Purpose:** Log in an existing user.
    *   **Request Body:** `{"email": "user@example.com", "password": "securepassword123"}`
    *   **Response Body (Success):** `{"access_token": "jwt_token_string", "token_type": "bearer"}`
    *   **Response Body (Error):** `{"error": "Invalid credentials"}`

### Project Recommendations (MVP - Simulated)

*   **`GET /recommendations`**
    *   **Purpose:** Fetch the predefined list of project recommendations for the MVP.
    *   **Request Body:** None
    *   **Response Body:**
        ```json
        {
          "recommendations": [
            {
              "id": "rec_001",
              "title": "Start a Neighborhood Compost Collection",
              "description": "Collect organic waste from households to create compost.",
              "relevance_statement": "Addresses our community's high organic waste going to landfills.",
              "simplified_impact": "Helps reduce landfill waste and create valuable compost."
            },
            {
              "id": "rec_002",
              "title": "Organize a Tree Planting Day",
              "description": "Plant native trees in designated local areas.",
              "relevance_statement": "Increases green space and improves air quality in residential zones.",
              "simplified_impact": "Enhances biodiversity and provides shade."
            }
            // ... more predefined recommendations
          ]
        }
        ```

### Projects

*   **`POST /projects`** (Requires Authentication)
    *   **Purpose:** Create a new project (typically after a user selects a recommendation).
    *   **Request Body:** `{"title": "Neighborhood Compost Initiative", "description": "My plan to start composting in our street.", "recommendation_id": "rec_001" (optional, for tracking source)}`
    *   **Response Body (Success):** `{"project_id": "uuid-proj-456", "title": "Neighborhood Compost Initiative", "description": "My plan to start composting in our street.", "status": "Planning", "user_id": "uuid-user-123", "created_at": "timestamp"}`

*   **`GET /projects`** (Requires Authentication)
    *   **Purpose:** Get a list of projects started by the authenticated user.
    *   **Request Body:** None
    *   **Response Body:** `[{"project_id": "uuid-proj-456", "title": "Neighborhood Compost Initiative", "status": "Planning"}, ...]`

*   **`GET /projects/{project_id}`** (Requires Authentication)
    *   **Purpose:** Get details of a specific project.
    *   **Request Body:** None
    *   **Response Body:** `{"project_id": "uuid-proj-456", "title": "Neighborhood Compost Initiative", "description": "...", "status": "Planning", "user_id": "uuid-user-123", "tasks": [{"task_id": "uuid-task-789", "description": "Draft proposal", "status": "To Do"}, ...]}`

*   **`PUT /projects/{project_id}`** (Requires Authentication)
    *   **Purpose:** Update a project (e.g., change status or description). For MVP, mainly for status.
    *   **Request Body:** `{"status": "In Progress", "description": "Updated description"}`
    *   **Response Body (Success):** `{"project_id": "uuid-proj-456", "title": "...", "status": "In Progress", "description": "Updated description", ...}`

### Tasks (within a Project)

*   **`POST /projects/{project_id}/tasks`** (Requires Authentication)
    *   **Purpose:** Create a new task for a specific project.
    *   **Request Body:** `{"description": "Research local composting guidelines"}`
    *   **Response Body (Success):** `{"task_id": "uuid-task-abc", "project_id": "uuid-proj-456", "description": "Research local composting guidelines", "status": "To Do", "created_at": "timestamp"}`

*   **`GET /projects/{project_id}/tasks`** (Requires Authentication)
    *   **Purpose:** Get all tasks for a specific project.
    *   **Request Body:** None
    *   **Response Body:** `[{"task_id": "uuid-task-abc", "description": "...", "status": "To Do"}, ...]`

*   **`PUT /tasks/{task_id}`** (Requires Authentication)
    *   **Purpose:** Update a task (e.g., change status or description).
    *   **Request Body:** `{"status": "Done", "description": "Updated task details"}`
    *   **Response Body (Success):** `{"task_id": "uuid-task-abc", "description": "Updated task details", "status": "Done", ...}`

*   **`DELETE /tasks/{task_id}`** (Requires Authentication)
    *   **Purpose:** Delete a task.
    *   **Request Body:** None
    *   **Response Body (Success):** `{"message": "Task deleted successfully"}` (or HTTP 204 No Content)

### Feedback

*   **`POST /feedback`** (Requires Authentication)
    *   **Purpose:** Post a new comment on the global "Ideas & Feedback" page.
    *   **Request Body:** `{"content": "This platform is a great idea! I'd love to see more about water conservation."}`
    *   **Response Body (Success):** `{"post_id": "uuid-post-xyz", "user_id": "uuid-user-123", "content": "...", "created_at": "timestamp"}`

*   **`GET /feedback`**
    *   **Purpose:** Get all posts from the "Ideas & Feedback" page (chronological order).
    *   **Request Body:** None
    *   **Response Body:** `[{"post_id": "uuid-post-xyz", "user_name": "Jane Doe", "content": "...", "created_at": "timestamp"}, ...]` (User name can be joined from Users table for display).

## 4. Backend Logic Highlights (Conceptual)

*   **User Authentication:**
    *   **Registration:**
        1.  Receive user details (email, password, name, community_location).
        2.  Validate input (e.g., email format, password complexity if desired).
        3.  Check if email already exists in the `Users` table.
        4.  Hash the password using a strong algorithm (e.g., bcrypt, Argon2).
        5.  Store user details (including hashed password) in the `Users` table.
    *   **Login:**
        1.  Receive email and password.
        2.  Retrieve user from `Users` table by email.
        3.  If user exists, compare the provided password with the stored hash using the same hashing algorithm.
        4.  If passwords match, generate a JWT (JSON Web Token). The JWT payload would include `user_id` and an expiry time.
        5.  Return the JWT to the client.
    *   **Authenticated Requests:** Subsequent requests to protected API endpoints must include the JWT in the `Authorization` header (e.g., `Bearer <token>`). The backend will validate the token (signature, expiry) and extract `user_id` to identify the user.

*   **Recommendation Logic (MVP):**
    1.  A predefined list of 3-5 recommendation objects (as described in the API response for `GET /recommendations`) will be stored directly in the backend code (e.g., as a Python list of dictionaries) or in a simple configuration file (e.g., `recommendations.json`) that is read at startup.
    2.  When the `GET /recommendations` endpoint is called, the backend simply returns this hardcoded list. No database interaction or complex logic is involved for this MVP feature.

*   **Project & Task Management:**
    *   **Create Project:**
        1.  User (authenticated, `user_id` from JWT) sends project details.
        2.  Backend creates a new record in the `Projects` table, associating it with the `user_id`.
    *   **Link Tasks to Projects:** When creating a task, the `project_id` (from the URL path parameter) is used to associate the task with its parent project in the `Tasks` table.
    *   **Authorization:** For operations like updating or deleting projects/tasks, the backend must verify that the authenticated user is the owner of the project (or has appropriate permissions, though MVP scope is simple ownership).

*   **Feedback Posting:**
    *   **Create Post:**
        1.  User (authenticated, `user_id` from JWT) sends content.
        2.  Backend creates a new record in `FeedbackPosts`, associating it with the `user_id`.
    *   **Retrieve Posts:** When `GET /feedback` is called, the backend queries the `FeedbackPosts` table, potentially joining with the `Users` table to fetch the author's name for display, and orders the results by `created_at` (descending).

## 5. Technology Choices (Reiteration for MVP Backend)

*   **Backend Framework:** Python with Flask or FastAPI (FastAPI preferred for built-in validation and docs).
*   **Database:** PostgreSQL (production-ready and feature-rich) or SQLite (for ease of local development setup). An ORM like SQLAlchemy (Python) can be used for database interactions.
*   **Authentication:** JWT (JSON Web Tokens) for stateless authentication. Libraries like `PyJWT` (Python) can be used.
*   **Password Hashing:** bcrypt or Argon2 libraries.

This backend design provides a solid foundation for the MVP, focusing on simplicity and the core features needed to test the platform's initial value proposition.Okay, I've created the `mvp_backend_design.md` file.

It includes:

1.  **Overall Backend Approach for MVP:** Proposing a Simplified Monolith using Python with Flask or FastAPI.
2.  **Database Schema (Conceptual - for MVP features only):**
    *   `Users` table (user_id, name, email, password_hash, community_location, created_at)
    *   `Projects` table (project_id, title, description, status, user_id, created_at, updated_at)
    *   `Tasks` table (task_id, project_id, description, status, created_at, updated_at)
    *   `FeedbackPosts` table (post_id, user_id, content, created_at)
    *   Brief explanation of relationships.
3.  **Key API Endpoints (Conceptual):**
    *   Endpoints for user registration (`POST /auth/register`) and login (`POST /auth/login`).
    *   Endpoint for fetching simulated project recommendations (`GET /recommendations`).
    *   Endpoints for creating (`POST /projects`), listing (`GET /projects`), viewing details (`GET /projects/{project_id}`), and updating (`PUT /projects/{project_id}`) projects.
    *   Endpoints for creating (`POST /projects/{project_id}/tasks`), listing (`GET /projects/{project_id}/tasks`), updating (`PUT /tasks/{task_id}`), and deleting (`DELETE /tasks/{task_id}`) tasks.
    *   Endpoints for posting (`POST /feedback`) and fetching (`GET /feedback`) feedback.
    *   For each, the HTTP method, path, purpose, example request body (if applicable), and example response body are outlined.
4.  **Backend Logic Highlights (Conceptual):**
    *   User Authentication (registration with password hashing, login with JWT generation).
    *   Recommendation Logic (MVP - serving a hardcoded list).
    *   Project & Task Management (CRUD logic, linking projects to users, tasks to projects).
    *   Feedback Posting (saving and retrieving posts).
5.  **Technology Choices (Reiteration for MVP Backend):**
    *   Python (Flask/FastAPI), PostgreSQL/SQLite, JWT, bcrypt/Argon2.

This structure should provide a clear conceptual blueprint for the MVP's backend.
