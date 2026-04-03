#!/usr/bin/env python3
"""
Backend API Testing for IslandFruitGuide - Iteration 3
Tests all API endpoints for the Caribbean fruit e-commerce website
New features: MongoDB leaderboard, email subscription, discount validation, daily challenges
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

    def test_game_leaderboard_api(self):
        """Test game leaderboard API endpoints"""
        print("\n🎮 Testing Game Leaderboard API...")
        
        # Test GET leaderboard (should work even if empty)
        self.test_api_endpoint("Get Game Leaderboard", "GET", "game/leaderboard", 200)
        
        # Test POST to leaderboard
        test_score_data = {
            "player_name": "TestPlayer",
            "score": 1250,
            "level": 5,
            "achievements": 8
        }
        
        success, response = self.test_api_endpoint(
            "Submit Score to Leaderboard", "POST", "game/leaderboard", 200, test_score_data
        )
        
        if success:
            print(f"   📊 Score submitted successfully")
            # Test GET again to see if our score appears
            self.test_api_endpoint("Get Updated Leaderboard", "GET", "game/leaderboard", 200)
        
        # Test with limit parameter
        self.test_api_endpoint("Get Leaderboard with Limit", "GET", "game/leaderboard?limit=5", 200)

    def test_email_subscription_api(self):
        """Test email subscription with IFG20 discount code"""
        print("\n📧 Testing Email Subscription API...")
        
        # Test new email subscription
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        success, response = self.test_api_endpoint(
            "Subscribe New Email", "POST", "subscribe", 200,
            {"email": test_email, "source": "game", "interest": "general"}
        )
        
        if success and response:
            expected_status = response.get('status')
            expected_code = response.get('discount_code')
            expected_pct = response.get('discount_pct')
            
            if expected_status == 'subscribed' and expected_code == 'IFG20' and expected_pct == 20:
                print(f"   ✅ New subscription returns correct IFG20 discount")
            else:
                print(f"   ❌ Unexpected response: status={expected_status}, code={expected_code}, pct={expected_pct}")
        
        # Test existing email subscription
        self.test_api_endpoint(
            "Subscribe Existing Email", "POST", "subscribe", 200,
            {"email": test_email, "source": "game", "interest": "general"}
        )

    def test_discount_validation_api(self):
        """Test discount code validation"""
        print("\n🎫 Testing Discount Validation API...")
        
        # Test valid IFG20 code
        success, response = self.test_api_endpoint(
            "Validate IFG20 Code", "POST", "discount/validate", 200,
            {"code": "IFG20"}
        )
        
        if success and response:
            if response.get('valid') == True and response.get('discount_pct') == 20:
                print(f"   ✅ IFG20 validation successful")
            else:
                print(f"   ❌ IFG20 validation failed: {response}")
        
        # Test valid CHALLENGE25 code
        success, response = self.test_api_endpoint(
            "Validate CHALLENGE25 Code", "POST", "discount/validate", 200,
            {"code": "CHALLENGE25"}
        )
        
        if success and response:
            if response.get('valid') == True and response.get('discount_pct') == 25:
                print(f"   ✅ CHALLENGE25 validation successful")
            else:
                print(f"   ❌ CHALLENGE25 validation failed: {response}")
        
        # Test invalid code
        success, response = self.test_api_endpoint(
            "Validate Invalid Code", "POST", "discount/validate", 200,
            {"code": "INVALID123"}
        )
        
        if success and response:
            if response.get('valid') == False:
                print(f"   ✅ Invalid code correctly rejected")
            else:
                print(f"   ❌ Invalid code should be rejected: {response}")

    def test_daily_challenge_api(self):
        """Test daily challenge system"""
        print("\n🎯 Testing Daily Challenge API...")
        
        # Test get daily challenge
        success, response = self.test_api_endpoint(
            "Get Daily Challenge", "GET", "game/daily-challenge", 200
        )
        
        target_score = 100  # default
        if success and response:
            required_fields = ['target_score', 'reward_code', 'theme', 'expires_at']
            missing_fields = [f for f in required_fields if f not in response]
            
            if not missing_fields:
                print(f"   ✅ Daily challenge structure correct")
                target_score = response.get('target_score', 100)
                
                if response.get('reward_code') == 'CHALLENGE25':
                    print(f"   ✅ Reward code is CHALLENGE25")
                else:
                    print(f"   ❌ Expected CHALLENGE25, got {response.get('reward_code')}")
            else:
                print(f"   ❌ Missing fields: {missing_fields}")
        
        # Test complete challenge above target
        success, response = self.test_api_endpoint(
            "Complete Challenge (Above Target)", "POST", "game/daily-challenge/complete", 200,
            {"score": target_score + 50, "player_name": "TestPlayer"}
        )
        
        if success and response:
            if response.get('completed') == True and response.get('reward_code') == 'CHALLENGE25':
                print(f"   ✅ Challenge completion (above target) successful")
            else:
                print(f"   ❌ Challenge completion failed: {response}")
        
        # Test complete challenge below target
        success, response = self.test_api_endpoint(
            "Complete Challenge (Below Target)", "POST", "game/daily-challenge/complete", 200,
            {"score": max(1, target_score - 50), "player_name": "TestPlayer"}
        )
        
        if success and response:
            if response.get('completed') == False and 'remaining' in response:
                print(f"   ✅ Challenge completion (below target) successful")
            else:
                print(f"   ❌ Challenge completion below target failed: {response}")

    def test_product_slug_endpoints(self):
        """Test product slug deep links"""
        print("\n🛍️ Testing Product Slug Endpoints...")
        
        # Test specific product slug
        success, response = self.test_api_endpoint(
            "Get Product by Slug", "GET", "products/tropical-juice-smoothie-recipes", 200
        )
        
        if success and response:
            if response.get('slug') == 'tropical-juice-smoothie-recipes':
                print(f"   ✅ Product slug deep link working")
            else:
                print(f"   ❌ Wrong slug returned: {response.get('slug')}")

    def test_error_handling(self):
        """Test error handling for non-existent resources"""
        print("\n🚫 Testing Error Handling...")
        
        # Test 404 responses
        self.test_api_endpoint("Non-existent Product", "GET", "products/non-existent-product", 404)
        self.test_api_endpoint("Non-existent Recipe", "GET", "recipes/non-existent-recipe", 404)

    def run_all_tests(self):
        """Run all backend tests"""
        print("🧪 Starting IslandFruitGuide Backend API Tests - Iteration 3")
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
        
        # Test game leaderboard API
        self.test_game_leaderboard_api()
        
        # Test new iteration 3 features
        self.test_email_subscription_api()
        self.test_discount_validation_api()
        self.test_daily_challenge_api()
        self.test_product_slug_endpoints()
        
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