#!/usr/bin/env python3
"""
Backend API Testing for IslandFruitGuide
Tests all API endpoints for the Caribbean fruit e-commerce website
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class IslandFruitAPITester:
    def __init__(self, base_url="https://scan-fix-expand.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}")
        else:
            print(f"❌ {test_name} - {details}")
            self.failed_tests.append(f"{test_name}: {details}")

    def test_api_endpoint(self, name: str, method: str, endpoint: str, expected_status: int = 200, 
                         data: Dict[Any, Any] = None, headers: Dict[str, str] = None) -> tuple:
        """Test a single API endpoint"""
        url = f"{self.api_base}/{endpoint}"
        
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if self.admin_token and 'Authorization' not in headers:
            headers['Authorization'] = f'Bearer {self.admin_token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            details = f"Expected {expected_status}, got {response.status_code}"
            if not success and response.text:
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', response.text[:100])}"
                except:
                    details += f" - {response.text[:100]}"
            
            self.log_result(name, success, details if not success else "")
            
            return success, response.json() if success and response.text else {}

        except requests.exceptions.RequestException as e:
            self.log_result(name, False, f"Request failed: {str(e)}")
            return False, {}
        except Exception as e:
            self.log_result(name, False, f"Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login functionality"""
        print("\n🔐 Testing Admin Authentication...")
        
        # Test admin login
        login_data = {
            "email": "jonescople@gmail.com",
            "password": "admin123"  # This might need to be updated based on actual password
        }
        
        success, response = self.test_api_endpoint(
            "Admin Login", "POST", "admin/login", 200, login_data
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"   🎫 Admin token acquired")
            
            # Test token verification
            self.test_api_endpoint("Admin Token Verification", "GET", "admin/verify", 200)
        else:
            print("   ⚠️  Admin login failed - continuing with public endpoints only")

    def test_public_endpoints(self):
        """Test all public API endpoints"""
        print("\n🌐 Testing Public API Endpoints...")
        
        # Test products endpoints
        self.test_api_endpoint("Get All Products", "GET", "products", 200)
        self.test_api_endpoint("Get Products by Category", "GET", "products/category/ebook", 200)
        
        # Test fruits endpoint
        self.test_api_endpoint("Get All Fruits", "GET", "fruits", 200)
        
        # Test recipes endpoints
        self.test_api_endpoint("Get All Recipes", "GET", "recipes", 200)
        
        # Test ebooks endpoints
        self.test_api_endpoint("Get All Ebooks", "GET", "ebooks", 200)
        
        # Test bundles endpoints
        self.test_api_endpoint("Get All Bundles", "GET", "bundles", 200)

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        if not self.admin_token:
            print("\n⚠️  Skipping admin endpoints - no admin token")
            return
            
        print("\n🔧 Testing Admin API Endpoints...")
        
        # Test admin fruits endpoints
        self.test_api_endpoint("Admin Get All Fruits", "GET", "admin/fruits", 200)
        
        # Test admin recipes endpoints
        self.test_api_endpoint("Admin Get All Recipes", "GET", "admin/recipes", 200)
        
        # Test admin products endpoints
        self.test_api_endpoint("Admin Get All Products", "GET", "admin/products", 200)
        
        # Test admin ebooks endpoints
        self.test_api_endpoint("Admin Get All Ebooks", "GET", "admin/ebooks", 200)
        
        # Test admin bundles endpoints
        self.test_api_endpoint("Admin Get All Bundles", "GET", "admin/bundles", 200)
        
        # Test admin leaves endpoints
        self.test_api_endpoint("Admin Get All Leaves", "GET", "admin/leaves", 200)

    def test_specific_endpoints(self):
        """Test specific endpoints that might have data"""
        print("\n🎯 Testing Specific Data Endpoints...")
        
        # Test some specific product slugs that might exist
        test_slugs = [
            "caribbean-fruit-guide",
            "tropical-juice-smoothie-recipes", 
            "superfruits-guide",
            "healing-drinks-recipes"
        ]
        
        for slug in test_slugs:
            self.test_api_endpoint(f"Get Product: {slug}", "GET", f"products/{slug}", 200)

    def test_error_handling(self):
        """Test error handling for non-existent resources"""
        print("\n🚫 Testing Error Handling...")
        
        # Test 404 responses
        self.test_api_endpoint("Non-existent Product", "GET", "products/non-existent-product", 404)
        self.test_api_endpoint("Non-existent Recipe", "GET", "recipes/non-existent-recipe", 404)

    def run_all_tests(self):
        """Run all backend tests"""
        print("🧪 Starting IslandFruitGuide Backend API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test admin authentication first
        self.test_admin_login()
        
        # Test public endpoints
        self.test_public_endpoints()
        
        # Test admin endpoints if we have token
        self.test_admin_endpoints()
        
        # Test specific endpoints
        self.test_specific_endpoints()
        
        # Test error handling
        self.test_error_handling()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"   • {failure}")
        
        print("\n" + "=" * 60)
        
        return self.tests_passed == self.tests_run

def main():
    """Main test runner"""
    tester = IslandFruitAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 All tests passed!")
        return 0
    else:
        print("💥 Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())