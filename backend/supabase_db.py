"""
Supabase Database Client
Replaces file-based storage with PostgreSQL
"""
import os
import requests
from typing import List, Dict, Optional, Any
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

class SupabaseClient:
    """Simple Supabase REST API client"""
    
    def __init__(self):
        self.url = SUPABASE_URL
        self.headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type': 'application/json'
        }
    
    def _request(self, method: str, endpoint: str, prefer: str = None, **kwargs) -> requests.Response:
        """Make HTTP request to Supabase"""
        url = f"{self.url}/rest/v1/{endpoint}"
        # Merge headers from kwargs with default headers
        headers = {**self.headers}
        if prefer:
            headers['Prefer'] = prefer
        if 'headers' in kwargs:
            headers.update(kwargs.pop('headers'))
        response = requests.request(method, url, headers=headers, **kwargs)
        return response
    
    # FRUITS
    def get_all_fruits(self) -> List[Dict]:
        """Get all fruits"""
        response = self._request('GET', 'fruits?select=*&order=name.asc')
        return response.json() if response.status_code == 200 else []
    
    def get_fruit_by_id(self, fruit_id: str) -> Optional[Dict]:
        """Get fruit by ID"""
        response = self._request('GET', f'fruits?id=eq.{fruit_id}&select=*')
        data = response.json() if response.status_code == 200 else []
        return data[0] if data else None
    
    def get_fruit_by_slug(self, slug: str) -> Optional[Dict]:
        """Get fruit by slug"""
        response = self._request('GET', f'fruits?slug=eq.{slug}&select=*')
        data = response.json() if response.status_code == 200 else []
        return data[0] if data else None
    
    def create_fruit(self, fruit: Dict) -> Dict:
        """Create new fruit"""
        response = self._request('POST', 'fruits', prefer='return=representation', json=fruit)
        return response.json()[0] if response.status_code == 201 else {}
    
    def update_fruit(self, fruit_id: str, fruit: Dict) -> Dict:
        """Update fruit"""
        response = self._request('PATCH', f'fruits?id=eq.{fruit_id}', prefer='return=representation', json=fruit)
        return response.json()[0] if response.status_code == 200 else {}
    
    def delete_fruit(self, fruit_id: str) -> bool:
        """Delete fruit"""
        response = self._request('DELETE', f'fruits?id=eq.{fruit_id}')
        return response.status_code == 204
    
    # RECIPES
    def get_all_recipes(self) -> List[Dict]:
        """Get all recipes"""
        response = self._request('GET', 'recipes?select=*&order=title.asc')
        return response.json() if response.status_code == 200 else []
    
    def get_recipe_by_id(self, recipe_id: str) -> Optional[Dict]:
        """Get recipe by ID"""
        response = self._request('GET', f'recipes?id=eq.{recipe_id}&select=*')
        data = response.json() if response.status_code == 200 else []
        return data[0] if data else None
    
    def get_recipe_by_slug(self, slug: str) -> Optional[Dict]:
        """Get recipe by slug"""
        response = self._request('GET', f'recipes?slug=eq.{slug}&select=*')
        data = response.json() if response.status_code == 200 else []
        return data[0] if data else None
    
    def create_recipe(self, recipe: Dict) -> Dict:
        """Create new recipe"""
        response = self._request('POST', 'recipes', prefer='return=representation', json=recipe)
        if response.status_code == 201:
            return response.json()[0]
        else:
            logger.error(f"Failed to create recipe: {response.status_code} - {response.text}")
            return {}
    
    def update_recipe(self, recipe_id: str, recipe: Dict) -> Dict:
        """Update recipe"""
        response = self._request('PATCH', f'recipes?id=eq.{recipe_id}', prefer='return=representation', json=recipe)
        return response.json()[0] if response.status_code == 200 else {}
    
    def delete_recipe(self, recipe_id: str) -> bool:
        """Delete recipe"""
        response = self._request('DELETE', f'recipes?id=eq.{recipe_id}')
        return response.status_code == 204
    
    # PRODUCTS
    def get_all_products(self) -> List[Dict]:
        """Get all products"""
        response = self._request('GET', 'products?select=*&order=title.asc')
        return response.json() if response.status_code == 200 else []
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict]:
        """Get product by ID"""
        response = self._request('GET', f'products?id=eq.{product_id}&select=*')
        data = response.json() if response.status_code == 200 else []
        return data[0] if data else None
    
    def get_product_by_slug(self, slug: str) -> Optional[Dict]:
        """Get product by slug"""
        response = self._request('GET', f'products?slug=eq.{slug}&select=*')
        data = response.json() if response.status_code == 200 else []
        return data[0] if data else None
    
    def create_product(self, product: Dict) -> Dict:
        """Create new product"""
        response = self._request('POST', 'products', prefer='return=representation', json=product)
        return response.json()[0] if response.status_code == 201 else {}
    
    def update_product(self, product_id: str, product: Dict) -> Dict:
        """Update product"""
        response = self._request('PATCH', f'products?id=eq.{product_id}', prefer='return=representation', json=product)
        return response.json()[0] if response.status_code == 200 else {}
    
    def delete_product(self, product_id: str) -> bool:
        """Delete product"""
        response = self._request('DELETE', f'products?id=eq.{product_id}')
        return response.status_code == 204
    
    # MEDICINAL LEAVES
    def get_all_leaves(self) -> List[Dict]:
        """Get all medicinal leaves"""
        response = self._request('GET', 'medicinal_leaves?select=*&order=common_name.asc')
        return response.json() if response.status_code == 200 else []
    
    def get_leaf_by_id(self, leaf_id: str) -> Optional[Dict]:
        """Get leaf by ID"""
        response = self._request('GET', f'medicinal_leaves?leaf_id=eq.{leaf_id}&select=*')
        data = response.json() if response.status_code == 200 else []
        return data[0] if data else None
    
    def get_leaf_by_slug(self, slug: str) -> Optional[Dict]:
        """Get leaf by slug"""
        response = self._request('GET', f'medicinal_leaves?slug=eq.{slug}&select=*')
        data = response.json() if response.status_code == 200 else []
        return data[0] if data else None
    
    def create_leaf(self, leaf: Dict) -> Dict:
        """Create new medicinal leaf"""
        response = self._request('POST', 'medicinal_leaves', prefer='return=representation', json=leaf)
        return response.json()[0] if response.status_code == 201 else {}
    
    def update_leaf(self, leaf_id: str, leaf: Dict) -> Dict:
        """Update medicinal leaf"""
        response = self._request('PATCH', f'medicinal_leaves?leaf_id=eq.{leaf_id}', prefer='return=representation', json=leaf)
        return response.json()[0] if response.status_code == 200 else {}
    
    def delete_leaf(self, leaf_id: str) -> bool:
        """Delete medicinal leaf"""
        response = self._request('DELETE', f'medicinal_leaves?leaf_id=eq.{leaf_id}')
        return response.status_code == 204


    # EBOOKS
    def get_all_ebooks(self) -> List[Dict]:
        """Get all ebooks"""
        response = self._request('GET', 'ebooks?select=*&order=created_at.desc')
        return response.json() if response.status_code == 200 else []
    
    def get_ebook_by_id(self, ebook_id: str) -> Optional[Dict]:
        """Get ebook by ID"""
        response = self._request('GET', f'ebooks?ebook_id=eq.{ebook_id}&select=*')
        data = response.json() if response.status_code == 200 else []
        return data[0] if data else None
    
    def create_ebook(self, ebook: Dict) -> Dict:
        """Create new ebook"""
        response = self._request('POST', 'ebooks', prefer='return=representation', json=ebook)
        if response.status_code == 201:
            return response.json()[0]
        else:
            logger.error(f"Failed to create ebook: {response.status_code} - {response.text}")
            return {}
    
    def update_ebook(self, ebook_id: str, ebook: Dict) -> Dict:
        """Update ebook"""
        response = self._request('PATCH', f'ebooks?ebook_id=eq.{ebook_id}', json=ebook)
        return response.json()[0] if response.status_code == 200 else {}
    
    # BUNDLES
    def get_all_bundles(self) -> List[Dict]:
        """Get all bundles"""
        response = self._request('GET', 'bundles?select=*&order=title.asc')
        return response.json() if response.status_code == 200 else []
    
    def create_bundle(self, bundle: Dict) -> Dict:
        """Create new bundle"""
        response = self._request('POST', 'bundles', json=bundle)
        return response.json()[0] if response.status_code == 201 else {}
    
    # RECIPE-FRUIT RELATIONSHIPS
    def link_recipe_to_fruit(self, recipe_id: str, fruit_id: str, is_primary: bool = False, quantity: str = None):
        """Link a recipe to a fruit"""
        data = {
            'recipe_id': recipe_id,
            'fruit_id': fruit_id,
            'is_primary': is_primary,
            'quantity': quantity
        }
        response = self._request('POST', 'recipe_fruits', json=data)
        return response.json()[0] if response.status_code == 201 else {}
    
    def get_recipe_fruits(self, recipe_id: str) -> List[Dict]:
        """Get all fruits for a recipe"""
        response = self._request('GET', f'recipe_fruits?recipe_id=eq.{recipe_id}&select=*,fruits(*)')
        return response.json() if response.status_code == 200 else []
    
    def get_fruit_recipes(self, fruit_id: str) -> List[Dict]:
        """Get all recipes using a fruit"""
        response = self._request('GET', f'recipe_fruits?fruit_id=eq.{fruit_id}&select=*,recipes(*)')
        return response.json() if response.status_code == 200 else []
    
    # FRUIT-PRODUCT RELATIONSHIPS
    def link_fruit_to_product(self, fruit_id: str, product_id: str, priority: int = 0):
        """Link a fruit to a product"""
        data = {'fruit_id': fruit_id, 'product_id': product_id, 'priority': priority}
        response = self._request('POST', 'fruit_products', json=data)
        return response.json()[0] if response.status_code == 201 else {}
    
    def get_fruit_products(self, fruit_id: str) -> List[Dict]:
        """Get all products for a fruit"""
        response = self._request('GET', f'fruit_products?fruit_id=eq.{fruit_id}&select=*,products(*)')
        return response.json() if response.status_code == 200 else []


# Global client instance
db = SupabaseClient()
