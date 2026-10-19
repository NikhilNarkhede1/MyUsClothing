import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

const ACCOUNTS_KEY = "myusclothing-demo-accounts";
const SESSION_KEY = "myusclothing-demo-session";

function readAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]"); }
  catch { return []; }
}

export default function Account() {
  const [params] = useSearchParams();
  const location = useLocation();
  const [mode, setMode] = useState(location.pathname === "/register" || params.get("mode") === "register" ? "register" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    setMessage("");
    const accounts = readAccounts();
    const normalizedEmail = email.trim().toLowerCase();
    if (mode === "register") {
      if (!name.trim()) return setMessage("Please enter your name.");
      if (password.length < 6) return setMessage("Use a password with at least 6 characters.");
      if (accounts.some(a => a.email === normalizedEmail)) return setMessage("An account with this email already exists. Please log in.");
      accounts.push({ name: name.trim(), email: normalizedEmail, password });
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      localStorage.setItem(SESSION_KEY, JSON.stringify({ name: name.trim(), email: normalizedEmail }));
      navigate("/");
      return;
    }
    const account = accounts.find(a => a.email === normalizedEmail && a.password === password);
    if (!account) return setMessage("Email or password is incorrect. If you are new, create an account first.");
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: account.name, email: account.email }));
    navigate("/");
  }

  return <div className="container page account-page">
    <section className="panel account-panel">
      <p className="eyebrow">WELCOME TO MYUSCLOTHING</p>
      <h1>{mode === "login" ? "Login to your account" : "Create your account"}</h1>
      <p className="muted">Keep your shopping experience simple and convenient.</p>
      <form onSubmit={submit} className="account-form">
        {mode === "register" && <div className="form-field"><label htmlFor="account-name">Full name</label><input id="account-name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" required /></div>}
        <div className="form-field"><label htmlFor="account-email">Email address</label><input id="account-email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></div>
        <div className="form-field"><label htmlFor="account-password">Password</label><input id="account-password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required /></div>
        {message && <div className="alert" role="alert">{message}</div>}
        <button className="btn btn-primary btn-block" type="submit">{mode === "login" ? "Login" : "Create account"}</button>
      </form>
      <p className="account-switch">{mode === "login" ? "New to MyUsClothing?" : "Already have an account?"}{" "}
        <button className="link-btn" type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>
          {mode === "login" ? "Register" : "Login"}
        </button>
      </p>
      <p className="muted small">Demo note: this starter account feature stores credentials in this browser only. Do not use a real or reused password. Production login requires secure server-side authentication.</p>
      <Link to="/products" className="link-arrow">Continue shopping →</Link>
    </section>
  </div>;
}
