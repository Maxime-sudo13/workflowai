# EcoLocal AI: MVP API Documentation (Conceptual)

## 1. Introduction

This document provides a conceptual overview of the API endpoints available for the Minimum Viable Product (MVP) of the EcoLocal AI platform. The API allows client applications (like the web frontend) to interact with the backend services.

**Authentication:** Most endpoints (unless otherwise specified) require authentication using JSON Web Tokens (JWT). After successful login, a JWT is issued. This token must be included in the `Authorization` header of subsequent requests as a Bearer token (e.g., `Authorization: Bearer <your_jwt_token>`).

**Base URL:** All API endpoints are prefixed with `/api/v1`.

*(This documentation is based on the `mvp_backend_design.md` document.)*

## 2. Authentication Endpoints

### `POST /auth/register`

*   **Purpose:** Register a new user.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123",
      "name": "Jane Doe",
      "community_location": "Springfield"
    }
    ```
*   **Response Body (Success - 201 Created):**
    ```json
    {
      "user_id": "user-uuid-12345",
      "email": "user@example.com",
      "name": "Jane Doe",
      "community_location": "Springfield",
      "message": "User registered successfully"
    }
    ```
    *(Alternatively, the response might directly include a JWT for immediate login.)*
*   **Response Body (Error - 400 Bad Request / 409 Conflict):**
    ```json
    {
      "error": "Email already exists"
    }
    ```
    ```json
    {
      "error": "Invalid input: [details of validation error]"
    }
    ```

### `POST /auth/login`

*   **Purpose:** Log in an existing user and obtain an authentication token.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response Body (Success - 200 OK):**
    ```json
    {
      "access_token": "your_jwt_token_string",
      "token_type": "bearer"
    }
    ```
*   **Response Body (Error - 401 Unauthorized):**
    ```json
    {
      "error": "Invalid credentials"
    }
    ```

## 3. Recommendation Endpoints (MVP)

### `GET /recommendations`

*   **Purpose:** Fetch the predefined list of project recommendations for the MVP.
*   **Authentication:** Not required for this MVP endpoint.
*   **Response Body (Success - 200 OK):**
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

## 4. Project Endpoints (MVP)

### `POST /projects`

*   **Purpose:** Create a new sustainability project.
*   **Authentication:** Required.
*   **Request Body:**
    ```json
    {
      "title": "Neighborhood Compost Initiative",
      "description": "My plan to start composting in our street.",
      "recommendation_id": "rec_001" // Optional: ID of the recommendation this project originated from
    }
    ```
*   **Response Body (Success - 201 Created):**
    ```json
    {
      "project_id": "project-uuid-67890",
      "title": "Neighborhood Compost Initiative",
      "description": "My plan to start composting in our street.",
      "status": "Planning", // Default status
      "user_id": "user-uuid-12345", // ID of the authenticated user
      "created_at": "2023-10-27T10:00:00Z"
    }
    ```

### `GET /projects`

*   **Purpose:** Get a list of projects started by the authenticated user.
*   **Authentication:** Required.
*   **Response Body (Success - 200 OK):**
    ```json
    [
      {
        "project_id": "project-uuid-67890",
        "title": "Neighborhood Compost Initiative",
        "status": "Planning",
        "created_at": "2023-10-27T10:00:00Z"
      },
      {
        "project_id": "project-uuid-abcde",
        "title": "Backyard Tree Planting",
        "status": "In Progress",
        "created_at": "2023-10-28T11:00:00Z"
      }
    ]
    ```

### `GET /projects/{project_id}`

*   **Purpose:** Get details of a specific project owned by the authenticated user.
*   **Authentication:** Required.
*   **Path Parameter:** `project_id` (string, UUID or integer)
*   **Response Body (Success - 200 OK):**
    ```json
    {
      "project_id": "project-uuid-67890",
      "title": "Neighborhood Compost Initiative",
      "description": "My plan to start composting in our street.",
      "status": "Planning",
      "user_id": "user-uuid-12345",
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:00:00Z",
      "tasks": [ // See Task Endpoints for task structure
        {
          "task_id": "task-uuid-11223",
          "description": "Draft proposal for neighborhood buy-in",
          "status": "To Do",
          "created_at": "2023-10-27T10:05:00Z"
        }
      ]
    }
    ```
*   **Response Body (Error - 404 Not Found):** If project doesn't exist or user doesn't have access.

### `PUT /projects/{project_id}`

*   **Purpose:** Update a project (e.g., change its status or description). For MVP, primarily for updating status.
*   **Authentication:** Required.
*   **Path Parameter:** `project_id` (string, UUID or integer)
*   **Request Body:**
    ```json
    {
      "title": "Neighborhood Compost Initiative (Updated)", // Optional
      "description": "Updated plan details.", // Optional
      "status": "In Progress" // Optional
    }
    ```
*   **Response Body (Success - 200 OK):**
    ```json
    {
      "project_id": "project-uuid-67890",
      "title": "Neighborhood Compost Initiative (Updated)",
      "description": "Updated plan details.",
      "status": "In Progress",
      "user_id": "user-uuid-12345",
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-28T12:00:00Z"
    }
    ```
*   **Response Body (Error - 404 Not Found):** If project doesn't exist or user doesn't have access.

## 5. Task Endpoints (MVP)

These endpoints operate within the context of a specific project.

### `POST /projects/{project_id}/tasks`

*   **Purpose:** Create a new task for a specific project.
*   **Authentication:** Required.
*   **Path Parameter:** `project_id` (string, UUID or integer)
*   **Request Body:**
    ```json
    {
      "description": "Research local composting guidelines"
    }
    ```
*   **Response Body (Success - 201 Created):**
    ```json
    {
      "task_id": "task-uuid-fghij",
      "project_id": "project-uuid-67890",
      "description": "Research local composting guidelines",
      "status": "To Do", // Default status
      "created_at": "2023-10-28T14:00:00Z"
    }
    ```
*   **Response Body (Error - 404 Not Found):** If the specified project doesn't exist or user doesn't have access.

### `GET /projects/{project_id}/tasks`

*   **Purpose:** Get all tasks for a specific project.
*   **Authentication:** Required.
*   **Path Parameter:** `project_id` (string, UUID or integer)
*   **Response Body (Success - 200 OK):**
    ```json
    [
      {
        "task_id": "task-uuid-fghij",
        "project_id": "project-uuid-67890",
        "description": "Research local composting guidelines",
        "status": "To Do",
        "created_at": "2023-10-28T14:00:00Z",
        "updated_at": "2023-10-28T14:00:00Z"
      },
      {
        "task_id": "task-uuid-klmno",
        "project_id": "project-uuid-67890",
        "description": "Identify potential compost bin locations",
        "status": "To Do",
        "created_at": "2023-10-28T14:05:00Z",
        "updated_at": "2023-10-28T14:05:00Z"
      }
    ]
    ```
*   **Response Body (Error - 404 Not Found):** If project doesn't exist or user doesn't have access.

### `PUT /tasks/{task_id}`

*   **Purpose:** Update a task (e.g., change its status or description).
*   **Authentication:** Required.
*   **Path Parameter:** `task_id` (string, UUID or integer)
*   **Request Body:**
    ```json
    {
      "description": "Research local composting guidelines (finalized)", // Optional
      "status": "Done" // Optional
    }
    ```
*   **Response Body (Success - 200 OK):**
    ```json
    {
      "task_id": "task-uuid-fghij",
      "project_id": "project-uuid-67890",
      "description": "Research local composting guidelines (finalized)",
      "status": "Done",
      "created_at": "2023-10-28T14:00:00Z",
      "updated_at": "2023-10-28T15:00:00Z"
    }
    ```
*   **Response Body (Error - 404 Not Found):** If task doesn't exist or user doesn't have access to the parent project.

### `DELETE /tasks/{task_id}`

*   **Purpose:** Delete a task.
*   **Authentication:** Required.
*   **Path Parameter:** `task_id` (string, UUID or integer)
*   **Response Body (Success - 204 No Content):** No response body.
*   **Response Body (Error - 404 Not Found):** If task doesn't exist or user doesn't have access.

## 6. Feedback Endpoints (MVP)

### `POST /feedback`

*   **Purpose:** Post a new comment on the global "Ideas & Feedback" page.
*   **Authentication:** Required.
*   **Request Body:**
    ```json
    {
      "content": "This platform is a great idea! I'd love to see more about water conservation."
    }
    ```
*   **Response Body (Success - 201 Created):**
    ```json
    {
      "post_id": "feedback-uuid-pqrst",
      "user_id": "user-uuid-12345", // ID of the authenticated user
      "content": "This platform is a great idea! I'd love to see more about water conservation.",
      "created_at": "2023-10-28T16:00:00Z"
    }
    ```

### `GET /feedback`

*   **Purpose:** Get all posts from the "Ideas & Feedback" page (typically in reverse chronological order).
*   **Authentication:** Not required for this MVP endpoint.
*   **Response Body (Success - 200 OK):**
    ```json
    [
      {
        "post_id": "feedback-uuid-pqrst",
        "user_id": "user-uuid-12345",
        "user_name": "Jane Doe", // Joined from Users table for display convenience
        "content": "This platform is a great idea! I'd love to see more about water conservation.",
        "created_at": "2023-10-28T16:00:00Z"
      },
      {
        "post_id": "feedback-uuid-uvwxy",
        "user_id": "user-uuid-67890",
        "user_name": "John Smith",
        "content": "The recommendations are interesting, but I hope to see more variety soon.",
        "created_at": "2023-10-28T15:30:00Z"
      }
    ]
    ```

This conceptual API documentation outlines the basic interactions for the EcoLocal AI MVP. Further details on error handling, rate limiting, and pagination would be included in more comprehensive API documentation.
