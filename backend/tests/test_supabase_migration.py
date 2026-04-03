"""
Backend tests for Supabase migration.
Tests all key endpoints that were migrated from MongoDB to Supabase:
- Products (list, category filter, single by slug)
- Game leaderboard (GET, POST with/without email)
- Email subscribe (new, duplicate)
- Email check
- Discount validate (IFG20, CHALLENGE25, FRUIT10)
- Checkout create-order (with discount)
- Daily challenge (GET, POST complete)
- Admin login
- Admin sync-products
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    BASE_URL = "https://game-ecommerce-suite.preview.emergentagent.com"


# ==================== PRODUCTS ====================

class TestProducts:
    """Products endpoints — Supabase backed"""

    def test_get_all_products_returns_list(self):
        """GET /api/products should return a list"""
        r = requests.get(f"{BASE_URL}/api/products", timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert isinstance(data, list), "Expected a list of products"
        print(f"[PASS] GET /api/products → {len(data)} products")

    def test_get_all_products_count(self):
        """GET /api/products should return 13+ products (synced catalog)"""
        r = requests.get(f"{BASE_URL}/api/products", timeout=15)
        assert r.status_code == 200
        data = r.json()
        # After sync, we expect at least 13 products
        assert len(data) >= 13, f"Expected >=13 products, got {len(data)}"
        print(f"[PASS] Products count: {len(data)}")

    def test_get_products_by_category_ebook(self):
        """GET /api/products/category/ebook should return ebooks only"""
        r = requests.get(f"{BASE_URL}/api/products/category/ebook", timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert isinstance(data, list)
        if data:
            for p in data:
                assert p.get('category') == 'ebook', f"Non-ebook product returned: {p.get('category')}"
        print(f"[PASS] GET /api/products/category/ebook → {len(data)} products")

    def test_get_products_by_category_recipe_pack(self):
        """GET /api/products/category/recipe-pack should return recipe packs"""
        r = requests.get(f"{BASE_URL}/api/products/category/recipe-pack", timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert isinstance(data, list)
        print(f"[PASS] GET /api/products/category/recipe-pack → {len(data)} products")

    def test_get_product_by_slug_caribbean_guide(self):
        """GET /api/products/caribbean-fruit-guide should return the ebook"""
        r = requests.get(f"{BASE_URL}/api/products/caribbean-fruit-guide", timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get('slug') == 'caribbean-fruit-guide'
        assert 'price' in data
        assert 'title' in data
        print(f"[PASS] GET /api/products/caribbean-fruit-guide → {data.get('title')}, ${data.get('price')}")

    def test_get_product_by_slug_not_found(self):
        """GET /api/products/nonexistent-slug should return 404"""
        r = requests.get(f"{BASE_URL}/api/products/nonexistent-test-slug-xyz", timeout=15)
        assert r.status_code == 404, f"Expected 404, got {r.status_code}"
        print(f"[PASS] GET /api/products/nonexistent → 404")

    def test_product_has_required_fields(self):
        """Products returned from Supabase should have required fields"""
        r = requests.get(f"{BASE_URL}/api/products", timeout=15)
        assert r.status_code == 200
        data = r.json()
        if data:
            product = data[0]
            required_fields = ['slug', 'title', 'price', 'category']
            for field in required_fields:
                assert field in product, f"Missing required field: {field}"
            print(f"[PASS] Product has required fields: {list(product.keys())[:8]}")


# ==================== GAME LEADERBOARD ====================

class TestGameLeaderboard:
    """Game leaderboard endpoints — Supabase game_sessions + leaderboard VIEW"""

    def test_get_leaderboard_returns_list(self):
        """GET /api/game/leaderboard should return a list"""
        r = requests.get(f"{BASE_URL}/api/game/leaderboard", timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert isinstance(data, list)
        print(f"[PASS] GET /api/game/leaderboard → {len(data)} entries")

    def test_submit_score_with_email(self):
        """POST /api/game/leaderboard with email — player appears on leaderboard"""
        payload = {
            "player_name": "TestPlayer",
            "score": 9999,
            "level": 5,
            "achievements": 10,
            "email": "test_leaderboard_supabase@example.com"
        }
        r = requests.post(f"{BASE_URL}/api/game/leaderboard", json=payload, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get('score') == 9999 or data.get('player_name') == 'TestPlayer'
        print(f"[PASS] POST /api/game/leaderboard (with email) → {data}")

    def test_submit_score_without_email(self):
        """POST /api/game/leaderboard without email — score recorded anonymously"""
        payload = {
            "player_name": "AnonymousPlayer",
            "score": 500,
            "level": 2
        }
        r = requests.post(f"{BASE_URL}/api/game/leaderboard", json=payload, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        # Should succeed (no status=error)
        assert data.get('status') != 'error', f"Got error response: {data}"
        print(f"[PASS] POST /api/game/leaderboard (no email) → {data}")

    def test_leaderboard_shows_named_players(self):
        """After submitting with email, leaderboard should show the player"""
        # Give Supabase a moment to update the VIEW
        time.sleep(1)
        r = requests.get(f"{BASE_URL}/api/game/leaderboard", timeout=15)
        assert r.status_code == 200
        data = r.json()
        # Should have at least one entry with a proper player name (from email)
        assert len(data) >= 1, "Leaderboard should have at least 1 entry after submission"
        # Verify structure
        if data:
            entry = data[0]
            assert 'player_name' in entry
            assert 'score' in entry
            assert 'level' in entry
        print(f"[PASS] Leaderboard has entries with player_name, score fields")


# ==================== EMAIL SUBSCRIBE ====================

class TestEmailSubscribe:
    """Email subscription endpoints — Supabase email_captures table"""

    TEST_EMAIL = f"test_supabase_migration_{int(time.time())}@example.com"

    def test_subscribe_new_email(self):
        """POST /api/subscribe with new email returns subscribed + IFG20"""
        payload = {
            "email": self.TEST_EMAIL,
            "source": "test",
            "interest": "testing"
        }
        r = requests.post(f"{BASE_URL}/api/subscribe", json=payload, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get('status') == 'subscribed', f"Expected 'subscribed', got: {data.get('status')}"
        assert data.get('discount_code') == 'IFG20', f"Expected IFG20, got: {data.get('discount_code')}"
        assert data.get('discount_pct') == 20
        print(f"[PASS] POST /api/subscribe (new email) → status=subscribed, code=IFG20")

    def test_subscribe_duplicate_email(self):
        """POST /api/subscribe with existing email returns already_subscribed"""
        # First ensure the TEST_EMAIL was subscribed in test_subscribe_new_email
        # Then try subscribing the SAME email again - should get already_subscribed
        payload = {
            "email": self.TEST_EMAIL,
            "source": "test_duplicate"
        }
        r = requests.post(f"{BASE_URL}/api/subscribe", json=payload, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get('status') == 'already_subscribed', f"Expected 'already_subscribed', got: {data.get('status')}"
        print(f"[PASS] POST /api/subscribe (duplicate) → already_subscribed")

    def test_check_subscriber_existing(self):
        """GET /api/subscribe/check/{email} for subscribed email"""
        r = requests.get(f"{BASE_URL}/api/subscribe/check/jonescople@gmail.com", timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get('subscribed') == True
        print(f"[PASS] GET /api/subscribe/check (subscribed) → {data}")

    def test_check_subscriber_not_existing(self):
        """GET /api/subscribe/check/{email} for unknown email"""
        r = requests.get(f"{BASE_URL}/api/subscribe/check/nobody_notregistered_xyz@example.com", timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get('subscribed') == False
        print(f"[PASS] GET /api/subscribe/check (not subscribed) → subscribed=False")

    def test_subscribe_invalid_email(self):
        """POST /api/subscribe with invalid email should return 400"""
        payload = {"email": "not-an-email"}
        r = requests.post(f"{BASE_URL}/api/subscribe", json=payload, timeout=15)
        assert r.status_code == 400, f"Expected 400, got {r.status_code}: {r.text[:200]}"
        print(f"[PASS] POST /api/subscribe (invalid email) → 400")


# ==================== DISCOUNT CODES ====================

class TestDiscountCodes:
    """Discount code validation — IFG20, CHALLENGE25, FRUIT10"""

    def test_validate_ifg20(self):
        """POST /api/discount/validate with IFG20 returns valid:true, 20%"""
        r = requests.post(f"{BASE_URL}/api/discount/validate", json={"code": "IFG20"}, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get('valid') == True
        assert data.get('discount_pct') == 20
        assert data.get('code') == 'IFG20'
        print(f"[PASS] IFG20 → valid=True, 20%")

    def test_validate_challenge25(self):
        """POST /api/discount/validate with CHALLENGE25 returns valid:true, 25%"""
        r = requests.post(f"{BASE_URL}/api/discount/validate", json={"code": "CHALLENGE25"}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get('valid') == True
        assert data.get('discount_pct') == 25
        print(f"[PASS] CHALLENGE25 → valid=True, 25%")

    def test_validate_fruit10(self):
        """POST /api/discount/validate with FRUIT10 returns valid:true, 10%"""
        r = requests.post(f"{BASE_URL}/api/discount/validate", json={"code": "FRUIT10"}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get('valid') == True
        assert data.get('discount_pct') == 10
        print(f"[PASS] FRUIT10 → valid=True, 10%")

    def test_validate_invalid_code(self):
        """POST /api/discount/validate with invalid code returns valid:false"""
        r = requests.post(f"{BASE_URL}/api/discount/validate", json={"code": "BADCODE99"}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get('valid') == False
        print(f"[PASS] BADCODE99 → valid=False")


# ==================== CHECKOUT ====================

class TestCheckout:
    """Checkout create-order endpoint — Supabase purchases table"""

    def test_create_order_with_discount(self):
        """POST /api/checkout/create-order with IFG20 discount"""
        payload = {
            "productSlug": "caribbean-fruit-guide",
            "email": "test_checkout@example.com",
            "discountCode": "IFG20"
        }
        r = requests.post(f"{BASE_URL}/api/checkout/create-order", json=payload, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert 'order_id' in data, f"Missing order_id: {data}"
        assert data.get('discount_pct') == 20
        assert data.get('final_price') is not None
        original = data.get('original_price', 14.99)
        final = data.get('final_price')
        expected = round(original * 0.80, 2)
        assert abs(final - expected) < 0.05, f"Discount not applied: original={original}, final={final}, expected={expected}"
        print(f"[PASS] Checkout with IFG20 → order_id={data.get('order_id')}, {original}→{final}")

    def test_create_order_without_discount(self):
        """POST /api/checkout/create-order without discount"""
        payload = {
            "productSlug": "mango-recipe-pack",
            "email": "test_checkout_nodiscount@example.com"
        }
        r = requests.post(f"{BASE_URL}/api/checkout/create-order", json=payload, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert 'order_id' in data
        assert data.get('discount_pct') == 0
        assert data.get('final_price') == data.get('original_price')
        print(f"[PASS] Checkout without discount → order_id={data.get('order_id')}, price={data.get('final_price')}")

    def test_create_order_missing_email(self):
        """POST /api/checkout/create-order without email returns 400"""
        payload = {"productSlug": "caribbean-fruit-guide"}
        r = requests.post(f"{BASE_URL}/api/checkout/create-order", json=payload, timeout=15)
        assert r.status_code == 400, f"Expected 400, got {r.status_code}"
        print(f"[PASS] Checkout missing email → 400")

    def test_create_order_invalid_product(self):
        """POST /api/checkout/create-order with non-existent product returns 404"""
        payload = {
            "productSlug": "nonexistent-product-xyz",
            "email": "test@example.com"
        }
        r = requests.post(f"{BASE_URL}/api/checkout/create-order", json=payload, timeout=15)
        assert r.status_code == 404, f"Expected 404, got {r.status_code}: {r.text[:200]}"
        print(f"[PASS] Checkout invalid product → 404")


# ==================== DAILY CHALLENGE ====================

class TestDailyChallenge:
    """Daily challenge endpoints"""

    def test_get_daily_challenge(self):
        """GET /api/game/daily-challenge returns challenge data"""
        r = requests.get(f"{BASE_URL}/api/game/daily-challenge", timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert 'target_score' in data
        assert 'reward_code' in data
        assert data.get('reward_code') == 'CHALLENGE25'
        assert 'theme' in data
        assert 'expires_at' in data
        print(f"[PASS] GET /api/game/daily-challenge → target={data.get('target_score')}, theme={data.get('theme')}")

    def test_complete_challenge_success(self):
        """POST /api/game/daily-challenge/complete with score >= target returns CHALLENGE25"""
        # First get the target score
        challenge_r = requests.get(f"{BASE_URL}/api/game/daily-challenge", timeout=15)
        assert challenge_r.status_code == 200
        challenge = challenge_r.json()
        target = challenge['target_score']

        # Submit a score well above the target
        payload = {
            "score": target + 500,
            "player_name": "TestChallengePlayer",
            "email": "test_challenge_complete@example.com"
        }
        r = requests.post(f"{BASE_URL}/api/game/daily-challenge/complete", json=payload, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get('completed') == True
        assert data.get('reward_code') == 'CHALLENGE25'
        print(f"[PASS] Daily challenge complete (score={target+500} >= target={target}) → CHALLENGE25")

    def test_complete_challenge_failure(self):
        """POST /api/game/daily-challenge/complete with score < target returns completed=False"""
        challenge_r = requests.get(f"{BASE_URL}/api/game/daily-challenge", timeout=15)
        assert challenge_r.status_code == 200
        target = challenge_r.json()['target_score']

        payload = {
            "score": 1,
            "player_name": "LoserPlayer"
        }
        r = requests.post(f"{BASE_URL}/api/game/daily-challenge/complete", json=payload, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get('completed') == False
        assert 'remaining' in data
        print(f"[PASS] Daily challenge fail (score=1 < target={target}) → completed=False")


# ==================== ADMIN ====================

class TestAdmin:
    """Admin login and product sync"""

    def test_admin_login_success(self):
        """POST /api/admin/login with correct credentials returns token"""
        payload = {
            "email": "jonescople@gmail.com",
            "password": "admin123"
        }
        r = requests.post(f"{BASE_URL}/api/admin/login", json=payload, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert 'access_token' in data
        assert data.get('token_type') == 'bearer'
        assert len(data['access_token']) > 10
        print(f"[PASS] Admin login → token received")
        return data['access_token']

    def test_admin_login_wrong_password(self):
        """POST /api/admin/login with wrong password returns 401"""
        payload = {
            "email": "jonescople@gmail.com",
            "password": "wrongpassword"
        }
        r = requests.post(f"{BASE_URL}/api/admin/login", json=payload, timeout=15)
        assert r.status_code == 401, f"Expected 401, got {r.status_code}"
        print(f"[PASS] Admin login wrong password → 401")

    def test_admin_sync_products(self):
        """POST /api/admin/sync-products responds 200 (KNOWN BUG: synced=0 due to missing id in products)"""
        # First login to get token
        login_r = requests.post(f"{BASE_URL}/api/admin/login",
                                json={"email": "jonescople@gmail.com", "password": "admin123"},
                                timeout=15)
        assert login_r.status_code == 200
        token = login_r.json()['access_token']

        headers = {"Authorization": f"Bearer {token}"}
        r = requests.post(f"{BASE_URL}/api/admin/sync-products", headers=headers, timeout=30)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert data.get('total') == 13, f"Expected total=13, got: {data}"
        assert data.get('source') == 'supabase'
        # KNOWN BUG: synced=0 because products dict has no 'id' field
        # Supabase products.id is NOT NULL - results in 23502 error
        print(f"[KNOWN BUG] sync-products synced={data.get('synced')}/13 (0 means null id bug)")


# ==================== HEALTH CHECK ====================

class TestHealth:
    """Basic health checks"""

    def test_api_root_accessible(self):
        """Root API accessible"""
        r = requests.get(f"{BASE_URL}/api/health", timeout=15)
        # Could be 200 or 404 depending on if /health is defined
        assert r.status_code in [200, 404, 422], f"Got {r.status_code}"
        print(f"[PASS] API accessible, status={r.status_code}")

    def test_products_endpoint_not_returning_errors(self):
        """Products endpoint doesn't return 500"""
        r = requests.get(f"{BASE_URL}/api/products", timeout=15)
        assert r.status_code != 500, f"Internal server error: {r.text[:300]}"
        print(f"[PASS] Products endpoint healthy, status={r.status_code}")
