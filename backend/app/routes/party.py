from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import PartyInquiry
from ..schemas import PartyInquiryCreate, PartyInquiryOut

router = APIRouter(prefix="/api/party", tags=["Party Catering"])

@router.post("/inquiry", response_model=PartyInquiryOut)
def create_party_inquiry(inquiry: PartyInquiryCreate, db: Session = Depends(get_db)):
    try:
        new_inquiry = PartyInquiry(
            customer_name=inquiry.customer_name.strip(),
            customer_phone=inquiry.customer_phone.strip(),
            event_date=inquiry.event_date.strip(),
            approx_guests=inquiry.approx_guests,
            party_type=inquiry.party_type or "Veg Catering",
            notes=(inquiry.notes or "").strip()
        )
        db.add(new_inquiry)
        db.commit()
        db.refresh(new_inquiry)
        return new_inquiry
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit party inquiry: {str(e)}")

@router.get("/inquiries", response_model=List[PartyInquiryOut])
def get_party_inquiries(
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    return db.query(PartyInquiry).order_by(PartyInquiry.created_at.desc()).limit(limit).all()
