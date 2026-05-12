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
import "../../styles/layout.css";
import "../../styles/auth.css";

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
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              className="auth-input"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              className="auth-input"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button
            className="auth-btn-primary"
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
    </div>
  );
}
