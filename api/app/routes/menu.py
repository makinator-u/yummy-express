from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from ..models import Category, MenuItem
from ..schemas import CategoryOut, MenuItemOut

router = APIRouter(tags=["Menu"])

@router.get("/categories", response_model=List[CategoryOut])
def get_categories_with_items(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.display_order.asc()).all()
    return categories

@router.get("/items", response_model=List[MenuItemOut])
def get_menu_items(
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    spicy_only: Optional[bool] = None,
    bestseller_only: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(MenuItem).join(Category)
    
    if category_slug:
        query = query.filter(Category.slug == category_slug)
    
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                MenuItem.name.ilike(search_fmt),
                MenuItem.description.ilike(search_fmt),
                Category.name.ilike(search_fmt)
            )
        )
    
    if spicy_only is not None and spicy_only:
        query = query.filter(MenuItem.is_spicy == True)
        
    if bestseller_only is not None and bestseller_only:
        query = query.filter(MenuItem.is_bestseller == True)
        
    return query.order_by(Category.display_order.asc(), MenuItem.id.asc()).all()

@router.get("/bestsellers", response_model=List[MenuItemOut])
def get_bestsellers(db: Session = Depends(get_db)):
    return db.query(MenuItem).filter(MenuItem.is_bestseller == True).all()

@router.get("/items/{item_id}", response_model=MenuItemOut)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
