#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class AuraOSAPITester:
    def __init__(self, base_url="https://glow-workspace.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_endpoint(self, name, method, endpoint, expected_status, data=None, auth_required=True):
        """Test a single API endpoint"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            
            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (expected {expected_status})"
                try:
                    error_data = response.json()
                    if 'detail' in error_data:
                        details += f" - {error_data['detail']}"
                except:
                    details += f" - {response.text[:100]}"
            
            self.log_test(name, success, details)
            return success, response.json() if response.content else {}
            
        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_auth_flow(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication Flow...")
        
        # Test login with admin credentials
        success, response = self.test_endpoint(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            {"email": "admin@auraos.com", "password": "aura2024"}
        )
        
        if not success:
            print("❌ Admin login failed - cannot continue with authenticated tests")
            return False
            
        # Test get current user
        self.test_endpoint("Get Current User", "GET", "auth/me", 200)
        
        # Test user registration
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@test.com"
        self.test_endpoint(
            "User Registration",
            "POST", 
            "auth/register",
            200,
            {"email": test_email, "password": "testpass123", "name": "Test User"}
        )
        
        # Test logout
        self.test_endpoint("Logout", "POST", "auth/logout", 200)
        
        # Login again for subsequent tests
        success, _ = self.test_endpoint(
            "Re-login for Tests",
            "POST",
            "auth/login", 
            200,
            {"email": "admin@auraos.com", "password": "aura2024"}
        )
        
        return success

    def test_settings_endpoints(self):
        """Test settings management"""
        print("\n⚙️ Testing Settings Endpoints...")
        
        # Get current settings
        success, settings = self.test_endpoint("Get Settings", "GET", "settings", 200)
        
        if success:
            # Update settings
            new_settings = {
                "aura_intensity": 0.7,
                "accent_color": "#FF6B6B",
                "transparency": 0.9
            }
            self.test_endpoint(
                "Update Settings",
                "PUT",
                "settings",
                200,
                new_settings
            )

    def test_system_endpoints(self):
        """Test system information endpoints"""
        print("\n💻 Testing System Endpoints...")
        
        # Test system info
        success, info = self.test_endpoint("Get System Info", "GET", "system/info", 200)
        if success and info:
            required_keys = ['cpu', 'memory', 'disk']
            has_all_keys = all(key in info for key in required_keys)
            self.log_test("System Info Structure", has_all_keys, 
                         f"Missing keys: {[k for k in required_keys if k not in info]}" if not has_all_keys else "")
        
        # Test processes
        success, processes = self.test_endpoint("Get Processes", "GET", "system/processes", 200)
        if success and isinstance(processes, list):
            self.log_test("Processes List", len(processes) > 0, f"Found {len(processes)} processes")

    def test_file_system(self):
        """Test virtual file system"""
        print("\n📁 Testing File System...")
        
        # Test root directory
        success, files = self.test_endpoint("Browse Root Directory", "GET", "files/browse?path=/", 200)
        if success and files:
            has_entries = 'entries' in files and len(files['entries']) > 0
            self.log_test("Root Directory Entries", has_entries, 
                         f"Found {len(files.get('entries', []))} entries" if has_entries else "No entries found")
        
        # Test Documents directory
        self.test_endpoint("Browse Documents", "GET", "files/browse?path=/Documents", 200)

    def test_wallpapers(self):
        """Test wallpapers endpoint"""
        print("\n🖼️ Testing Wallpapers...")
        
        success, wallpapers = self.test_endpoint("Get Wallpapers", "GET", "wallpapers", 200)
        if success and isinstance(wallpapers, list):
            self.log_test("Wallpapers List", len(wallpapers) > 0, f"Found {len(wallpapers)} wallpapers")

    def test_unauthenticated_access(self):
        """Test that protected endpoints require authentication"""
        print("\n🔒 Testing Authentication Protection...")
        
        # Clear session cookies
        self.session.cookies.clear()
        
        protected_endpoints = [
            ("settings", "GET"),
            ("system/info", "GET"), 
            ("files/browse", "GET"),
            ("wallpapers", "GET")
        ]
        
        for endpoint, method in protected_endpoints:
            success, _ = self.test_endpoint(
                f"Protected {endpoint} (no auth)",
                method,
                endpoint,
                401
            )

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting AuraOS Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test unauthenticated access first
        self.test_unauthenticated_access()
        
        # Test authentication flow
        if not self.test_auth_flow():
            print("\n❌ Authentication failed - stopping tests")
            return False
        
        # Test all authenticated endpoints
        self.test_settings_endpoints()
        self.test_system_endpoints()
        self.test_file_system()
        self.test_wallpapers()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️ {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = AuraOSAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open("/app/backend_test_results.json", "w") as f:
        json.dump({
            "summary": {
                "total_tests": tester.tests_run,
                "passed_tests": tester.tests_passed,
                "success_rate": tester.tests_passed / tester.tests_run if tester.tests_run > 0 else 0,
                "timestamp": datetime.now().isoformat()
            },
            "test_results": tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())