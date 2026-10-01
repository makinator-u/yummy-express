import json
import base64
import hmac
import hashlib
import time
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Order
from ..schemas import GoogleAuthRequest, AuthResponse, UserOut, OrderOut

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

AUTH_SECRET = os.environ.get("AUTH_SECRET", "yummy_express_google_auth_secret_key_2026")

def generate_auth_token(user_id: int, email: str) -> str:
    timestamp = int(time.time())
    payload = f"{user_id}:{email}:{timestamp}"
    signature = hmac.new(AUTH_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()[:32]
    encoded_payload = base64.urlsafe_b64encode(payload.encode()).decode().rstrip("=")
    return f"ye_{encoded_payload}.{signature}"

def verify_auth_token(token: str, db: Session) -> Optional[User]:
    if not token or not token.startswith("ye_"):
        return None
    try:
        token_body = token[3:]
        if "." not in token_body:
            return None
        encoded_payload, signature = token_body.split(".", 1)
        # Pad base64
        padded = encoded_payload + "=" * (-len(encoded_payload) % 4)
        payload = base64.urlsafe_b64decode(padded.encode()).decode()
        
        # Verify signature
        expected_sig = hmac.new(AUTH_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()[:32]
        if not hmac.compare_digest(signature, expected_sig):
            return None
        
        parts = payload.split(":")
        user_id = int(parts[0])
        user = db.query(User).filter(User.id == user_id).first()
        return user
    except Exception:
        return None

def get_current_user(
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
    elif x_auth_token:
        token = x_auth_token.strip()

    if not token:
        raise HTTPException(status_code=401, detail="Authentication token missing")

    user = verify_auth_token(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")
    return user

def decode_google_jwt(credential: str) -> dict:
    """Decode Google ID Token payload without heavy external libraries."""
    try:
        parts = credential.split(".")
        if len(parts) < 2:
            raise ValueError("Invalid JWT format")
        payload_b64 = parts[1]
        padded = payload_b64 + "=" * (-len(payload_b64) % 4)
        payload_json = base64.urlsafe_b64decode(padded).decode("utf-8")
        return json.loads(payload_json)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse Google credential: {str(e)}")

@router.post("/google", response_model=AuthResponse)
def sign_in_with_google(auth_req: GoogleAuthRequest, db: Session = Depends(get_db)):
    google_id = None
    email = None
    name = None
    picture = ""

    if auth_req.credential:
        # Decode Google credential token
        payload = decode_google_jwt(auth_req.credential)
        google_id = payload.get("sub")
        email = payload.get("email")
        name = payload.get("name") or payload.get("given_name") or "Google User"
        picture = payload.get("picture") or ""
    elif auth_req.email:
        # Fallback / manual google account input for local testing
        email = auth_req.email.strip().lower()
        name = (auth_req.name or email.split("@")[0]).strip()
        google_id = auth_req.google_id or f"google_{hashlib.md5(email.encode()).hexdigest()[:16]}"
        picture = auth_req.picture or f"https://api.dicebear.com/7.x/initials/svg?seed={name}"
    else:
        raise HTTPException(status_code=400, detail="Google credential or email is required")

    if not email or not google_id:
        raise HTTPException(status_code=400, detail="Invalid Google profile information")

    # Find existing user by google_id or email
    user = db.query(User).filter((User.google_id == google_id) | (User.email == email)).first()

    if not user:
        # Create new customer account
        user = User(
            google_id=google_id,
            email=email,
            name=name,
            picture=picture,
            role="customer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update user profile if changed
        updated = False
        if name and user.name != name:
            user.name = name
            updated = True
        if picture and user.picture != picture:
            user.picture = picture
            updated = True
        if updated:
            db.commit()
            db.refresh(user)

    token = generate_auth_token(user.id, user.email)
    return {
        "token": token,
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(user: User = Depends(get_current_user)):
    return user

@router.get("/my-orders", response_model=List[OrderOut])
def get_user_orders(
    user: User = Depends(get_current_user),
    limit: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db)
):
    orders = (
        db.query(Order)
        .filter((Order.user_id == user.id) | (Order.customer_phone == user.email))
        .order_by(Order.created_at.desc())
        .limit(limit)
        .all()
    )
    return orders

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
