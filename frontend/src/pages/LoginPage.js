import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_glow-workspace/artifacts/2wqrcvq7_AURA%20LOGO.png";

export default function LoginPage() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    let result;
    if (tab === "login") {
      result = await login(email, password);
    } else {
      if (!name.trim()) { setError("Name is required"); setSubmitting(false); return; }
      result = await register(email, password, name);
    }
    setSubmitting(false);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-bg" />
      <div className="cosmic-orb cosmic-orb-1" style={{ opacity: 0.12 }} />
      <div className="cosmic-orb cosmic-orb-2" style={{ opacity: 0.1 }} />
      <div className="login-card" data-testid="login-card">
        <div className="login-logo">
          <img src={LOGO_URL} alt="AuraOS" data-testid="login-logo" />
          <h1>AuraOS</h1>
        </div>
        <div className="login-tabs" data-testid="login-tabs">
          <div
            className={`login-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setError(""); }}
            data-testid="login-tab-login"
          >
            Sign In
          </div>
          <div
            className={`login-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => { setTab("register"); setError(""); }}
            data-testid="login-tab-register"
          >
            Create Account
          </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit} data-testid="login-form">
          {tab === "register" && (
            <input
              className="login-input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              data-testid="login-input-name"
              autoComplete="name"
            />
          )}
          <input
            className="login-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            data-testid="login-input-email"
            autoComplete="email"
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            data-testid="login-input-password"
            autoComplete={tab === "login" ? "current-password" : "new-password"}
          />
          {error && <div className="login-error" data-testid="login-error">{error}</div>}
          <button
            type="submit"
            className="login-submit"
            disabled={submitting}
            data-testid="login-submit-button"
          >
            {submitting ? "..." : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
