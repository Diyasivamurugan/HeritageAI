from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database import crud
from app.schemas.heritage_site import (
    HeritageSiteResponse,
    HeritageSiteCreate,
    HeritageSiteUpdate
)

router = APIRouter(prefix="/api/heritage", tags=["Heritage Locations"])

@router.get("", response_model=List[HeritageSiteResponse])
def list_heritage_locations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    dynasty: Optional[str] = Query(None, description="Filter by dynasty (e.g., Chola, Pallava, Pandya)"),
    is_unesco: Optional[bool] = Query(None, description="Filter by UNESCO status"),
    search: Optional[str] = Query(None, description="Optional search query"),
    db: Session = Depends(get_db)
):
    """
    List heritage locations with pagination and optional dynasty/UNESCO filters.
    If search parameter is provided, performs a fuzzy search.
    """
    if search:
        return crud.search_heritage_sites(db, search)
    return crud.get_all_heritage_sites(db, skip=skip, limit=limit, dynasty=dynasty, is_unesco=is_unesco)


@router.get("/search", response_model=List[HeritageSiteResponse])
def search_locations(
    q: str = Query(..., min_length=1, description="Search term for heritage sites"),
    db: Session = Depends(get_db)
):
    """
    Search heritage locations by name, dynasty, location, architecture, or cultural significance.
    """
    return crud.search_heritage_sites(db, q)


@router.get("/{id_or_slug}", response_model=HeritageSiteResponse)
def get_heritage_detail(id_or_slug: str, db: Session = Depends(get_db)):
    """
    View individual heritage details by numeric ID or URL slug.
    Returns full record including verified historical facts and stories.
    """
    if id_or_slug.isdigit():
        site = crud.get_heritage_site_by_id(db, int(id_or_slug))
    else:
        site = crud.get_heritage_site_by_slug(db, id_or_slug)

    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Heritage location '{id_or_slug}' not found"
        )
    return site


@router.post("", response_model=HeritageSiteResponse, status_code=status.HTTP_201_CREATED)
def create_heritage_location(
    site_in: HeritageSiteCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new heritage site in the database (CRUD: Create).
    """
    existing = crud.get_heritage_site_by_slug(db, site_in.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Site with slug '{site_in.slug}' already exists."
        )
    return crud.create_heritage_site(db, site_in.model_dump())


@router.put("/{site_id}", response_model=HeritageSiteResponse)
def update_heritage_location(
    site_id: int,
    site_update: HeritageSiteUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing heritage site (CRUD: Update).
    """
    updated = crud.update_heritage_site(db, site_id, site_update.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Heritage site with ID {site_id} not found."
        )
    return updated


@router.delete("/{site_id}", status_code=status.HTTP_200_OK)
def delete_heritage_location(
    site_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a heritage site and its cascading records (CRUD: Delete).
    """
    success = crud.delete_heritage_site(db, site_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Heritage site with ID {site_id} not found."
        )
    return {"message": f"Heritage site {site_id} successfully deleted."}
