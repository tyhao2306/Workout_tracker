# Workout_tracker

Using Fastapi as backend and React as the frontend

## Features:
User authentication:
- Register & Login (JWT-based)
- Passwords hashed securely

### Workout & Exercise Management
- Create workouts (e.g., "Push Day", "Leg Day")
- Add exercises to specific workouts
- View all exercises tied to a selected workout
- Dynamic frontend forms

### Tech stack
- Frontend: React + Axios
- Backend: FastAPI
- Auth: JWT(`python-jose`)
- Password Hashing: Passlib-bcrypt
- Database: PostgreSQL
- ORM: SQLAlchemy
- API Testing: FastAPI docs (Swagger UI)

Step 1:
Install the necessary dependencies for the backend. The libraries needed are Fastapi, psycopg,jose cryptography,sqlalchemy,passlib bcrypt, python-multipart. 

backend/
├── main.py       # Entry point of the application
├── auth.py       # Handles user authentication and authorization
├── database.py   # Manages database connections and queries
└── models.py     # Defines data models and schemas

Step 2: 
create a react app with npx create-app.
<<<<<<< HEAD
import axios 
=======
import axios 
>>>>>>> 8165527 (Updated login page)
