import { useState } from 'react';
import companyLogo from '@/assets/company_logo.png';

const FIXED_USERNAME = 'admin';
const FIXED_PASSWORD = 'AR@12345';
const AUTH_KEY = 'ar_saurtech_auth';

export function isLoggedIn(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === FIXED_USERNAME && password === FIXED_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        onLogin();
      } else {
        setError('Invalid username or password. Please try again.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-section">
          <img src={companyLogo} alt="A.R. Saurtech Energy" className="login-logo" />
        </div>
        <h1 className="login-company-name">A.R. Saurtech Energy Pvt. Ltd.</h1>
        <p className="login-subtitle">Receipt Voucher Generator</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn btn-generate login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="login-footer-text">Internal Use Only</p>
      </div>
    </div>
  );
}
