from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
import datetime
import models
from starlette import status
from database import engine, SessionLocal
from sqlalchemy.orm import Session
import auth
from auth import get_current_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth.router)
models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "http://workoutfrontenddomain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExerciseBase(BaseModel):
    name: str = None
    category: str = None
    description: str = None
    muscle_group: str = None

class Workout_ExerciseBase(BaseModel):
    exercise_id: int = None
    workout_id: int = None
    sets: int = None
    reps: int = None
    weight: int = None

class WorkoutBase(BaseModel):
    name: str = None
    user_id: int = None
    scheduled_date: str = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@app.get("/", status_code= status.HTTP_200_OK)
async def user(user:user_dependency, db: Session = Depends(get_db)):
    if user is None:
        raise HTTPException(status_code = 401, detail = 'Authentication Failed')
    return {"User": user}

@app.post("/exercise")
async def create_exercise(exercise: ExerciseBase, db: Session = Depends(get_db)):
    db_exercise = models.Exercise(name= exercise.name, category= exercise.category,description= exercise.description, muscle_group=exercise.muscle_group)
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)
    return db_exercise

@app.get("/exercise")
async def get_exercises(db: Session = Depends(get_db)):
    exercises = db.query(models.Exercise).all()
    return exercises

@app.post("/workoutexercise")
async def create_workout_exercise(workout_exercise: Workout_ExerciseBase, db: Session = Depends(get_db)):
    db_wexercise = models.Workout_exercise(sets= workout_exercise.sets,reps= workout_exercise.reps,weight=workout_exercise.weight,exercise_id= workout_exercise.exercise_id, workout_id=workout_exercise.workout_id)
    db.add(db_wexercise)
    db.commit()
    db.refresh(db_wexercise)
    return db_wexercise

@app.get("/workoutexercise")
async def get_workout_exercises(db: Session = Depends(get_db)):
    workout_exercises = db.query(models.Workout_exercise).all()
    return workout_exercises

@app.get("/workoutexercise/{workout_id}")
async def get_workout_exercises_for_workout(workout_id: int, db: Session = Depends(get_db)):
    workout_exercises = db.query(models.Workout_exercise).filter(models.Workout_exercise.workout_id == workout_id).all()
    return workout_exercises

@app.post("/workout")
async def create_workout(workout: WorkoutBase, db: Session = Depends(get_db)):
    db_workout = models.Workouts(name= workout.name,user_id= workout.user_id,scheduled_date=workout.scheduled_date)
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@app.get("/workout")
async def get_workout(db: Session = Depends(get_db)):
    workout_exercises = db.query(models.Workouts).all()
    return workout_exercises

@app.get("/verify-token/{token}")
async def verify_user_token(token: str):
    get_current_user(token=token)
    return {"message": "Token is valid"}
