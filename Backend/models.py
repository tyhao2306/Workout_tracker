from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from database import Base

class Exercise(Base):
    __tablename__ = 'exercise'

    id = Column(Integer, primary_key= True, index = True)
    name = Column(String, index = True)
    category = Column(String, index = True)
    muscle_group = Column(String, index = True)
    description = Column(String, index = True)

class Workout_exercise(Base):
    __tablename__ = 'workout_exercise'

    id = Column(Integer, primary_key= True, index = True)
    workout_id = Column(Integer, ForeignKey("workout.id"))
    sets = Column(Integer, index = True)
    reps = Column(Integer, index = True)
    weight = Column(Integer, index = True)
    exercise_id = Column(Integer, ForeignKey("exercise.id"))

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key= True, index = True)
    username = Column(String, unique = True)
    hashed_password = Column(String)

class Workouts(Base):
    __tablename__ = 'workout'

    id = Column(Integer, primary_key= True, index = True)
    name = Column(String, index = True)
    user_id = Column(Integer, ForeignKey("user.id"))
    scheduled_date = Column(String, index = True)
    
