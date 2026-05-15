import { useState } from "react";
import { supabase } from "./supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Account created successfully.");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  }

  return (
    <div className="auth-page">
      <section className="auth-left">
        <div className="auth-brand">
          <h1>PEN-AIs</h1>
          <span>ADVANCED WRITING ENGINE</span>
        </div>

        <div className="auth-left-content">
          <h2>The Precision of Thought.</h2>
          <p>
            Bridging the gap between traditional literary excellence and
            futuristic computational intelligence.
          </p>
        </div>
      </section>

      <section className="auth-right">
        <div className="auth-status">
          <small>UI_REV: AI-99</small>
          <small>SECURE_LINK: ACTIVE</small>
        </div>

        <div className="auth-card">
          <h2>Welcome back</h2>
          <p>Access your digital atelier and continue your draft.</p>

          <div className="social-row">
            <button>◎ Google</button>
            <button>⌘ Apple</button>
          </div>

          <div className="divider">
            <span>OR EMAIL ADDRESS</span>
          </div>

          <label>IDENTIFIER</label>
          <input
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>ACCESS KEY</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="auth-options">
            <span>
              <input type="checkbox" /> Stay authenticated on this terminal
            </span>
            <button>Forgot?</button>
          </div>

          <button className="login-main" onClick={signIn}>
            INITIALIZE SESSION
          </button>

          <p className="signup-text">
            New to the suite?{" "}
            <button onClick={signUp}>Request an invitation.</button>
          </p>
        </div>

        <footer>© 2026 PEN-AIS SYSTEMS</footer>
      </section>
    </div>
  );
}