# API Reference Documentation - FixMate AI

The FixMate AI API server is hosted on port `5000` by default. All API endpoints are prefixed with `/api`.

---

## 1. Authentication Endpoints (`/api/auth`)

### POST `/register`
Registers a new user and issues a login token.
*   **Request Payload**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+91 9876543219",
      "password": "securepassword123"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "603f9e...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      }
    }
    ```

### POST `/login`
Authenticates user and returns JWT token.
*   **Request Payload**:
    ```json
    {
      "email": "jane@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOi...",
      "user": {
        "id": "603f9e...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user",
        "location": { "latitude": 19.076, "longitude": 72.877, "address": "Mumbai" }
      }
    }
    ```

### PUT `/location` (Protected)
Updates the logged-in user's GPS coordinates.
*   **Request Headers**: `Authorization: Bearer <JWT_TOKEN>`
*   **Request Payload**:
    ```json
    {
      "latitude": 19.0820,
      "longitude": 72.8850,
      "address": "Kurla West, Mumbai, India"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "user": {
        "id": "603f9e...",
        "name": "Jane Doe",
        "location": { "latitude": 19.082, "longitude": 72.885, "address": "Kurla West..." }
      }
    }
    ```

---

## 2. Professionals Endpoints (`/api/professionals`)

### GET `/`
Queries, filters, and ranks professionals. Calculates distance if `lat` and `lng` parameters are passed.
*   **Query Parameters**:
    *   `profession` (string, e.g. "Plumber")
    *   `search` (string, matches name)
    *   `lat` (number, user latitude)
    *   `lng` (number, user longitude)
    *   `recommend` (boolean, sets smart ranking scoring)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "count": 1,
      "data": [
        {
          "_id": "603f7a...",
          "name": "Rajesh Kumar",
          "profession": "Plumber",
          "experience": 8,
          "rating": 4.8,
          "location": { "latitude": 19.079, "longitude": 72.882, "address": "Kurla West..." },
          "distance": 0.45
        }
      ]
    }
    ```

---

## 3. Bookings Endpoints (`/api/bookings`)

### POST `/` (Protected)
Books a scheduled service or requests an Emergency dispatch.
*   **Request Headers**: `Authorization: Bearer <JWT_TOKEN>`
*   **Request Payload (Scheduled Booking)**:
    ```json
    {
      "professionalId": "603f7a...",
      "date": "2026-06-15",
      "time": "14:00",
      "problemDescription": "Water leakage in kitchen tap"
    }
    ```
*   **Request Payload (Emergency Dispatch)**:
    ```json
    {
      "isEmergency": true,
      "profession": "Plumber",
      "problemDescription": "Pipe burst in bathroom! Immediate help needed"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "603fb8...",
        "userId": "603f9e...",
        "professionalId": "603f7a...",
        "date": "2026-06-07",
        "time": "15:45",
        "problemDescription": "Pipe burst...",
        "isEmergency": true,
        "status": "Accepted"
      }
    }
    ```

### PUT `/:id/status` (Protected)
Updates status of a booking (emits Socket notification).
*   **Request Payload**:
    ```json
    {
      "status": "Completed"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "603fb8...",
        "status": "Completed"
      }
    }
    ```

---

## 4. AI Chatbot Endpoints (`/api/ai`)

### POST `/chat`
Processes conversational queries.
*   **Request Payload**:
    ```json
    {
      "message": "I need an electrician immediately"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "reply": "🚨 Emergency Mode Triggered! FixMate AI offers rapid 30-minute dispatches for critical situations. Let me open the request panel for you.",
      "action": "open_emergency_mode"
    }
    ```
