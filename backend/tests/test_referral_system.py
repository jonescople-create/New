"""
Iteration 6 - Backend tests for:
- Referral system (FRIEND15): /api/referral/generate, /api/referral/validate
- PayPal confirm endpoint: /api/pay/confirm
- Gym-energy slug fix: /api/products/gym-energy
- Subscribe with referral_code → FRIEND15
- FRIEND15 discount validation
- Checkout with FRIEND15 discount
- GET /api/products (15 products check)
- Game leaderboard with email
- Subscribe new email → IFG20
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://game-ecommerce-suite.preview.emergentagent.com').rstrip('/')

TEST_EMAIL = f"test_ref_iter6_{int(time.time())}@example.com"


# ==================== REFERRAL SYSTEM ====================

class TestReferralGenerate:
    """POST /api/referral/generate endpoint tests"""

    def test_generate_referral_with_valid_email(self):
        """Should return ref_code, share_url, discount_code=FRIEND15, discount_pct=15"""
        payload = {
            "email": "player@example.com",
            "player_name": "TestPlayer",
            "score": 500
        }
        r = requests.post(f"{BASE_URL}/api/referral/generate", json=payload, timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert "ref_code" in data, f"Missing ref_code in response: {data}"
        assert "share_url" in data, f"Missing share_url in response: {data}"
        assert data.get("discount_code") == "FRIEND15", f"Expected FRIEND15 discount, got: {data.get('discount_code')}"
        assert data.get("discount_pct") == 15, f"Expected 15% discount, got: {data.get('discount_pct')}"
        print(f"[PASS] Referral generated: {data['ref_code']}, url: {data['share_url']}")

    def test_generate_referral_ref_code_starts_with_REF(self):
        """ref_code should start with REF_"""
        payload = {"email": "reftest@example.com", "player_name": "Player", "score": 200}
        r = requests.post(f"{BASE_URL}/api/referral/generate", json=payload, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["ref_code"].startswith("REF_"), f"ref_code should start with REF_, got: {data['ref_code']}"
        print(f"[PASS] ref_code format correct: {data['ref_code']}")

    def test_generate_referral_share_url_contains_ref(self):
        """share_url should contain the ref code as query param"""
        payload = {"email": "shareurl@example.com", "player_name": "Player", "score": 300}
        r = requests.post(f"{BASE_URL}/api/referral/generate", json=payload, timeout=15)
        assert r.status_code == 200
        data = r.json()
        ref_code = data["ref_code"]
        share_url = data["share_url"]
        assert ref_code in share_url, f"share_url should contain ref_code. url: {share_url}, ref: {ref_code}"
        print(f"[PASS] share_url contains ref_code")

    def test_generate_referral_missing_email_returns_400(self):
        """Missing/invalid email should return 400"""
        r = requests.post(f"{BASE_URL}/api/referral/generate", json={"player_name": "P", "score": 100}, timeout=15)
        assert r.status_code == 400, f"Expected 400 for missing email, got {r.status_code}: {r.text[:200]}"
        print(f"[PASS] Missing email returns 400")

    def test_generate_referral_invalid_email_returns_400(self):
        """Invalid email (no @) should return 400"""
        payload = {"email": "not-an-email", "player_name": "Player", "score": 100}
        r = requests.post(f"{BASE_URL}/api/referral/generate", json=payload, timeout=15)
        assert r.status_code == 400, f"Expected 400 for invalid email, got {r.status_code}: {r.text[:200]}"
        print(f"[PASS] Invalid email returns 400")

    def test_generate_referral_deterministic_same_email(self):
        """Same email always produces same ref_code"""
        payload = {"email": "deterministic@example.com", "player_name": "P", "score": 100}
        r1 = requests.post(f"{BASE_URL}/api/referral/generate", json=payload, timeout=15)
        r2 = requests.post(f"{BASE_URL}/api/referral/generate", json=payload, timeout=15)
        assert r1.status_code == 200 and r2.status_code == 200
        assert r1.json()["ref_code"] == r2.json()["ref_code"], "Same email should produce same ref_code"
        print(f"[PASS] Referral codes are deterministic")


class TestReferralValidate:
    """GET /api/referral/validate/{ref_code} endpoint tests"""

    def _get_ref_code(self, email="validate_test@example.com"):
        """Helper to get a real ref_code"""
        r = requests.post(f"{BASE_URL}/api/referral/generate",
                          json={"email": email, "player_name": "Test", "score": 100}, timeout=15)
        assert r.status_code == 200
        return r.json()["ref_code"]

    def test_validate_valid_ref_code(self):
        """Valid REF_ code should return valid=true and FRIEND15"""
        ref_code = self._get_ref_code()
        r = requests.get(f"{BASE_URL}/api/referral/validate/{ref_code}", timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get("valid") == True, f"Expected valid=True, got: {data}"
        assert data.get("discount_code") == "FRIEND15", f"Expected FRIEND15, got: {data.get('discount_code')}"
        print(f"[PASS] Valid ref_code validated: {data}")

    def test_validate_invalid_ref_code_returns_valid_false(self):
        """Invalid ref_code (not starting with REF_) should return valid=False"""
        r = requests.get(f"{BASE_URL}/api/referral/validate/INVALID123", timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        data = r.json()
        assert data.get("valid") == False, f"Expected valid=False for invalid code, got: {data}"
        print(f"[PASS] Invalid ref_code returns valid=False")

    def test_validate_ref_code_discount_pct_is_15(self):
        """Valid ref_code should return discount_pct=15"""
        ref_code = self._get_ref_code("pct_test@example.com")
        r = requests.get(f"{BASE_URL}/api/referral/validate/{ref_code}", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("discount_pct") == 15, f"Expected discount_pct=15, got: {data.get('discount_pct')}"
        print(f"[PASS] Referral discount_pct is 15")


# ==================== SUBSCRIBE WITH REFERRAL ====================

class TestSubscribeWithReferral:
    """POST /api/subscribe with referral_code → should give FRIEND15"""

    def _get_ref_code(self, email="ref_subscribe_test@example.com"):
        r = requests.post(f"{BASE_URL}/api/referral/generate",
                          json={"email": email, "player_name": "Test", "score": 100}, timeout=15)
        assert r.status_code == 200
        return r.json()["ref_code"]

    def test_subscribe_with_referral_code_returns_FRIEND15(self):
        """New subscriber with referral_code should get FRIEND15 (15%)"""
        ref_code = self._get_ref_code()
        new_email = f"ref_new_{int(time.time())}@example.com"
        payload = {
            "email": new_email,
            "source": "game",
            "referral_code": ref_code
        }
        r = requests.post(f"{BASE_URL}/api/subscribe", json=payload, timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert data.get("discount_code") == "FRIEND15", f"Expected FRIEND15 for referral subscriber, got: {data.get('discount_code')}"
        assert data.get("discount_pct") == 15, f"Expected 15% discount, got: {data.get('discount_pct')}"
        print(f"[PASS] Subscribe with referral returns FRIEND15: {data}")

    def test_subscribe_without_referral_returns_IFG20(self):
        """New subscriber without referral_code should get IFG20 (20%)"""
        new_email = f"no_ref_{int(time.time())}@example.com"
        payload = {"email": new_email, "source": "store"}
        r = requests.post(f"{BASE_URL}/api/subscribe", json=payload, timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert data.get("status") == "subscribed", f"Expected subscribed status, got: {data.get('status')}"
        assert data.get("discount_code") == "IFG20", f"Expected IFG20 without referral, got: {data.get('discount_code')}"
        assert data.get("discount_pct") == 20, f"Expected 20%, got: {data.get('discount_pct')}"
        print(f"[PASS] Subscribe without referral returns IFG20: {data}")


# ==================== DISCOUNT VALIDATE ====================

class TestDiscountValidateFRIEND15:
    """POST /api/discount/validate with FRIEND15"""

    def test_FRIEND15_is_valid(self):
        """FRIEND15 should be a valid discount code"""
        r = requests.post(f"{BASE_URL}/api/discount/validate", json={"code": "FRIEND15"}, timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get("valid") == True, f"Expected FRIEND15 to be valid, got: {data}"
        assert data.get("discount_pct") == 15, f"Expected 15%, got: {data.get('discount_pct')}"
        print(f"[PASS] FRIEND15 is valid with 15% discount")

    def test_IFG20_is_valid(self):
        """IFG20 should still be valid (regression check)"""
        r = requests.post(f"{BASE_URL}/api/discount/validate", json={"code": "IFG20"}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("valid") == True
        assert data.get("discount_pct") == 20
        print(f"[PASS] IFG20 still valid with 20%")

    def test_CHALLENGE25_is_valid(self):
        """CHALLENGE25 should still be valid (regression check)"""
        r = requests.post(f"{BASE_URL}/api/discount/validate", json={"code": "CHALLENGE25"}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("valid") == True
        assert data.get("discount_pct") == 25
        print(f"[PASS] CHALLENGE25 still valid with 25%")


# ==================== PAY/CONFIRM ====================

class TestPayConfirm:
    """POST /api/pay/confirm — PayPal purchase confirmation"""

    def test_confirm_purchase_valid_payload(self):
        """Valid payload should return status=confirmed"""
        payload = {
            "customer_email": "buyer@example.com",
            "product_name": "Tropical Gym Energy Recipes",
            "amount": 12.74,
            "order_id": f"TEST_ORDER_{int(time.time())}"
        }
        r = requests.post(f"{BASE_URL}/api/pay/confirm", json=payload, timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert data.get("status") == "confirmed", f"Expected status=confirmed, got: {data}"
        print(f"[PASS] pay/confirm returns confirmed: {data}")

    def test_confirm_purchase_missing_email_returns_400(self):
        """Missing customer_email should return 400"""
        payload = {
            "product_name": "Some Ebook",
            "amount": 9.99,
            "order_id": "ORDER123"
        }
        r = requests.post(f"{BASE_URL}/api/pay/confirm", json=payload, timeout=15)
        assert r.status_code == 400, f"Expected 400 for missing email, got {r.status_code}: {r.text[:200]}"
        print(f"[PASS] Missing email returns 400")

    def test_confirm_purchase_invalid_email_returns_400(self):
        """Invalid email should return 400"""
        payload = {
            "customer_email": "not-valid-email",
            "product_name": "Ebook",
            "amount": 9.99,
            "order_id": "ORDER456"
        }
        r = requests.post(f"{BASE_URL}/api/pay/confirm", json=payload, timeout=15)
        assert r.status_code == 400, f"Expected 400 for invalid email, got {r.status_code}: {r.text[:200]}"
        print(f"[PASS] Invalid email returns 400")


# ==================== GYM-ENERGY SLUG ====================

class TestGymEnergySlug:
    """GET /api/products/gym-energy — slug fix verification"""

    def test_gym_energy_slug_returns_200(self):
        """GET /api/products/gym-energy should return the product (not 404)"""
        r = requests.get(f"{BASE_URL}/api/products/gym-energy", timeout=15)
        assert r.status_code == 200, f"Expected 200 for gym-energy slug, got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert "title" in data, f"Expected product title in response: {data}"
        print(f"[PASS] GET /api/products/gym-energy → {data.get('title')}")

    def test_gym_energy_product_title(self):
        """Product title should be Tropical Gym Energy Recipes"""
        r = requests.get(f"{BASE_URL}/api/products/gym-energy", timeout=15)
        assert r.status_code == 200
        data = r.json()
        title = data.get("title", "")
        assert "gym" in title.lower() or "energy" in title.lower(), f"Unexpected title for gym-energy: {title}"
        print(f"[PASS] gym-energy product title: {title}")

    def test_products_list_count(self):
        """GET /api/products should return at least 15 products"""
        r = requests.get(f"{BASE_URL}/api/products", timeout=15)
        assert r.status_code == 200
        data = r.json()
        count = len(data)
        assert count >= 15, f"Expected >=15 products, got {count}"
        print(f"[PASS] GET /api/products → {count} products")


# ==================== CHECKOUT WITH FRIEND15 ====================

class TestCheckoutWithFriend15:
    """POST /api/checkout/create-order with FRIEND15 → 15% off"""

    def test_checkout_with_FRIEND15_applies_15_percent(self):
        """FRIEND15 should give 15% discount on checkout"""
        payload = {
            "productSlug": "gym-energy",
            "email": f"checkout_friend15_{int(time.time())}@example.com",
            "discountCode": "FRIEND15"
        }
        r = requests.post(f"{BASE_URL}/api/checkout/create-order", json=payload, timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert data.get("discount_pct") == 15, f"Expected 15% discount, got: {data.get('discount_pct')}"
        assert data.get("discount_code") == "FRIEND15", f"Expected FRIEND15, got: {data.get('discount_code')}"
        # Verify final price is original * 0.85
        original = data.get("original_price", 0)
        final = data.get("final_price", 0)
        expected_final = round(original * 0.85, 2)
        assert abs(final - expected_final) < 0.02, f"Expected final_price ~{expected_final}, got {final}"
        print(f"[PASS] FRIEND15 checkout: original={original}, final={final}, expected={expected_final}")

    def test_checkout_with_IFG20_applies_20_percent_regression(self):
        """IFG20 should still give 20% discount (regression check)"""
        payload = {
            "productSlug": "gym-energy",
            "email": f"checkout_ifg20_{int(time.time())}@example.com",
            "discountCode": "IFG20"
        }
        r = requests.post(f"{BASE_URL}/api/checkout/create-order", json=payload, timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert data.get("discount_pct") == 20, f"Expected 20% discount for IFG20, got: {data.get('discount_pct')}"
        print(f"[PASS] IFG20 checkout discount correct: {data.get('discount_pct')}%")


# ==================== GAME LEADERBOARD WITH EMAIL ====================

class TestLeaderboardWithEmail:
    """POST /api/game/leaderboard with email → player appears on leaderboard"""

    def test_submit_score_with_email_and_verify(self):
        """Submit score with email and verify it appears on leaderboard (by score/player_name)"""
        ts = int(time.time())
        unique_email = f"leaderboard_iter6b_{ts}@example.com"
        unique_score = 6543  # Distinctive score

        # Submit score
        submit_payload = {
            "player_name": "TestPlayer6b",
            "score": unique_score,
            "level": 3,
            "achievements": 5,
            "email": unique_email
        }
        r = requests.post(f"{BASE_URL}/api/game/leaderboard", json=submit_payload, timeout=15)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data.get("score") == unique_score, f"Score mismatch: {data}"
        print(f"[PASS] Score submitted: {data}")

        # Verify on leaderboard — leaderboard VIEW returns player_name (derived from email), not email
        # Email like leaderboard_iter6b_123@example.com → player_name like Leaderboard_Iter6B_123
        time.sleep(1)
        r2 = requests.get(f"{BASE_URL}/api/game/leaderboard?limit=50", timeout=15)
        assert r2.status_code == 200
        leaderboard = r2.json()
        scores_on_board = [e.get("score", 0) for e in leaderboard]
        assert unique_score in scores_on_board, \
            f"Score {unique_score} not found on leaderboard. Scores: {scores_on_board[:10]}"
        print(f"[PASS] Player score appears on leaderboard after submission")
