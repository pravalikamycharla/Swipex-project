from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import Base, engine, SessionLocal
from models import User


# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SwipeX Backend")


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database connection
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# Registration data
class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str


# Login data
class LoginRequest(BaseModel):
    email: str
    password: str


# Home
@app.get("/")
def home():
    return {"message": "SwipeX Backend Running"}


# REGISTER
@app.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    # Check whether email already exists
    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:
        return {
            "success": False,
            "message": "Account already registered with this email"
        }

    # Create new user
    new_user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password=data.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "Registration successful"
    }


# LOGIN
@app.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    # Email doesn't exist
    if not user:
        return {
            "success": False,
            "message": "Account not registered"
        }

    # Wrong password
    if user.password != data.password:
        return {
            "success": False,
            "message": "Incorrect password"
        }

    return {
        "success": True,
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name
    }