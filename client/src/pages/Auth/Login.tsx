import { useState } from "react";
import type { Location } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import { firebaseAuth } from "../../services/firebase";

const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid credentials.";
      case "auth/invalid-email":
        return "Invalid email address.";
      default:
        return "Unable to sign in. Please try again.";
    }
  }

  return "Unable to sign in. Please try again.";
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath =
    (location.state as { from?: Location })?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      toast.success("Welcome back.");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }

    setIsResetting(true);

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      toast.success("Password reset email sent.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <header className="auth-header">
          <p className="eyebrow">Finance Tracker</p>
          <h1>Welcome back</h1>
          <p className="subhead">Sign in to keep your budgets in sync.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button
            className="primary-btn"
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            className="link-button"
            onClick={handleReset}
            disabled={isResetting}
          >
            {isResetting ? "Sending..." : "Forgot password?"}
          </button>
          <p>
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");

        :root {
          --bg: #0b0d10;
          --panel: #12151c;
          --panel-2: #0f1218;
          --text: #eef1f6;
          --muted: #9aa4b2;
          --accent: #6ee7ff;
          --accent-2: #7c6cff;
          --border: rgba(255, 255, 255, 0.08);
          --ring: rgba(110, 231, 255, 0.4);
          --font: "Space Grotesk", sans-serif;
        }

        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
              1100px circle at 15% -10%,
              rgba(110, 231, 255, 0.12),
              transparent 55%
            ),
            radial-gradient(
              900px circle at 85% 10%,
              rgba(124, 108, 255, 0.12),
              transparent 50%
            ),
            var(--bg);
          color: var(--text);
          font-family: var(--font);
          padding: 32px;
        }

        .auth-shell {
          width: min(420px, 100%);
          background: linear-gradient(180deg, var(--panel), var(--panel-2));
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 32px 30px 28px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
          position: relative;
          overflow: hidden;
        }

        .auth-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            300px circle at 20% 0%,
            rgba(110, 231, 255, 0.12),
            transparent 60%
          );
          pointer-events: none;
        }

        .auth-header {
          position: relative;
          z-index: 1;
          margin-bottom: 24px;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 11px;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .auth-header h1 {
          font-size: 28px;
          margin: 0 0 6px;
        }

        .subhead {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
        }

        .auth-form {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 16px;
        }

        .field {
          display: grid;
          gap: 8px;
          font-size: 13px;
          color: var(--muted);
        }

        .field input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px;
          color: var(--text);
          outline: none;
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .field input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--ring);
        }

        .primary-btn {
          margin-top: 4px;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          border: none;
          border-radius: 14px;
          padding: 12px;
          font-weight: 600;
          color: #050609;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .primary-btn:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .auth-links {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: var(--muted);
          font-size: 13px;
          position: relative;
          z-index: 1;
        }

        .auth-links a {
          color: var(--text);
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }

        .auth-links a:hover {
          border-bottom-color: var(--accent);
        }

        .link-button {
          background: none;
          border: none;
          color: var(--accent);
          padding: 0;
          font-size: 13px;
          cursor: pointer;
          text-align: left;
        }

        .link-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 520px) {
          .auth-shell {
            padding: 26px 22px 24px;
          }

          .auth-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
