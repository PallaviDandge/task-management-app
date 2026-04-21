import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo =
    ((location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
      "/dashboard");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel-highlight">
        <p className="eyebrow">TaskFlow</p>
        <h1>Welcome back.</h1>
        <p>
          Sign in to manage your tasks, update priorities, and track deadlines in one
          place.
        </p>
      </section>

      <section className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error ? <p className="message message-error">{error}</p> : null}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit" className="button button-primary button-block">
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          <p className="auth-switch">
            No account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
