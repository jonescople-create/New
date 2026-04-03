"""
IslandFruitGuide Backend API
PayPal Payment Gateway Integration + Admin Panel
NOW POWERED BY SUPABASE POSTGRESQL! 🚀
"""
import os
import json
import re
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request, Depends, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
import paypalrestsdk
from dotenv import load_dotenv
import logging

# Supabase Database Client
from supabase_db import db as supabase_db
from ebook_generator import EbookGenerator

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="IslandFruitGuide API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PayPal Configuration
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

if PAYPAL_MODE == "sandbox":
    PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID_SANDBOX")
    PAYPAL_SECRET = os.getenv("PAYPAL_SECRET_SANDBOX")
else:
    PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID_LIVE")
    PAYPAL_SECRET = os.getenv("PAYPAL_SECRET_LIVE")

paypalrestsdk.configure({
    "mode": PAYPAL_MODE,
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_SECRET
})

logger.info(f"PayPal configured in {PAYPAL_MODE} mode")
logger.info(f"Frontend URL: {FRONTEND_URL}")

# Admin Configuration
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")
JWT_SECRET = os.getenv("JWT_SECRET", "default-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()


# ==================== Models ====================

class PayPalOrderRequest(BaseModel):
    product_id: str
    product_name: str
    amount: float
    currency: str = "USD"
    customer_email: Optional[EmailStr] = None


class PayPalCaptureRequest(BaseModel):
    order_id: str


class OrderResponse(BaseModel):
    id: str
    status: str
    links: list


# Admin Models
class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class EbookGenerateRequest(BaseModel):
    """Request model for ebook generation"""
    theme_key: str  # gym-energy, fat-loss, healing-drinks, preworkout
    auto_publish: bool = False


class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class RecipeModel(BaseModel):
    id: str
    title: str
    ingredients: List[str]
    instructions: List[str]
    related_fruit_ids: List[str]
    image_url: str
    slug: str
    prep_time: str
    cook_time: str
    servings: int
    difficulty: str
    description: str


# ==================== Auth Helper Functions ====================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None or email != ADMIN_EMAIL:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ==================== Recipe File Management ====================

RECIPES_FILE_PATH = "/app/frontend/src/data/recipes.ts"
FRUITS_FILE_PATH = "/app/frontend/src/data/fruits.ts"


def read_recipes_from_file() -> List[dict]:
    """
    Read recipes from Supabase PostgreSQL
    (Function name kept for backward compatibility)
    """
    try:
        return supabase_db.get_all_recipes()
    except Exception as e:
        logger.error(f"Error reading recipes from Supabase: {str(e)}")
        return []


def write_recipes_to_file(recipes: List[dict]):
    """Write recipes back to the TypeScript file"""
    try:
        # Read the original file to preserve structure
        with open(RECIPES_FILE_PATH, 'r') as f:
            original_content = f.read()
        
        # Extract the header (interface and const declaration)
        header_match = re.search(r'(.*?export const recipes: Recipe\[\] = )\[', original_content, re.DOTALL)
        if not header_match:
            raise ValueError("Could not find header in file")
        
        header = header_match.group(1)
        
        # Extract the footer (export functions)
        footer_match = re.search(r'\];(.*)$', original_content, re.DOTALL)
        footer = footer_match.group(1) if footer_match else ''
        
        # Format recipes as TypeScript
        recipes_str = "[\n"
        for i, recipe in enumerate(recipes):
            recipes_str += "  {\n"
            recipes_str += f'    id: "{recipe["id"]}",\n'
            recipes_str += f'    title: "{recipe["title"]}",\n'
            recipes_str += f'    ingredients: {json.dumps(recipe["ingredients"])},\n'
            recipes_str += f'    instructions: {json.dumps(recipe["instructions"])},\n'
            recipes_str += f'    related_fruit_ids: {json.dumps(recipe["related_fruit_ids"])},\n'
            
            # Handle image URL with template literal if it uses SUPABASE_STORAGE
            if recipe["image_url"].startswith("http"):
                recipes_str += f'    image_url: "{recipe["image_url"]}",\n'
            else:
                recipes_str += f'    image_url: `${{SUPABASE_STORAGE}}{recipe["image_url"]}`,\n'
            
            recipes_str += f'    slug: "{recipe["slug"]}",\n'
            recipes_str += f'    prep_time: "{recipe["prep_time"]}",\n'
            recipes_str += f'    cook_time: "{recipe["cook_time"]}",\n'
            recipes_str += f'    servings: {recipe["servings"]},\n'
            recipes_str += f'    difficulty: "{recipe["difficulty"]}",\n'
            recipes_str += f'    description: "{recipe["description"]}"\n'
            recipes_str += "  }"
            if i < len(recipes) - 1:
                recipes_str += ","
            recipes_str += "\n"
        recipes_str += "]"
        
        # Combine everything
        new_content = header + recipes_str + ";" + footer
        
        # Write to file
        with open(RECIPES_FILE_PATH, 'w') as f:
            f.write(new_content)
        
        logger.info("Recipes file updated successfully")
    except Exception as e:
        logger.error(f"Error writing recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to write recipes: {str(e)}")


def read_fruits_from_file() -> List[dict]:
    """
    Read fruits from Supabase PostgreSQL
    (Function name kept for backward compatibility)
    """
    try:
        return supabase_db.get_all_fruits()
    except Exception as e:
        logger.error(f"Error reading fruits from Supabase: {str(e)}")
        return []


def write_fruits_to_file(fruits: List[dict]):
    """Write fruits back to the TypeScript file"""
    try:
        # Read the original file to preserve structure
        with open(FRUITS_FILE_PATH, 'r') as f:
            original_content = f.read()
        
        # Extract the header (interfaces and const declaration)
        header_match = re.search(r'(.*?export const fruits: Fruit\[\] = )\[', original_content, re.DOTALL)
        if not header_match:
            raise ValueError("Could not find header in file")
        
        header = header_match.group(1)
        
        # Extract the footer (export functions if any)
        footer_match = re.search(r'\];(.*)$', original_content, re.DOTALL)
        footer = footer_match.group(1) if footer_match else ''
        
        # Format fruits as TypeScript
        fruits_str = "[\n"
        for i, fruit in enumerate(fruits):
            fruits_str += "  {\n"
            fruits_str += f'    id: "{fruit["id"]}",\n'
            fruits_str += f'    name: "{fruit["name"]}",\n'
            fruits_str += f'    scientific_name: "{fruit["scientific_name"]}",\n'
            fruits_str += f'    description: "{fruit["description"]}",\n'
            fruits_str += f'    nutrition: "{fruit["nutrition"]}",\n'
            fruits_str += f'    health_benefits: {json.dumps(fruit["health_benefits"])},\n'
            fruits_str += f'    seasonality: "{fruit["seasonality"]}",\n'
            fruits_str += f'    origin: "{fruit["origin"]}",\n'
            
            # Handle image URL
            if fruit["image_url"].startswith("http"):
                fruits_str += f'    image_url: "{fruit["image_url"]}",\n'
            else:
                fruits_str += f'    image_url: `${{SUPABASE_STORAGE}}{fruit["image_url"]}`,\n'
            
            fruits_str += f'    slug: "{fruit["slug"]}",\n'
            fruits_str += f'    category: {json.dumps(fruit["category"])},\n'
            fruits_str += f'    how_to_eat: "{fruit["how_to_eat"]}",\n'
            fruits_str += f'    storage: "{fruit["storage"]}",\n'
            fruits_str += f'    color: "{fruit["color"]}",\n'
            fruits_str += f'    emoji: "{fruit["emoji"]}",\n'
            fruits_str += f'    related_fruit_ids: {json.dumps(fruit["related_fruit_ids"])},\n'
            fruits_str += f'    views: {fruit["views"]}'
            
            # Handle optional leaf_medicine
            if "leaf_medicine" in fruit and fruit["leaf_medicine"]:
                fruits_str += ',\n    leaf_medicine: ' + json.dumps(fruit["leaf_medicine"])
            
            fruits_str += "\n  }"
            if i < len(fruits) - 1:
                fruits_str += ","
            fruits_str += "\n"
        fruits_str += "]"
        
        # Combine everything
        new_content = header + fruits_str + ";" + footer
        
        # Write to file
        with open(FRUITS_FILE_PATH, 'w') as f:
            f.write(new_content)
        
        logger.info("Fruits file updated successfully")
    except Exception as e:
        logger.error(f"Error writing fruits: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to write fruits: {str(e)}")


# ==================== Admin Authentication Routes ====================

@app.post("/api/admin/login", response_model=AdminLoginResponse)
async def admin_login(login_request: AdminLoginRequest):
    """
    Admin login endpoint - returns JWT token
    """
    try:
        # Verify credentials
        if login_request.email != ADMIN_EMAIL:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not verify_password(login_request.password, ADMIN_PASSWORD_HASH):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Create access token
        access_token = create_access_token({"sub": login_request.email})
        
        logger.info(f"Admin login successful: {login_request.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": JWT_EXPIRATION_HOURS * 3600
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")


@app.get("/api/admin/verify")
async def verify_admin(payload: dict = Depends(verify_token)):
    """
    Verify admin token
    """
    return {"status": "valid", "email": payload.get("sub")}


# ==================== Admin Recipe Management Routes ====================

@app.get("/api/admin/recipes")
async def get_all_recipes(payload: dict = Depends(verify_token)):
    """
    Get all recipes (admin only)
    """
    try:
        recipes = read_recipes_from_file()
        return {"recipes": recipes, "count": len(recipes)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/admin/recipes/{recipe_id}")
async def get_recipe_by_id(recipe_id: str, payload: dict = Depends(verify_token)):
    """
    Get a single recipe by ID (admin only)
    """
    try:
        recipes = read_recipes_from_file()
        recipe = next((r for r in recipes if r["id"] == recipe_id), None)
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/admin/recipes")
async def create_recipe(recipe: RecipeModel, payload: dict = Depends(verify_token)):
    """Create a new recipe (admin only) - Supabase handles uniqueness"""
    try:
        new_recipe = supabase_db.create_recipe(recipe.dict())
        if not new_recipe:
            raise HTTPException(status_code=400, detail="Failed to create recipe (duplicate ID or slug?)")
        logger.info(f"Recipe created in Supabase: {recipe.id}")
        return {"status": "success", "recipe": new_recipe}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating recipe: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/admin/recipes/{recipe_id}")
async def update_recipe(recipe_id: str, recipe: RecipeModel, payload: dict = Depends(verify_token)):
    """Update an existing recipe (admin only)"""
    try:
        updated_recipe = supabase_db.update_recipe(recipe_id, recipe.dict())
        if not updated_recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        logger.info(f"Recipe updated in Supabase: {recipe_id}")
        return {"status": "success", "recipe": updated_recipe}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating recipe: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/admin/recipes/{recipe_id}")
async def delete_recipe(recipe_id: str, payload: dict = Depends(verify_token)):
    """Delete a recipe (admin only)"""
    try:
        success = supabase_db.delete_recipe(recipe_id)
        if not success:
            raise HTTPException(status_code=404, detail="Recipe not found")
        logger.info(f"Recipe deleted from Supabase: {recipe_id}")
        return {"status": "success", "message": "Recipe deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting recipe: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/admin/upload-image")
async def upload_recipe_image(
    file: UploadFile = File(...),
    payload: dict = Depends(verify_token)
):
    """
    Upload a recipe image (admin only)
    Stores in /app/frontend/public/recipe-images/ directory
    Returns the relative URL path
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Validate file size (max 5MB)
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size must be less than 5MB")
        
        # Generate safe filename
        import hashlib
        import time
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        timestamp = int(time.time())
        file_hash = hashlib.md5(contents).hexdigest()[:8]
        safe_filename = f"recipe-{timestamp}-{file_hash}.{file_ext}"
        
        # Create directory if it doesn't exist
        upload_dir = "/app/frontend/public/recipe-images"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_dir, safe_filename)
        with open(file_path, 'wb') as f:
            f.write(contents)
        
        # Return relative URL
        image_url = f"/recipe-images/{safe_filename}"
        
        logger.info(f"Image uploaded: {safe_filename}")
        return {
            "status": "success",
            "image_url": image_url,
            "filename": safe_filename
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


# ==================== Public Recipe Endpoints ====================

@app.get("/api/recipes")
async def get_all_recipes_public():
    """Get all recipes (public endpoint)"""
    try:
        recipes = supabase_db.get_all_recipes()
        return recipes
    except Exception as e:
        logger.error(f"Error getting recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recipes/{slug}")
async def get_recipe_by_slug(slug: str):
    """Get recipe by slug (public endpoint)"""
    try:
        recipes = supabase_db.get_all_recipes()
        recipe = next((r for r in recipes if r.get('slug') == slug), None)
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting recipe: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Public Bundle Endpoints ====================

@app.get("/api/bundles")
async def get_all_bundles_public():
    """Get all active bundles"""
    try:
        response = supabase_db._request('GET', 'bundles?status=eq.active&select=*')
        return response.json() if response.status_code == 200 else []
    except Exception as e:
        logger.error(f"Error getting bundles: {str(e)}")
        return []

@app.get("/api/bundles/{bundle_id}")
async def get_bundle_by_id_public(bundle_id: str):
    """Get bundle with products"""
    try:
        bundle_res = supabase_db._request('GET', f'bundles?bundle_id=eq.{bundle_id}')
        if bundle_res.status_code != 200 or not bundle_res.json():
            raise HTTPException(status_code=404, detail="Bundle not found")
        bundle = bundle_res.json()[0]
        
        products_res = supabase_db._request('GET', f'bundle_products?bundle_id=eq.{bundle_id}&select=*')
        if products_res.status_code == 200:
            bundle_products = products_res.json()
            product_ids = [bp['product_id'] for bp in bundle_products]
            products = []
            for pid in product_ids:
                prod_res = supabase_db._request('GET', f'products?id=eq.{pid}', headers={'Prefer': 'return=representation'})
                if prod_res.status_code == 200 and prod_res.json():
                    products.append(prod_res.json()[0])
            bundle['products'] = products
        return bundle
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting bundle: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Admin Bundle Endpoints ====================

@app.get("/api/admin/bundles")
async def get_all_bundles_admin(payload: dict = Depends(verify_token)):
    """Get all bundles (admin)"""
    try:
        response = supabase_db._request('GET', 'bundles?select=*&order=created_at.desc')
        if response.status_code == 200:
            bundles = response.json()
            for bundle in bundles:
                prod_res = supabase_db._request('GET', f'bundle_products?bundle_id=eq.{bundle["bundle_id"]}&select=*')
                if prod_res.status_code == 200:
                    bundle['product_count'] = len(prod_res.json())
            return bundles
        return []
    except Exception as e:
        logger.error(f"Error getting bundles: {str(e)}") 
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/bundles")
async def create_bundle(bundle_data: dict, payload: dict = Depends(verify_token)):
    """Create bundle"""
    from uuid import uuid4
    try:
        bundle_id = str(uuid4())
        product_ids = bundle_data.pop('product_ids', [])
        bundle = {
            'bundle_id': bundle_id,
            'title': bundle_data['title'],
            'slug': bundle_data['slug'],
            'description': bundle_data.get('description', ''),
            'price': bundle_data['price'],
            'discount_percentage': bundle_data.get('discount_percentage', 0),
            'image_url': bundle_data.get('image_url', ''),
            'status': bundle_data.get('status', 'active'),
            'created_at': datetime.utcnow().isoformat()
        }
        response = supabase_db._request('POST', 'bundles', json=bundle, prefer='return=representation')
        if response.status_code not in [200, 201]:
            raise Exception(f"Failed: {response.text}")
        for product_id in product_ids:
            supabase_db._request('POST', 'bundle_products', json={'bundle_id': bundle_id, 'product_id': product_id})
        return response.json()[0]
    except Exception as e:
        logger.error(f"Error creating bundle: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Enhanced Ebook Endpoints ====================

@app.get("/api/admin/ebooks/{ebook_id}/recipes")
async def get_ebook_recipes(ebook_id: str, payload: dict = Depends(verify_token)):
    """Get recipes in ebook"""
    try:
        links_res = supabase_db._request('GET', f'ebook_recipes?ebook_id=eq.{ebook_id}&select=recipe_id')
        if links_res.status_code != 200:
            return []
        recipe_ids = [link['recipe_id'] for link in links_res.json()]
        all_recipes = supabase_db.get_all_recipes()
        return [r for r in all_recipes if r['id'] in recipe_ids]
    except Exception as e:
        logger.error(f"Error getting ebook recipes: {str(e)}")
        return []

@app.patch("/api/admin/ebooks/{ebook_id}")
async def update_ebook(ebook_id: str, ebook_data: dict, payload: dict = Depends(verify_token)):
    """Update ebook"""
    try:
        response = supabase_db._request('PATCH', f'ebooks?ebook_id=eq.{ebook_id}', json=ebook_data, prefer='return=representation')
        if response.status_code == 200:
            if 'title' in ebook_data or 'cover_image_url' in ebook_data:
                products = supabase_db.get_all_products()
                ebook = response.json()[0]
                product = next((p for p in products if ebook['slug'] in p.get('slug', '')), None)
                if product:
                    update_data = {}
                    if 'title' in ebook_data:
                        update_data['title'] = ebook_data['title']
                    if 'cover_image_url' in ebook_data:
                        update_data['cover_image'] = ebook_data['cover_image_url']
                    if update_data:
                        supabase_db._request('PATCH', f'products?id=eq.{product["id"]}', json=update_data, prefer='return=representation')
            return response.json()[0]
        raise Exception(f"Failed: {response.text}")
    except Exception as e:
        logger.error(f"Error updating ebook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Admin Fruit Management Routes ====================

@app.get("/api/admin/fruits")
async def get_all_fruits(payload: dict = Depends(verify_token)):
    """
    Get all fruits (admin only)
    """
    try:
        fruits = read_fruits_from_file()
        return {"fruits": fruits, "count": len(fruits)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/admin/fruits/{fruit_id}")
async def get_fruit_by_id(fruit_id: str, payload: dict = Depends(verify_token)):
    """
    Get a single fruit by ID (admin only)
    """
    try:
        fruits = read_fruits_from_file()
        fruit = next((f for f in fruits if f["id"] == fruit_id), None)
        if not fruit:
            raise HTTPException(status_code=404, detail="Fruit not found")
        return fruit
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/admin/fruits")
async def create_fruit(fruit: dict, payload: dict = Depends(verify_token)):
    """
    Create a new fruit (admin only) - Supabase will handle uniqueness constraints
    """
    try:
        # Create in Supabase
        new_fruit = supabase_db.create_fruit(fruit)
        
        if not new_fruit:
            raise HTTPException(status_code=400, detail="Failed to create fruit (duplicate ID or slug?)")
        
        logger.info(f"Fruit created in Supabase: {fruit['id']}")
        return {"status": "success", "fruit": new_fruit}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating fruit: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/admin/fruits/{fruit_id}")
async def update_fruit(fruit_id: str, fruit: dict, payload: dict = Depends(verify_token)):
    """
    Update an existing fruit (admin only)
    """
    try:
        # Update directly in Supabase
        updated_fruit = supabase_db.update_fruit(fruit_id, fruit)
        
        if not updated_fruit:
            raise HTTPException(status_code=404, detail="Fruit not found")
        
        logger.info(f"Fruit updated in Supabase: {fruit_id}")
        return {"status": "success", "fruit": updated_fruit}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating fruit: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/admin/fruits/{fruit_id}")
async def delete_fruit(fruit_id: str, payload: dict = Depends(verify_token)):
    """
    Delete a fruit (admin only)
    """
    try:
        # Delete from Supabase
        success = supabase_db.delete_fruit(fruit_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Fruit not found")
        
        logger.info(f"Fruit deleted from Supabase: {fruit_id}")
        return {"status": "success", "message": "Fruit deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting fruit: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Store & Products Routes (Store System) ====================

PRODUCTS_FILE_PATH = "/app/frontend/src/data/products.ts"

def read_products_from_file() -> List[dict]:
    """
    Read products from Supabase PostgreSQL
    (Function name kept for backward compatibility)
    """
    try:
        return supabase_db.get_all_products()
    except Exception as e:
        logger.error(f"Error reading products from Supabase: {str(e)}")
        return []

def write_products_to_file(products: List[dict]):
    """Write products back to TypeScript file"""
    try:
        with open(PRODUCTS_FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract header
        header_match = re.search(r'(.*?export const products: Product\[\] = \[)', content, re.DOTALL)
        if not header_match:
            raise Exception("Could not find products array in file")
        
        header = header_match.group(1)
        
        # Extract footer
        footer_match = re.search(r'\];(.*)$', content, re.DOTALL)
        footer = footer_match.group(1) if footer_match else '\n'
        
        # Convert products to TypeScript format
        ts_objects = []
        for product in products:
            ts_obj = "  {\n"
            ts_obj += f'    id: "{product["id"]}",\n'
            ts_obj += f'    title: "{product["title"]}",\n'
            ts_obj += f'    slug: "{product["slug"]}",\n'
            ts_obj += f'    category: "{product["category"]}",\n'
            ts_obj += f'    price: {product["price"]},\n'
            ts_obj += f'    short_description: {json.dumps(product["short_description"])},\n'
            ts_obj += f'    long_description: {json.dumps(product["long_description"])},\n'
            ts_obj += f'    cover_image: "{product["cover_image"]}",\n'
            ts_obj += f'    table_of_contents: {json.dumps(product["table_of_contents"])},\n'
            ts_obj += f'    features: {json.dumps(product["features"])},\n'
            ts_obj += f'    page_count: {product["page_count"]},\n'
            ts_obj += f'    file_format: "{product["file_format"]}",\n'
            ts_obj += f'    file_size: "{product["file_size"]}",\n'
            ts_obj += f'    download_url: "{product["download_url"]}",\n'
            ts_obj += f'    related_fruits: {json.dumps(product["related_fruits"])},\n'
            ts_obj += f'    seo_title: "{product["seo_title"]}",\n'
            ts_obj += f'    seo_description: "{product["seo_description"]}",\n'
            ts_obj += f'    is_featured: {str(product["is_featured"]).lower()},\n'
            ts_obj += f'    created_at: "{product["created_at"]}"\n'
            ts_obj += "  }"
            ts_objects.append(ts_obj)
        
        new_content = header + "\n" + ",\n".join(ts_objects) + "\n];" + footer
        
        with open(PRODUCTS_FILE_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
    except Exception as e:
        logger.error(f"Error writing products: {str(e)}")
        raise

@app.get("/api/products")
async def get_all_products():
    """Get all store products (public endpoint)"""
    try:
        products = read_products_from_file()
        return products
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products/category/{category}")
async def get_products_by_category(category: str):
    """Get products by category (public endpoint)"""
    try:
        products = read_products_from_file()
        filtered = [p for p in products if p.get("category") == category]
        return filtered
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products/{slug}")
async def get_product_by_slug(slug: str):
    """Get a single product by slug (public endpoint)"""
    try:
        products = read_products_from_file()
        product = next((p for p in products if p.get("slug") == slug), None)
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Admin product management endpoints
@app.get("/api/admin/products")
async def admin_get_all_products(payload: dict = Depends(verify_token)):
    """Get all products (admin only)"""
    try:
        products = read_products_from_file()
        return products
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/products/{product_id}")
async def admin_get_product(product_id: str, payload: dict = Depends(verify_token)):
    """Get a single product by ID (admin only)"""
    try:
        products = read_products_from_file()
        product = next((p for p in products if p.get("id") == product_id), None)
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/products")
async def admin_create_product(product: dict, payload: dict = Depends(verify_token)):
    """Create a new product (admin only) - Supabase handles uniqueness"""
    try:
        new_product = supabase_db.create_product(product)
        if not new_product:
            raise HTTPException(status_code=400, detail="Failed to create product (duplicate ID or slug?)")
        logger.info(f"Product created in Supabase: {product.get('id')}")
        return {"status": "success", "product": new_product}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/products/{product_id}")
async def admin_update_product(product_id: str, product: dict, payload: dict = Depends(verify_token)):
    """Update an existing product (admin only)"""
    try:
        updated_product = supabase_db.update_product(product_id, product)
        if not updated_product:
            raise HTTPException(status_code=404, detail="Product not found")
        logger.info(f"Product updated in Supabase: {product_id}")
        return {"status": "success", "product": updated_product}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/products/{product_id}")
async def admin_delete_product(product_id: str, payload: dict = Depends(verify_token)):
    """Delete a product (admin only)"""
    try:
        success = supabase_db.delete_product(product_id)
        if not success:
            raise HTTPException(status_code=404, detail="Product not found")
        logger.info(f"Product deleted from Supabase: {product_id}")
        return {"status": "success", "message": "Product deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Note: Duplicate admin_delete_product removed (was dead code)


# ==================== Medicinal Leaves Admin Routes (Priority 3) ====================

LEAVES_FILE_PATH = "/app/frontend/src/data/medicinalLeaves.ts"

def read_leaves_from_file() -> List[dict]:
    """
    Read medicinal leaves from Supabase PostgreSQL
    (Function name kept for backward compatibility)
    """
    try:
        return supabase_db.get_all_leaves()
    except Exception as e:
        logger.error(f"Error reading leaves from Supabase: {str(e)}")
        return []

def write_leaves_to_file(leaves: list):
    """Write medicinal leaves back to TypeScript file"""
    file_path = "/app/frontend/src/data/medicinalLeaves.ts"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the header (everything before the array opening bracket)
    start_marker = 'export const medicinalLeaves: MedicinalLeaf[] = ['
    start_idx = content.find(start_marker)
    if start_idx == -1:
        raise Exception("Could not find medicinalLeaves array in file")
    
    header = content[:start_idx + len(start_marker)]
    
    # Find the end of the array using bracket counting
    rest = content[start_idx + len(start_marker):]
    bracket_count = 1
    end_idx = 0
    for i, char in enumerate(rest):
        if char == '[':
            bracket_count += 1
        elif char == ']':
            bracket_count -= 1
            if bracket_count == 0:
                end_idx = i
                break
    
    if end_idx == 0:
        raise Exception("Could not find end of medicinalLeaves array")
    
    # Footer is everything after the closing ];
    footer = rest[end_idx + 1:]  # Skip the ] and get rest including ;
    if footer.startswith(';'):
        footer = footer[1:]  # Skip the semicolon since we'll add it
    
    # Convert leaves to TypeScript format
    ts_objects = []
    for leaf in leaves:
        ts_obj = "  {\n"
        ts_obj += f'    leaf_id: "{leaf["leaf_id"]}",\n'
        ts_obj += f'    common_name: "{leaf["common_name"]}",\n'
        ts_obj += f'    local_names: {json.dumps(leaf["local_names"])},\n'
        ts_obj += f'    scientific_name: "{leaf["scientific_name"]}",\n'
        ts_obj += f'    plant_part_used: "{leaf["plant_part_used"]}",\n'
        ts_obj += f'    traditional_uses: {json.dumps(leaf["traditional_uses"])},\n'
        ts_obj += f'    preparation_methods: {json.dumps(leaf["preparation_methods"])},\n'
        ts_obj += f'    flavor_profile: "{leaf["flavor_profile"]}",\n'
        ts_obj += f'    contraindications: {json.dumps(leaf["contraindications"])},\n'
        ts_obj += f'    pregnancy_warning: {str(leaf["pregnancy_warning"]).lower()},\n'
        ts_obj += f'    interaction_flags: {json.dumps(leaf["interaction_flags"])},\n'
        ts_obj += f'    image_id: {json.dumps(leaf.get("image_id"))},\n'
        ts_obj += f'    source_notes: "{leaf["source_notes"]}",\n'
        ts_obj += f'    slug: "{leaf["slug"]}",\n'
        ts_obj += f'    fruit_id: "{leaf["fruit_id"]}",\n'
        ts_obj += f'    seo_title: "{leaf["seo_title"]}",\n'
        ts_obj += f'    seo_description: "{leaf["seo_description"]}",\n'
        ts_obj += f'    disclaimer: "{leaf["disclaimer"]}"\n'
        ts_obj += "  }"
        ts_objects.append(ts_obj)
    
    # Reconstruct the file
    new_content = header + "\n" + ",\n".join(ts_objects) + "\n];" + footer
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

@app.get("/api/admin/leaves")
async def get_all_leaves(payload: dict = Depends(verify_token)):
    """
    Get all medicinal leaves (admin only)
    """
    try:
        leaves = read_leaves_from_file()
        return leaves
    except Exception as e:
        logger.error(f"Error fetching leaves: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/leaves/{leaf_id}")
async def get_leaf(leaf_id: str, payload: dict = Depends(verify_token)):
    """
    Get a single medicinal leaf by ID (admin only)
    """
    try:
        leaves = read_leaves_from_file()
        leaf = next((l for l in leaves if l["leaf_id"] == leaf_id), None)
        
        if not leaf:
            raise HTTPException(status_code=404, detail="Leaf not found")
        
        return leaf
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching leaf: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/leaves")
async def create_leaf(leaf: dict, payload: dict = Depends(verify_token)):
    """Create a new medicinal leaf (admin only) - Supabase handles uniqueness"""
    try:
        new_leaf = supabase_db.create_leaf(leaf)
        if not new_leaf:
            raise HTTPException(status_code=400, detail="Failed to create leaf (duplicate ID or slug?)")
        logger.info(f"Leaf created in Supabase: {leaf['leaf_id']}")
        return {"status": "success", "leaf": new_leaf}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating leaf: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/leaves/{leaf_id}")
async def update_leaf(leaf_id: str, leaf: dict, payload: dict = Depends(verify_token)):
    """Update an existing medicinal leaf (admin only)"""
    try:
        updated_leaf = supabase_db.update_leaf(leaf_id, leaf)
        if not updated_leaf:
            raise HTTPException(status_code=404, detail="Leaf not found")
        logger.info(f"Leaf updated in Supabase: {leaf_id}")
        return {"status": "success", "leaf": updated_leaf}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating leaf: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/leaves/{leaf_id}")
async def delete_leaf(leaf_id: str, payload: dict = Depends(verify_token)):
    """Delete a medicinal leaf (admin only)"""
    try:
        success = supabase_db.delete_leaf(leaf_id)
        if not success:
            raise HTTPException(status_code=404, detail="Leaf not found")
        logger.info(f"Leaf deleted from Supabase: {leaf_id}")
        return {"status": "success", "message": "Leaf deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting leaf: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SEO Sitemap Routes (Phase 7B) ====================

@app.get("/api/seo/generate-sitemaps")
async def generate_sitemaps(payload: dict = Depends(verify_token)):
    """
    Generate all sitemaps (admin only - Phase 7B)
    Returns sitemap data for download
    """
    try:
        from datetime import datetime
        
        # Get all data
        fruits_data = read_fruits_from_file()
        recipes_data = read_recipes_from_file()
        products_data = read_products_from_file()
        
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        # Generate main sitemap
        main_sitemap = generate_main_sitemap_xml(current_date)
        
        # Generate fruits sitemap
        fruits_sitemap = generate_fruits_sitemap_xml(fruits_data, current_date)
        
        # Generate recipes sitemap
        recipes_sitemap = generate_recipes_sitemap_xml(recipes_data, current_date)
        
        # Generate products sitemap
        products_sitemap = generate_products_sitemap_xml(products_data, current_date)
        
        # Generate image sitemap
        images_sitemap = generate_images_sitemap_xml(fruits_data, recipes_data, current_date)
        
        # Generate sitemap index
        sitemap_index = generate_sitemap_index_xml(current_date)
        
        return {
            "status": "success",
            "sitemaps": {
                "sitemap.xml": sitemap_index,
                "sitemap-main.xml": main_sitemap,
                "sitemap-fruits.xml": fruits_sitemap,
                "sitemap-recipes.xml": recipes_sitemap,
                "sitemap-products.xml": products_sitemap,
                "sitemap-images.xml": images_sitemap
            },
            "message": "Sitemaps generated successfully"
        }
    except Exception as e:
        logger.error(f"Error generating sitemaps: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def generate_main_sitemap_xml(current_date: str) -> str:
    """Generate main sitemap XML"""
    urls = [
        ('https://www.islandfruitguide.com/', current_date, 'daily', '1.0'),
        ('https://www.islandfruitguide.com/fruits', current_date, 'daily', '0.9'),
        ('https://www.islandfruitguide.com/recipes', current_date, 'daily', '0.9'),
        ('https://www.islandfruitguide.com/store', current_date, 'daily', '0.9'),
        ('https://www.islandfruitguide.com/tools', current_date, 'weekly', '0.8'),
        ('https://www.islandfruitguide.com/tools/fruit-recommender', current_date, 'weekly', '0.8'),
        ('https://www.islandfruitguide.com/tools/recipe-builder', current_date, 'weekly', '0.8'),
        ('https://www.islandfruitguide.com/tools/medicinal-advisor', current_date, 'weekly', '0.8'),
        ('https://www.islandfruitguide.com/medicinal-leaves', current_date, 'weekly', '0.8'),
        ('https://www.islandfruitguide.com/seasonal-fruits', current_date, 'weekly', '0.7'),
        ('https://www.islandfruitguide.com/about', current_date, 'monthly', '0.5'),
        ('https://www.islandfruitguide.com/contact', current_date, 'monthly', '0.5'),
        ('https://www.islandfruitguide.com/editorial-policy', current_date, 'monthly', '0.4'),
    ]
    
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for loc, lastmod, changefreq, priority in urls:
        xml += '  <url>\n'
        xml += f'    <loc>{loc}</loc>\n'
        xml += f'    <lastmod>{lastmod}</lastmod>\n'
        xml += f'    <changefreq>{changefreq}</changefreq>\n'
        xml += f'    <priority>{priority}</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    return xml


def generate_fruits_sitemap_xml(fruits_data: list, current_date: str) -> str:
    """Generate fruits sitemap XML"""
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for fruit in fruits_data:
        xml += '  <url>\n'
        xml += f'    <loc>https://www.islandfruitguide.com/fruits/{fruit["slug"]}</loc>\n'
        xml += f'    <lastmod>{current_date}</lastmod>\n'
        xml += '    <changefreq>weekly</changefreq>\n'
        xml += '    <priority>0.8</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    return xml


def generate_recipes_sitemap_xml(recipes_data: list, current_date: str) -> str:
    """Generate recipes sitemap XML"""
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for recipe in recipes_data:
        xml += '  <url>\n'
        xml += f'    <loc>https://www.islandfruitguide.com/recipes/{recipe["slug"]}</loc>\n'
        xml += f'    <lastmod>{current_date}</lastmod>\n'
        xml += '    <changefreq>weekly</changefreq>\n'
        xml += '    <priority>0.7</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    return xml


def generate_products_sitemap_xml(products_data: list, current_date: str) -> str:
    """Generate store products sitemap XML"""
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for product in products_data:
        category_plural = product["category"] + 's' if product["category"] != 'ebook' else 'ebooks'
        xml += '  <url>\n'
        xml += f'    <loc>https://www.islandfruitguide.com/store/{category_plural}/{product["slug"]}</loc>\n'
        xml += f'    <lastmod>{current_date}</lastmod>\n'
        xml += '    <changefreq>weekly</changefreq>\n'
        xml += '    <priority>0.8</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    return xml


def generate_images_sitemap_xml(fruits_data: list, recipes_data: list, current_date: str) -> str:
    """Generate images sitemap XML"""
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
    
    # Fruit images
    for fruit in fruits_data:
        image_url = fruit["image_url"] if fruit["image_url"].startswith('http') else f'https://www.islandfruitguide.com{fruit["image_url"]}'
        xml += '  <url>\n'
        xml += f'    <loc>https://www.islandfruitguide.com/fruits/{fruit["slug"]}</loc>\n'
        xml += '    <image:image>\n'
        xml += f'      <image:loc>{escape_xml(image_url)}</image:loc>\n'
        xml += f'      <image:title>{escape_xml(fruit["name"] + " - " + fruit["scientific_name"])}</image:title>\n'
        xml += f'      <image:caption>{escape_xml(fruit["description"][:150])}</image:caption>\n'
        xml += '    </image:image>\n'
        xml += '  </url>\n'
    
    # Recipe images
    for recipe in recipes_data:
        image_url = recipe["image_url"] if recipe["image_url"].startswith('http') else f'https://www.islandfruitguide.com{recipe["image_url"]}'
        xml += '  <url>\n'
        xml += f'    <loc>https://www.islandfruitguide.com/recipes/{recipe["slug"]}</loc>\n'
        xml += '    <image:image>\n'
        xml += f'      <image:loc>{escape_xml(image_url)}</image:loc>\n'
        xml += f'      <image:title>{escape_xml(recipe["title"])}</image:title>\n'
        xml += f'      <image:caption>{escape_xml(recipe["description"][:150])}</image:caption>\n'
        xml += '    </image:image>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    return xml


def generate_sitemap_index_xml(current_date: str) -> str:
    """Generate sitemap index XML"""
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    sitemaps = [
        'sitemap-main.xml',
        'sitemap-fruits.xml',
        'sitemap-recipes.xml',
        'sitemap-images.xml'
    ]
    
    for sitemap in sitemaps:
        xml += '  <sitemap>\n'
        xml += f'    <loc>https://www.islandfruitguide.com/{sitemap}</loc>\n'
        xml += f'    <lastmod>{current_date}</lastmod>\n'
        xml += '  </sitemap>\n'
    
    xml += '</sitemapindex>'
    return xml


def escape_xml(text: str) -> str:
    """Escape XML special characters"""
    return (text
        .replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replace('"', '&quot;')
        .replace("'", '&apos;'))



# ==================== PayPal Routes ====================

@app.post("/api/paypal/create-order", response_model=OrderResponse)
async def create_paypal_order(order_request: PayPalOrderRequest):
    """
    Create a PayPal order for checkout
    """
    try:
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": f"{FRONTEND_URL}/checkout/success",
                "cancel_url": f"{FRONTEND_URL}/checkout/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": order_request.product_name,
                        "sku": order_request.product_id,
                        "price": f"{order_request.amount:.2f}",
                        "currency": order_request.currency,
                        "quantity": 1
                    }]
                },
                "amount": {
                    "total": f"{order_request.amount:.2f}",
                    "currency": order_request.currency
                },
                "description": f"Purchase of {order_request.product_name}"
            }]
        })

        if payment.create():
            logger.info(f"Payment created successfully: {payment.id}")
            
            # Extract approval URL
            approval_url = None
            for link in payment.links:
                if link.rel == "approval_url":
                    approval_url = link.href
                    break
            
            return {
                "id": payment.id,
                "status": payment.state,
                "links": [{"rel": link.rel, "href": link.href, "method": link.method} for link in payment.links]
            }
        else:
            logger.error(f"Payment creation failed: {payment.error}")
            raise HTTPException(status_code=400, detail=payment.error)
            
    except Exception as e:
        logger.error(f"Error creating PayPal order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@app.post("/api/paypal/capture-order")
async def capture_paypal_order(capture_request: PayPalCaptureRequest):
    """
    Capture/Execute a PayPal payment after approval
    """
    try:
        payment = paypalrestsdk.Payment.find(capture_request.order_id)
        
        if payment.execute({"payer_id": capture_request.order_id}):
            logger.info(f"Payment executed successfully: {payment.id}")
            return {
                "id": payment.id,
                "state": payment.state,
                "payer": payment.payer,
                "transactions": payment.transactions
            }
        else:
            logger.error(f"Payment execution failed: {payment.error}")
            raise HTTPException(status_code=400, detail=payment.error)
            
    except Exception as e:
        logger.error(f"Error capturing PayPal order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to capture order: {str(e)}")


@app.get("/api/paypal/order/{order_id}")
async def get_order_details(order_id: str):
    """
    Get PayPal order details
    """
    try:
        payment = paypalrestsdk.Payment.find(order_id)
        return {
            "id": payment.id,
            "state": payment.state,
            "create_time": payment.create_time,
            "update_time": payment.update_time,
            "payer": payment.payer,
            "transactions": payment.transactions
        }
    except Exception as e:
        logger.error(f"Error fetching order details: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Order not found: {str(e)}")


@app.post("/api/paypal/webhook")
async def paypal_webhook(request: Request):
    """
    Handle PayPal webhook events for payment notifications
    """
    try:
        body = await request.json()
        event_type = body.get("event_type")
        
        logger.info(f"Received PayPal webhook: {event_type}")
        
        if event_type == "PAYMENT.SALE.COMPLETED":
            # Handle successful payment
            sale_id = body.get("resource", {}).get("id")
            logger.info(f"Payment completed: {sale_id}")
            # Here you can update your database, send confirmation emails, etc.
            
        elif event_type == "PAYMENT.SALE.REFUNDED":
            # Handle refund
            refund_id = body.get("resource", {}).get("id")
            logger.info(f"Payment refunded: {refund_id}")
            
        return {"status": "success", "message": "Webhook processed"}
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        return {"status": "error", "message": str(e)}


# ==================== Ebook Generation API ====================

@app.get("/api/ebooks")
async def get_ebooks():
    """Get all published ebooks"""
    try:
        ebooks = supabase_db.get_all_ebooks()
        # Filter to published only for public API
        published = [e for e in ebooks if e.get('status') == 'published']
        return published
    except Exception as e:
        logger.error(f"Error fetching ebooks: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/admin/ebooks")
async def admin_get_ebooks(payload: dict = Depends(verify_token)):
    """Get all ebooks (admin only)"""
    try:
        return supabase_db.get_all_ebooks()
    except Exception as e:
        logger.error(f"Error fetching ebooks: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/admin/ebooks/generate")
async def generate_ebook(request: EbookGenerateRequest, payload: dict = Depends(verify_token)):
    """
    Generate a complete ebook with recipes (admin only)
    This creates the ebook, generates all recipes, and stores them in Supabase
    """
    try:
        # Initialize ebook generator
        generator = EbookGenerator(supabase_db)
        
        # Validate theme
        if request.theme_key not in generator.EBOOK_THEMES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid theme. Choose from: {list(generator.EBOOK_THEMES.keys())}"
            )
        
        logger.info(f"Generating ebook for theme: {request.theme_key}")
        
        # Generate ebook content
        ebook_data = generator.generate_ebook_content(request.theme_key)
        
        # Extract recipes from ebook
        recipes = ebook_data.pop('recipes')
        
        # Set status
        ebook_data['status'] = 'published' if request.auto_publish else 'draft'
        ebook_data['generated_at'] = datetime.now().isoformat()
        
        # Create ebook in Supabase
        created_ebook = supabase_db.create_ebook(ebook_data)
        
        if not created_ebook:
            raise HTTPException(status_code=500, detail="Failed to create ebook in database")
        
        ebook_id = created_ebook['ebook_id']
        
        # Create all recipes in Supabase
        created_recipes = []
        for recipe in recipes:
            try:
                # Remove fields that don't exist in recipes table
                recipe_clean = {k: v for k, v in recipe.items() if k not in ['health_benefits', 'best_time']}
                
                created_recipe = supabase_db.create_recipe(recipe_clean)
                if created_recipe:
                    created_recipes.append(created_recipe)
                    
                    # Link recipe to ebook
                    link_data = {
                        'ebook_id': ebook_id,
                        'recipe_id': created_recipe['id'],
                        'order_index': len(created_recipes)
                    }
                    # Would need to add ebook_recipes linking method
                    
            except Exception as e:
                logger.warning(f"Failed to create recipe: {recipe['title']} - {str(e)}")
                continue
        
        # Automatically create a store product for this ebook
        if request.auto_publish:
            product_data = {
                'id': f'product-{ebook_id}',
                'title': ebook_data['title'],
                'slug': ebook_data['slug'],
                'category': 'ebook',
                'price': ebook_data['price'],
                'short_description': ebook_data['subtitle'],
                'long_description': ebook_data['description'],
                'cover_image': ebook_data.get('cover_image_url', ''),
                'page_count': ebook_data['page_count'],
                'file_format': 'PDF',
                'seo_title': f"{ebook_data['title']} - {ebook_data['subtitle']}",
                'seo_description': ebook_data['description'][:160],
                'is_featured': True
            }
            
            try:
                created_product = supabase_db.create_product(product_data)
                logger.info(f"✅ Auto-created store product: {created_product.get('id')}")
            except Exception as e:
                logger.warning(f"Failed to auto-create product: {str(e)}")
        
        logger.info(f"✅ Ebook generated successfully: {ebook_data['title']}")
        logger.info(f"   - Created {len(created_recipes)} recipes")
        
        return {
            'status': 'success',
            'ebook': created_ebook,
            'recipes_created': len(created_recipes),
            'message': f"Successfully generated '{ebook_data['title']}' with {len(created_recipes)} recipes"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating ebook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/ebooks/{slug}")
async def get_ebook_by_slug(slug: str):
    """Get a specific ebook by slug"""
    try:
        # Would need to implement get_ebook_by_slug in supabase_db
        ebooks = supabase_db.get_all_ebooks()
        ebook = next((e for e in ebooks if e.get('slug') == slug), None)
        
        if not ebook:
            raise HTTPException(status_code=404, detail="Ebook not found")
        
        # Only show published ebooks to public
        if ebook.get('status') != 'published':
            raise HTTPException(status_code=404, detail="Ebook not found")
        
        return ebook
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching ebook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Game Leaderboard API ====================

class LeaderboardEntry(BaseModel):
    player_name: str
    score: int
    level: int = 1
    achievements: int = 0

@app.get("/api/game/leaderboard")
async def get_leaderboard(limit: int = 20):
    """Get top scores from the global leaderboard"""
    try:
        response = supabase_db._request(
            'GET',
            f'game_leaderboard?select=*&order=score.desc&limit={limit}'
        )
        if response.status_code == 200:
            return response.json()
        return []
    except Exception as e:
        logger.error(f"Error getting leaderboard: {str(e)}")
        return []

@app.post("/api/game/leaderboard")
async def submit_score(entry: LeaderboardEntry):
    """Submit a score to the global leaderboard"""
    try:
        data = {
            'player_name': entry.player_name[:20],
            'score': max(0, min(entry.score, 99999)),
            'level': max(1, min(entry.level, 99)),
            'achievements': max(0, min(entry.achievements, 50)),
            'created_at': datetime.utcnow().isoformat(),
        }
        response = supabase_db._request(
            'POST', 'game_leaderboard',
            json=data,
            prefer='return=representation'
        )
        if response.status_code in [200, 201]:
            result = response.json()
            return result[0] if isinstance(result, list) and result else result
        # Table might not exist yet — return submitted data as-is
        logger.warning(f"Leaderboard insert status {response.status_code}: {response.text}")
        return data
    except Exception as e:
        logger.error(f"Error submitting score: {str(e)}")
        return {"status": "saved_locally", **entry.dict()}


# ==================== Intelligence Tools API ====================

class FruitRecommendRequest(BaseModel):
    taste: str
    climate: str
    useCase: str


class RecipeBuilderRequest(BaseModel):
    fruits: List[str]


class MedicinalAdvisorRequest(BaseModel):
    concerns: List[str]


@app.get("/api/fruits")
async def get_fruits():
    """
    Get all fruits (public endpoint for tools)
    """
    try:
        fruits = read_fruits_from_file()
        # Return simplified data for frontend
        return [{"name": f["name"], "slug": f.get("slug", ""), "id": f.get("id", "")} for f in fruits]
    except Exception as e:
        logger.error(f"Error loading fruits: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tools/recommend-fruits")
async def recommend_fruits(request: FruitRecommendRequest):
    """
    Recommend tropical fruits based on user preferences
    """
    try:
        # Load fruits data
        fruits_data = read_fruits_from_file()
        recommendations = []
        
        # Scoring logic based on preferences
        for fruit in fruits_data:
            score = 0
            reasons = []
            
            # Taste preference matching - check description for taste keywords
            description = fruit.get('description', '').lower()
            how_to_eat = fruit.get('how_to_eat', '').lower()
            
            if request.taste == 'sweet' and any(word in description for word in ['sweet', 'sugary', 'honey', 'candy']):
                score += 35
                reasons.append('perfectly sweet taste profile')
            elif request.taste == 'tart' and any(word in description for word in ['tart', 'tangy', 'sour', 'acidic']):
                score += 35
                reasons.append('delightful tangy flavor')
            elif request.taste == 'mild' and any(word in description for word in ['mild', 'creamy', 'subtle', 'buttery']):
                score += 35
                reasons.append('smooth, mild flavor')
            elif request.taste == 'exotic' and any(word in description for word in ['bold', 'unique', 'complex', 'pungent', 'exotic']):
                score += 35
                reasons.append('bold, exotic taste')
            else:
                score += 10  # Base score for all fruits
            
            # Climate matching - check origin and description
            origin = fruit.get('origin', '').lower()
            if request.climate == 'tropical' and any(word in origin for word in ['tropical', 'caribbean', 'jamaica', 'africa', 'brazil']):
                score += 30
                reasons.append('thrives in tropical climates')
            elif request.climate == 'subtropical':
                score += 25
                reasons.append('grows well in warm regions')
            elif request.climate == 'temperate':
                score += 15
                reasons.append('can be grown indoors with care')
            elif request.climate == 'any':
                score += 25
            
            # Use case matching
            benefits = ' '.join(fruit.get('health_benefits', [])).lower()
            if request.useCase == 'eating' and 'fresh' in how_to_eat:
                score += 35
                reasons.append('excellent for fresh eating')
            elif request.useCase == 'cooking' and any(word in how_to_eat for word in ['cook', 'bake', 'sauté', 'fried', 'boil']):
                score += 35
                reasons.append('versatile in cooking')
            elif request.useCase == 'juices' and any(word in how_to_eat or word in description for word in ['juice', 'drink', 'smoothie', 'beverage', 'blend']):
                score += 35
                reasons.append('perfect for juices and smoothies')
            elif request.useCase == 'health' and any(word in benefits for word in ['vitamin', 'antioxidant', 'immune', 'health', 'protein', 'fiber']):
                score += 35
                reasons.append('packed with health benefits')
            else:
                score += 10
            
            # Bonus for popular fruits
            category = fruit.get('category', [])
            if 'popular' in category:
                score += 5
            
            if score >= 40:  # Lower threshold to ensure we get results
                recommendations.append({
                    'name': fruit['name'],
                    'slug': fruit['slug'],
                    'scientificName': fruit.get('scientific_name', fruit['name']),
                    'matchScore': min(score, 100),
                    'reason': reasons[0].capitalize() + '.' if reasons else 'Great all-around tropical fruit.',
                    'image': fruit.get('image_url', '')
                })
        
        # Sort by score and return top 5
        recommendations.sort(key=lambda x: x['matchScore'], reverse=True)
        return {'recommendations': recommendations[:5]}
        
    except Exception as e:
        logger.error(f"Error in fruit recommender: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tools/build-recipe")
async def build_recipe(request: RecipeBuilderRequest):
    """
    Find recipes that match selected fruits
    """
    try:
        # Load recipes data
        recipes_data = read_recipes_from_file()
        matched_recipes = []
        
        for recipe in recipes_data:
            # Get all fruits mentioned in the recipe
            recipe_fruits = []
            main_fruit = recipe.get('mainFruit', '').lower()
            if main_fruit:
                recipe_fruits.append(main_fruit)
            
            # Check ingredients for fruits
            ingredients = recipe.get('ingredients', [])
            for ingredient in ingredients:
                ingredient_lower = ingredient.lower()
                for selected_fruit in request.fruits:
                    if selected_fruit.lower() in ingredient_lower:
                        recipe_fruits.append(selected_fruit)
            
            # Calculate match
            matched_fruits = list(set([f for f in recipe_fruits if any(sf.lower() in f.lower() for sf in request.fruits)]))
            
            if matched_fruits:
                matched_recipes.append({
                    'id': recipe['id'],
                    'title': recipe['title'],
                    'slug': recipe['slug'],
                    'description': recipe.get('description', ''),
                    'mainFruit': recipe.get('mainFruit', ''),
                    'prepTime': recipe.get('prep_time', recipe.get('prepTime', 'N/A')),
                    'servings': recipe.get('servings', 1),
                    'matchedFruits': matched_fruits[:3],  # Show top 3 matches
                    'image': recipe.get('image_url', recipe.get('image', ''))
                })
        
        # Sort by number of matched fruits
        matched_recipes.sort(key=lambda x: len(x['matchedFruits']), reverse=True)
        
        return {'recipes': matched_recipes[:12]}  # Return top 12 matches
        
    except Exception as e:
        logger.error(f"Error in recipe builder: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tools/medicinal-advisor")
async def medicinal_advisor(request: MedicinalAdvisorRequest):
    """
    Recommend medicinal leaves based on health concerns
    """
    try:
        # Load medicinal leaves data
        leaves_data = read_leaves_from_file()
        recommendations = []
        
        # Health concern keywords mapping
        concern_keywords = {
            'diabetes': ['diabetes', 'blood sugar', 'glucose', 'insulin'],
            'pressure': ['blood pressure', 'hypertension', 'cardiovascular'],
            'cold': ['cold', 'flu', 'fever', 'immune', 'respiratory'],
            'stomach': ['digestion', 'stomach', 'gastric', 'intestinal', 'digestive'],
            'inflammation': ['inflammation', 'pain', 'anti-inflammatory', 'arthritis'],
            'sleep': ['sleep', 'insomnia', 'anxiety', 'stress', 'calming', 'relaxation'],
            'immunity': ['immune', 'immunity', 'antioxidant', 'vitamin c'],
            'skin': ['skin', 'dermatitis', 'wound', 'healing', 'topical']
        }
        
        for leaf in leaves_data:
            uses_text = ' '.join(leaf.get('traditional_uses', [])).lower()
            contraindications = ' '.join(leaf.get('contraindications', [])).lower()
            all_text = uses_text + ' ' + contraindications
            
            matched_concerns = []
            for concern in request.concerns:
                keywords = concern_keywords.get(concern, [concern])
                if any(keyword in all_text for keyword in keywords):
                    matched_concerns.append(concern)
            
            if matched_concerns:
                # Extract primary benefits (first 3 traditional uses)
                primary_benefits = leaf.get('traditional_uses', [])[:3]
                
                # Get usage instructions from first preparation method
                prep_methods = leaf.get('preparation_methods', [])
                usage = prep_methods[0]['instructions'] if prep_methods else 'Consult with a healthcare professional for proper usage.'
                
                recommendations.append({
                    'name': leaf['common_name'],
                    'slug': leaf['slug'],
                    'scientificName': leaf.get('scientific_name', leaf['common_name']),
                    'primaryBenefits': primary_benefits,
                    'image': leaf.get('image_id', ''),
                    'usageInstructions': usage[:200] + '...' if len(usage) > 200 else usage
                })
        
        return {'recommendations': recommendations[:6]}  # Return top 6 matches
        
    except Exception as e:
        logger.error(f"Error in medicinal advisor: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== General Routes ====================

@app.get("/")
def read_root():
    """
    API root endpoint
    """
    return {
        "message": "IslandFruitGuide API",
        "version": "1.0.0",
        "paypal_mode": PAYPAL_MODE,
        "endpoints": {
            "health": "/health",
            "create_order": "/api/paypal/create-order",
            "capture_order": "/api/paypal/capture-order",
            "get_order": "/api/paypal/order/{order_id}",
            "webhook": "/api/paypal/webhook"
        }
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "paypal_configured": bool(PAYPAL_CLIENT_ID and PAYPAL_SECRET),
        "paypal_mode": PAYPAL_MODE
    }


@app.get("/api/config")
def get_config():
    """
    Get client configuration (safe for frontend)
    """
    return {
        "paypal_mode": PAYPAL_MODE,
        "currency": "USD"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
