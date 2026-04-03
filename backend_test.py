#!/usr/bin/env python3
"""
Caribbean Fruit E-commerce Backend API Testing - Iteration 4
Tests: Email delivery, Product sync, Discount checkout, Product slug APIs, Game features
"""
import requests
import sys
import json
from datetime import datetime

class CaribbeanFruitAPITester:
    def __init__(self, base_url="https://scan-fix-expand.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            self.passed_tests.append(test_name)
            print(f"✅ {test_name}")
            if details:
                print(f"   {details}")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name}")
            if details:
                print(f"   {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    self.log_result(name, True, f"Status: {response.status_code}")
                    return True, response_data
                except:
                    self.log_result(name, True, f"Status: {response.status_code} (no JSON)")
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    self.log_result(name, False, f"Expected {expected_status}, got {response.status_code}: {error_data}")
                except:
                    self.log_result(name, False, f"Expected {expected_status}, got {response.status_code}: {response.text[:200]}")
                return False, {}

        except Exception as e:
            self.log_result(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin authentication"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/admin/login",
            200,
            data={"email": "jonescople@gmail.com", "password": "admin123"}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            return True
        return False

    def test_email_subscription_new(self):
        """Test email subscription with new email"""
        # Use unique email for this test
        test_email = f"testiter4_{datetime.now().strftime('%H%M%S')}@example.com"
        success, response = self.run_test(
            "Email Subscription (New Email)",
            "POST",
            "api/subscribe",
            200,
            data={"email": test_email, "source": "game", "interest": "general"}
        )
        
        if success:
            expected_fields = ['status', 'discount_code', 'discount_pct']
            if all(field in response for field in expected_fields):
                if response.get('status') == 'subscribed' and response.get('discount_code') == 'IFG20' and response.get('discount_pct') == 20:
                    self.log_result("Email Subscription Response Validation", True, f"Correct response: {response}")
                    return True
                else:
                    self.log_result("Email Subscription Response Validation", False, f"Incorrect response values: {response}")
            else:
                self.log_result("Email Subscription Response Validation", False, f"Missing fields in response: {response}")
        return False

    def test_email_subscription_existing(self):
        """Test email subscription with existing email"""
        success, response = self.run_test(
            "Email Subscription (Existing Email)",
            "POST",
            "api/subscribe",
            200,
            data={"email": "test@example.com", "source": "game", "interest": "general"}
        )
        
        if success and response.get('status') == 'already_subscribed':
            self.log_result("Email Subscription Already Subscribed Check", True, f"Correct 'already_subscribed' status")
            return True
        else:
            self.log_result("Email Subscription Already Subscribed Check", False, f"Expected 'already_subscribed', got: {response}")
        return False

    def test_products_endpoint(self):
        """Test products endpoint returns 13 products"""
        success, response = self.run_test(
            "Get All Products",
            "GET",
            "api/products",
            200
        )
        
        if success:
            if isinstance(response, list) and len(response) == 13:
                self.log_result("Products Count Validation", True, f"Found {len(response)} products (expected 13)")
                return True, response
            else:
                self.log_result("Products Count Validation", False, f"Expected 13 products, got {len(response) if isinstance(response, list) else 'non-list'}")
        return False, []

    def test_product_slug_endpoints(self):
        """Test specific product slug endpoints"""
        slugs_to_test = [
            'tropical-juice-smoothie-recipes',
            'pre-workout-drinks', 
            'mango-recipe-pack',
            'caribbean-fruit-guide'
        ]
        
        all_passed = True
        for slug in slugs_to_test:
            success, response = self.run_test(
                f"Product Slug: {slug}",
                "GET",
                f"api/products/{slug}",
                200
            )
            if not success:
                all_passed = False
            elif success and response.get('slug') == slug:
                self.log_result(f"Product Slug {slug} Data Validation", True, f"Correct slug in response")
            else:
                self.log_result(f"Product Slug {slug} Data Validation", False, f"Slug mismatch in response")
                all_passed = False
        
        return all_passed

    def test_discount_validation(self):
        """Test discount code validation"""
        test_cases = [
            ("IFG20", True, 20),
            ("CHALLENGE25", True, 25),
            ("INVALID", False, 0)
        ]
        
        all_passed = True
        for code, should_be_valid, expected_pct in test_cases:
            success, response = self.run_test(
                f"Discount Validation: {code}",
                "POST",
                "api/discount/validate",
                200,
                data={"code": code}
            )
            
            if success:
                is_valid = response.get('valid', False)
                discount_pct = response.get('discount_pct', 0)
                
                if should_be_valid:
                    if is_valid and discount_pct == expected_pct:
                        self.log_result(f"Discount {code} Validation Check", True, f"Valid with {discount_pct}% discount")
                    else:
                        self.log_result(f"Discount {code} Validation Check", False, f"Expected valid={should_be_valid}, pct={expected_pct}, got valid={is_valid}, pct={discount_pct}")
                        all_passed = False
                else:
                    if not is_valid:
                        self.log_result(f"Discount {code} Validation Check", True, f"Correctly rejected invalid code")
                    else:
                        self.log_result(f"Discount {code} Validation Check", False, f"Should have rejected invalid code")
                        all_passed = False
            else:
                all_passed = False
        
        return all_passed

    def test_checkout_with_discounts(self):
        """Test checkout with different discount codes"""
        test_cases = [
            ("IFG20", "tropical-juice-smoothie-recipes"),
            ("CHALLENGE25", "caribbean-fruit-guide"),
            ("", "mango-recipe-pack")  # No discount code
        ]
        
        all_passed = True
        for discount_code, product_slug in test_cases:
            test_name = f"Checkout with {discount_code if discount_code else 'no discount'}"
            
            checkout_data = {
                "productSlug": product_slug,
                "email": "test@example.com"
            }
            if discount_code:
                checkout_data["discountCode"] = discount_code
            
            success, response = self.run_test(
                test_name,
                "POST",
                "api/checkout/create-order",
                200,
                data=checkout_data
            )
            
            if success:
                # Validate discount was applied correctly
                original_price = response.get('original_price', 0)
                final_price = response.get('final_price', 0)
                discount_pct = response.get('discount_pct', 0)
                
                if discount_code == "IFG20":
                    expected_discount = 20
                elif discount_code == "CHALLENGE25":
                    expected_discount = 25
                else:
                    expected_discount = 0
                
                if discount_pct == expected_discount:
                    expected_final = original_price * (1 - expected_discount / 100)
                    if abs(final_price - expected_final) < 0.01:  # Allow for rounding
                        self.log_result(f"Checkout Discount Calculation ({discount_code})", True, 
                                      f"Original: ${original_price}, Final: ${final_price}, Discount: {discount_pct}%")
                    else:
                        self.log_result(f"Checkout Discount Calculation ({discount_code})", False, 
                                      f"Price calculation error: expected ${expected_final}, got ${final_price}")
                        all_passed = False
                else:
                    self.log_result(f"Checkout Discount Calculation ({discount_code})", False, 
                                  f"Expected {expected_discount}% discount, got {discount_pct}%")
                    all_passed = False
            else:
                all_passed = False
        
        return all_passed

    def test_game_features(self):
        """Test game-related endpoints"""
        all_passed = True
        
        # Test daily challenge
        success, response = self.run_test(
            "Daily Challenge",
            "GET",
            "api/game/daily-challenge",
            200
        )
        
        if success:
            required_fields = ['target_score', 'reward_code', 'reward_description', 'expires_at', 'theme']
            if all(field in response for field in required_fields):
                self.log_result("Daily Challenge Response Validation", True, f"All required fields present")
            else:
                self.log_result("Daily Challenge Response Validation", False, f"Missing fields in response")
                all_passed = False
        else:
            all_passed = False
        
        # Test leaderboard
        success, response = self.run_test(
            "Game Leaderboard",
            "GET",
            "api/game/leaderboard",
            200
        )
        
        if success:
            if isinstance(response, list):
                self.log_result("Leaderboard Response Validation", True, f"Got {len(response)} leaderboard entries")
            else:
                self.log_result("Leaderboard Response Validation", False, f"Expected list, got {type(response)}")
                all_passed = False
        else:
            all_passed = False
        
        return all_passed

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting Caribbean Fruit E-commerce API Testing - Iteration 4")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 80)
        
        # Admin login first
        if not self.test_admin_login():
            print("❌ Admin login failed - stopping admin-only tests")
        
        # Test email subscription features
        print("\n📧 Testing Email Subscription Features")
        self.test_email_subscription_new()
        self.test_email_subscription_existing()
        
        # Test product endpoints
        print("\n🛍️ Testing Product Features")
        products_success, products = self.test_products_endpoint()
        self.test_product_slug_endpoints()
        
        # Test discount system
        print("\n💰 Testing Discount System")
        self.test_discount_validation()
        self.test_checkout_with_discounts()
        
        # Test game features
        print("\n🎮 Testing Game Features")
        self.test_game_features()
        
        # Print final results
        print("\n" + "=" * 80)
        print(f"📊 FINAL RESULTS")
        print(f"Tests passed: {self.tests_passed}/{self.tests_run}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests ({len(self.failed_tests)}):")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"{i}. {failure['test']}")
                if failure['details']:
                    print(f"   {failure['details']}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests ({len(self.passed_tests)}):")
            for test in self.passed_tests:
                print(f"• {test}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = CaribbeanFruitAPITester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n⚠️ Testing interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Testing failed with error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())